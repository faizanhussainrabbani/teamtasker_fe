/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Enable ESLint during builds to catch issues early
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Enable TypeScript checking during builds
    ignoreBuildErrors: false,
  },
  images: {
    // Enable image optimization for better performance
    unoptimized: false,
    domains: [
      'localhost',
      'placehold.co',
      'placekitten.com',
      'picsum.photos',
    ],
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Configure headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
}

export default nextConfig
