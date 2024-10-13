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

    const reports = await fetchRedis("lrange", `admin:report`, 0, -1);
    const decodedreports: string[] = reports.map((report: any) => decodeURIComponent(report));

    return NextResponse.json(decodedreports, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 400 }
    );
  }
}
