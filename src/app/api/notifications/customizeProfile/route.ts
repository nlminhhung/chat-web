import { fetchRedis, postRedis } from "@/src/commands/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { NextResponse, NextRequest } from "next/server";
import crypto from 'crypto';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

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

function generateFileName(bytes: number) {
  return crypto.randomBytes(bytes).toString("hex");
}

const allowedImageTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
];

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
    const userName = formData.get("name") as string;
    const userId = formData.get("id") as string;
    const picture = formData.get("file") as File | null;

    if (userId !== session.user.id) {
      return NextResponse.json(
        { error: "You are not the right user!" },
        { status: 403 }
      );
    }

    let fileUrl: string | null = null;

    if (picture && allowedImageTypes.includes(picture.type)) {
      const buffer = Buffer.from(await picture.arrayBuffer());
      const fileName = generateFileName(12);

      const uploadParams = {
        Bucket: bucketName,
        Body: buffer,
        Key: fileName,
        ContentType: picture.type,
      };

      await s3Client.send(new PutObjectCommand(uploadParams));

      fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;
    } else if (picture) {
      // Picture exists but is not a valid type
      return NextResponse.json(
        {
          error: `Invalid file type. Allowed types are: ${allowedImageTypes.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    const userInfo = JSON.parse(
      await fetchRedis("get", `user:${userId}`)
    ) as User;

    if (!userInfo) {
      return NextResponse.json(
        { error: "User not found!" },
        { status: 404 }
      );
    }

    userInfo.name = userName;
    if (fileUrl) {
      userInfo.image = fileUrl;
    }

    await postRedis("set", `user:${userId}`, JSON.stringify(userInfo));

    return NextResponse.json(
      { message: "Your profile has been updated!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 400 }
    );
  }
}
