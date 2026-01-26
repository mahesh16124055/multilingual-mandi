/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    unoptimized: true, // Required for static export
  },
  env: {
    CUSTOM_KEY: 'multilingual-mandi',
  },
  
  // Static export configuration for Netlify
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  
  // Fix workspace root issue
  outputFileTracingRoot: __dirname,
}

module.exports = nextConfig