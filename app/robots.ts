import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/',
        '/api/',
        '/_next/',
        '/admin/',
        '/private/',
        '/*.json$',
        '/*.xml$',
        '/temp/',
        '/dev/',
      ],
    },
    sitemap: 'https://agence-blackswan.com/sitemap.xml',
          host: 'https://agence-blackswan.com',
  }
} 