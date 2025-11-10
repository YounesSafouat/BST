import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://agence-blackswan.com'
  
  // Fetch blog posts
  let blogPosts: any[] = []
  try {
    const response = await fetch(`${baseUrl}/api/blog`, { cache: 'no-store' })
    if (response.ok) {
      blogPosts = await response.json()
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error)
  }

  // Fetch client cases for sitemap
  let clientCases: any[] = []
  try {
    const response = await fetch(`${baseUrl}/api/cas-client?published=true`, { cache: 'no-store' })
    if (response.ok) {
      const data = await response.json()
      clientCases = data.cases || []
    }
  } catch (error) {
    console.error('Error fetching client cases for sitemap:', error)
  }

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/cas-client`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/rendez-vous`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/hubspot`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/odoo`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  // Client case URLs
  const clientCaseUrls = clientCases.map((caseItem: any) => ({
    url: `${baseUrl}/cas-client/${caseItem.slug}`,
    lastModified: caseItem.updatedAt ? new Date(caseItem.updatedAt) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Blog post URLs
  const blogUrls = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.createdAt || Date.now()),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...clientCaseUrls, ...blogUrls]
} 