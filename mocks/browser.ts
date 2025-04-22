import { http, HttpResponse } from 'msw';
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Create a custom response transformer to add CORS headers
const corsTransformer = (response: Response) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Clone the response and add CORS headers
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: new Headers({
      ...Object.fromEntries(response.headers.entries()),
      ...corsHeaders,
    }),
  });
};

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...handlers);

// Add the response transformer to all responses
worker.events.on('response:mocked', ({ response }) => {
  return corsTransformer(response);
});

// Handle OPTIONS requests for CORS preflight
worker.use(
  http.options('*', () => {
    const response = new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Max-Age': '86400',
      },
    });

    return corsTransformer(response);
  })
);
