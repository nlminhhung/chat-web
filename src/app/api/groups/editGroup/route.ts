import { fetchRedis, postRedis } from "@/src/commands/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from 'crypto';

const bucketName = process.env.BUCKET_NAME!;
const region = process.env.BUCKET_REGION!;
const accessKeyId = process.env.ACCESS_KEY!;
const secretAccessKey = process.env.SECRET_ACCESS_KEY!;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const allowedImageTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"];

function generateFileName(bytes: number) {
  return crypto.randomBytes(bytes).toString("hex");
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
    const groupImage = formData.get("file") as File | null;
    const userId = formData.get("userId") as string;
    const groupId = formData.get("groupId") as string;

    // Check if user is group leader
    const leaderId = await fetchRedis("hget", `group:${groupId}`, "leader");
    if (leaderId !== userId) {
      return NextResponse.json(
        { error: "Only group leader can edit this group!" },
        { status: 403 }
      );
    }

    let fileUrl: string | null = null;

    if (groupImage && allowedImageTypes.includes(groupImage.type)) {
      const buffer = Buffer.from(await groupImage.arrayBuffer());
      const fileName = generateFileName(12);

      const uploadParams = {
        Bucket: bucketName,
        Body: buffer,
        Key: fileName,
        ContentType: groupImage.type,
      };

      await s3Client.send(new PutObjectCommand(uploadParams));
      fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;
    } else if (groupImage) {
      return NextResponse.json(
        {
          error: `Invalid file type. Allowed types are: ${allowedImageTypes.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    // Update group in Redis
    const updates: Record<string, string> = { name: groupName };

    if (fileUrl) {
      const existingImageUrl = await fetchRedis("hget", `group:${groupId}`, "image");
      if (existingImageUrl) {
        const existingKey = existingImageUrl.split("/").pop();
        if (existingKey) {
          await s3Client.send(
            new DeleteObjectCommand({
              Bucket: bucketName,
              Key: existingKey,
            })
          );
        }
      }
      updates["image"] = fileUrl;
    }

    await postRedis("hset", `group:${groupId}`, ...Object.entries(updates).flat());

    return NextResponse.json({ message: "All changes saved!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong!" }, { status: 400 });
  }
}
