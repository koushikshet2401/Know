'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Search,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  CreditCard,
  Eye,
} from 'lucide-react';
import {
  getClients,
  suspendClient,
  reactivateClient,
  ClientItem,
  Pagination,
} from '@/lib/adminApi';
import { useToast } from '@/components/admin/Toast';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { AssignPlanModal } from '@/components/admin/AssignPlanModal';
import { TableSkeleton } from '@/components/admin/TableSkeleton';

const INDUSTRIES = [
  'All',
  'SaaS',
  'E-commerce',
  'Education',
  'Healthcare',
  'Finance',
  'Logistics',
];

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Dialog & Modal states
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    variant: 'danger' | 'warning' | 'default';
    action: () => Promise<void>;
  }>({
    open: false,
    title: '',
    description: '',
    confirmLabel: 'Confirm',
    variant: 'default',
    action: async () => {},
  });

  const [assignModal, setAssignModal] = useState<{
    open: boolean;
    clientId: string;
    clientName: string;
  }>({
    open: false,
    clientId: '',
    clientName: '',
  });

  const { success, error } = useToast();

  // 400ms debounce for search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchClientsList = useCallback(
    async (pageToFetch: number = 1) => {
      setLoading(true);
      try {
        const res = await getClients({
          page: pageToFetch,
          limit: 10,
          status: statusFilter,
          search: debouncedSearch,
          industry: industryFilter,
        });
        setClients(res.data || []);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      } catch (err: any) {
        console.error('Failed to fetch clients:', err);
        error(err.message || 'Failed to load clients');
      } finally {
        setLoading(false);
      }
    },
    [statusFilter, debouncedSearch, industryFilter, error]
  );

  useEffect(() => {
    fetchClientsList(pagination.page);
  }, [fetchClientsList, pagination.page]);

  const handleSuspend = (client: ClientItem) => {
    setActiveMenuId(null);
    setConfirmDialog({
      open: true,
      title: `Suspend ${client.name}?`,
      description: `This will suspend access for ${client.company_name || client.name}. The client chatbot will be temporarily halted.`,
      confirmLabel: 'Suspend Client',
      variant: 'warning',
      action: async () => {
        try {
          await suspendClient(client.id);
          success(`Suspended ${client.name}`);
          setConfirmDialog((prev) => ({ ...prev, open: false }));
          fetchClientsList(pagination.page);
        } catch (err: any) {
          error(err.message || 'Failed to suspend client');
        }
      },
    });
  };

  const handleReactivate = (client: ClientItem) => {
    setActiveMenuId(null);
    setConfirmDialog({
      open: true,
      title: `Reactivate ${client.name}?`,
      description: `This will restore active service and chatbot access for ${client.company_name || client.name}.`,
      confirmLabel: 'Reactivate Client',
      variant: 'default',
      action: async () => {
        try {
          await reactivateClient(client.id);
          success(`Reactivated ${client.name}`);
          setConfirmDialog((prev) => ({ ...prev, open: false }));
          fetchClientsList(pagination.page);
        } catch (err: any) {
          error(err.message || 'Failed to reactivate client');
        }
      },
    });
  };

  const handleOpenAssignModal = (client: ClientItem) => {
    setActiveMenuId(null);
    setAssignModal({
      open: true,
      clientId: client.id,
      clientName: client.company_name || client.name,
    });
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-900 text-white shadow-2xs">
            Active
          </span>
        );
      case 'lead':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-800 border border-zinc-200">
            Lead
          </span>
        );
      case 'suspended':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-200 text-zinc-800 border border-zinc-300">
            Suspended
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-500 border border-zinc-200">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-700">
            {status}
          </span>
        );
    }
  };

  const renderUsageBar = (used?: number | null, limit?: number | null) => {
    if (!limit || limit === 0) {
      return <span className="text-xs text-zinc-400">—</span>;
    }
    const currentUsed = used || 0;
    const percent = Math.min(100, Math.round((currentUsed / limit) * 100));

    return (
      <div className="w-28">
        <div className="flex items-center justify-between text-[11px] text-zinc-600 mb-1 font-mono">
          <span>{currentUsed.toLocaleString()}</span>
          <span>{limit.toLocaleString()}</span>
        </div>
        <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
          <div className="h-full bg-zinc-900 rounded-full" style={{ width: `${percent}%` }} />
        </div>
      </div>
    );
  };

  const renderEndsDate = (endsAt?: string | null) => {
    if (!endsAt) return <span className="text-zinc-400 text-xs">—</span>;
    const date = new Date(endsAt);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return (
      <div className="text-xs text-zinc-700">
        <div className="font-medium">{date.toLocaleDateString()}</div>
        {diffDays > 0 && diffDays <= 7 && (
          <span className="block text-[10px] text-zinc-900 font-semibold">({diffDays}d left)</span>
        )}
        {diffDays <= 0 && (
          <span className="block text-[10px] text-zinc-400 font-normal">(Expired)</span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white border border-zinc-200 p-4 rounded-xl shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or company..."
            className="w-full bg-white border border-zinc-200 text-zinc-900 rounded-lg pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 placeholder:text-zinc-400 transition shadow-2xs"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-600 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="bg-white border border-zinc-200 text-zinc-800 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-zinc-900 shadow-2xs"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="lead">Lead</option>
              <option value="suspended">Suspended</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-600 font-medium">Industry:</span>
            <select
              value={industryFilter}
              onChange={(e) => {
                setIndustryFilter(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="bg-white border border-zinc-200 text-zinc-800 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-zinc-900 shadow-2xs"
            >
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind === 'All' ? 'all' : ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto min-h-[350px]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 text-[10px] font-bold text-zinc-500 uppercase tracking-wider bg-zinc-50/80">
                <th className="px-5 py-3 w-12">#</th>
                <th className="px-5 py-3">Client</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Usage</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Ends</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <TableSkeleton rows={5} cols={8} />
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-zinc-500 text-xs">
                    No clients match your filter criteria.
                  </td>
                </tr>
              ) : (
                clients.map((client, index) => {
                  const itemIndex = (pagination.page - 1) * pagination.limit + index + 1;
                  return (
                    <tr
                      key={client.id}
                      className="hover:bg-zinc-50/70 transition-colors group relative"
                    >
                      <td className="px-5 py-3.5 text-xs text-zinc-400">{itemIndex}</td>
                      <td className="px-5 py-3.5">
                        <Link href={`/admin/clients/${client.id}`} className="block">
                          <div className="font-semibold text-zinc-900 group-hover:underline">
                            {client.name}
                          </div>
                          <div className="text-[11px] text-zinc-500">{client.email}</div>
                        </Link>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="text-zinc-800 font-semibold text-xs">
                          {client.company_name || '—'}
                        </div>
                        {client.industry && (
                          <div className="text-[11px] text-zinc-500">{client.industry}</div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-zinc-700 font-medium">
                        {client.current_plan_name || '—'}
                      </td>
                      <td className="px-4 py-3.5">
                        {renderUsageBar(
                          client.conversations_used,
                          client.plan_conversations_limit
                        )}
                      </td>
                      <td className="px-4 py-3.5">{renderStatusBadge(client.status)}</td>
                      <td className="px-4 py-3.5">{renderEndsDate(client.ends_at)}</td>
                      <td className="px-5 py-3.5 text-right relative">
                        <div className="inline-block text-left">
                          <button
                            onClick={() =>
                              setActiveMenuId(activeMenuId === client.id ? null : client.id)
                            }
                            className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition"
                            aria-label="Client actions"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {activeMenuId === client.id && (
                            <div className="absolute right-5 mt-1 w-44 rounded-xl bg-white border border-zinc-200 shadow-xl z-20 py-1.5 text-xs text-left animate-in fade-in zoom-in-95 duration-100">
                              <Link
                                href={`/admin/clients/${client.id}`}
                                className="flex items-center gap-2.5 px-3 py-2 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 transition"
                              >
                                <Eye className="w-3.5 h-3.5 text-zinc-900" />
                                <span>View Details</span>
                              </Link>
                              <button
                                onClick={() => handleOpenAssignModal(client)}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 transition"
                              >
                                <CreditCard className="w-3.5 h-3.5 text-zinc-900" />
                                <span>Assign Plan</span>
                              </button>
                              {client.status === 'active' && (
                                <button
                                  onClick={() => handleSuspend(client)}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-zinc-900 hover:bg-zinc-100 transition font-medium"
                                >
                                  <UserX className="w-3.5 h-3.5" />
                                  <span>Suspend</span>
                                </button>
                              )}
                              {client.status === 'suspended' && (
                                <button
                                  onClick={() => handleReactivate(client)}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-zinc-900 hover:bg-zinc-100 transition font-medium"
                                >
                                  <UserCheck className="w-3.5 h-3.5" />
                                  <span>Reactivate</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-600">
          <div>
            Showing{' '}
            <span className="font-semibold text-zinc-900">
              {clients.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-zinc-900">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{' '}
            of <span className="font-semibold text-zinc-900">{pagination.total}</span> clients
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page <= 1 || loading}
              className="p-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 disabled:opacity-40 text-zinc-700 transition shadow-2xs"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-semibold text-zinc-800">
              Page {pagination.page} of {pagination.pages || 1}
            </span>
            <button
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page >= pagination.pages || loading}
              className="p-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 disabled:opacity-40 text-zinc-700 transition shadow-2xs"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmLabel={confirmDialog.confirmLabel}
        variant={confirmDialog.variant}
        onConfirm={confirmDialog.action}
      />

      {/* Assign Plan Modal */}
      <AssignPlanModal
        open={assignModal.open}
        onOpenChange={(open) => setAssignModal((prev) => ({ ...prev, open }))}
        clientId={assignModal.clientId}
        clientName={assignModal.clientName}
        onSuccess={() => fetchClientsList(pagination.page)}
      />
    </div>
  );
}
