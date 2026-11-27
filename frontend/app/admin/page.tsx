'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users,
  CreditCard,
  Clock,
  FileText,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import {
  getClients,
  getExpiringClients,
  getInvoices,
  ClientItem,
} from '@/lib/adminApi';

interface DashboardStats {
  totalClients: number;
  activeSubscriptions: number;
  expiringSoon: number;
  pendingInvoices: number;
}

interface ExpiringClient {
  id: string;
  client_id: string;
  name: string;
  company_name: string;
  email: string;
  plan_name: string;
  ends_at: string;
  conversations_used: number;
  days_left: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    activeSubscriptions: 0,
    expiringSoon: 0,
    pendingInvoices: 0,
  });
  const [recentClients, setRecentClients] = useState<ClientItem[]>([]);
  const [expiringList, setExpiringList] = useState<ExpiringClient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [clientsRes, activeRes, expiring7Res, invoicesRes, expiring14Res] =
          await Promise.all([
            getClients({ limit: 5 }),
            getClients({ status: 'active', limit: 1 }),
            getExpiringClients(7),
            getInvoices({ status: 'pending', limit: 1 }),
            getExpiringClients(14),
          ]);

        const expiring7 = expiring7Res.subscriptions || expiring7Res.data || [];
        const expiring14 = expiring14Res.subscriptions || expiring14Res.data || [];

        setStats({
          totalClients: clientsRes.pagination?.total || 0,
          activeSubscriptions: activeRes.pagination?.total || 0,
          expiringSoon: expiring7.length,
          pendingInvoices: invoicesRes.pagination?.total || 0,
        });

        setRecentClients(clientsRes.data || []);
        setExpiringList(expiring14 as any);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Clients',
      value: stats.totalClients,
      sub: 'All time registrations',
      icon: Users,
    },
    {
      title: 'Active Subscriptions',
      value: stats.activeSubscriptions,
      sub: 'Currently operational',
      icon: CreditCard,
    },
    {
      title: 'Expiring Soon',
      value: stats.expiringSoon,
      sub: 'Next 7 days',
      icon: Clock,
    },
    {
      title: 'Pending Invoices',
      value: stats.pendingInvoices,
      sub: 'Unpaid receipts',
      icon: FileText,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-900 text-white shadow-2xs">
            Active
          </span>
        );
      case 'lead':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-800 border border-zinc-200">
            Lead
          </span>
        );
      case 'suspended':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-200 text-zinc-800 border border-zinc-300">
            Suspended
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-500 border border-zinc-200">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Overview & Performance</h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Monitor client accounts, subscription usage metrics, and billing workflows in real time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/clients"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-800 transition shadow-2xs"
          >
            <span>All Clients</span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
          </Link>
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
              className="bg-white border border-zinc-200 rounded-xl p-5 flex flex-col justify-between hover:border-zinc-300 transition-colors shadow-xs"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-zinc-600">{card.title}</span>
                <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-zinc-900 font-mono tracking-tight">
                  {loading ? '...' : card.value}
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5">{card.sub}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Two Column Layout: Recent Clients & Expiring Subscriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Clients Table (2/3 width) */}
        <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs flex flex-col">
          <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/50">
            <div>
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Recent Clients</h3>
              <p className="text-[11px] text-zinc-500">Newly registered companies and marketing leads</p>
            </div>
            <Link
              href="/admin/clients"
              className="text-xs font-semibold text-zinc-700 hover:text-zinc-900 transition flex items-center gap-1"
            >
              <span>See full list</span>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
            </Link>
          </div>

          <div className="overflow-x-auto flex-1">
            {loading ? (
              <div className="p-8 text-center text-zinc-500 text-xs">Loading recent clients...</div>
            ) : recentClients.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-xs">No clients found.</div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 text-[10px] font-bold text-zinc-500 uppercase tracking-wider bg-zinc-50/80">
                    <th className="px-5 py-3">Client</th>
                    <th className="px-4 py-3">Company</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Plan</th>
                    <th className="px-5 py-3 text-right">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {recentClients.map((client) => (
                    <tr
                      key={client.id}
                      className="hover:bg-zinc-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="px-5 py-3.5">
                        <Link href={`/admin/clients/${client.id}`} className="block">
                          <div className="font-semibold text-zinc-900 group-hover:underline">
                            {client.name}
                          </div>
                          <div className="text-[11px] text-zinc-500">{client.email}</div>
                        </Link>
                      </td>
                      <td className="px-4 py-3.5">
                        <Link href={`/admin/clients/${client.id}`} className="block text-zinc-700 font-medium">
                          {client.company_name || '—'}
                        </Link>
                      </td>
                      <td className="px-4 py-3.5">
                        <Link href={`/admin/clients/${client.id}`} className="block">
                          {getStatusBadge(client.status)}
                        </Link>
                      </td>
                      <td className="px-4 py-3.5">
                        <Link href={`/admin/clients/${client.id}`} className="block text-zinc-700 font-medium">
                          {client.current_plan_name || 'No Plan'}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-right text-zinc-500">
                        <Link href={`/admin/clients/${client.id}`} className="block">
                          {client.created_at ? new Date(client.created_at).toLocaleDateString() : '—'}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Column: Expiring Subscriptions (1/3 width) */}
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs flex flex-col">
          <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/50">
            <div>
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Expiring Subscriptions</h3>
              <p className="text-[11px] text-zinc-500">Upcoming renewals within 14 days</p>
            </div>
            <Clock className="w-4 h-4 text-zinc-600" />
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            {loading ? (
              <div className="p-6 text-center text-zinc-500 text-xs">Loading expiring list...</div>
            ) : expiringList.length === 0 ? (
              <div className="p-6 text-center text-zinc-500 text-xs">
                No subscriptions expiring in the next 14 days.
              </div>
            ) : (
              expiringList.map((item) => {
                const days = item.days_left ?? 0;
                const daysPercent = Math.min(100, Math.max(0, (days / 30) * 100));

                return (
                  <Link
                    key={item.id}
                    href={`/admin/clients/${item.client_id}`}
                    className="block p-3 rounded-lg bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="truncate max-w-[150px]">
                        <div className="font-semibold text-zinc-900 text-xs truncate">
                          {item.company_name || item.name}
                        </div>
                        <div className="text-[11px] text-zinc-500">{item.plan_name}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-zinc-900 border border-zinc-200 shadow-2xs">
                        {days <= 0 ? 'Expires today' : `Ends in ${days}d`}
                      </span>
                    </div>

                    {/* Progress Bar (30 days scale) */}
                    <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-zinc-900 rounded-full transition-all"
                        style={{ width: `${daysPercent}%` }}
                      />
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
