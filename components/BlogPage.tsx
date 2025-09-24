/**
 * BlogPage.tsx
 * 
 * Main blog page component that displays blog posts with filtering, search,
 * and regional content adaptation. This component handles blog post listing,
 * categorization, and user interaction features.
 * 
 * WHERE IT'S USED:
 * - Blog page route (/app/blog/page.tsx) - Main blog listing page
 * - Displays all published blog posts with filtering capabilities
 * 
 * KEY FEATURES:
 * - Dynamic blog post loading from API
 * - Category-based filtering and search functionality
 * - Regional content adaptation based on user location
 * - Pagination for large numbers of posts
 * - Scheduled post release management
 * - Responsive design with mobile optimization
 * - SEO-friendly URL structure
 * - Content scheduling and publication control
 * 
 * TECHNICAL DETAILS:
 * - Uses React with TypeScript and client-side rendering
 * - Implements pagination with configurable page sizes
 * - Integrates with geolocation API for regional content
 * - Fetches blog data from /api/blog endpoint
 * - Implements search and filter functionality
 * - Uses Tailwind CSS for responsive design
 * - Handles scheduled post publishing logic
 * 
 * @author younes safouat
 * @version 1.0.0
 * @since 2025
 */

"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Calendar, Clock, ChevronRight, ArrowRight, Filter, User, BookOpen, TrendingUp, MapPin, FileText, Award, Users, Zap } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { getRegionFromCountry, shouldShowContent, type Region } from "@/lib/geolocation"
import { useGeolocationSingleton } from '@/hooks/useGeolocationSingleton'
import { useButtonAnalytics } from '@/hooks/use-analytics'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import Loader from "./home/Loader"

// Helper function to check if a blog is released
function isBlogReleased(post: any): boolean {
  if (!post.scheduledDate) return post.published;

  const scheduledDate = new Date(post.scheduledDate);
  const now = new Date();

  return scheduledDate <= now && post.published;
}

export default function BlogPage() {
  const [blogData, setBlogData] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const { data: location, loading: locationLoading, region: userRegion } = useGeolocationSingleton();
  
  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = useState<string>('');
  const { trackButtonClick } = useButtonAnalytics();

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
        const apiUrl = baseUrl
          ? `${baseUrl}/api/blog`
          : "/api/blog";
        const res = await fetch(apiUrl);
        const data = await res.json();
        setBlogData({ content: { blogPosts: data } });
      } catch (err) {
        console.error("Failed to fetch blog data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogData();
  }, []);

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

  useEffect(() => {
    if (!blogData) return;

    let filtered = (blogData.content?.blogPosts || []).filter((post: any) => isBlogReleased(post));

    filtered = filtered.filter((post: any) => shouldShowContent(post, userRegion));

    if (searchTerm) {
      filtered = filtered.filter(
        (post: any) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory !== "Tous") {
      filtered = filtered.filter((post: any) => post.category === selectedCategory)
    }

    setFilteredPosts(filtered)
    setCurrentPage(1);
  }, [blogData, searchTerm, selectedCategory, userRegion])

  const getCategoryColor = (categoryName: any) => {
    const category = blogData.content?.categories?.items?.find((cat: any) => cat.name === categoryName)
    return category?.color || "var(--color-main)"
  }

  const getImageUrl = (img: string): string => {
    if (!img) return '/placeholder.svg';
    if (img.startsWith('/https://') || img.startsWith('/http://')) return img.slice(1);
    return img;
  };

  const getRegionDisplayName = (region: Region): string => {
    switch (region) {
      case 'france':
        return 'France';
      case 'morocco':
        return 'Maroc';
      case 'international':
        return 'International';
      default:
        return 'International';
    }
  };

  const handleNewsletterSubmit = async () => {
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterStatus('error');
      setNewsletterMessage('Veuillez entrer une adresse email valide');
      return;
    }

    setNewsletterStatus('loading');
    setNewsletterMessage('');
    trackButtonClick('newsletter_submit_blog');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      const data = await response.json();

      if (data.success) {
        setNewsletterStatus('success');
        setNewsletterMessage('Merci ! Vous êtes maintenant abonné à notre newsletter.');
        setNewsletterEmail('');
      } else {
        setNewsletterStatus('error');
        setNewsletterMessage(data.error || 'Une erreur est survenue. Veuillez réessayer.');
      }
    } catch (error) {
      setNewsletterStatus('error');
      setNewsletterMessage('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  if (loading) return <Loader />;
  if (!blogData) return <div>Erreur de chargement du blog.</div>;

  const blogCategories = blogData.content?.categories?.items?.map((cat: any) => ({ name: cat.name, count: undefined })) || [];
  const blogPosts = blogData.content?.blogPosts || [];

  const generateCategoriesFromPosts = () => {
    const categoryCounts: { [key: string]: number } = {};
    filteredPosts.forEach((post: any) => {
      if (post.category) {
        categoryCounts[post.category] = (categoryCounts[post.category] || 0) + 1;
      }
    });

    const allCategories = [
      {
        name: "Tous",
        count: filteredPosts.length,
        color: "var(--color-main)"
      },
      ...Object.entries(categoryCounts).map(([name, count]) => ({
        name,
        count,
        color: getCategoryColor(name)
      }))
    ];

    return allCategories;
  };

  const actualCategories = generateCategoriesFromPosts();

  const totalPages = Math.ceil(filteredPosts.length / pageSize);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="min-h-screen bg-white">
      <section className="relative pt-48 md:pt-56 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="uppercase tracking-widest text-sm text-[var(--color-secondary)] font-semibold mb-2">NOTRE BLOG</div>
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              Découvrez Nos <span className="text-[var(--color-main)]">Articles</span>
            </h1>
            <p className="text-xl text-color-gray max-w-3xl mx-auto leading-relaxed">
              Guides pratiques, études de cas et insights sur Odoo ERP, HubSpot CRM et la transformation digitale.
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-color-gray" />
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-color-main focus:border-transparent"
              />
            </div>
          </div>


        </div>
      </section>

      {filteredPosts.find((post: any) => post.featured) && (
        <section className="pb-16 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">


            {filteredPosts
              .filter((post: any) => post.featured)
              .map((post: any) => (
                <div
                  key={post.slug}
                  className="group relative grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500"
                >
                  <div className="relative h-64 lg:h-auto overflow-hidden">
                    <div className="aspect-video relative overflow-hidden bg-gray-100">
                      {post.image ? (
                        <img
                          src={getImageUrl(post.image)}
                          alt={post.title}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <img
                          src="/placeholder.svg"
                          alt="Placeholder"
                          className="object-cover w-full h-full"
                        />
                      )}
                    </div>
                    <div
                      className="absolute top-4 left-4 px-4 py-2 rounded-full text-white text-sm font-medium"
                      style={{ backgroundColor: getCategoryColor(post.category) }}
                    >
                      {post.category}
                    </div>
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-color-gray">
                        <User className="w-4 h-4" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-color-gray">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.date).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-color-black mb-4 group-hover:text-color-secondary transition-colors duration-300">
                      {post.title}
                    </h3>
                    <p className="text-color-gray mb-6 leading-relaxed">{post.excerpt}</p>
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-color-gray" />
                      <div>
                        <div className="font-medium text-color-black">{post.author}</div>
                        <div className="text-sm text-color-gray">{post.authorRole}</div>
                      </div>
                    </div>
                    <Button className="bg-black text-white hover:bg-gray-900 group">
                      Lire l'article{" "}
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      <section className="pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-80 space-y-8">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <Filter className="w-5 h-5 text-color-gray" />
                  <h3 className="text-lg font-bold text-color-black">Catégories</h3>
                </div>
                <div className="space-y-2">
                  {actualCategories.length > 1 ? (
                    actualCategories.map((category: any) => (
                      <button
                        key={category.name}
                        onClick={() => setSelectedCategory(category.name)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${selectedCategory === category.name
                          ? "bg-gray-50 border-2 border-gray-200"
                          : "hover:bg-gray-50 border-2 border-transparent"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color || "var(--color-main)" }}
                          ></div>
                          <span className="font-medium text-color-gray">{category.name}</span>
                        </div>
                        <span className="text-sm text-color-gray">{category.count}</span>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-4 text-sm text-gray-500">
                      Aucune catégorie disponible pour votre région
                    </div>
                  )}
                </div>
              </div>



              <div className="bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-main)] rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="w-5 h-5 text-white" />
                  <h3 className="text-lg font-bold">Newsletter</h3>
                </div>
                <p className="text-white/90 mb-4 text-sm">
                  Restez informé des dernières tendances et conseils pour votre transformation digitale.
                </p>
                <div className="space-y-3">
                  <Input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Votre email"
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white"
                    disabled={newsletterStatus === 'loading'}
                  />
                  <Button
                    onClick={handleNewsletterSubmit}
                    disabled={newsletterStatus === 'loading'}
                    className="w-full bg-white text-[var(--color-secondary)] hover:bg-white/90 disabled:opacity-50"
                  >
                    {newsletterStatus === 'loading' ? 'Abonnement...' : "S'abonner"}
                  </Button>
                  
                  {newsletterMessage && (
                    <div className={`text-sm text-center p-2 rounded-lg ${
                      newsletterStatus === 'success' 
                        ? 'bg-green-500/20 text-green-100' 
                        : 'bg-red-500/20 text-red-100'
                    }`}>
                      {newsletterMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-black">
                  {filteredPosts.length} Article{filteredPosts.length > 1 ? "s" : ""}{" "}
                  {selectedCategory !== "Tous" ? `dans ${selectedCategory}` : ""}
                </h2>
              </div>

              {filteredPosts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-color-gray" />
                  </div>
                  <h3 className="text-xl font-bold text-color-black mb-2">
                    {searchTerm || selectedCategory !== "Tous"
                      ? "Aucun article trouvé"
                      : "Aucun article disponible pour votre région"
                    }
                  </h3>
                  <p className="text-color-gray">
                    {searchTerm || selectedCategory !== "Tous"
                      ? "Essayez de modifier vos critères de recherche."
                      : "Le contenu sera bientôt disponible pour votre région."
                    }
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paginatedPosts.map((post: any) => (
                    <div
                      key={post.slug}
                      className="group relative flex flex-col bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500"
                    >
                      <div className="absolute top-4 left-4 px-4 py-2 rounded-full text-white text-sm font-medium z-10"
                        style={{ backgroundColor: getCategoryColor(post.category) }}>
                        {post.category}
                      </div>
                      <div className="relative h-64 overflow-hidden">
                        <div className="aspect-video relative overflow-hidden bg-gray-100">
                          <img
                            src={getImageUrl(post.image)}
                            alt={post.title}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col flex-1 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                              <User className="w-6 h-6 text-gray-500" />
                            </div>
                            <div>
                              <div className="font-semibold text-black leading-tight">{post.author}</div>
                              {post.authorRole && (
                                <div className="text-xs text-gray-400">{post.authorRole}</div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Calendar className="w-4 h-4" />
                            {post.date ? post.date : "Date inconnue"}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-black mb-2 group-hover:text-color-main transition-colors duration-300">
                          {post.title}
                        </h3>
                        <p className="text-gray-500 mb-4 flex-1">{post.excerpt}</p>

                        <div className="flex items-center justify-end mt-auto">
                          <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1 text-color-main font-medium hover:underline text-sm">
                            Lire <ArrowRight className="w-4 h-4 ml-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-12 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        aria-disabled={currentPage === 1}
                        tabIndex={currentPage === 1 ? -1 : 0}
                        href="#"
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }).map((_, i) => {
                      if (
                        i === 0 ||
                        i === totalPages - 1 ||
                        Math.abs(i + 1 - currentPage) <= 1
                      ) {
                        return (
                          <PaginationItem key={i}>
                            <PaginationLink
                              isActive={currentPage === i + 1}
                              href="#"
                              onClick={() => setCurrentPage(i + 1)}
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (
                        (i === 1 && currentPage > 3) ||
                        (i === totalPages - 2 && currentPage < totalPages - 2)
                      ) {
                        return (
                          <PaginationItem key={i}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        aria-disabled={currentPage === totalPages}
                        tabIndex={currentPage === totalPages ? -1 : 0}
                        href="#"
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-[var(--color-secondary)]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--color-main)]/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-[var(--color-secondary)] rounded-full mr-2"></span>
              TRANSFORMATION DIGITALE
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Prêt à Transformer Votre Entreprise ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Rejoignez les centaines d'entreprises qui ont déjà révolutionné leurs processus avec Odoo.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            <Button
              size="lg"
              className="bg-[var(--color-main)] hover:bg-[var(--color-secondary)] text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              onClick={() => {
                window.location.href = '/#contact';
              }}
            >
              Démarrer maintenant
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-[var(--color-main)] text-[var(--color-main)] hover:bg-[var(--color-main)] hover:text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 group"
              onClick={() => {
                window.location.href = '/#modules';
              }}
            >
              Voir nos réalisations
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--color-secondary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-[var(--color-secondary)]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Expertise Certifiée</h3>
              <p className="text-gray-600">Partenaire officiel Odoo & HubSpot</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--color-secondary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-[var(--color-secondary)]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">+100 Clients Satisfaits</h3>
              <p className="text-gray-600">Transformations réussies au Maroc</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--color-secondary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-[var(--color-secondary)]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Résultats Rapides</h3>
              <p className="text-gray-600">Déploiement en quelques semaines</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
