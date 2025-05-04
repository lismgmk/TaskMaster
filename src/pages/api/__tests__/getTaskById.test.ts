import { getTaskById } from '..';
import { describe, it, expect, vi } from 'vitest';

describe('getTaskById', () => {
  it('должен вернуть задачу по id', async () => {
    const task = { id: 1, title: 'Test Task' };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(task)
    }) as unknown as typeof fetch;

    const result = await getTaskById(1);
    expect(result).toEqual(task);
  });

  it('должен бросить ошибку при неудачном ответе', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ message: 'Not found' })
    }) as unknown as typeof fetch;

    await expect(getTaskById(1)).rejects.toThrow('Not found');
  });
});
