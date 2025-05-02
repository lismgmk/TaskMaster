import { OpenAI } from 'openai';
import { z } from 'zod';

const openai = new OpenAI({
  apiKey: import.meta.env.OPENAI_API_KEY
});

const schema = z.object({
  title: z.string().min(5)
});

export const prerender = false;

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json();
    const { title } = schema.parse(body);

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that writes task descriptions based on titles.'
        },
        {
          role: 'user',
          content: `Write a task description for this title: "${title}"`
        }
      ],
      max_tokens: 100
    });

    const generated = response.choices[0]?.message?.content?.trim();

    if (!generated) {
      return new Response(
        JSON.stringify({ error: 'No description generated' }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify({ description: generated }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('OpenAI Error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
