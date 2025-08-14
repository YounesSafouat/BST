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
    // During build time, we might not have access to external URLs
    // Return an empty array to avoid build failures
    if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SITE_URL) {
      console.warn("No site URL configured for production build, returning empty array");
      return [];
    }

    const baseUrl = getBaseUrl();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const res = await fetch(`${baseUrl}/api/blog`, {
      cache: "no-store",
      signal: controller.signal
    });

    clearTimeout(timeoutId);

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
    // During build time, we might not have access to external URLs
    if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SITE_URL) {
      return {
        title: "Blog | Blackswantechnology",
        description: "Découvrez nos articles sur Odoo ERP, HubSpot CRM et la transformation digitale.",
      };
    }

    const baseUrl = getBaseUrl();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const res = await fetch(`${baseUrl}/api/blog`, {
      cache: "no-store",
      signal: controller.signal
    });

    clearTimeout(timeoutId);

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
    // During build time, we might not have access to external URLs
    if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SITE_URL) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Erreur lors du chargement de l'article</h1>
            <p className="text-gray-600">Veuillez réessayer plus tard.</p>
          </div>
        </div>
      );
    }

    const baseUrl = getBaseUrl();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const res = await fetch(`${baseUrl}/api/blog`, {
      cache: "no-store",
      signal: controller.signal
    });

    clearTimeout(timeoutId);

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
            <p className="text-gray-600">Cet article n'existe pas ou n'est pas encore publié.</p>
          </div>
        </div>
      );
    }

    return <BlogPost post={post} />;
  } catch (error) {
    console.warn("Error loading blog post:", error);
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
