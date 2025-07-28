module.exports = {
  apps: [{
    name: 'bst-app',
    script: 'npm',
    args: 'start',
    cwd: '/root/BST',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOSTNAME: '0.0.0.0',
      NEXT_PUBLIC_SITE_URL: 'https://agence-blackswan.com',
      NEXT_PUBLIC_BASE_URL: 'https://agence-blackswan.com',
      NEXTAUTH_URL: 'https://agence-blackswan.com',
      // Load sensitive data from environment variables
      MONGODB_URI: process.env.MONGODB_URI,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      HUBSPOT_ACCESS_TOKEN: process.env.HUBSPOT_ACCESS_TOKEN
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: '/root/BST/logs/err.log',
    out_file: '/root/BST/logs/out.log',
    log_file: '/root/BST/logs/combined.log',
    time: true,
    // Add restart delay to prevent rapid restarts
    min_uptime: '10s',
    max_restarts: 10,
    restart_delay: 4000
  }]
} 