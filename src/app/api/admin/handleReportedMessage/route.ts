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
    const senderId = body.report.senderId;
    const reporterId = body.report.reporterId;
    const content = body.report.content;
    const timestamp = body.report.timestamp;

    const sortedUsers = [senderId, reporterId].sort();
    const chatId = sortedUsers.join(":");
    const jsonReport = JSON.stringify(body.report);
    
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
      const messageObj = {
        senderId: senderId,
        timestamp: timestamp,
        content: encodeURIComponent(content),
      };
    
      const jsonMessage = JSON.stringify(messageObj);
      
      await fetchRedis("lrem", `chat:${chatId}`, 1, `${jsonMessage}`)
    }
    await fetchRedis("lrem", `admin:report`, 1, `${jsonReport}`)
    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 400 }
    );
  }
}
