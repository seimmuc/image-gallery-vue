// class ResizeObserver {
//   observe() {
//       // do nothing
//   }
//   unobserve() {
//       // do nothing
//   }
//   disconnect() {
//       // do nothing
//   }
// }

import { vi } from "vitest";

// window.ResizeObserver = ResizeObserver;

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

export {};