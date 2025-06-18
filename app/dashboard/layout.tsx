"use client";

import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  // Sidebar width: collapsed = 4rem (w-16), expanded = 6rem (w-24)
  const sidebarWidth = collapsed ? "ml-16" : "ml-24";

  return (
    <SessionProvider>
      <DashboardLayoutContent collapsed={collapsed} setCollapsed={setCollapsed} sidebarWidth={sidebarWidth}>
        {children}
      </DashboardLayoutContent>
    </SessionProvider>
  );
}

function DashboardLayoutContent({ children, collapsed, setCollapsed, sidebarWidth }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarWidth}`}>
        <Topbar />
        <main className="flex-1 w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
} 