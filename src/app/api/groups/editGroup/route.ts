import { fetchRedis, postRedis } from "@/src/commands/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { NextResponse, NextRequest } from "next/server";
import { S3Client, DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
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

const allowedImageTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"];

function generateFileName(bytes: number) { 
  return crypto.randomBytes(bytes).toString('hex');
}

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
    const groupImage = formData.get("file");
    const userId = formData.get("userId") as string;
    const groupId = formData.get("groupId") as string;

    if (!groupImage || !(groupImage instanceof File)) {
      return NextResponse.json({ error: "File is required and must be a valid file." }, { status: 400 });
    }
    if (!allowedImageTypes.includes(groupImage.type)) {
      return NextResponse.json({ error: `Invalid file type. Allowed types are: ${allowedImageTypes.join(", ")}` }, { status: 400 });
    }

const buffer = Buffer.from(await groupImage.arrayBuffer());
    const fileName = generateFileName(12);
    const uploadParams = {
      Bucket: bucketName,
      Body: buffer!,
      Key: fileName,
      ContentType: groupImage.type
    }
    const fileUrl = `https://${bucketName}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${fileName}`;
    await s3Client.send(new PutObjectCommand(uploadParams));

    //check if user is the leader of the group
    const leaderId = await fetchRedis("hget", `group:${groupId}`, "leader");
    if (leaderId !== userId) {
      return NextResponse.json(
        { error: "Only group leader can delete this group!" },
        { status: 403 }
      );
    }

    async function editGroup(groupId: string, groupName: string, groupImage: File) {
      try {
        const imageUrl = await fetchRedis("hget", `group:${groupId}`, "image");
        
        await s3Client.send(new DeleteObjectCommand({
            Bucket: bucketName,
            Key: imageUrl.split("/").slice(-1)[0]
        }));
        
        await postRedis("hset", `group:${groupId}`, "image", fileUrl);        
        await postRedis("hset", `group:${groupId}`, "name", groupName);

      } catch (error) {
        return NextResponse.json(
          { error: "Something went wrong!" },
          { status: 400 }
        );
      }
    }
    
    editGroup(groupId, groupName, groupImage);
    
    return NextResponse.json(
      { message: "All changes saved!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 400 }
    );
  }
}