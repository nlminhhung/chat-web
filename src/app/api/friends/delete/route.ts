import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { fetchRedis } from "@/src/commands/redis";
import { z } from "zod";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "You are unauthorized!" },
        { status: 402 }
      );
    }

    const body = await req.json();
    const { id: friendId } = z.object({ id: z.string() }).parse(body);

    const isFriend = (await fetchRedis(
      "zscore",
      `user:${session.user.id}:friends`,
      friendId
    )) as 0 | 1;
    if (!isFriend) {
      return NextResponse.json(
        { error: "Not friends so can't delete!" },
        { status: 400 }
      );
    }
    const sortedUsers = [session.user.id, friendId].sort(); 
    const chatId = sortedUsers.join(":");

    // await Promise.all([
    //   fetchRedis("zrem", `user:${session.user.id}:friends`, friendId),
    //   fetchRedis("zrem", `user:${friendId}:friends`, session.user.id),
    //   fetchRedis("del", `chat:${chatId}`)
    // ]);

    const messageIds = (await fetchRedis(
      "zrange",
      `chat:${chatId}`,
      0,
      -1,
    )) as string[];

    await Promise.all([
      messageIds.map(async (messageId) => {
        fetchRedis("zrem", `chat:${chatId}`, messageId);
        fetchRedis("del", messageId)
      }),
      fetchRedis("zrem", `user:${session.user.id}:friends`, friendId),
      fetchRedis("zrem", `user:${friendId}:friends`, session.user.id),
      ])

    return Response.json("OK", { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 401 }
    );
  }
}
