import { z } from 'zod';
import { prisma } from './db';
import { taskSchema, taskUpdateSchema } from './schema';
import type { CreateTaskInput, UpdateTaskInput } from './types';
const baseUrl = import.meta.env.PUBLIC_BASE_URL;
// Get all tasks
export async function getTasks() {
  const res = await fetch(`${baseUrl}/api/tasks`);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to fetch tasks');
  }
  return res.json();
}

// Get a task by ID
export async function getTaskById(id: number) {
  const res = await fetch(`${baseUrl}/api/task/${id}`);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to fetch task');
  }
  return res.json();
}

export async function createTask(input: CreateTaskInput) {
  const res = await fetch(`${baseUrl}/api/create-task`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Failed to create task');
  }

  return await res.json();
}

// Update a task by ID
export async function updateTask(id: number, input: UpdateTaskInput) {
  const res = await fetch(`${baseUrl}/api/task/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to update task');
  }

  return res.json();
}

export async function deleteTask(id: number) {
  const res = await fetch(`${baseUrl}/api/task/${id}`, {
    method: 'DELETE'
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to delete task');
  }

  return res.json();
}

export async function generateDescription(title: string): Promise<string> {
  const res = await fetch(`${baseUrl}/api/generate-description`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to generate description');
  }

  const data = await res.json();
  return data.description;
}
