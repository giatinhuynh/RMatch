// next.config.js (or next.config.mjs)
export default {
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'pwnxutdwtdqsdtkbhtfa.supabase.co', // Supabase domain
          pathname: '/storage/v1/object/public/**', // Adjust Supabase storage path
        },
        {
          protocol: 'https',
          hostname: 'i0.wp.com', // Add the external WordPress image domain
          pathname: '/**', // Allow all paths from this domain
        },
      ],
    },
  };
  