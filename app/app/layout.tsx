'use client';

import React from 'react';
import { DatabaseProvider, TrackingProvider } from '@/components/providers';
import { Navigation } from '@/components/app';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <DatabaseProvider>
      <TrackingProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
          <Navigation />
          <main className="flex-1 overflow-auto pb-20 md:pb-0">
            <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </TrackingProvider>
    </DatabaseProvider>
  );
}
