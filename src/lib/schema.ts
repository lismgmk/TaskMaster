import { z } from 'zod';

const TaskPriorityEnum = z.enum(['low', 'medium', 'high']);

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or less'),
  description: z
    .string()
    .max(1000, 'Description must be 1000 characters or less')
    .optional()
    .nullable(),
  priority: TaskPriorityEnum,
  dueDate: z.string().optional().nullable(),
  completed: z.boolean().default(false)
});

export const taskUpdateSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or less')
    .optional(),
  description: z
    .string()
    .max(1000, 'Description must be 1000 characters or less')
    .optional()
    .nullable(),
  priority: TaskPriorityEnum.optional(),
  dueDate: z.string().optional().nullable(),
  completed: z.boolean().optional()
});

export const taskFilterSchema = z.object({
  priority: z.union([TaskPriorityEnum, z.literal('all')]).default('all'),
  status: z.enum(['all', 'active', 'completed']).default('all')
});
