'use client';

import React, { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollNavigator } from '@/components/ui/ScrollNavigator';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';

function ShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <div className="w-full min-h-screen bg-zinc-50 text-zinc-900">{children}</div>;
  }

  return (
    <SmoothScrollProvider>
      <Navbar />
      <main className="flex-1 pt-16 pb-20 lg:pb-0">{children}</main>
      <Footer />
      <ScrollNavigator />
    </SmoothScrollProvider>
  );
}

export function ClientLayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="w-full min-h-screen bg-white" />}>
      <ShellInner>{children}</ShellInner>
    </Suspense>
  );
}
