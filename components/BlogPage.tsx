"use client"

import { Button } from "@/components/ui/button"
import { Search, Calendar, Clock, ChevronRight, ArrowRight, Filter, User, BookOpen, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination"

export default function BlogPage() {
  // All hooks at the top!
  const [blogData, setBlogData] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
        const apiUrl = baseUrl
          ? `${baseUrl}/api/content?type=blog-page`
          : "/api/content?type=blog-page";
        const res = await fetch(apiUrl);
        const data = await res.json();
        setBlogData(Array.isArray(data) ? data[0] : data);
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

    let filtered = (blogData.content?.blogPosts || []).filter((post: any) => post.published === true);

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (post: any) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "Tous") {
      filtered = filtered.filter((post: any) => post.category === selectedCategory)
    }

    setFilteredPosts(filtered)
    setCurrentPage(1); // Reset to first page on filter/search change
  }, [blogData, searchTerm, selectedCategory])

  // Function to get category color
  const getCategoryColor = (categoryName: any) => {
    const category = blogData.content?.categories?.items?.find((cat: any) => cat.name === categoryName)
    return category?.color || "var(--color-main)"
  }

  // Helper to get the correct image URL
  const getImageUrl = (img: string): string => {
    if (!img) return '/placeholder.svg';
    if (img.startsWith('/https://') || img.startsWith('/http://')) return img.slice(1);
    return img;
  };

  if (loading) return <div>Chargement...</div>;
  if (!blogData) return <div>Erreur de chargement du blog.</div>;

  // Extract categories and posts from dynamic data
  const blogCategories = blogData.content?.categories?.items?.map((cat: any) => ({ name: cat.name, count: undefined })) || [];
  const blogPosts = blogData.content?.blogPosts || [];

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / pageSize);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="min-h-screen bg-white">
      <section className="relative pt-48 md:pt-56 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gray-50 border border-gray-200 mb-8">
              <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
              <span className="text-sm font-medium text-color-gray tracking-wide">NOTRE BLOG</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-color-black mb-6">
              Découvrez Nos <span className="text-color-main">Articles</span>
            </h1>
            <p className="text-xl text-color-gray max-w-3xl mx-auto leading-relaxed">
              Guides pratiques, études de cas et insights sur Odoo ERP, HubSpot CRM et la transformation digitale.
            </p>
          </div>

          {/* Search Section */}
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

      {/* Featured Post */}
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

      {/* Main Content */}
      <section className="pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-80 space-y-8">
              {/* Categories Filter */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <Filter className="w-5 h-5 text-color-gray" />
                  <h3 className="text-lg font-bold text-color-black">Catégories</h3>
                </div>
                <div className="space-y-2">
                  {blogCategories.map((category: any) => (
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
                  ))}
                </div>
              </div>

              {/* Popular Posts */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="w-5 h-5 text-color-gray" />
                  <h3 className="text-lg font-bold text-color-black">Articles Populaires</h3>
                </div>
                <div className="space-y-4">
                  {blogPosts.slice(0, 3).map((post: any) => (
                    <a
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="flex items-start gap-3 group hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={getImageUrl(post.image)}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-color-gray group-hover:text-color-secondary transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-1 mt-2">
                          <Clock className="w-3 h-3 text-color-gray" />
                          <span className="text-xs text-color-gray">{post.readTime}</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Newsletter - Static only, no functionality */}
              <div className="bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-main)] rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="w-5 h-5 text-white" />
                  <h3 className="text-lg font-bold">Newsletter</h3>
                </div>
                <p className="text-white/90 mb-4 text-sm">
                  Restez informé des dernières tendances et conseils pour votre transformation digitale.
                </p>
                <input
                  type="email"
                  placeholder="Votre email"
                  className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder:text-white/70 mb-3"
                />
                <Button className="w-full bg-white text-[var(--color-secondary)] hover:bg-white/90">S'abonner</Button>
              </div>
            </div>

            {/* Blog Posts Grid */}
            <div className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-black">
                  {filteredPosts.length} Article{filteredPosts.length > 1 ? "s" : ""}{" "}
                  {selectedCategory !== "Tous" ? `dans ${selectedCategory}` : ""}
                </h2>
                <div className="text-sm text-gray-500">
                  <span>Trier par: </span>
                  <select title="selector" className="ml-2 bg-transparent border-b border-gray-300 focus:outline-none">
                    <option>Plus récents</option>
                    <option>Plus populaires</option>
                    <option>Plus lus</option>
                  </select>
                </div>
              </div>

              {filteredPosts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-color-gray" />
                  </div>
                  <h3 className="text-xl font-bold text-color-black mb-2">Aucun article trouvé</h3>
                  <p className="text-color-gray">Essayez de modifier vos critères de recherche.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paginatedPosts.map((post: any) => (
                    <div
                      key={post.slug}
                      className="group relative flex flex-col bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500"
                    >
                      {/* Category badge */}
                      <div className="absolute top-4 left-4 px-4 py-2 rounded-full text-white text-sm font-medium z-10"
                        style={{ backgroundColor: getCategoryColor(post.category) }}>
                        {post.category}
                      </div>
                      {/* Image */}
                      <div className="relative h-64 overflow-hidden">
                        <div className="aspect-video relative overflow-hidden bg-gray-100">
                          <img
                            src={getImageUrl(post.image)}
                            alt={post.title}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>
                      {/* Card Content */}
                      <div className="flex flex-col flex-1 p-6">
                        {/* Author and Date Row */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                              {/* If you have author image, use it here. Otherwise, fallback to icon/initials */}
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
                        {/* Title and Excerpt */}
                        <h3 className="text-xl font-bold text-black mb-2 group-hover:text-color-main transition-colors duration-300">
                          {post.title}
                        </h3>
                        <p className="text-gray-500 mb-4 flex-1">{post.excerpt}</p>
                        {/* Bottom Row: Lire link right-aligned */}
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

              {/* Pagination Controls */}
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
                    {/* Render page numbers with ellipsis if needed */}
                    {Array.from({ length: totalPages }).map((_, i) => {
                      // Show first, last, current, and neighbors; ellipsis for gaps
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

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
            Prêt à Transformer Votre Entreprise ?
          </h2>
          <div className="text-sm text-gray">
            Découvrez comment nos solutions peuvent vous aider à atteindre vos objectifs.
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-black text-white hover:bg-gray-900 px-8 py-6 text-lg font-medium rounded-xl"
            >
              Contacter un Expert
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-gray-300 hover:bg-gray-50 px-8 py-6 text-lg font-medium rounded-xl"
            >
              Voir nos Services
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
