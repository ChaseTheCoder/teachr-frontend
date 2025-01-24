/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['teachr-backend.onrender.com'],
  },
  output: 'export',
  distDir: 'out'
}

module.exports = nextConfig
