/** @type {import('next').NextConfig} */
const rewrites = () => {
  return [
    {
      source: '/api/auth/:path*',
      destination: `${process.env.API_ENDPOINT}/:path*`,
    },
    {
      source: '/api/product/:path*',
      destination: `${process.env.PRODUCT_API_ENDPOINT}/:path*`,
    },
  ];
};
const nextConfig = {
  // For Static Export
  // output: 'export',
  rewrites,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  optimizeFonts: false,
  env: {
    API_ENDPOINT: process.env.API_ENDPOINT,
    PRODUCT_API_ENDPOINT: process.env.PRODUCT_API_ENDPOINT,
    APP_ENV: process.env.APP_ENV,
    HOST_URL: process.env.HOST_URL,
  },
};

export default nextConfig;
