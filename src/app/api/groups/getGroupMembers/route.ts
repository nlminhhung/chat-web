// to get list of members in a group

import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { fetchRedis } from "@/src/commands/redis";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("You are unauthorized!", { status: 401 });
    }

    const groupId = req.nextUrl.searchParams.get("groupId") as string;
    const leader = await fetchRedis("hget", `group:${groupId}`, "leader");
    const members = (await fetchRedis(
      "zrange",
      `group:${groupId}:members`,
      0,
      -1,
      "REV"
    )) as string[];

    const membersInfo: UserChatInformation[]  = await Promise.all(
        members.map(async (memberId) => {
        const memberInfo = JSON.parse(
          await fetchRedis("get", `user:${memberId}`)
        ) as User;
        
        return {
          id: memberInfo.id,
          name: memberInfo.name,
          image: memberInfo.image,
        };
      })
    );

    return Response.json({leader, membersInfo}, { status: 200 });
  } catch (error) {
    return new Response("Something went wrong!", { status: 400 });
  }
}
