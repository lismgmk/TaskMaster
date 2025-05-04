import { z } from 'zod';
import { taskSchema, taskUpdateSchema, taskFilterSchema } from './schema';

export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskFilter = {
  priority: TaskPriority | 'all';
  status: 'all' | 'active' | 'completed';
};

export type CreateTaskInput = z.infer<typeof taskSchema>;

export type UpdateTaskInput = z.infer<typeof taskUpdateSchema>;

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

export type TaskFilterInput = z.infer<typeof taskFilterSchema>;
