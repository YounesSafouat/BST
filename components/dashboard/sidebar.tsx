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
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    color: "from-blue-200 to-blue-100 text-blue-700",
  },
  {
    title: "Content",
    href: "/dashboard/content",
    icon: FileText,
    color: "from-green-200 to-green-100 text-green-700",
  },
  {
    title: "Blog",
    href: "/dashboard/blog",
    icon: BookText,
    color: "from-yellow-200 to-yellow-100 text-yellow-700",
  },
  {
    title: "Clients",
    href: "/dashboard/clients",
    icon: Building2,
    color: "from-purple-200 to-purple-100 text-purple-700",
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: UserCircle,
    color: "from-green-200 to-green-100 text-green-700",
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
];

export function Sidebar({ collapsed, setCollapsed }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Responsive width: lg:w-28 md:w-20 w-16 (collapsed), lg:w-64 md:w-40 w-24 (expanded)
  const widthClass = collapsed
    ? "w-16 md:w-20 lg:w-24"
    : "w-24 md:w-32 lg:w-56 xl:w-64";

  // Sidebar content
  function SidebarContent({ isDrawer = false }: { isDrawer?: boolean }) {
    return (
      <aside
        className={`h-screen ${widthClass} bg-white shadow-xl rounded-3xl flex flex-col items-center border border-gray-100 z-30 transition-all duration-300 m-4`}
      >
        {/* Collapse/Expand button (desktop only, left edge) */}
        {!isDrawer && (
          <button
            className="absolute top-6 left-2 bg-white border border-gray-200 rounded-full p-1 shadow hover:bg-gray-100 transition md:flex hidden"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            type="button"
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        )}
        {/* Company Logo */}
        <div className={`mt-8 mb-10 flex items-center justify-center rounded-2xl bg-gray-100 overflow-hidden transition-all duration-300 ${collapsed ? "w-12 h-12" : "w-16 h-16"}`}>
          <img
            src="/bst.png"
            alt="Company Logo"
            className={`object-contain ${collapsed ? "w-10 h-10" : "w-14 h-14"}`}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            style={{ display: "block" }}
          />
          {/* Fallback if logo fails */}
          <span className="absolute text-xl font-bold text-gray-400" style={{ display: "none" }}>BST</span>
        </div>
        {/* Menu icons - vertically centered */}
        <nav className="flex-1 flex flex-col items-center justify-center gap-2 w-full">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.title}
                className={`group flex items-center ${collapsed ? "justify-center" : "justify-start"} w-full h-14 rounded-2xl transition-all duration-200 relative px-0 md:px-2 ${
                  isActive ? "bg-[#e6f4ea] text-green-700 font-bold" : "text-gray-400 hover:bg-gray-100"
                }`}
                onClick={() => isDrawer && setDrawerOpen(false)}
              >
                <span className="flex items-center justify-center w-14 h-14">
                  <item.icon className="w-7 h-7" />
                </span>
                {!collapsed && (
                  <span className="ml-2 text-base font-medium transition-all duration-200 text-gray-700 group-hover:text-black">
                    {item.title}
                  </span>
                )}
                {collapsed && (
                  <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap shadow-lg">
                    {item.title}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        {/* Sign out icon at the bottom */}
        <div className="w-full flex flex-col items-center mb-6 mt-4">
          <button
            onClick={() => signOut()}
            aria-label="Sign Out"
            className="flex items-center justify-center w-14 h-14 rounded-2xl hover:bg-gray-100 text-gray-300 hover:text-red-500 transition-all duration-200"
          >
            <LogOut className="w-7 h-7" />
          </button>
        </div>
        {/* Close button for drawer */}
        {isDrawer && (
          <button
            className="absolute top-6 right-6 p-2 rounded hover:bg-gray-100 transition md:hidden"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </aside>
    );
  }

  return (
    <>
      {/* Burger button for small screens */}
      <button
        className="fixed top-4 left-4 z-40 p-2 bg-white rounded shadow hover:bg-gray-100 transition cursor-pointer md:hidden"
        onClick={() => setDrawerOpen(true)}
        aria-label="Open sidebar"
        type="button"
      >
        <Menu className="w-6 h-6" />
      </button>
      {/* Sidebar always visible on desktop */}
      <div className="hidden md:block">
        <SidebarContent />
      </div>
      {/* Drawer on small screens */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <SidebarContent isDrawer />
          <div
            className="flex-1 bg-black bg-opacity-30 cursor-pointer"
            onClick={() => setDrawerOpen(false)}
          />
        </div>
      )}
    </>
  );
} 