import { getTasks } from '..'; // Убедитесь, что путь правильный
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('getTasks', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('должен успешно вернуть задачи', async () => {
    const mockTasks = [
      {
        id: 1,
        title: 'Test Task 1',
        description: 'Description for Task 1',
        priority: 'low',
        dueDate: '2024-12-31T23:59:59Z',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        title: 'Test Task 2',
        description: 'Description for Task 2',
        priority: 'high',
        dueDate: '2024-12-31T23:59:59Z',
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockTasks)
    }) as unknown as typeof fetch;

    const tasks = await getTasks();

    expect(tasks).toEqual(mockTasks);
  });

  it('должен выбросить ошибку при неудачном запросе', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ message: 'Failed to fetch tasks' })
    }) as unknown as typeof fetch;

    await expect(getTasks()).rejects.toThrow('Failed to fetch tasks');
  });
});
