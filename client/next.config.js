/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  env: {
    CUSTOM_KEY: 'multilingual-mandi',
  },
  
  // Fix workspace root issue
  outputFileTracingRoot: __dirname,
}

module.exports = nextConfig