import { prisma } from '@lib/db';
export const prerender = false;
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: [{ completed: 'asc' }, { updatedAt: 'desc' }]
    });
    return new Response(JSON.stringify(tasks), { status: 200 });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return new Response(JSON.stringify({ message: 'Failed to fetch tasks' }), {
      status: 500
    });
  }
}
