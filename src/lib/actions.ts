import { z } from 'zod';
import { prisma } from './db';
import { taskSchema, taskUpdateSchema } from './schema';
import type { CreateTaskInput, UpdateTaskInput } from './types';

// Get all tasks
export async function getTasks() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: [
        { completed: 'asc' },
        { updatedAt: 'desc' }
      ]
    });
    
    return tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw new Error('Failed to fetch tasks');
  }
}

// Get a task by ID
export async function getTaskById(id: number) {
  try {
    const task = await prisma.task.findUnique({
      where: { id }
    });
    
    if (!task) {
      throw new Error(`Task with ID ${id} not found`);
    }
    
    return task;
  } catch (error) {
    console.error(`Error fetching task with ID ${id}:`, error);
    throw new Error(`Failed to fetch task: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Create a new task
export async function createTask(input: CreateTaskInput) {
  try {
    // Validate input using Zod schema
    const validatedData = taskSchema.parse(input);
    
    // Create the task in the database
    const task = await prisma.task.create({
      data: {
        title: validatedData.title,
        description: validatedData.description || '',
        priority: validatedData.priority,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
        completed: validatedData.completed || false
      }
    });
    
    return task;
  } catch (error) {
    console.error('Error creating task:', error);
    
    if (error instanceof z.ZodError) {
      // Handle validation errors
      const errorMessage = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      throw new Error(`Validation failed: ${errorMessage}`);
    }
    
    throw new Error(`Failed to create task: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Update a task by ID
export async function updateTask(id: number, input: UpdateTaskInput) {
  try {
    // Validate input using Zod schema
    const validatedData = taskUpdateSchema.parse(input);
    
    // Get current task to ensure it exists
    const existingTask = await prisma.task.findUnique({
      where: { id }
    });
    
    if (!existingTask) {
      throw new Error(`Task with ID ${id} not found`);
    }
    
    // Update the task in the database
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title: validatedData.title !== undefined ? validatedData.title : undefined,
        description: validatedData.description !== undefined ? validatedData.description : undefined,
        priority: validatedData.priority !== undefined ? validatedData.priority : undefined,
        dueDate: validatedData.dueDate !== undefined ? 
          (validatedData.dueDate ? new Date(validatedData.dueDate) : null) : 
          undefined,
        completed: validatedData.completed !== undefined ? validatedData.completed : undefined
      }
    });
    
    return updatedTask;
  } catch (error) {
    console.error(`Error updating task with ID ${id}:`, error);
    
    if (error instanceof z.ZodError) {
      // Handle validation errors
      const errorMessage = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      throw new Error(`Validation failed: ${errorMessage}`);
    }
    
    throw new Error(`Failed to update task: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Delete a task by ID
export async function deleteTask(id: number) {
  try {
    // Get current task to ensure it exists
    const existingTask = await prisma.task.findUnique({
      where: { id }
    });
    
    if (!existingTask) {
      throw new Error(`Task with ID ${id} not found`);
    }
    
    // Delete the task from the database
    await prisma.task.delete({
      where: { id }
    });
    
    return { success: true, message: `Task with ID ${id} deleted successfully` };
  } catch (error) {
    console.error(`Error deleting task with ID ${id}:`, error);
    throw new Error(`Failed to delete task: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
