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
        { status: 401 }
      );
    }
    const body = await req.json();
    const messageId = body.messageId;
    const messageType = body.messageType;
    const senderId = session.user.id; 
    const friendId = body.friendId; 
    const chatType = body.chatType; 
    const chatId = chatType === "direct" ? [senderId, friendId].sort().join(":") : friendId;
    
    if (senderId != session.user.id) {
      return NextResponse.json(
        { error: "You do not have permission to delete this message!" },
        { status: 400 }
      );
    }

    const requestType = chatType === "direct" ? "friends" : "groups"

    const isValidRequest = (await fetchRedis(
      "zscore",
      `user:${session.user.id}:${requestType}`,
      friendId
    )) as 0 | 1;

    if (!isValidRequest) {
      return NextResponse.json(
        { error: "You can't delete this message!" },
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
