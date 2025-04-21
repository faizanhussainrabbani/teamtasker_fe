export async function initMocks() {
  if (typeof window === 'undefined') {
    return;
  }

  if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
    const { worker } = await import('./browser');
    
    // Start the worker
    await worker.start({
      onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
    });
    
    console.log('[MSW] Mock API server started');
  }
}
