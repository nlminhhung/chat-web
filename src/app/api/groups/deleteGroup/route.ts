// removing a list of members from a group by the group leader
import { fetchRedis, postRedis } from "@/src/commands/redis";
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

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "You are unauthorized!" },
        { status: 401 }
      );
    }
    const body = await req.json();

    const memberIds = (body.memberIds) as string[];
    const groupId = body.groupId;
    const userId = body.userId;

    //check if user is the leader of the group
    const leaderId = await fetchRedis("hget", `group:${groupId}`, "leader");
    if (leaderId !== userId) {
      return NextResponse.json(
        { error: "Only group leader can delete this group!" },
        { status: 403 }
      );
    }
    // remove group from user's group list
    const removeGroupIdFromMembers = memberIds.map((memberId: string) => {
        return postRedis("zrem", `user:${memberId}:groups`, groupId);
    });

    const removeGroupIdFromUser = postRedis("zrem", `user:${userId}:groups`, groupId);

    // remove users from group members
    const deleteGroupMember = postRedis("del", `group:${groupId}:members`);

    const imageUrl = await fetchRedis("hget", `group:${groupId}`, "image");

    const deleteGroup = postRedis("del", `group:${groupId}`);

    const messageIds = (await fetchRedis(
        "zrange",
        `chat:${groupId}`,
        0,
        -1,
      )) as string[];

    const deleteGroupMessage =  messageIds.map(async (messageId) => {
      await fetchRedis("zrem", `chat:${groupId}`, messageId);
      await fetchRedis("del", messageId)
    });

    const deleteImage =  s3Client.send(new DeleteObjectCommand({
      Bucket: bucketName,
      Key: imageUrl.split("/").slice(-1)[0]
    }))

    await Promise.all([
      deleteImage,
      removeGroupIdFromUser,
      ...removeGroupIdFromMembers,
      deleteGroupMember,
      deleteGroup,
      ...deleteGroupMessage,
    ]);    

    return NextResponse.json(
      { message: "Delete this group successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 400 }
    );
  }
}