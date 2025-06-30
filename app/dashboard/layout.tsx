"use client";

import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import Loader from "@/components/home/Loader"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SessionProvider>
      <DashboardLayoutContent collapsed={collapsed} setCollapsed={setCollapsed}>
        {children}
      </DashboardLayoutContent>
    </SessionProvider>
  );
}

interface DashboardLayoutContentProps {
  children: React.ReactNode;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

function DashboardLayoutContent({ children, collapsed, setCollapsed }: DashboardLayoutContentProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Loader />;
  }

  if (status === "unauthenticated") {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <Topbar />
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
} 