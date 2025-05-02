import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Prisma client
vi.mock('../src/lib/db', () => {
  return {
    prisma: {
      task: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn()
      }
    }
  };
});

// Mock window.localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
  key: vi.fn(),
  length: 0
};

// Mock window object for components
global.window = {
  ...global.window,
  localStorage: localStorageMock,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn()
};

// Mock document object
global.document = {
  ...global.document,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn()
};
