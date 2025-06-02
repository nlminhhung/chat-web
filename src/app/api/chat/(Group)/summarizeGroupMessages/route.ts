import { NextRequest } from "next/server";
import OpenAI from 'openai';
import { fetchRedis } from "@/src/commands/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { getHash } from "@/src/commands/getHash";

export const dynamic = 'force-dynamic';
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "You are unauthorized!" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    const groupId = req.nextUrl.searchParams.get("groupId") as string;

    const messageIds = (await fetchRedis(
      "zrange",
      `chat:${groupId}`,
      -10,
      -1
    )) as string[];
    
    if (!messageIds || messageIds.length === 0) {
      return new Response(JSON.stringify({ summary: "No messages to summarize." }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

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
      return new Response("Failed to generate summary", {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ summary }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response('Internal server error', {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
