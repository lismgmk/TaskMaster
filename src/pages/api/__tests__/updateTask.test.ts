import { updateTask } from '..';
import { describe, it, expect, vi } from 'vitest';

const update = { title: 'Updated' };

describe('updateTask', () => {
  it('должен обновить задачу', async () => {
    const updatedTask = { id: 1, ...update };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(updatedTask)
    }) as unknown as typeof fetch;

    const result = await updateTask(1, update);
    expect(result).toEqual(updatedTask);
  });

  it('должен бросить ошибку при неудаче', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ message: 'Ошибка обновления' })
    }) as unknown as typeof fetch;

    await expect(updateTask(1, update)).rejects.toThrow('Ошибка обновления');
  });
});
