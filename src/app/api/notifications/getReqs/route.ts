import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { fetchRedis } from "@/src/commands/redis";


export async function GET(req: Request) {
    try{
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("You are unauthorized!", { status: 402 });
    }

    const friendRequests = (await fetchRedis(
        "hkeys",
        `user:${session!.user.id}:incoming_friend_requests`
    )) as string[];
    
    const friendInfo = await Promise.all(
        friendRequests.map(async (requestId) => {
            const message = (await fetchRedis(
                "hget",
                `user:${session!.user.id}:incoming_friend_requests`,
                requestId
            )) as string;
            const senderInfo = JSON.parse(await fetchRedis(
                "get",
                `user:${requestId}`,
            )) as User;
            return {
                user: {id: senderInfo.id, name: senderInfo.name, image: senderInfo.image},
                message: decodeURIComponent(message)
            }
        })
    )
    return Response.json(friendInfo, { status: 200 });
    }
    catch (error) {
        return new Response("Something went wrong!", { status: 400 });
      }
}
