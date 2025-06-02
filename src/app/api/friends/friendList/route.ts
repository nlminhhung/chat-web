import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { fetchRedis } from "@/src/commands/redis";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(
        JSON.stringify({ message: "You are unauthorized!" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const userId = session.user.id;
    const friends = (await fetchRedis(
      "zrange",
      `user:${userId}:friends`,
      0,
      -1,
      "REV"
    )) as string[];

    const friendInfo = await Promise.all(
      friends.map(async (friendId) => {
        const senderRaw = await fetchRedis("get", `user:${friendId}`);
        const senderInfo = senderRaw ? JSON.parse(senderRaw) as User : null;

        if (!senderInfo) {
          return null; 
        }

        const onlineStatus = (await fetchRedis(
          "hexists",
          "onlineUsers",
          friendId
        )) as 0 | 1;

        const sortedUsers = [userId, friendId].sort();
        const chatId = sortedUsers.join(":");

        let lastMessage;
        try {
          const messageId = await fetchRedis(
            "zrange",
            `chat:${chatId}`,
            0,
            0,
            "REV"
          );

          if (Array.isArray(messageId) && messageId.length > 0) {
            const lastMessageType = await fetchRedis("hget", messageId[0], "type");
            if (lastMessageType === "message") {
              lastMessage = await fetchRedis("hget", messageId[0], "content");
            } else {
              lastMessage = "[image]";
            }
          } else {
            lastMessage = "...";
          }
        } catch (error) {
          lastMessage = "...";
        }

        return {
          id: senderInfo.id,
          name: senderInfo.name,
          image: senderInfo.image,
          lastMessage: lastMessage,
          onlineStatus: onlineStatus,
        };
      })
    );

    const filteredFriendInfo = friendInfo.filter(Boolean);

    return new Response(
      JSON.stringify(filteredFriendInfo),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}
