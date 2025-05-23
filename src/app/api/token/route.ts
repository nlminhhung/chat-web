import { NextRequest, NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';
import { fetchRedis } from '@/src/commands/redis';
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";

export const revalidate = 0;

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You are unauthorized!" },
      { status: 401 }
    );
  }
  const room = req.nextUrl.searchParams.get('room');
  const username = req.nextUrl.searchParams.get('username');
  const userId = req.nextUrl.searchParams.get('userId');

  if (userId !== session.user.id) {
    return NextResponse.json("You are unauthorized!", { status: 401 });
  }
  if (!room) {
    return NextResponse.json({ error: 'Missing "room" query parameter' }, { status: 400 });
  } else if (!username) {
    return NextResponse.json({ error: 'Missing "username" query parameter' }, { status: 400 });
  } else if (!userId) {
    return NextResponse.json({ error: 'Missing "userId" query parameter' }, { status: 400 });
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (!apiKey || !apiSecret || !wsUrl) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }
  const isMember = (await fetchRedis(
      "zscore",
      `user:${userId}:groups`,
      room
    )) as 0 | 1;
  if (!isMember) {
    return NextResponse.json(
      { error: "You are not a member of this group!" },
      { status: 403 }
    );
  }
  const isGroupExist = (await fetchRedis(
    "hgetall",
    `group:${room}`
  )) as 0 | 1;
  if (!isGroupExist) {
    return NextResponse.json(
      { error: "This group does not exist!" },
      { status: 404 }
    );
  }
  const at = new AccessToken(apiKey, apiSecret, { identity: username });
  at.addGrant({ room, roomJoin: true, canPublish: true, canSubscribe: true });

  return NextResponse.json(
    { token: await at.toJwt() },
    { headers: { "Cache-Control": "no-store" } },
  );
}