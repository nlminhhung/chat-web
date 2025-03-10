// import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse, NextRequest } from "next/server";
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method !== 'POST') {
    return NextResponse.json(
        { error: "Method not allowed" },
        { status: 405 }
    );
  }
  const body = await req.json();
  const conversation  = body.messages;

  if (!conversation || !Array.isArray(conversation)) {
    return NextResponse.json(
        { error: "Invalid conversation data" },
        { status: 400 }
    );
  }

  try {
    const conversationText = conversation.map(msg => `${msg.sender}: ${msg.content}`).join('\n');

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
