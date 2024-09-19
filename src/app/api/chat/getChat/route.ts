import { fetchRedis } from "@/src/commands/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({error: "You are unauthorized!"}, { status: 402 });
        }
        const friendId = req.nextUrl.searchParams.get("friendId") as string;

        const isFriend = (await fetchRedis(
            "zscore",
            `user:${session.user.id}:friends`,
            friendId
            )) as 0 | 1;
        
        if (!isFriend) {
            return Response.json({error:"These users are not friends!"}, { status: 400 });
        }
        
        const friendInfo = JSON.parse(await fetchRedis(
            "get",
            `user:${friendId}`,
        )) as User;

        return NextResponse.json({name: friendInfo.name, image: friendInfo.image} , { status: 200 });

    }
    catch {
        return NextResponse.json({error: "Something went wrong!"}, { status: 400 });
    }
}
