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
        const res = await fetch("/api/content?type=blog-page");
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

    let filtered = blogData.content?.blogPosts || [];

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
  const getCategoryColor = (categoryName:any) => {
    const category = blogData.content?.categories?.items?.find((cat: any) => cat.name === categoryName)
    return category?.color || "#000000"
  }

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
              <span className="text-sm font-medium text-gray-700 tracking-wide">NOTRE BLOG</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 tracking-tight">
              Insights &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#714b67] to-[#ff5c35]">
                Expertise
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Découvrez nos derniers articles, guides pratiques et études de cas sur Odoo ERP, HubSpot CRM et la
              transformation digitale.
            </p>
          </div>

          {/* Search Section */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-gray-300 focus:outline-none text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {filteredPosts.find((post: any) => post.featured) && (
        <section className="pb-16 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">Article à la Une</h2>
              <a href="/blog" className="text-gray-600 hover:text-black transition-colors flex items-center text-sm">
                Voir tous les articles <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            </div>

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
                          src={post.image.startsWith('http') ? post.image : `/images/${post.image}`}
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
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime} de lecture</span>
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-black mb-4 group-hover:text-[#714b67] transition-colors duration-300">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{post.excerpt}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-black">{post.author}</div>
                          <div className="text-sm text-gray-500">{post.authorRole}</div>
                        </div>
                      </div>
                      <a href={`/blog/${post.slug}`}>
                        <Button className="bg-black text-white hover:bg-gray-900 group">
                          Lire l'article{" "}
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                      </a>
                    </div>
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
                  <Filter className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-bold text-black">Catégories</h3>
                </div>
                <div className="space-y-2">
                  {blogCategories.map((category: any) => (
                    <button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                        selectedCategory === category.name
                          ? "bg-gray-50 border-2 border-gray-200"
                          : "hover:bg-gray-50 border-2 border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color || "#000000" }}
                        ></div>
                        <span className="font-medium text-gray-700">{category.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">{category.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Posts */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-bold text-black">Articles Populaires</h3>
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
                          src={post.image || "/placeholder.svg"}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 group-hover:text-[#714b67] transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{post.readTime}</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Newsletter - Static only, no functionality */}
              <div className="bg-gradient-to-br from-[#714b67] to-[#ff5c35] rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="w-5 h-5 text-white" />
                  <h3 className="text-lg font-bold">Newsletter</h3>
                </div>
                <p className="text-white/90 mb-4 text-sm">
                  Recevez nos derniers articles et conseils directement dans votre boîte mail.
                </p>
                <input
                  type="email"
                  placeholder="Votre email"
                  className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder:text-white/70 mb-3"
                />
                <Button className="w-full bg-white text-[#714b67] hover:bg-white/90">S'abonner</Button>
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
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-2">Aucun article trouvé</h3>
                  <p className="text-gray-600">Essayez de modifier vos critères de recherche.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paginatedPosts.map((post: any) => (
                      <div
                        key={post.slug}
                        className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-[1.02]"
                      >
                        <div className="relative h-48 overflow-hidden">
                        <div className="aspect-video relative overflow-hidden bg-gray-100">
                          {post.image ? (
                          <img
                              src={post.image.startsWith('http') ? post.image : `/images/${post.image}`}
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
                            className="absolute top-4 left-4 px-3 py-1 rounded-full text-white text-xs font-medium"
                            style={{ backgroundColor: getCategoryColor(post.category) }}
                          >
                            {post.category}
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Calendar className="w-3 h-3" />
                              <span>{post.date}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{post.readTime}</span>
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-black mb-3 group-hover:text-[#714b67] transition-colors duration-300 line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-gray-600" />
                              </div>
                              <div className="text-sm">
                                <span className="font-medium text-black">{post.author}</span>
                              </div>
                            </div>
                            <a
                              href={`/blog/${post.slug}`}
                              className="text-[#714b67] font-medium text-sm flex items-center group-hover:underline"
                            >
                              Lire <ArrowRight className="ml-1 w-4 h-4" />
                            </a>
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
                        asChild
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
                        asChild
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
            Vous avez des questions sur nos solutions{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#714b67] to-[#ff5c35]">
              Odoo ou HubSpot
            </span>
            ?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Nos experts sont disponibles pour vous accompagner dans votre transformation digitale.
          </p>
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
