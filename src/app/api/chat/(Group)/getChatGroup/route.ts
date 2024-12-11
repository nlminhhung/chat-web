import { fetchRedis } from "@/src/commands/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { NextResponse, NextRequest } from "next/server";
import { getHash } from "@/src/commands/getHash";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({error: "You are unauthorized!"}, { status: 401 });
        }
        const groupId = req.nextUrl.searchParams.get("groupId") as string;

        const isMember = (await fetchRedis(
            "zscore",
            `user:${session.user.id}:groups`,
            groupId
            )) as 0 | 1;
        
        if (!isMember) {
            return Response.json({error:"You are not a member of this group!"}, { status: 403 });
        }

        const group = await fetchRedis("hgetall", `group:${groupId}`);
        const groupResult = await getHash(group);
        groupResult["id"] = groupId;
        // return NextResponse.json({name: friendInfo.name, image: friendInfo.image, id: friendInfo.id} , { status: 200 });
        return NextResponse.json(groupResult , { status: 200 });
    }
    catch {
        return NextResponse.json({error: "Something went wrong!"}, { status: 400 });
    }
}
