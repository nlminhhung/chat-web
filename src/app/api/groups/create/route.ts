//creating a group

import { randomBytes } from "crypto";
import { postRedis } from "@/src/commands/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from 'crypto';

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

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "You are unauthorized!" },
        { status: 401 }
      );
    }
    const formData = await req.formData();
    
    const groupName = formData.get("groupName") as string;
    const friendIds = formData.getAll("friendIds") as string[];
    const groupPicture = formData.get("file");
    const userId = formData.get("userId") as string;
    const memberCount = friendIds.length + 1;

    if (!groupPicture || !(groupPicture instanceof File)) {
      return NextResponse.json({ error: "File is required and must be a valid file." }, { status: 400 });
    }
    if (!allowedImageTypes.includes(groupPicture.type)) {
      return NextResponse.json({ error: `Invalid file type. Allowed types are: ${allowedImageTypes.join(", ")}` }, { status: 400 });
    }

    const groupId = randomBytes(12).toString("hex").slice(0, 12);
    const date = new Date();
    const timestamp = date.getTime();

    const buffer = Buffer.from(await groupPicture.arrayBuffer());
    const fileName = generateFileName(12);
    const uploadParams = {
      Bucket: bucketName,
      Body: buffer!,
      Key: fileName,
      ContentType: groupPicture.type
    }
    const fileUrl = `https://${bucketName}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${fileName}`;
    await s3Client.send(new PutObjectCommand(uploadParams));
    
    // add user to group
    const addUserToGroupPromises = friendIds.map((friendId: string) => {
      return postRedis("zadd", `user:${friendId}:groups`, timestamp, groupId);
    });

    // add group members
    const addGroupMembers = friendIds.map((friendId: string) => {
      return postRedis("zadd", `group:${groupId}:members`, timestamp, friendId);
    });

    await Promise.all([
        postRedis(
          "hset",
          `group:${groupId}`,
          "name",
          groupName,
          "leader",
          userId,
          "memberCount",
          memberCount,
          "image",
          fileUrl,
          "createdAt",
          timestamp
        ),
        postRedis("zadd", `user:${userId}:groups`, timestamp, groupId),
        postRedis("zadd", `group:${groupId}:members`, timestamp, userId),
        addUserToGroupPromises,
        addGroupMembers
    ])

    return NextResponse.json(
      { message: "Group created successfully!", groupId: groupId },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 400 }
    );
  }
}
