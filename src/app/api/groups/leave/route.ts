// removing a list of members from a group by the group leader
import { fetchRedis, postRedis } from "@/src/commands/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "You are unauthorized!" },
        { status: 401 }
      );
    }
    const body = await req.json();

    const memberCount = parseInt(body.memberCount) as number;
    const groupId = body.groupId;
    const userId = body.userId;

    //check if user is the leader of the group
    const leaderId = await fetchRedis("hget", `group:${groupId}`, "leader");
    if (leaderId === userId) {
      return NextResponse.json(
        { error: "You have to pass leadership before leaving the group! (or delete the group if you the only one)" },
        { status: 403 }
      );
    }

    // remove group from user's group list
    const removeGroupIdFromUser = await postRedis("zrem", `user:${userId}:groups`, groupId);

    // remove the user from group members
    const removeUserFromGroup = await postRedis("zrem", `group:${groupId}:members`, userId);

    // reduce group member count by one (the user who is leaving)
    const reduceGroupMembersCount = postRedis("hset", `group:${groupId}`, "memberCount", memberCount - 1);

    Promise.all([
      removeGroupIdFromUser,
      removeUserFromGroup,
      reduceGroupMembersCount,
    ])

    return NextResponse.json(
      { message: "Leave the group successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 400 }
    );
  }
}