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
        { status: 402 }
      );
    }
    const body = await req.json();
    const reporterId = session.user.id;
    const {
      senderId: senderId,
      content: content,
      timestamp: timestamp,
      type: type,
    } = body.message; 
    const senderName = body.senderName
    const reporterName =body.reporterName 

    const isFriend = (await fetchRedis(
      "zscore",
      `user:${session.user.id}:friends`,
      senderId
    )) as 0 | 1;

    if (!isFriend) {
      return NextResponse.json(
        { error: "You are not friends so can't report this messsage!" },
        { status: 400 }
      );
    }
    const reportObj = {
        reporterId: reporterId,
        reporterName: reporterName,
        senderId: senderId,
        senderName: senderName,
        type: type,
        content: content,
        timestamp: timestamp,
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
