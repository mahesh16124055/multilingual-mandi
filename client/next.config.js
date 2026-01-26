/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    // Only unoptimize for production static export
    ...(process.env.NODE_ENV === 'production' && { unoptimized: true }),
  },
  env: {
    CUSTOM_KEY: 'multilingual-mandi',
  },
  
  // Static export configuration for Netlify (production only)
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    trailingSlash: true,
    distDir: 'out',
  }),
  
  // Fix workspace root issue
  outputFileTracingRoot: __dirname,
}

module.exports = nextConfig