import { messageValidate } from "@/src/lib/valid_data/message";
import { fetchRedis } from "@/src/commands/redis";
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

    const reportObj = {
      reporterId: body.report.reporterId,
      reporterName: body.report.reporterName,
      senderId: body.report.senderId,
      senderName: body.report.senderName,
      content: body.report.content,
      timestamp: body.report.timestamp,
    };

    const sortedUsers = [reportObj.senderId, reportObj.reporterId].sort();
    const chatId = sortedUsers.join(":");

    if (isDelete) {
      const isFriend = (await fetchRedis(
        "zscore",
        `user:${reportObj.senderId}:friends`,
        reportObj.reporterId
      )) as 0 | 1;
      if (!isFriend) {
        return NextResponse.json(
          { error: "They are no longer friends so this report is not valid!" },
          { status: 400 }
        );
      }

      const messageObj = {
        senderId: reportObj.senderId,
        timestamp: reportObj.timestamp,
        content: reportObj.content,
      };

      const jsonMessage = JSON.stringify(messageObj);
      console.log(encodeURIComponent(jsonMessage))
      await fetchRedis("lrem", `chat:${chatId}`, 1, `${encodeURIComponent(jsonMessage)}`);
    }

    const jsonMessage = JSON.stringify(reportObj);

    await fetchRedis(
      "lrem",
      `admin:report`,
      1,
      `${encodeURIComponent(jsonMessage)}`
    );
    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 400 }
    );
  }
}
