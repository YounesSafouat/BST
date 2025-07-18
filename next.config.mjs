/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['localhost', 'your-domain.com', '0.0.0.0'],
  },
  output: 'standalone',
  experimental: {
    serverActions: true,
  },
  // Ensure proper host binding for production
  serverRuntimeConfig: {
    hostname: process.env.HOSTNAME || '0.0.0.0',
    port: process.env.PORT || 3000,
  },
}

export default nextConfig
