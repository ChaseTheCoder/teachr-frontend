/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              frame-ancestors 'self' https://www.google.com https://*.google.com;
              script-src-elem 'self' 'unsafe-inline' 'unsafe-eval'
                https://www.googletagmanager.com 
                https://www.google-analytics.com 
                https://ssl.google-analytics.com 
                https://www.google.com 
                https://*.google.com
                https://pagead2.googlesyndication.com
                https://*.adtrafficquality.google
                https://ep2.adtrafficquality.google;
            `.replace(/\s+/g, ' ').trim()
          }
        ]
      }
    ]
  },
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['teachr-backend.onrender.com'],
  },
}

module.exports = nextConfig
