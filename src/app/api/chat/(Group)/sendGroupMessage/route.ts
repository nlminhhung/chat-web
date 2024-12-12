import { messageValidate } from "@/src/lib/valid_data/message";
import { fetchRedis, postRedis } from "@/src/commands/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "You are unauthorized!" },
        { status: 401 }
      );
    }
    const body = await req.json();
    const { message: message } = messageValidate.parse({
      message: body.message,
    });
    const senderId = session.user.id; // to get user ID
    const groupId = body.groupId; // to get friend ID
    
    const date = new Date();
    const timestamp = date.getTime();
    const messageId = `message:${timestamp}:${Math.random().toString(36).substring(2, 9)}`;

    const isMember = (await fetchRedis(
      "zscore",
      `user:${session.user.id}:groups`,
      groupId
    )) as 0 | 1;

    if (!isMember) {
      return NextResponse.json(
        { error: "You are not a member of this group!" },
        { status: 403 }
      );
    }
    Promise.all([
      await postRedis(
        "hset",
        messageId,
        "senderId", senderId,
        "timestamp", timestamp,
        "type", "message",
        "content", message
      ),
      await postRedis(
        "zadd",
        `chat:${groupId}`,
        timestamp,
        messageId
      ),
    ])

    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 400 }
    );
  }
}
