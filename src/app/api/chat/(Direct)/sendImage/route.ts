import { fetchRedis, postRedis } from "@/src/commands/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { NextResponse, NextRequest } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from 'crypto'

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

function generateFileName(bytes: number) { 
  return crypto.randomBytes(bytes).toString('hex');
}

const allowedImageTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"];

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "You are unauthorized!" },
        { status: 401 }
      );
    }
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "File is required and must be a valid file." }, { status: 400 });
    }
    if (!allowedImageTypes.includes(file.type)) {
      return NextResponse.json({ error: `Invalid file type. Allowed types are: ${allowedImageTypes.join(", ")}` }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const friendId = formData.get("friendId") as string;
    const fileName = generateFileName(12);
    const uploadParams = {
      Bucket: bucketName,
      Body: buffer!,
      Key: fileName,
      ContentType: file.type
    }
    const senderId = session.user.id; // to get user ID
    const sortedUsers = [senderId, friendId].sort(); // to set a chat ID
    const chatId = sortedUsers.join(":"); // to set a chat ID (2)
    const date = new Date();
    const timestamp = date.getTime();
    const messageId = `message:${timestamp}:${Math.random().toString(36).substring(2, 9)}`;
    const fileUrl = `https://${bucketName}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${fileName}`;
    const isFriend = (await fetchRedis(
      "zscore",
      `user:${session.user.id}:friends`,
      friendId
    )) as 0 | 1;

    if (!isFriend) {
      return NextResponse.json(
        { error: "You are not friends with this user!" },
        { status: 400 }
      );
    }
    await s3Client.send(new PutObjectCommand(uploadParams));
    
    Promise.all([
      await postRedis(
        "hset",
        messageId,
        "senderId", senderId,
        "timestamp", timestamp,
        "type", "image",
        "content", fileUrl
      ),
      await postRedis(
        "zadd",
        `chat:${chatId}`,
        timestamp,
        messageId
      ),
      await postRedis(
        "zadd",
        `user:${senderId}:friends`,
        timestamp,
        friendId
      ),
      await postRedis(
        "zadd",
        `user:${friendId}:friends`,
        timestamp,
        senderId
      )
    ])
    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 400 }
    );
  }
}
