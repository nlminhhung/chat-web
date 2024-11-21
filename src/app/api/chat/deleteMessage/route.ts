import { messageValidate } from "@/src/lib/valid_data/message";
import { fetchRedis } from "@/src/commands/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { NextResponse, NextRequest } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const bucketName = process.env.BUCKET_NAME!
const region = process.env.BUCKET_REGION!
const accessKeyId = process.env.ACCESS_KEY!
const secretAccessKey = process.env.SECRET_ACCESS_KEY!

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "You are unauthorized!" },
        { status: 402 }
      );
    }
    const body = await req.json();
    const messageId = body.messageId;
    const messageType = body.messageType;
    const senderId = session.user.id; // to get user ID
    const friendId = body.friendId; // to get friend ID
    const sortedUsers = [senderId, friendId].sort(); // to set a chat ID
    const chatId = sortedUsers.join(":"); // to set a chat ID (2)

    const isFriend = (await fetchRedis(
      "zscore",
      `user:${session.user.id}:friends`,
      friendId
    )) as 0 | 1;

    if (!isFriend) {
      return NextResponse.json(
        { error: "You are not friends so can't delete this messsage!" },
        { status: 400 }
      );
    }
    if (messageType === "image") {
      const imageUrl = await fetchRedis("hget", messageId, "content");
      const key = imageUrl.split("/").slice(-1)[0]
      const deleteParams = {
        Bucket: bucketName,
        Key: key,
      }
      await s3Client.send(new DeleteObjectCommand(deleteParams))
    }
    await Promise.all([
      fetchRedis("del", messageId),
      fetchRedis("zrem", `chat:${chatId}`, messageId),
  ]);

    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 400 }
    );
  }
}
