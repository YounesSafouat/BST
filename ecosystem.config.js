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
      MONGODB_URI: 'mongodb+srv://younes:Bst.987654321@cluster0.7oaxi3p.mongodb.net/blackswantechnology?retryWrites=true&w=majority&appName=Cluster0',
      NEXTAUTH_SECRET: 'blackswantechnology_website_we_invest_in_the_future',
      HUBSPOT_ACCESS_TOKEN: 'pat-eul-91e2254b-ca7b-4a18-8d99-76304a2b69a5'
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: '/root/BST/logs/err.log',
    out_file: '/root/BST/logs/out.log',
    log_file: '/root/BST/logs/combined.log',
    time: true
  }]
} 