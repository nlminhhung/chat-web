import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { fetchRedis } from "@/src/commands/redis";
import { z } from "zod";
import { db } from "@/src/lib/db";
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("You are unauthorized!", { status: 402 });
    }

    const body = await req.json();
    const { id: idToAdd } = z.object({ id: z.string() }).parse(body);

    const isFriends = await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd
    );
    if (isFriends) {
      return new Response("Already friends", { status: 400 });
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

    await Promise.all([
      fetchRedis("sadd", `user:${session.user.id}:friends`, idToAdd),
      fetchRedis("sadd", `user:${idToAdd}:friends`, session.user.id),
      fetchRedis(
        "hdel",
        `user:${session.user.id}:incoming_friend_requests`,
        idToAdd
      ),
    ]);

    return Response.json("OK", { status: 200 });
  } catch (error) {
    return new Response("Something went wrong!", { status: 400 });
  }
}
