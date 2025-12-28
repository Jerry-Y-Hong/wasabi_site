/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      '/**/*': ['./data/**/*'],
    },
  },
  serverActions: {
    bodySizeLimit: '50mb',
  },
};

export default nextConfig;
