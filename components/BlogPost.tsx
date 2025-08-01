"use client"

import { Button } from "@/components/ui/button"
import {
  Calendar,
  Clock,
  User,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
} from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

// Define the post type with all new fields
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
  featured?: boolean
  published?: boolean
  body?: string
  cover?: string

  similarPosts?: string[] // Array of post slugs
}



// Helper to get the correct image URL
const getImageUrl = (img: string) => {
  if (!img) return '/placeholder.svg';
  if (img.startsWith('/https://') || img.startsWith('/http://')) return img.slice(1);
  return img;
};

export function BlogPost({ post }: { post: Post }) {
  const [scrollY, setScrollY] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [similarPosts, setSimilarPosts] = useState<Post[]>([])

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    setIsLoaded(true)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Fetch similar posts and testimonials from DB
  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
        const apiUrl = baseUrl ? `${baseUrl}/api/blog` : "/api/blog";
        const res = await fetch(apiUrl);
        const data = await res.json();
        const allPosts: Post[] = Array.isArray(data) ? data : [];

        // Get similar posts using the similarPosts array from the post
        if (post.similarPosts && post.similarPosts.length > 0) {
          const similar = allPosts.filter((p) =>
            post.similarPosts!.includes(p.slug) && p.slug !== post.slug
          );
          setSimilarPosts(similar);
        } else {
          // Fallback: same category, exclude current post, limit 3
          const related = allPosts
            .filter((p) => p.slug !== post.slug && p.category === post.category && p.published !== false)
            .slice(0, 3);
          setSimilarPosts(related);
        }


      } catch (error) {
        console.error('Error fetching related data:', error);
      }
    };
    fetchData();
  }, [post.slug, post.category, post.similarPosts]);

  // Function to get category color
  const getCategoryColor = (categoryName: string) => {
    // Generate a consistent color based on the category name using CSS variables
    const colors = [
      "var(--color-main)", // Dark Slate
      "var(--color-secondary)", // Sky Blue
      "#000000", // Black
      "var(--color-secondary)", // Sky Blue variant
      "var(--color-main)", // Dark Slate variant
      "var(--color-secondary)", // Sky Blue variant
      "var(--color-main)", // Dark Slate variant
      "var(--color-secondary)", // Sky Blue variant
      "var(--color-main)", // Dark Slate variant
      "var(--color-secondary)", // Sky Blue variant
    ];

    // Simple hash function to get consistent color for category
    let hash = 0;
    for (let i = 0; i < categoryName.length; i++) {
      const char = categoryName.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    return colors[Math.abs(hash) % colors.length];
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="relative pt-20 md:pt-24 pb-20 px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <a href="/" className="hover:text-black transition-colors">
              Accueil
            </a>
            <ChevronRight className="w-4 h-4" />
            <a href="/blog" className="hover:text-black transition-colors">
              Blog
            </a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-black">{post.title}</span>
          </div>
        </div>
      </section>

      {/* Article Header */}
      <section className="pt-12 pb-8 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div
            className="px-4 py-2 rounded-full text-white text-sm font-medium inline-block mb-6"
            style={{ backgroundColor: getCategoryColor(post.category) }}
          >
            {post.category}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6 tracking-tight">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <div className="font-medium text-black">{post.author}</div>
                <div className="text-sm text-gray-500">{post.authorRole}</div>
              </div>
            </div>
            <div className="h-8 w-px bg-gray-200 hidden md:block"></div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} de lecture</span>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm" className="rounded-full">
                <Share2 className="w-4 h-4 mr-2" /> Partager
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="pb-12 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="aspect-video relative overflow-hidden bg-gray-100 rounded-2xl mb-8">
            <img
              src={getImageUrl(post.cover || post.image)}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="pb-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="blog-content">
            <p className="text-xl text-gray-600 leading-relaxed mb-8 font-medium">{post.excerpt}</p>
            {post.body && (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold text-black mb-6 mt-8 leading-tight">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-bold text-black mb-5 mt-7 leading-tight">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-bold text-black mb-4 mt-6 leading-tight">{children}</h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="text-lg font-bold text-black mb-3 mt-5 leading-tight">{children}</h4>
                  ),
                  p: ({ children }) => (
                    <p className="text-base text-gray-700 leading-7 mb-6">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside text-gray-700 leading-7 mb-6 space-y-2">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside text-gray-700 leading-7 mb-6 space-y-2">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-base text-gray-700 leading-7">{children}</li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-[var(--color-secondary)] pl-6 py-4 my-8 bg-gray-50 rounded-r-lg">
                      <p className="text-lg text-gray-700 italic leading-7">{children}</p>
                    </blockquote>
                  ),
                  code: ({ children, className }) => {
                    const isInline = !className;
                    return isInline ? (
                      <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">{children}</code>
                    ) : (
                      <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono leading-6">{children}</code>
                    );
                  },
                  pre: ({ children }) => (
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono leading-6 mb-6">{children}</pre>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-8">
                      <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-gray-100">{children}</thead>
                  ),
                  tbody: ({ children }) => (
                    <tbody className="bg-white">{children}</tbody>
                  ),
                  tr: ({ children }) => (
                    <tr className="border-b border-gray-300 last:border-b-0">{children}</tr>
                  ),
                  th: ({ children }) => (
                    <th className="px-4 py-3 text-left font-bold text-gray-900 border-r border-gray-300 last:border-r-0">{children}</th>
                  ),
                  td: ({ children }) => (
                    <td className="px-4 py-3 text-gray-700 border-r border-gray-300 last:border-r-0">{children}</td>
                  ),
                  img: ({ src, alt }) => (
                    <div className="my-8">
                      <img 
                        src={src} 
                        alt={alt || 'Blog image'} 
                        className="w-full h-auto rounded-lg shadow-lg max-w-full"
                        loading="lazy"
                      />
                      {alt && (
                        <p className="text-sm text-gray-500 text-center mt-2 italic">{alt}</p>
                      )}
                    </div>
                  ),
                  a: ({ href, children }) => (
                    <a 
                      href={href} 
                      className="text-[var(--color-secondary)] hover:text-[var(--color-main)] underline transition-colors duration-200"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-bold text-black">{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-gray-800">{children}</em>
                  ),
                }}
              >
                {post.body}
              </ReactMarkdown>
            )}
          </div>
        </div>
      </section>



      {/* Similar Articles */}
      {similarPosts.length > 0 && (
        <section className="py-16 px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-black mb-8">Articles Similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarPosts.map((relatedPost) => (
                <div
                  key={relatedPost.slug}
                  className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-500"
                >
                  <div className="relative h-48 overflow-hidden">
                    <div className="aspect-video relative overflow-hidden bg-gray-100 rounded-xl">
                      {relatedPost.cover || relatedPost.image ? (
                        <img
                          src={getImageUrl(relatedPost.cover || relatedPost.image)}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <img
                          src="/placeholder.svg"
                          alt="Placeholder"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div
                      className="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-xs font-medium"
                      style={{ backgroundColor: getCategoryColor(relatedPost.category) }}
                    >
                      {relatedPost.category}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{relatedPost.date}</span>
                    </div>
                    <h3 className="text-lg font-bold text-black mb-3 group-hover:text-[var(--color-secondary)] transition-colors duration-300 line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <a
                      href={`/blog/${relatedPost.slug}`}
                      className="text-[var(--color-secondary)] font-medium text-sm flex items-center group-hover:underline"
                    >
                      Lire l'article <ArrowRight className="ml-1 w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
} 