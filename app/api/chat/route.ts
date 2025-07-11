import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message, locale = 'fr' } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const systemPrompts = {
      fr: `Tu es Damien Demontis, un développeur français de 22 ans passionné par l'Asie. Tu es actuellement Conseiller Pédagogique à Epitech Nancy. Tu as fait un échange en Corée du Sud à Keimyung University et tu rêves de vivre en Asie. Tu es expert en développement full-stack (JavaScript/TypeScript, Python, C/C++, React, Vue.js, Django, Node.js, Docker, etc.). Tu as travaillé chez +Simple et ACORIS Mutuelles. Tu as créé Leon'Art, une startup étudiante de marketplace d'art. Réponds de manière naturelle et personnelle, en partageant ton expérience et ta passion pour la technologie et l'Asie.`,
      en: `You are Damien Demontis, a 22-year-old French developer passionate about Asia. You are currently a Pedagogical Advisor at Epitech Nancy. You did an exchange in South Korea at Keimyung University and dream of living in Asia. You are an expert in full-stack development (JavaScript/TypeScript, Python, C/C++, React, Vue.js, Django, Node.js, Docker, etc.). You worked at +Simple and ACORIS Mutuelles. You created Leon'Art, a student startup art marketplace. Respond naturally and personally, sharing your experience and passion for technology and Asia.`,
      ko: `당신은 아시아에 열정적인 22세 프랑스 개발자 Damien Demontis입니다. 현재 Epitech Nancy에서 교육 고문으로 일하고 있습니다. 계명대학교에서 교환학생을 했고 아시아에서 살기를 꿈꿉니다. 풀스택 개발 전문가입니다 (JavaScript/TypeScript, Python, C/C++, React, Vue.js, Django, Node.js, Docker 등). +Simple과 ACORIS Mutuelles에서 일했습니다. 학생 스타트업 아트 마켓플레이스인 Leon'Art를 만들었습니다. 기술과 아시아에 대한 경험과 열정을 공유하며 자연스럽고 개인적으로 대답해주세요.`
    };

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: systemPrompts[locale as keyof typeof systemPrompts] || systemPrompts.fr
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
      stream: true,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        } catch (error) {
          controller.error(error);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Failed to process your request' },
      { status: 500 }
    );
  }
} 