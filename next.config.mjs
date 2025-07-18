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
    domains: ['localhost', 'agence-blackswan.com', '0.0.0.0', '212.227.28.148'],
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
  // Add trailing slash for better routing
  trailingSlash: false,
  // Disable x-powered-by header for security
  poweredByHeader: false,
  // Add compression
  compress: true,
  // Handle production builds better
  swcMinify: true,
}

export default nextConfig
