import { fetchRedis } from "@/src/commands/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role != "admin") {
      return NextResponse.json(
        { error: "You are unauthorized!" },
        { status: 402 }
      );
    }

    const reportObjects = await fetchRedis("lrange", `admin:report`, 0, -1);
    const reports = reportObjects.map((reportString: string) => JSON.parse(reportString));
    const result = await Promise.all(
      reports.map(async (report: any) => {
        const senderInfo = JSON.parse(
          await fetchRedis("get", `user:${report.senderId}`)
        ) as User;
        const reporterInfo = JSON.parse(
          await fetchRedis("get", `user:${report.reporterId}`)
        ) as User;
        const messageInfo = await fetchRedis(
          "hgetall",
          report.messageId
        );

        const messageResult: Record<string, any> = {};
        for (let i = 0; i < messageInfo.length; i += 2) {
          const key = messageInfo[i];
          const value = messageInfo[i + 1];
          messageResult[key] = value;
        }
        messageResult["messageId"] = report.messageId;
        messageResult["reporterName"] = reporterInfo.name;
        messageResult["reporterId"] = report.reporterId;
        messageResult["senderName"] = senderInfo.name;
        return messageResult;
      })
    );
    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 400 }
    );
  }
}
