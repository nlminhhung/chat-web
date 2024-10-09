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
    const index = body.updateIndex;
    const senderId = session.user.id; 
    const friendId = body.friendId; 
    const sortedUsers = [senderId, friendId].sort(); 
    const chatId = sortedUsers.join(":"); 
    const timestamp = new Date();

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
    const messageObj = {
      senderId: senderId,
      timestamp: timestamp,
      content: encodeURIComponent(message),
    };
    const jsonMessage = JSON.stringify(messageObj);

    await fetchRedis("lset", `chat:${chatId}`, index, jsonMessage)
    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 400 }
    );
  }
}
