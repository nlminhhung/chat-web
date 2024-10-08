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
    const index = body.deleteIndex;
    const senderId = session.user.id; // to get user ID
    const friendId = body.friendId; // to get friend ID
    const sortedUsers = [senderId, friendId].sort(); // to set a chat ID
    const chatId = sortedUsers.join(":"); // to set a chat ID (2)

    const isFriend = (await fetchRedis(
      "zscore",
      `user:${session.user.id}:friends`,
      friendId
    )) as 0 | 1;

    if (!isFriend) {
      return NextResponse.json(
        { error: "You are not friends so can't delete this messsage!" },
        { status: 400 }
      );
    }

    await Promise.all([
      fetchRedis("lset", `chat:${chatId}`, index, `_TO_DELETE`),
      fetchRedis("lrem", `chat:${chatId}`, 1, `_TO_DELETE`),
    ]);

    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 400 }
    );
  }
}