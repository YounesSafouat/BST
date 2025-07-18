"use client";

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MaintenanceRefreshButton() {
  return (
    <Button
      onClick={() => window.location.reload()}
      className="bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-main)] hover:from-[var(--color-secondary)]/80 hover:to-[var(--color-main)]/80 text-white px-8 py-3 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <ArrowRight className="h-5 w-5 mr-2" />
      Actualiser maintenant
    </Button>
  );
} 