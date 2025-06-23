"use client";

import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Play,
  Shield,
  Award,
  Users,
  FileText,
  Building2,
  MessageSquare,
  Settings,
} from "lucide-react";
import AcceuilPage from "@/app/components/acceuil-page";

const stats = [
  {
    title: "Total Users",
    value: "12",
    icon: Users,
    color: "from-blue-200 to-blue-100 text-blue-700",
    shadow: "shadow-blue-100/60",
  },
  {
    title: "Content Pages",
    value: "8",
    icon: FileText,
    color: "from-green-200 to-green-100 text-green-700",
    shadow: "shadow-green-100/60",
  },
  {
    title: "Clients",
    value: "24",
    icon: Building2,
    color: "from-purple-200 to-purple-100 text-purple-700",
    shadow: "shadow-purple-100/60",
  },
  {
    title: "Blog Posts",
    value: "16",
    icon: MessageSquare,
    color: "from-yellow-200 to-yellow-100 text-yellow-700",
    shadow: "shadow-yellow-100/60",
  },
];

export default function DashboardPage() {
  return (
    <div className="w-full h-full">
      {/* Content Preview Section */}
      <div className="dashboard-content-preview">
        <AcceuilPage previewOnly />
      </div>
    </div>
  );
} 