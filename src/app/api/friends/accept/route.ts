import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { fetchRedis } from "@/src/commands/redis";
import { z } from "zod";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({error: "You are unauthorized!"}, { status: 402 });
    }

    const body = await req.json();
    const { id: idToAdd } = z.object({ id: z.string() }).parse(body);

    const isFriend = (await fetchRedis(
      "zscore",
      `user:${session.user.id}:friends`,
      idToAdd
    )) as 0 | 1;
    if (isFriend) {
      return NextResponse.json({error: "Already friends"}, { status: 400 });
    }

    const hasSentRequest = (await fetchRedis(
      "hexists",
      `user:${session.user.id}:incoming_friend_requests`,
      idToAdd
    )) as 0 | 1;

    if (!hasSentRequest) {
      return new Response("Request doesn't exist!", {
        status: 400,
      });
    }
    const timestamp = Math.floor(Date.now() / 1000);
    console.log("Time:", timestamp);
    await Promise.all([
      fetchRedis("zadd", `user:${session.user.id}:friends`, 1, idToAdd),
      fetchRedis("zadd", `user:${idToAdd}:friends`, 1, session.user.id),
      fetchRedis(
        "hdel",
        `user:${session.user.id}:incoming_friend_requests`,
        idToAdd
      ),
      fetchRedis(
        "hdel",
        `user:${idToAdd}:incoming_friend_requests`,
        session.user.id
      )
    ]);

    return Response.json("OK", { status: 200 });
  } catch (error) {
    return NextResponse.json({error: "Something went wrong!"}, { status: 400 });
  }
}
