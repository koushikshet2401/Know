'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminProvider, useAdmin } from '@/lib/adminContext';
import { ToastProvider } from '@/components/admin/Toast';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { AdminErrorBoundary } from '@/components/admin/AdminErrorBoundary';
import { getAdminToken } from '@/lib/adminApi';

function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const { admin, isLoading } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = getAdminToken();
    if (!token && !pathname.startsWith('/admin/login')) {
      router.replace('/admin/login');
    }
  }, [pathname, router]);

  // While checking authentication on protected pages
  if (isLoading && !pathname.startsWith('/admin/login')) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center text-zinc-900 z-50">
        <div className="w-9 h-9 border-2 border-zinc-200 border-t-zinc-900 rounded-full animate-spin mb-3" />
        <p className="text-zinc-600 text-xs font-medium">Verifying admin session...</p>
      </div>
    );
  }

  // If not loading and no admin, wait for router redirect
  if (!isLoading && !admin && !pathname.startsWith('/admin/login')) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center text-zinc-500 text-xs">
        Redirecting to login...
      </div>
    );
  }

  // For /admin/login page, render without sidebar layout
  if (pathname.startsWith('/admin/login')) {
    return <AdminErrorBoundary>{children}</AdminErrorBoundary>;
  }

  return (
    <div className="flex h-screen bg-zinc-50 text-zinc-900 overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto flex flex-col bg-zinc-50">
        <AdminTopbar />
        <div className="p-6 max-w-7xl w-full mx-auto flex-1">
          <AdminErrorBoundary>{children}</AdminErrorBoundary>
        </div>
      </main>
    </div>
  );
}

export function AdminClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <ToastProvider>
        <AdminAuthGuard>{children}</AdminAuthGuard>
      </ToastProvider>
    </AdminProvider>
  );
}
