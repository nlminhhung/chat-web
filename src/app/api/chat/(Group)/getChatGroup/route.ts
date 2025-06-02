import { fetchRedis } from "@/src/commands/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { getHash } from "@/src/commands/getHash";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "You are unauthorized!" }), { status: 401 });
    }

    const url = new URL(req.url);
    const groupId = url.searchParams.get("groupId") as string;

    const isMember = (await fetchRedis(
      "zscore",
      `user:${session.user.id}:groups`,
      groupId
    )) as 0 | 1;

    if (!isMember) {
      return new Response(JSON.stringify({ error: "You are not a member of this group!" }), { status: 403 });
    }

    const group = await fetchRedis("hgetall", `group:${groupId}`);
    const groupResult = await getHash(group);
    groupResult["id"] = groupId;

    return new Response(JSON.stringify(groupResult), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Something went wrong!" }), { status: 400 });
  }
}
