// to get list of friends for creating a group

import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { fetchRedis } from "@/src/commands/redis";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("You are unauthorized!", { status: 401 });
    }

    const userId = session!.user.id;
    const members = (await fetchRedis(
      "zrange",
      `group:${userId}:members`,
      0,
      -1,
      "REV"
    )) as string[];
    const membersInfo = await Promise.all(
        members.map(async (memberId) => {
        const senderInfo = JSON.parse(
          await fetchRedis("get", `user:${memberId}`)
        ) as User;
        
        return {
          id: senderInfo.id,
          name: senderInfo.name,
          image: senderInfo.image,
        };
      })
    );

    return Response.json(membersInfo, { status: 200 });
  } catch (error) {
    return new Response("Something went wrong!", { status: 400 });
  }
}
