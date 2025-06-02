import { fetchRedis } from "@/src/commands/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response("You are unauthorized!", { status: 401 });
        }

        const url = new URL(req.url);
        const friendId = url.searchParams.get("friendId") as string;

        const isFriend = (await fetchRedis(
            "zscore",
            `user:${session.user.id}:friends`,
            friendId
        )) as 0 | 1;

        if (!isFriend) {
            return new Response("These users are not friends!", { status: 400 });
        }

        // const nickname = await fetchRedis(
        //     "hget",
        //     `user:${session.user.id}:nicknames`,
        //     friendId
        // ) as string | null;

        const friendInfo = JSON.parse(await fetchRedis(
            "get",
            `user:${friendId}`,
        )) as User;

        // if (nickname){
        //     return NextResponse.json({name: nickname, image: friendInfo.image, id: friendInfo.id} , { status: 200 });
        // }
        const jsonResponse = JSON.stringify({
            name: friendInfo.name,
            image: friendInfo.image,
            id: friendInfo.id
        });
        return new Response(jsonResponse, { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch {
        return new Response("Something went wrong!", { status: 400 });
    }
}
