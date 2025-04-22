export async function initMocks() {
  if (typeof window === 'undefined') {
    return;
  }

  if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
    try {
      const { worker } = await import('./browser');

      // Start the worker
      await worker.start({
        onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
        serviceWorker: {
          url: '/mockServiceWorker.js',
          options: {
            scope: '/',
          },
        },
      });

      console.log('%c[MSW] Mock API server started', 'background: #0070f3; color: white; padding: 2px 4px; border-radius: 2px; font-weight: bold;');
      console.log('API requests will be intercepted by MSW');
    } catch (error) {
      console.error('[MSW] Failed to initialize:', error);
    }
  }
}
