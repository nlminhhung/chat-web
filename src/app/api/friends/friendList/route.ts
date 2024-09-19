import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { fetchRedis } from "@/src/commands/redis";


export async function GET(req: Request) {
    try{
    const session = await getServerSession(authOptions);
    // if (!session) {
    //   return new Response("You are unauthorized!", { status: 402 });
    // }

    const friends = (await fetchRedis(
        "zrange",
        `user:${session!.user.id}:friends`,
        0,
        -1,
        "REV"
    )) as string[];
    const friendInfo = await Promise.all(
        friends.map(async (friendId) => {
            const senderInfo = JSON.parse(await fetchRedis(
                "get",
                `user:${friendId}`,
            )) as User;
            return {
                id: senderInfo.id, name: senderInfo.name, image: senderInfo.image
            }
        })
    )

    return Response.json(friendInfo, { status: 200 });
    }
    catch (error) {
        return new Response("Something went wrong!", { status: 400 });
      }
}
