/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force Rebuild Timestamp: 1735538700000 
  experimental: {
    outputFileTracingIncludes: {
      '/**/*': ['./data/**/*'],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  serverActions: {
    bodySizeLimit: '50mb',
  },
};

export default nextConfig;