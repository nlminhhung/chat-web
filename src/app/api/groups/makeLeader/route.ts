// make another member leader
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

    const memberId = (body.memberId) as string;
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
    else if (leaderId === memberId) {
      return NextResponse.json(
        { error: "This user is already a leader!" },
        { status: 400 }
      );
    }

    // make the user a leader
    await postRedis("hset", `group:${groupId}`, "leader", memberId);

    return NextResponse.json(
      { message: "Make another user a leader successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 400 }
    );
  }
}