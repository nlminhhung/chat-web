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

    const memberIds = (body.memberIds) as string[];
    const membersRemoved = memberIds.length as number;
    // const memberCount = parseInt(body.memberCount) as number;
    const groupId = body.groupId;
    const userId = body.userId;

    //check if user is the leader of the group
    const leaderId = await fetchRedis("hget", `group:${groupId}`, "leader");
    if (leaderId !== userId) {
      return NextResponse.json(
        { error: "You are not the leader of this group!" },
        { status: 403 }
      );
    }
    
    //check if the user is removing himself
    if (memberIds.includes(userId)) {
      return NextResponse.json(
        { error: "You cannot remove yourself from the group!" },
        { status: 400 }
      );
    }

    // check if no member is selected
    if (memberIds.length === 0) {
      return NextResponse.json(
        { error: "No member selected!" },
        { status: 400 }
      );
    }

    //get member count
    const memberCount = await fetchRedis("hget", `group:${groupId}`, "memberCount");

    // remove group from user's group list
    const removeGroupIdFromUser = memberIds.map((memberId: string) => {
      return postRedis("zrem", `user:${memberId}:groups`, groupId);
    });

    // remove users from group members
    const removeUserFromGroup = memberIds.map((memberId: string) => {
      return postRedis("zrem", `group:${groupId}:members`, memberId);
    });

    // reduce group member count
    console.log("MC: ", parseInt(memberCount), "MR: ", membersRemoved);
    const reduceGroupMembersCount = postRedis("hset", `group:${groupId}`, "memberCount", parseInt(memberCount) - membersRemoved);

    Promise.all([
      removeGroupIdFromUser,
      removeUserFromGroup,
      reduceGroupMembersCount,
    ])

    return NextResponse.json(
      { message: "Remove user(s) successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 400 }
    );
  }
}