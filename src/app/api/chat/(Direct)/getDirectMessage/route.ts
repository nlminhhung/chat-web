import { fetchRedis } from "@/src/commands/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { NextRequest } from "next/server";
import { getHash } from "@/src/commands/getHash";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("You are unauthorized!", {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const friendId = url.searchParams.get("friendId") as string;

    const isFriend = (await fetchRedis(
      "zscore",
      `user:${session.user.id}:friends`,
      friendId
    )) as 0 | 1;

    if (!isFriend) {
      return new Response(
        "These users are not friends!",
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const sortedUsers = [session.user.id, friendId].sort();
    const chatId = sortedUsers.join(":");

    const messageIds = (await fetchRedis(
      "zrange",
      `chat:${chatId}`,
      0,
      -1
    )) as string[];

    const messages = await Promise.all(
      messageIds.map(async (messageId) => {

        const message = await fetchRedis("hgetall", messageId);
        const result = await getHash(message);
        const senderInfo = JSON.parse(
          await fetchRedis("get", `user:${result["senderId"]}`)
        ) as User;

        result["name"] = senderInfo.name;
        result["senderImage"] = senderInfo.image;
        result["messageId"] = messageId;

        return result;
      })
    );
    return new Response(JSON.stringify(messages), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(
      "Something went wrong!",
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
