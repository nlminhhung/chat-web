import { messageValidate } from "@/src/lib/valid_data/message";
import { fetchRedis } from "@/src/commands/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "You are unauthorized!" },
        { status: 402 }
      );
    }
    const body = await req.json();
    const { message: message } = messageValidate.parse({message: body.message});
    const messageId = body.messageId;
    const senderId = body.senderId; 
    const friendId = body.friendId; // to get friend ID

    if (senderId != session.user.id) {
      return NextResponse.json(
        { error: "You do not have permission to update this message!" },
        { status: 400 }
      );
    }
    const isFriend = (await fetchRedis(
      "zscore",
      `user:${session.user.id}:friends`,
      friendId
    )) as 0 | 1;

    if (!isFriend) {
      return NextResponse.json(
        { error: "You are not friends so can't delete this message!" },
        { status: 400 }
      );
    }
    await fetchRedis("hset", messageId, "content", message)
    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 400 }
    );
  }
}
