"use client";

import { Bell } from "lucide-react";

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 w-full bg-white/70 backdrop-blur-md shadow-sm rounded-b-2xl flex items-center justify-between px-4 md:px-8 py-3 mb-8">
      {/* Search input */}
      <div className="flex-1 flex items-center">
        <input
          type="text"
          placeholder="Search..."
          className="w-full max-w-xs px-4 py-2 rounded-xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#a78bfa] text-gray-700 placeholder-gray-400 shadow-sm"
        />
      </div>
      {/* Right side: notification and avatar */}
      <div className="flex items-center gap-4 ml-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
          <Bell className="w-6 h-6 text-gray-500" />
          {/* Notification dot */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#a78bfa] to-[#f3f0ff] flex items-center justify-center text-white font-bold text-lg shadow-inner">
          N
        </div>
      </div>
    </header>
  );
} 