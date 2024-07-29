import { addFriendValidate } from "@/src/lib/valid_data/addFriend";
import { fetchRedis } from "@/src/commands/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("You are unauthorized!", { status: 402 });
    }
    const body = await req.json();
    const { email: emailToAdd, message: messageToAdd } = addFriendValidate.parse({email: body.email, message: body.message});

    const idToAdd = (await fetchRedis(
      "get",
      `user:email:${emailToAdd}`
    )) as string;

    if (!idToAdd) {
      return new Response("This person does not exist!", { status: 404 }); // status 404
    } else if (idToAdd === session.user.id) {
      return new Response("You cannot add yourself as a friend!", {
        status: 400,
      });
    }

    const isSentRequest = (await fetchRedis(
      "hexists",
      `user:${idToAdd}:incoming_friend_requests`,
      session.user.id
    )) as 0 | 1;

    if (isSentRequest) {
      return new Response("Already sent request to this user!", {
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
      return new Response("Already friends with this user!", { status: 400 });
    }

    await fetchRedis(
      "hset",
      `user:${idToAdd}:incoming_friend_requests`,
      session.user.id, messageToAdd
    );

    return new Response("Your friend request has been sent!", { status: 200 });
  } catch (error) {
    return new Response("Something went wrong!", { status: 400 });

  }
}
