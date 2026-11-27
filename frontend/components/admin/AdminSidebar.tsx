'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  FileText,
  ShieldCheck,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAdmin } from '@/lib/adminContext';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Clients', href: '/admin/clients', icon: Users },
  { label: 'Subscriptions', href: '/admin/plans', icon: CreditCard },
  { label: 'Invoices', href: '/admin/invoices', icon: FileText },
  { label: 'Consent', href: '/admin/consent', icon: ShieldCheck },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { admin, logout } = useAdmin();

  const isLinkActive = (item: NavItem) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  return (
    <aside className="w-60 h-screen bg-white border-r border-zinc-200 flex flex-col shrink-0 select-none">
      {/* Top Brand / Logo */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-zinc-200">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center font-bold text-white text-xs shadow-xs">
            K
          </div>
          <span className="font-bold text-sm tracking-tight text-zinc-900">KnowBridge</span>
        </Link>
        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
          Admin
        </span>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-3 py-2">
          Management
        </div>
        {navItems.map((item) => {
          const active = isLinkActive(item);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-colors ${
                active
                  ? 'bg-zinc-100 text-zinc-900 font-semibold border border-zinc-200 shadow-2xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? 'text-zinc-900' : 'text-zinc-500'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="pt-4 pb-1">
          <div className="h-px bg-zinc-200 mx-2 my-2" />
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-3 py-2">
            System
          </div>
          <Link
            href="/admin/settings"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-colors ${
              pathname.startsWith('/admin/settings')
                ? 'bg-zinc-100 text-zinc-900 font-semibold border border-zinc-200 shadow-2xs'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
            }`}
          >
            <Settings className="w-4 h-4 text-zinc-500" />
            <span>Settings</span>
          </Link>
        </div>
      </nav>

      {/* Bottom Profile and Logout */}
      <div className="p-3 border-t border-zinc-200 bg-zinc-50/70">
        <div className="px-3 py-1.5 mb-1">
          <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Logged in as</p>
          <p className="text-xs font-semibold text-zinc-800 truncate" title={admin?.email || ''}>
            {admin?.email || 'admin@knowbridge.io'}
          </p>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
        >
          <LogOut className="w-4 h-4 text-zinc-500" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
