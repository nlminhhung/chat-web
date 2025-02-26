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
    const groupId = body.groupId;
    const userId = body.userId;

    //check if user is the leader of the group
    const leaderId = await fetchRedis("hget", `group:${groupId}`, "leader");
    if (leaderId !== userId) {
      return NextResponse.json(
        { error: "Only group leader can delete this group!" },
        { status: 403 }
      );
    }

    // remove group from user's group list
    const removeGroupIdFromMembers = memberIds.map((memberId: string) => {
        return postRedis("zrem", `user:${memberId}:groups`, groupId);
    });

    const removeGroupIdFromUser = await postRedis("zrem", `user:${userId}:groups`, groupId);

    // remove users from group members
    const deleteGroupMember = await postRedis("del", `group:${groupId}:members`);

    const deleteGroup = await postRedis("del", `group:${groupId}`);

    const messageIds = (await fetchRedis(
        "zrange",
        `chat:${groupId}`,
        0,
        -1,
      )) as string[];

    const deleteGroupMessage = await messageIds.map(async (messageId) => {
        fetchRedis("zrem", `chat:${groupId}`, messageId);
        fetchRedis("del", messageId)
    });

    Promise.all([
      removeGroupIdFromUser,
      removeGroupIdFromMembers,
      deleteGroupMember,
      deleteGroup,
      deleteGroupMessage,
    ])

    return NextResponse.json(
      { message: "Delete this group successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 400 }
    );
  }
}