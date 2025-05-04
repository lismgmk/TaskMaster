import { getTasks } from '..'; // Убедитесь, что путь правильный
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('getTasks', () => {
  it('должен вернуть список задач при успешном ответе', async () => {
    const mockTasks = [{ id: 1, title: 'Test Task' }];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockTasks)
    }) as unknown as typeof fetch;

    const result = await getTasks();
    expect(result).toEqual(mockTasks);
  });

  it('должен бросить ошибку при неудачном ответе', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ message: 'Ошибка' })
    }) as unknown as typeof fetch;

    await expect(getTasks()).rejects.toThrow('Ошибка');
  });
});
