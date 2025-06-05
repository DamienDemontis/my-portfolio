import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const stream = new ReadableStream({
    async start(controller) {
      const completion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
        stream: true,
      });
      for await (const part of completion) {
        controller.enqueue(part.choices[0]?.delta?.content || '');
      }
      controller.close();
    },
  });
  return new NextResponse(stream);
}
