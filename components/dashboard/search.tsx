"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Search, FileText, Users, MessageSquare, Code, Settings, Database, Globe, Palette, BarChart3 } from "lucide-react"

// Enhanced search data structure
interface SearchItem {
  id: string
  title: string
  description: string
  url: string
  category: string
  icon?: React.ComponentType<{ className?: string }>
  type: 'page' | 'content'
}

// Content search result interface
interface ContentResult {
  _id: string
  title: string
  description?: string
  type: string
  content?: any
  url: string
  category: string
  icon?: React.ComponentType<{ className?: string }>
}

export function SearchDialog() {
  const router = useRouter()
  const { data: session } = useSession()
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [contentResults, setContentResults] = React.useState<ContentResult[]>([])
  const [isSearching, setIsSearching] = React.useState(false)

  // Static navigation items
  const navigationItems: SearchItem[] = [
    {
      id: "dashboard",
      title: "Dashboard",
      description: "View analytics and overview",
      url: "/dashboard",
      category: "Navigation",
      type: 'page',
      icon: BarChart3
    },
    {
      id: "content",
      title: "Content Management",
      description: "Manage website content",
      url: "/dashboard/content",
      category: "Content",
      type: 'page',
      icon: Database
    },
    {
      id: "blog",
      title: "Blog Management",
      description: "Manage blog posts",
      url: "/dashboard/blog",
      category: "Content",
      type: 'page',
      icon: FileText
    },
    {
      id: "seo",
      title: "SEO Management",
      description: "Manage SEO settings",
      url: "/dashboard/seo",
      category: "Marketing",
      type: 'page',
      icon: Globe
    },
    {
      id: "clients",
      title: "Client Management",
      description: "Manage client information",
      url: "/dashboard/clients",
      category: "Business",
      type: 'page',
      icon: Users
    },
    {
      id: "users",
      title: "User Management",
      description: "Manage user accounts",
      url: "/dashboard/users",
      category: "Administration",
      type: 'page',
      icon: Users
    },
    {
      id: "contact",
      title: "Contact Submissions",
      description: "View contact form submissions",
      url: "/dashboard/contact-submissions",
      category: "Communication",
      type: 'page',
      icon: MessageSquare
    },
    {
      id: "appearance",
      title: "Appearance Settings",
      description: "Customize colors, fonts, and design",
      url: "/dashboard/appearance",
      category: "Design",
      type: 'page',
      icon: Palette
    },
    {
      id: "settings",
      title: "Settings",
      description: "Manage system settings",
      url: "/dashboard/settings",
      category: "Administration",
      type: 'page',
      icon: Settings
    },
    {
      id: "snippets",
      title: "Snippets",
      description: "Manage tracking and analytics scripts",
      url: "/dashboard/snippets",
      category: "Marketing",
      type: 'page',
      icon: Code
    }
  ]

  // Search through content (blogs, testimonials, clients, etc.)
  const searchContent = React.useCallback(async (query: string) => {
    if (!query.trim()) {
      setContentResults([])
      return
    }

    setIsSearching(true)
    try {
      // Search through different content types
      const searchPromises = [
        fetch(`/api/content?type=blog&search=${encodeURIComponent(query)}`),
        fetch(`/api/content?type=testimonials&search=${encodeURIComponent(query)}`),
        fetch(`/api/content?type=clients&search=${encodeURIComponent(query)}`),
        fetch(`/api/content?type=snippets&search=${encodeURIComponent(query)}`),
        fetch(`/api/content?type=seo&search=${encodeURIComponent(query)}`),
        fetch(`/api/content?type=content&search=${encodeURIComponent(query)}`)
      ]

      const responses = await Promise.allSettled(searchPromises)
      const results: ContentResult[] = []

      responses.forEach((response, index) => {
        if (response.status === 'fulfilled' && response.value.ok) {
          response.value.json().then((data: any[]) => {
            if (data && data.length > 0) {
              data.forEach(item => {
                const typeMap: { [key: string]: string } = {
                  'blog': 'Blog Post',
                  'testimonials': 'Testimonial',
                  'clients': 'Client',
                  'snippets': 'Snippet',
                  'seo': 'SEO',
                  'content': 'Content'
                }

                const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
                  'blog': FileText,
                  'testimonials': MessageSquare,
                  'clients': Users,
                  'snippets': Code,
                  'seo': Globe,
                  'content': Database
                }

                const categoryMap: { [key: string]: string } = {
                  'blog': 'Content',
                  'testimonials': 'Business',
                  'clients': 'Business',
                  'snippets': 'Marketing',
                  'seo': 'Marketing',
                  'content': 'Content'
                }

                const type = ['blog', 'testimonials', 'clients', 'snippets', 'seo', 'content'][index]

                results.push({
                  _id: item._id,
                  title: item.title || item.name || 'Untitled',
                  description: item.description || item.content?.description || item.excerpt || 'No description',
                  type: typeMap[type] || type,
                  content: item.content,
                  url: `/dashboard/${type}`,
                  category: categoryMap[type] || 'Other',
                  icon: iconMap[type]
                })
              })
            }
          })
        }
      })

      setContentResults(results)
    } catch (error) {
      console.error('Error searching content:', error)
      setContentResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  // Debounced search
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        searchContent(searchQuery)
      } else {
        setContentResults([])
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, searchContent])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    setSearchQuery("")
    setContentResults([])
    command()
  }, [])

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    if (!open) {
      setSearchQuery("")
      setContentResults([])
    }
  }

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-lg border border-gray-200 bg-white/80 px-3 text-sm text-gray-500 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span>Search pages, blogs, clients...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 inline-flex h-5 select-none items-center gap-1 rounded border bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-600">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={handleOpenChange}>
        <CommandInput
          placeholder="Search pages, blogs, clients, testimonials..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>
            {isSearching ? "Searching..." : "No results found."}
          </CommandEmpty>

          {/* Content Results */}
          {isSearching && (
            <CommandGroup heading="Searching...">
              <div className="px-2 py-6 text-center text-sm text-gray-500">
                Searching through content...
              </div>
            </CommandGroup>
          )}

          {!isSearching && contentResults.length > 0 && (
            <CommandGroup heading="Content Results">
              {contentResults.map((item) => (
                <CommandItem
                  key={`content-${item._id}`}
                  onSelect={() => runCommand(() => router.push(item.url))}
                >
                  {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                  <div className="flex flex-col">
                    <span className="font-medium">{item.title}</span>
                    <span className="text-xs text-gray-500">
                      {item.type} • {item.description}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Navigation Items */}
          {Object.entries(navigationItems.reduce((groups, item) => {
            const category = item.category
            if (!groups[category]) {
              groups[category] = []
            }
            groups[category].push(item)
            return groups
          }, {} as Record<string, SearchItem[]>)).map(([category, items]) => (
            <CommandGroup key={category} heading={category}>
              {items.map((item: SearchItem) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => runCommand(() => router.push(item.url))}
                >
                  {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                  <div className="flex flex-col">
                    <span className="font-medium">{item.title}</span>
                    <span className="text-xs text-gray-500">{item.description}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  )
} 