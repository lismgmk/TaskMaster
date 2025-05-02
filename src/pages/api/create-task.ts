// src/pages/api/create-task.ts
import { prisma } from '@lib/db';
import { taskSchema } from '@lib/schema';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const data = taskSchema.parse(body); // валидация Zod

    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description || '',
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        completed: false
      }
    });

    return new Response(JSON.stringify(task), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 400 }
    );
  }
};
