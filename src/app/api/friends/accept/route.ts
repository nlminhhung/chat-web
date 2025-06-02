import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { fetchRedis } from "@/src/commands/redis";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("You are unauthorized!", { status: 401 });
    }

    const body = await req.json();
    const { id: idToAdd } = z.object({ id: z.string() }).parse(body);

    const isFriend = (await fetchRedis(
      "zscore",
      `user:${session.user.id}:friends`,
      idToAdd
    )) as 0 | 1;

    if (isFriend) {
      return new Response("Already friends", { status: 400 });
    }

    const hasSentRequest = (await fetchRedis(
      "hexists",
      `user:${session.user.id}:incoming_friend_requests`,
      idToAdd
    )) as 0 | 1;

    if (!hasSentRequest) {
      return new Response("Request doesn't exist!", { status: 400 });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    await Promise.all([
      fetchRedis("zadd", `user:${session.user.id}:friends`, timestamp, idToAdd),
      fetchRedis("zadd", `user:${idToAdd}:friends`, timestamp, session.user.id),
      fetchRedis(
        "hdel",
        `user:${session.user.id}:incoming_friend_requests`,
        idToAdd
      ),
      fetchRedis(
        "hdel",
        `user:${idToAdd}:incoming_friend_requests`,
        session.user.id
      ),
    ]);

    return new Response("OK", { status: 200 });
  } catch (error) {
    return new Response("Something went wrong!", { status: 400 });
  }
}
