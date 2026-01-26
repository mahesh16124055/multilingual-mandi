/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  env: {
    CUSTOM_KEY: 'multilingual-mandi',
  },
  trailingSlash: true,
  output: 'export',
}

module.exports = nextConfig