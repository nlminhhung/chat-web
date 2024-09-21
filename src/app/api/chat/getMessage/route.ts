import { fetchRedis } from "@/src/commands/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "You are unauthorized!" },
        { status: 402 }
      );
    }
    const friendId = req.nextUrl.searchParams.get("friendId") as string;

    const isFriend = (await fetchRedis(
      "zscore",
      `user:${session.user.id}:friends`,
      friendId
    )) as 0 | 1;

    if (!isFriend) {
      return Response.json(
        { error: "These users are not friends!" },
        { status: 403 }
      );
    }
    
    const sortedUsers = [session.user.id, friendId].sort(); // to set a chat ID
    const chatId = sortedUsers.join(":"); // to set a chat ID (2)

    const friendInfo = await fetchRedis("lrange", `chat:${chatId}`, 0, -1)
    
    return NextResponse.json(friendInfo, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 400 }
    );
  }
}
