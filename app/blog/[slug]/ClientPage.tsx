"use client"

import { BlogPost } from "@/components/BlogPost"
import Loader from "@/components/home/Loader"
import { useEffect, useState } from "react"

// Define the post type (should match BlogPost)
type Post = {
  slug: string
  title: string
  excerpt: string
  category: string
  image: string
  author: string
  authorRole: string
  date: string
  readTime: string
  body?: string
}

export default function ClientPage({ slug }: { slug: string }) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
      const res = await fetch(`${baseUrl}/api/blog`)
      const data = await res.json()
      const posts = Array.isArray(data) ? data : []
      const found = posts.find((p: any) => p.slug === slug)
      setPost(found || null)
      setLoading(false)
    }
    fetchPost()
  }, [slug])

  if (loading) return <Loader />
  if (!post) return <div>Article non trouvé</div>
  return <BlogPost post={post} />
}
