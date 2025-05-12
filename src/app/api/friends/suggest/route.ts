import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { fetchRedis } from "@/src/commands/redis";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("You are unauthorized!", { status: 401 });
    }
    const suggestedUserIds = (await fetchRedis(
      "hkeys",
      `onlineUsers`
    )) as string[];
    const userInfo = await Promise.all(
      suggestedUserIds.map(async (userId) => {
        const userInfo = JSON.parse(
          await fetchRedis("get", `user:${userId}`)
        ) as User;
        return {
          id: userInfo.id,
          name: userInfo.name,
          image: userInfo.image,
          email: userInfo.email
        };
      })
    );
    const jsonResponse = JSON.stringify(userInfo);
    return new Response(jsonResponse, { status: 200, headers: { 'Content-Type': 'application/json' } });
    // return Response.json(userInfo, { status: 200 });
  } catch (error) {
    console.error("Error fetching suggested users:", error);
    return new Response("Something went wrong!", { status: 400 });
  }
}
