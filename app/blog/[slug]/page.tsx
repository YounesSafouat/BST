export const dynamic = "force-dynamic";
import type { Metadata } from "next"
import { BlogPost } from "@/components/BlogPost"

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
    'http://localhost:3000'
  );
}

// This function is required for static site generation with dynamic routes
export async function generateStaticParams() {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/blog`, { cache: "no-store" });
    
    if (!res.ok) {
      console.warn("Failed to fetch blog data for static params, returning empty array");
      return [];
    }
    
    const data = await res.json();
    const posts = Array.isArray(data) ? data : [];
    return posts.map((post: any) => ({ slug: post.slug }));
  } catch (error) {
    console.warn("Error fetching blog data for static params:", error);
    return [];
  }
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/blog`, { cache: "no-store" });
    
    if (!res.ok) {
      return {
        title: "Blog | Blackswantechnology",
        description: "Découvrez nos articles sur Odoo ERP, HubSpot CRM et la transformation digitale.",
      };
    }
    
    const data = await res.json();
    const posts = Array.isArray(data) ? data : [];
    const post = posts.find((p: any) => p.slug === params.slug);

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
  } catch (error) {
    console.warn("Error generating metadata for blog post:", error);
    return {
      title: "Blog | Blackswantechnology",
      description: "Découvrez nos articles sur Odoo ERP, HubSpot CRM et la transformation digitale.",
    };
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/blog`, { cache: "no-store" });
    
    if (!res.ok) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Erreur lors du chargement de l'article</h1>
            <p className="text-gray-600">Veuillez réessayer plus tard.</p>
          </div>
        </div>
      );
    }
    
    const data = await res.json();
    const posts = Array.isArray(data) ? data : [];
    const post = posts.find((p: any) => p.slug === params.slug && p.published);

    if (!post) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Article non trouvé</h1>
            <p className="text-gray-600">Cet article n'existe pas ou a été déplacé.</p>
            <a href="/blog" className="text-[var(--color-secondary)] hover:underline mt-4 inline-block">
              Retour au blog
            </a>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-white">
        <BlogPost post={post} />
      </div>
    );
  } catch (error) {
    console.error("Error loading blog post:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Erreur lors du chargement de l'article</h1>
          <p className="text-gray-600">Veuillez réessayer plus tard.</p>
        </div>
      </div>
    );
  }
}
