// Mock worker implementation that doesn't rely on MSW
// This is a temporary solution until we can fix the MSW import issues

// Create a mock worker object with the same interface
export const worker = {
  start: () => Promise.resolve(),
  stop: () => Promise.resolve(),
  use: () => {},
  resetHandlers: () => {},
  restoreHandlers: () => {},
  events: {
    on: () => {}
  }
};
