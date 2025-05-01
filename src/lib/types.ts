import { z } from 'zod';
import { taskSchema, taskUpdateSchema, taskFilterSchema } from './schema';

// Task priority type
export type TaskPriority = 'low' | 'medium' | 'high';

// Task filter type
export type TaskFilter = {
  priority: TaskPriority | 'all';
  status: 'all' | 'active' | 'completed';
};

// Type for creating a new task
export type CreateTaskInput = z.infer<typeof taskSchema>;

// Type for updating an existing task
export type UpdateTaskInput = z.infer<typeof taskUpdateSchema>;

// Type for the task model
export type Task = {
  id: number;
  title: string;
  description: string | null;
  priority: TaskPriority;
  dueDate: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

// Type for filtering tasks
export type TaskFilterInput = z.infer<typeof taskFilterSchema>;
