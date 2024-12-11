import { randomBytes } from "crypto";
import { postRedis } from "@/src/commands/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "You are unauthorized!" },
        { status: 402 }
      );
    }
    const body = await req.json();
    const friendIds = (body.friendIds) as string[];
    const memberCount = friendIds.length + 1;  
    const groupName = body.groupName;
    const userId = body.userId;
    const groupId = randomBytes(12).toString("hex").slice(0, 12);
    const date = new Date();
    const timestamp = date.getTime();

    const promises = friendIds.map((friendId: string) => {
      return postRedis("zadd", `user:${friendId}:groups`, timestamp, groupId);
    });

    
    await Promise.all([
        postRedis(
          "hset",
          `group:${groupId}`,
          "name",
          groupName,
          "leader",
          userId,
          "memberCount",
          memberCount
        ),
        postRedis("zadd", `user:${userId}:groups`, timestamp, groupId),
        promises
    ])

    return NextResponse.json(
      { message: "Group created successfully!", groupId: groupId },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 400 }
    );
  }
}
