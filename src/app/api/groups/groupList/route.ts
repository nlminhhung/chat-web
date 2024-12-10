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
    const groups = (await fetchRedis(
      "zrange",
      `user:${userId}:groups`,
      0,
      -1,
      "REV"
    )) as string[];
    const groupsInfo = await Promise.all(
        groups.map(async (groupId) => {
          const message = await fetchRedis(
            "hgetall",
            `group:${groupId}`
        );
          const result: Record<string, any> = {};
          for (let i = 0; i < message.length; i += 2) {
            const key = message[i];
            const value = message[i + 1];
            result[key] = value;
          }
          result["groupId"] = groupId;
          return result;
        })
      )

    return Response.json(groupsInfo, { status: 200 });
  } catch (error) {
    return new Response("Something went wrong!", { status: 400 });
  }
}
