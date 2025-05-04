import { deleteTask } from '..';
import { describe, it, expect, vi, beforeEach } from 'vitest';


describe('deleteTask', () => {
  it('должен удалить задачу', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ success: true })
    }) as unknown as typeof fetch;

    const result = await deleteTask(1);
    expect(result).toEqual({ success: true });
  });

  it('должен бросить ошибку при ошибке удаления', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ message: 'Ошибка удаления' })
    }) as unknown as typeof fetch;

    await expect(deleteTask(1)).rejects.toThrow('Ошибка удаления');
  });
});
