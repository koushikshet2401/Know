'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAdmin } from '@/lib/adminContext';

function getPageTitle(pathname: string): string {
  if (pathname === '/admin') return 'Dashboard';
  if (pathname === '/admin/clients') return 'Clients Management';
  if (pathname.startsWith('/admin/clients/')) return 'Client Details';
  if (pathname.startsWith('/admin/plans')) return 'Subscriptions & Plans';
  if (pathname.startsWith('/admin/invoices')) return 'Invoices & Billing';
  if (pathname.startsWith('/admin/consent')) return 'Consent & DPDP Compliance';
  if (pathname.startsWith('/admin/settings')) return 'Settings';
  return 'Admin';
}

export function AdminTopbar() {
  const pathname = usePathname();
  const { admin } = useAdmin();
  const title = getPageTitle(pathname);

  const initial = admin?.email ? admin.email.charAt(0).toUpperCase() : 'A';

  return (
    <header className="h-14 bg-white border-b border-zinc-200 px-6 flex items-center justify-between shrink-0 select-none">
      <div>
        <h1 className="text-sm font-bold text-zinc-900 tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-zinc-50 border border-zinc-200">
          <div className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-[10px]">
            {initial}
          </div>
          <span className="text-xs font-semibold text-zinc-700 max-w-[200px] truncate">
            {admin?.email || 'admin@knowbridge.io'}
          </span>
        </div>
      </div>
    </header>
  );
}
