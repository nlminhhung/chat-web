import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { fetchRedis } from "@/src/commands/redis";


export async function POST(req: Request) {
    try{
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("You are unauthorized!", { status: 402 });
    }

    return Response.json("OK", { status: 200 });
    }
    catch (error) {
        return new Response("Something went wrong!", { status: 400 });
      }
}
