"use client";

import { useSession } from "next-auth/react";
import { SearchDialog } from "./search";

export function Topbar() {
  const { data: session } = useSession();

  // Function to get user initials
  const getUserInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      const names = name.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return name[0]?.toUpperCase() || 'U';
    }
    if (email) {
      return email[0]?.toUpperCase() || 'U';
    }
    return 'U';
  };

  const userInitials = getUserInitials(session?.user?.name, session?.user?.email);

  return (
    <header className="sticky top-0 z-20 w-full bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
      {/* Search component */}
      <div className="flex-1 flex items-center max-w-sm">
        <SearchDialog />
      </div>
      
      {/* Right side: avatar only */}
      <div className="flex items-center ml-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-semibold text-sm sm:text-lg shadow-sm">
          {userInitials}
        </div>
      </div>
    </header>
  );
} 