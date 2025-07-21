/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable SSR for client-heavy application
  experimental: {
    esmExternals: false
  },
  images: {
    domains: ['edumanage-prod.netlify.app'],
  },

  // Netlify specific settings
  trailingSlash: true,

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
