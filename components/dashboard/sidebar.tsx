"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
  Palette,
  MessageSquare,
  Building2,
  UserCircle,
  BookText,
  Palette as PaletteIcon,
  Settings as SettingsIcon,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Navigation,
  ArrowDown,
  Globe,
  Info,
  ChevronDown,
  ChevronUp,
  Home,
} from "lucide-react";

// Grouped menu items
const menuGroups = [
  {
    title: "Main",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        color: "from-blue-200 to-blue-100 text-blue-700",
      },
    ]
  },
  {
    title: "Section",
    items: [
      {
        title: "Header",
        href: "/dashboard/header",
        icon: Navigation,
        color: "from-indigo-200 to-indigo-100 text-indigo-700",
      },
      {
        title: "Footer",
        href: "/dashboard/footer",
        icon: ArrowDown,
        color: "from-teal-200 to-teal-100 text-teal-700",
      },
    ]
  },
  {
    title: "Pages",
    items: [
      
      {
        title: "Home Page",
        href: "/dashboard/content",
        icon: Home,
        color: "from-green-200 to-green-100 text-green-700", 
      },
      
      {
        title: "About Page",
        href: "/dashboard/about",
        icon: Info,
        color: "from-cyan-200 to-cyan-100 text-cyan-700",
      },
      {
        title: "Blog Page",
        href: "/dashboard/blog",
        icon: BookText,
        color: "from-yellow-200 to-yellow-100 text-yellow-700",
      },
      {
        title: "Clients Page",
        href: "/dashboard/clients",
        icon: Building2,
        color: "from-purple-200 to-purple-100 text-purple-700",
      },
      {
        title: "HubSpot Page",
        href: "/dashboard/hubspot",
        icon: Globe,
        color: "from-orange-200 to-orange-100 text-orange-700",
      },
      {
        title: "Odoo Page",
        href: "/dashboard/odoo",
        icon: Building2,
        color: "from-purple-200 to-purple-100 text-purple-700",
      },
    ]
  },
  {
    title: "Content",
    items: [
      {
        title: "Testimonials",
        href: "/dashboard/testimonials",
        icon: MessageSquare,
        color: "from-amber-200 to-amber-100 text-amber-700",
      },
    ]
  },
  {
    title: "Management",
    items: [
      {
        title: "Users",
        href: "/dashboard/users",
        icon: UserCircle,
        color: "from-green-200 to-green-100 text-green-700",
      },
    ]
  },
  {
    title: "Settings",
    items: [
      {
        title: "SEO",
        href: "/dashboard/seo",
        icon: Settings,
        color: "from-orange-200 to-orange-100 text-orange-700",
      },
      {
        title: "Appearance",
        href: "/dashboard/appearance",
        icon: PaletteIcon,
        color: "from-pink-200 to-pink-100 text-pink-700",
      },
      {
        title: "Settings",
        href: "/dashboard/settings",
        icon: SettingsIcon,
        color: "from-gray-200 to-gray-100 text-gray-700",
      },
    ]
  },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Main']); // Main group expanded by default

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupTitle) 
        ? prev.filter(title => title !== groupTitle)
        : [...prev, groupTitle]
    );
  };

  const isGroupExpanded = (groupTitle: string) => expandedGroups.includes(groupTitle);

  // Sidebar content
  function SidebarContent({ isDrawer = false }: { isDrawer?: boolean }) {
    return (
      <aside
        className={`h-screen bg-white shadow-xl border-r border-gray-200 flex flex-col items-center z-30 transition-all duration-300 ${
          isDrawer 
            ? "w-64" 
            : collapsed 
              ? "w-16 lg:w-20" 
              : "w-64 lg:w-72"
        }`}
      >
        {/* Collapse/Expand button (desktop only) */}
        {!isDrawer && (
          <button
            className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1.5 shadow-lg hover:bg-gray-50 transition-all duration-200 hidden lg:flex items-center justify-center"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            type="button"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}

        {/* Company Logo */}
        <div className={`mt-6 mb-8 flex items-center justify-center rounded-xl  overflow-hidden transition-all duration-300 ${
          collapsed ? "w-12 h-12" : "w-[15em] h-[10em]"
        }`}>
          <img
            src="/bst.png"
            alt="Company Logo"
            className={`object-contain ${collapsed ? "w-10 h-10" : "w-[15em] h-[15em]"}`}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            style={{ display: "block" }}
          />
        </div>

        {/* Menu items */}
        <nav className="flex-1 flex flex-col items-center justify-start gap-1 w-full px-2 overflow-y-auto">
          {menuGroups.map((group) => (
            <div key={group.title} className="w-full">
              {/* Group header */}
              {!collapsed && (
                <button
                  onClick={() => toggleGroup(group.title)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:bg-gray-50 rounded-lg transition-all duration-200"
                >
                  <span>{group.title}</span>
                  {isGroupExpanded(group.title) ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </button>
              )}
              
              {/* Group items */}
              {isGroupExpanded(group.title) && group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-label={item.title}
                    className={`group flex items-center w-full h-12 rounded-xl transition-all duration-200 relative ${
                      isActive 
                        ? "bg-green-50 text-green-700 font-semibold border border-green-200" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    } ${collapsed ? "justify-center px-0" : "justify-start px-3 ml-2"}`}
                    onClick={() => isDrawer && setDrawerOpen(false)}
                  >
                    <span className="flex items-center justify-center w-8 h-8">
                      <item.icon className="w-5 h-5" />
                    </span>
                    {!collapsed && (
                      <span className="ml-3 text-sm font-medium transition-all duration-200">
                        {item.title}
                      </span>
                    )}
                    {collapsed && (
                      <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap shadow-lg z-50">
                        {item.title}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sign out button */}
        <div className="w-full flex flex-col items-center mb-6 px-2">
          <button
            onClick={() => signOut()}
            aria-label="Sign Out"
            className={`flex items-center w-full h-12 rounded-xl hover:bg-red-50 hover:text-red-600 text-gray-500 transition-all duration-200 ${
              collapsed ? "justify-center" : "justify-start px-3"
            }`}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span className="ml-3 text-sm font-medium">Sign Out</span>}
          </button>
        </div>

        {/* Close button for mobile drawer */}
        {isDrawer && (
          <button
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 lg:hidden"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </aside>
    );
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-all duration-200 lg:hidden"
        onClick={() => setDrawerOpen(true)}
        aria-label="Open sidebar"
        type="button"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <SidebarContent />
      </div>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <SidebarContent isDrawer />
          <div
            className="flex-1 bg-black bg-opacity-50 cursor-pointer"
            onClick={() => setDrawerOpen(false)}
          />
        </div>
      )}
    </>
  );
} 