import { prisma } from '@lib/db';
import { taskUpdateSchema } from '@lib/schema';
import { z } from 'astro/zod';
export const prerender = false;
export async function GET({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return new Response(JSON.stringify({ message: 'Invalid ID' }), {
      status: 400
    });
  }

  try {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      return new Response(
        JSON.stringify({ message: `Task with ID ${id} not found` }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(task), { status: 200 });
  } catch (error) {
    console.error(`Error fetching task with ID ${id}:`, error);
    return new Response(JSON.stringify({ message: 'Failed to fetch task' }), {
      status: 500
    });
  }
}

export async function PATCH({
  params,
  request
}: {
  params: { id: string };
  request: Request;
}) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return new Response(JSON.stringify({ message: 'Invalid ID' }), {
      status: 400
    });
  }

  const body = await request.json();

  try {
    const validated = taskUpdateSchema.parse(body);

    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) {
      return new Response(
        JSON.stringify({ message: `Task with ID ${id} not found` }),
        { status: 404 }
      );
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title: validated.title ?? undefined,
        description: validated.description ?? undefined,
        priority: validated.priority ?? undefined,
        dueDate:
          validated.dueDate !== undefined
            ? validated.dueDate
              ? new Date(validated.dueDate)
              : null
            : undefined,
        completed: validated.completed ?? undefined
      }
    });

    return new Response(JSON.stringify(updatedTask), { status: 200 });
  } catch (error) {
    console.error('Error updating task:', error);
    if (error instanceof z.ZodError) {
      const msg = error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join(', ');
      return new Response(
        JSON.stringify({ message: `Validation failed: ${msg}` }),
        { status: 400 }
      );
    }
    return new Response(JSON.stringify({ message: 'Failed to update task' }), {
      status: 500
    });
  }
}

export async function DELETE({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return new Response(JSON.stringify({ message: 'Invalid ID' }), {
      status: 400
    });
  }

  try {
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) {
      return new Response(
        JSON.stringify({ message: `Task with ID ${id} not found` }),
        { status: 404 }
      );
    }

    await prisma.task.delete({ where: { id } });

    return new Response(
      JSON.stringify({ success: true, message: 'Task deleted' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting task:', error);
    return new Response(JSON.stringify({ message: 'Failed to delete task' }), {
      status: 500
    });
  }
}
