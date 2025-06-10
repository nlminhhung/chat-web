import { getServerSession } from "next-auth";
import { fetchRedis, postRedis } from "@/src/commands/redis";
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
    const reporterId = session.user.id;
    const messageId = body.messageId;
    const senderId = body.senderId;
    const friendId = body.friendId;
    const chatType = body.chatType;
    const messageType = body.messageType;

    const requestType = chatType === "direct" ? "friends" : "groups"

    const isValidRequest = (await fetchRedis(
      "zscore",
      `user:${session.user.id}:${requestType}`,
      friendId
    )) as 0 | 1;

    if (!isValidRequest) {
      return NextResponse.json(
        { error: "You can't report this messsage!" },
        { status: 400 }
      );
    }
    const reportObj = {
        reporterId: reporterId,
        senderId: senderId,
        groupId: friendId,
        messageId: messageId,
        chatType: chatType,
        messageType: messageType,
    };
    const jsonReport = JSON.stringify(reportObj);

    await postRedis("rpush", `admin:report`, jsonReport);

    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 400 }
    );
  }
}
