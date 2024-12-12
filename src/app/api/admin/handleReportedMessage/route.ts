import { fetchRedis, postRedis } from "@/src/commands/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role != "admin") {
      return NextResponse.json(
        { error: "You are unauthorized!" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const isDelete = body.isDelete;
    const messageId = body.messageId;
    const reporterId = body.reporterId;
    const senderId = body.senderId;
    const groupId = body.groupId;
    const chatType = body.chatType;

    const chatId =
      chatType === "direct" ? [senderId, reporterId].sort().join(":") : groupId;

    if (isDelete) {
      const requestType = chatType === "direct" ? "friends" : "groups";

      const isValidRequest = (await fetchRedis(
        "zscore",
        `user:${session.user.id}:${requestType}`,
        groupId
      )) as 0 | 1;

      if (!isValidRequest) {
        return NextResponse.json(
          { error: "You can't delete this message!" },
          { status: 400 }
        );
      }
      await Promise.all([
        fetchRedis("del", messageId),
        fetchRedis("zrem", `chat:${chatId}`, messageId),
      ]);
    }

    const reportObj = {
      reporterId: reporterId,
      senderId: senderId,
      groupId: groupId,
      messageId: messageId,
      chatType: chatType,
    };
    const jsonMessage = JSON.stringify(reportObj);

    await postRedis("lrem", `admin:report`, 1, jsonMessage);
    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 400 }
    );
  }
}
