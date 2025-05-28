// import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse, NextRequest } from "next/server";
import OpenAI from 'openai';
import { fetchRedis } from "@/src/commands/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { getHash } from "@/src/commands/getHash";

export const dynamic = 'force-dynamic';
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: NextRequest, res: NextResponse) {
  try {
  
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "You are unauthorized!" },
        { status: 401 }
      );
    }
    
    // const body = await req.json();
    // const conversation  = body.messages;

    // if (!conversation || !Array.isArray(conversation)) {
    //   return NextResponse.json(
    //       { error: "Invalid conversation data" },
    //       { status: 400 }
    //   );
    // }

    
    const groupId = req.nextUrl.searchParams.get("groupId") as string;

    const messageIds = (await fetchRedis(
          "zrange",
          `chat:${groupId}`,
          -10,
          -1
        )) as string[];
    
        const messages = await Promise.all(
          messageIds.map(async (messageId) => {
            const message = await fetchRedis("hgetall", messageId);
            const result = await getHash(message);
    
            const senderInfo = JSON.parse(
              await fetchRedis("get", `user:${result["senderId"]}`)
            ) as User;
            result["name"] = senderInfo.name;
            result["senderImage"] = senderInfo.image;
            result["messageId"] = messageId;
            return result;
          })
        );
    const conversationText = messages.map(msg => `${msg.name}: ${msg.content}`).join('\n');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Summarize the following conversation into Vietnamese in less than 25 words.' },
        { role: 'user', content: conversationText },
      ],
      max_tokens: 200,
    });

    const summary = response.choices[0]?.message?.content;

    if (!summary) {
      return NextResponse.json(
        { error: "Failed to generate summary" },
        { status: 500 }
    );
    }
    return NextResponse.json({ summary }, { status: 200 });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
