import { generateDescription } from '..';
import { describe, it, expect, vi } from 'vitest';

describe('generateDescription', () => {
  it('должен сгенерировать описание', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ description: 'Generated' })
    }) as unknown as typeof fetch;

    const result = await generateDescription('Title');
    expect(result).toBe('Generated');
  });

  it('должен бросить ошибку при провале', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ error: 'Ошибка генерации' })
    }) as unknown as typeof fetch;

    await expect(generateDescription('Title')).rejects.toThrow(
      'Ошибка генерации'
    );
  });
});
