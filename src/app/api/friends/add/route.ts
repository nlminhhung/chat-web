import { addFriendValidate } from "@/src/lib/valid_data/addFriend";
import { fetchRedis } from "@/src/commands/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { NextResponse } from "next/server";
import { NextApiResponse } from "next";
import { getIO } from "@/src/lib/getSocket";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const io = getIO();
    if (!session) {
      return NextResponse.json({error: "You are unauthorized!"}, { status: 402 });
    }
    const body = await req.json();
    const { email: emailToAdd, message: messageToAdd } = addFriendValidate.parse({email: body.email, message: body.message});

    const idToAdd = (await fetchRedis(
      "get",
      `user:email:${emailToAdd}`
    )) as string;

    if (!idToAdd) {
      return NextResponse.json({error: "This person does not exist!"}, { status: 404 }); // status 404
    } else if (idToAdd === session.user.id) {
      return NextResponse.json({error: "You can not add yourself as a friend!"}, {
        status: 400,
      });
    }

    const hasSentRequest = (await fetchRedis(
      "hexists",
      `user:${idToAdd}:incoming_friend_requests`,
      session.user.id
    )) as 0 | 1;

    if (hasSentRequest) {
      return NextResponse.json({error: "Already sent request to this user!"}, {
        status: 400,
      });
    }

    //Not done !!
    const isFriend = (await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd
    )) as 0 | 1;

    if (isFriend) {
      return Response.json({error:"Already friends with this user!"}, { status: 400 });
    }

    await fetchRedis(
      "hset",
      `user:${idToAdd}:incoming_friend_requests`,
      session.user.id, messageToAdd || "Hey! Let's be friend!"
    );
    return NextResponse.json({message: "Request has been sent!", idToAdd: idToAdd, userId: session.user.id, requestMessage: messageToAdd || "Hey! Let's be friend!"} , { status: 200 });
  } catch (error) {
    return NextResponse.json({error: "Something went wrong!"}, { status: 400 });

  }
}
