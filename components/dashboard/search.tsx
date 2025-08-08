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
import { Search } from "lucide-react"

// Search data structure
interface SearchItem {
  id: string
  title: string
  description: string
  url: string
  category: string
  icon?: React.ComponentType<{ className?: string }>
}

export function SearchDialog() {
  const router = useRouter()
  const { data: session } = useSession()
  const [open, setOpen] = React.useState(false)

  // Search items - you can expand this with your actual data
  const searchItems: SearchItem[] = [
    {
      id: "dashboard",
      title: "Dashboard",
      description: "View analytics and overview",
      url: "/dashboard",
      category: "Navigation"
    },
    {
      id: "content",
      title: "Content Management",
      description: "Manage website content",
      url: "/dashboard/content",
      category: "Content"
    },
    {
      id: "blog",
      title: "Blog Management",
      description: "Manage blog posts",
      url: "/dashboard/blog",
      category: "Content"
    },
    {
      id: "seo",
      title: "SEO Management",
      description: "Manage SEO settings",
      url: "/dashboard/seo",
      category: "Marketing"
    },
    {
      id: "clients",
      title: "Client Management",
      description: "Manage client information",
      url: "/dashboard/clients",
      category: "Business"
    },
    {
      id: "users",
      title: "User Management",
      description: "Manage user accounts",
      url: "/dashboard/users",
      category: "Administration"
    },
    {
      id: "contact",
      title: "Contact Submissions",
      description: "View contact form submissions",
      url: "/dashboard/contact-submissions",
      category: "Communication"
    },
    {
      id: "appearance",
      title: "Appearance Settings",
      description: "Customize colors, fonts, and design",
      url: "/dashboard/appearance",
      category: "Design"
    },
    {
      id: "settings",
      title: "Settings",
      description: "Manage system settings",
      url: "/dashboard/settings",
      category: "Administration"
    },
    {
      id: "snippets",
      title: "Snippets",
      description: "Manage tracking and analytics scripts",
      url: "/dashboard/settings#snippets",
      category: "Marketing"
    }
  ]

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
    command()
  }, [])

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-lg border border-gray-200 bg-white/80 px-3 text-sm text-gray-500 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span>Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 inline-flex h-5 select-none items-center gap-1 rounded border bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-600">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {Object.entries(searchItems.reduce((groups, item) => {
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