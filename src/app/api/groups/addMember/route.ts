// add new member to group
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

    const memberIds = (body.memberIds) as string[];
    const membersAdded = memberIds.length as number;
    const memberCount = parseInt(body.memberCount) as number;
    const groupId = body.groupId;
    const userId = body.userId;
    const timestamp = new Date().getTime();
    
    //check if user is the leader of the group
    const leaderId = await fetchRedis("hget", `group:${groupId}`, "leader");
    if (leaderId !== userId) {
      return NextResponse.json(
        { error: "You are not the leader of the group!" },
        { status: 403 }
      );
    }

    // check if no member is selected
    if (memberIds.length === 0) {
      return NextResponse.json(
        { error: "No member selected!" },
        { status: 400 }
      );
    }

    // add group id to user's group list
    const addGroupIdToUser = memberIds.map((memberId: string) => {
      return postRedis("zadd", `user:${memberId}:groups`, timestamp, groupId);
    });

    // add user id to group members
    const addUserIdToGroup = memberIds.map((memberId: string) => {
      return postRedis("zadd", `group:${groupId}:members`, timestamp, memberId);
    });

    // increase group member count
    const increaseGroupMembersCount = await postRedis("hset", `group:${groupId}`, "memberCount", memberCount + membersAdded);

    await Promise.all([
      ...addGroupIdToUser,
      ...addUserIdToGroup,
      increaseGroupMembersCount,
    ])

    return NextResponse.json(
      { message: "Add user(s) successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 400 }
    );
  }
}