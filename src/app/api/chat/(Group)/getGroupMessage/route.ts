import { fetchRedis } from "@/src/commands/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { NextRequest } from "next/server";
import { getHash } from "@/src/commands/getHash";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "You are unauthorized!" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const groupId = req.nextUrl.searchParams.get("groupId") as string;

    const isMember = (await fetchRedis(
      "zscore",
      `user:${session.user.id}:groups`,
      groupId
    )) as 0 | 1;

    if (!isMember) {
      return new Response(JSON.stringify({ error: "You are not a member of this group!" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const messageIds = (await fetchRedis(
      "zrange",
      `chat:${groupId}`,
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
    return new Response(JSON.stringify({ error: "Something went wrong!" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
