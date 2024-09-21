// next.config.js (or next.config.mjs)
export default {
  eslint: {
    ignoreDuringBuilds: true,  // Disable ESLint during the build process
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/auth/login',
        permanent: false,
      },
    ];
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pwnxutdwtdqsdtkbhtfa.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'i0.wp.com',
        pathname: '/**',
      },
    ],
  },
};
