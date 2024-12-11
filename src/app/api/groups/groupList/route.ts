import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { fetchRedis } from "@/src/commands/redis";
import { getHash } from "@/src/commands/getHash";

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
          const group = await fetchRedis(
            "hgetall",
            `group:${groupId}`
        );      
          const result = await getHash(group);
          result["id"] = groupId;
          return result;
        })
      )

    return Response.json(groupsInfo, { status: 200 });
  } catch (error) {
    return new Response("Something went wrong!", { status: 400 });
  }
}
