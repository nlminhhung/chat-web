import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { fetchRedis } from "@/src/commands/redis";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("You are unauthorized!", { status: 402 });
    }

    const userId = session!.user.id;
    const friends = (await fetchRedis(
      "zrange",
      `user:${userId}:friends`,
      0,
      -1,
      "REV"
    )) as string[];
    const friendInfo = await Promise.all(
      friends.map(async (friendId) => {
        const senderInfo = JSON.parse(
          await fetchRedis("get", `user:${friendId}`)
        ) as User;
        const onlineStatus = (await fetchRedis("hexists", "onlineUsers", friendId)) as 0 | 1
        const sortedUsers = [userId, friendId].sort(); 
        const chatId = sortedUsers.join(":"); 
        let lastMessage = ""
        try {
            const jsonLastMessage = JSON.parse(decodeURIComponent((await fetchRedis("lrange", `chat:${chatId}`, -1, -1))))
            lastMessage = jsonLastMessage.content;
        } catch (error) {
            lastMessage = "..."
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

    return Response.json(friendInfo, { status: 200 });
  } catch (error) {
    return new Response("Something went wrong!", { status: 400 });
  }
}
