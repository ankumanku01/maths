/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Disable static optimization for pages with getServerSideProps
  experimental: {
    esmExternals: false,
  },

  // Disable static generation for auth-protected app
  output: 'standalone',
  
  images: {
    domains: ['edumanage-prod.netlify.app', 'localhost'],
    unoptimized: true,
  },
  
  // For Netlify deployment
  trailingSlash: false,
  
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
