import type { Metadata } from "next"
import BlogPost from "../../../pages/blog-post"

// This function is required for static site generation with dynamic routes
export async function generateStaticParams() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/content?type=blog-page`, { cache: "no-store" });
  const data = await res.json();
  const blogData = Array.isArray(data) ? data[0] : data;
  const posts = blogData?.content?.blogPosts || [];
  return posts.map((post: any) => ({ slug: post.slug }));
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/content?type=blog-page`, { cache: "no-store" });
  const data = await res.json();
  const blogData = Array.isArray(data) ? data[0] : data;
  const post = blogData?.content?.blogPosts?.find((p: any) => p.slug === params.slug);

  if (!post) {
    return {
      title: "Article non trouvé | Blackswantechnology",
      description: "Cet article n'existe pas ou a été déplacé.",
    };
  }

  return {
    title: `${post.title} | Blackswantechnology`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/content?type=blog-page`, { cache: "no-store" });
  const data = await res.json();
  const blogData = Array.isArray(data) ? data[0] : data;
  const post = blogData?.content?.blogPosts?.find((p: any) => p.slug === params.slug);

  if (!post) {
    return <div>Article non trouvé</div>;
  }

  return <BlogPost post={post} />;
}
