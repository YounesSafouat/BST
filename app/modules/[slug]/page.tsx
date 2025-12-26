export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import ModulePage from "./ModulePage";

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
    'http://localhost:3000'
  );
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function generateStaticParams() {
  try {
    if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SITE_URL) {
      return [];
    }

    const baseUrl = getBaseUrl();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${baseUrl}/api/content?type=home-page`, {
      cache: "no-store",
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    const homePageContent = Array.isArray(data) ? data.find((c: any) => c.type === 'home-page') : null;
    
    if (!homePageContent?.content?.platformSection?.apps) {
      return [];
    }

    const apps = homePageContent.content.platformSection.apps;
    return apps.map((app: any) => ({
      slug: app.slug || generateSlug(app.title)
    }));
  } catch (error) {
    console.warn("Error fetching module data for static params:", error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SITE_URL) {
      return {
        title: "Module | Blackswantechnology",
        description: "Découvrez nos modules Odoo.",
      };
    }

    const baseUrl = getBaseUrl();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${baseUrl}/api/content?type=home-page`, {
      cache: "no-store",
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return {
        title: "Module | Blackswantechnology",
        description: "Découvrez nos modules Odoo.",
      };
    }

    const data = await res.json();
    const homePageContent = Array.isArray(data) ? data.find((c: any) => c.type === 'home-page') : null;
    
    if (!homePageContent?.content?.platformSection?.apps) {
      return {
        title: "Module | Blackswantechnology",
        description: "Découvrez nos modules Odoo.",
      };
    }

    const apps = homePageContent.content.platformSection.apps;
    const module = apps.find((app: any) => {
      const appSlug = app.slug || generateSlug(app.title);
      return appSlug === params.slug;
    });

    if (!module) {
      return {
        title: "Module non trouvé | Blackswantechnology",
        description: "Ce module n'existe pas ou a été déplacé.",
      };
    }

    return {
      title: `${module.title} | Blackswantechnology`,
      description: module.description,
      openGraph: {
        title: module.title,
        description: module.description,
        type: "website",
      },
    };
  } catch (error) {
    console.warn("Error generating metadata for module:", error);
    return {
      title: "Module | Blackswantechnology",
      description: "Découvrez nos modules Odoo.",
    };
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  try {
    if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SITE_URL) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Erreur lors du chargement du module</h1>
            <p className="text-gray-600">Veuillez réessayer plus tard.</p>
          </div>
        </div>
      );
    }

    const baseUrl = getBaseUrl();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${baseUrl}/api/content?type=home-page`, {
      cache: "no-store",
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Erreur lors du chargement du module</h1>
            <p className="text-gray-600">Veuillez réessayer plus tard.</p>
          </div>
        </div>
      );
    }

    const data = await res.json();
    const homePageContent = Array.isArray(data) ? data.find((c: any) => c.type === 'home-page') : null;
    
    if (!homePageContent?.content?.platformSection?.apps) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Module non trouvé</h1>
            <p className="text-gray-600">Ce module n'existe pas.</p>
          </div>
        </div>
      );
    }

    const apps = homePageContent.content.platformSection.apps;
    const module = apps.find((app: any) => {
      const appSlug = app.slug || generateSlug(app.title);
      return appSlug === params.slug;
    });

    if (!module) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Module non trouvé</h1>
            <p className="text-gray-600">Ce module n'existe pas ou a été déplacé.</p>
          </div>
        </div>
      );
    }

    return <ModulePage module={module} />;
  } catch (error) {
    console.warn("Error loading module:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Erreur lors du chargement du module</h1>
          <p className="text-gray-600">Veuillez réessayer plus tard.</p>
        </div>
      </div>
    );
  }
}



