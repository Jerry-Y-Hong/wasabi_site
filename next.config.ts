/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force Rebuild Timestamp: 1735538700000
  // (experimental outputFileTracingIncludes removed – not a valid Next.js option)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // serverActions is now default or moved in newer Next.js versions

  async redirects() {
    return [
      {
        source: '/solutions/:path*',
        destination: '/tech/solutions/:path*',
        permanent: true,
      },
      {
        source: '/smartfarm/:path*',
        destination: '/tech/smartfarm/:path*',
        permanent: true,
      },
      {
        source: '/technology/:path*',
        destination: '/tech/technology/:path*',
        permanent: true,
      },
      {
        source: '/cultivation/:path*',
        destination: '/tech/cultivation/:path*',
        permanent: true,
      },
      {
        source: '/tech',
        destination: '/tech/solutions',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;