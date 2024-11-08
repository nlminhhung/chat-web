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
        { status: 402 }
      );
    }

    const body = await req.json();

    const isDelete = body.isDelete;
    const messageId = body.messageId;
    const reporterId = body.reporterId;
    const senderId = body.senderId;

    const sortedUsers = [senderId, reporterId].sort();
    const chatId = sortedUsers.join(":");

    if (isDelete) {
      const isFriend = (await fetchRedis(
        "zscore",
        `user:${senderId}:friends`,
        reporterId
      )) as 0 | 1;
      if (!isFriend) {
        return NextResponse.json(
          { error: "They are no longer friends so this report is not valid!" },
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
      messageId: messageId
    }
    const jsonMessage = JSON.stringify(reportObj);

    await postRedis(
      "lrem",
      `admin:report`,
      1,
      jsonMessage
    );
    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 400 }
    );
  }
}
