'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  getConsentRecords,
  ConsentRecord,
  Pagination,
} from '@/lib/adminApi';
import { useToast } from '@/components/admin/Toast';
import { TableSkeleton } from '@/components/admin/TableSkeleton';

export default function ConsentPage() {
  const [records, setRecords] = useState<ConsentRecord[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { error } = useToast();

  const fetchRecords = useCallback(
    async (pageToFetch: number = 1) => {
      setLoading(true);
      try {
        const res = await getConsentRecords({
          page: pageToFetch,
          limit: 10,
          status: statusFilter,
        });
        setRecords(res.data || []);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      } catch (err: any) {
        console.error('Failed to load consent records:', err);
        error(err.message || 'Failed to load consent records');
      } finally {
        setLoading(false);
      }
    },
    [statusFilter, error]
  );

  useEffect(() => {
    fetchRecords(pagination.page);
  }, [fetchRecords, pagination.page]);

  const renderConsentStatus = (record: ConsentRecord) => {
    if (record.data_deleted) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-500 border border-zinc-200">
          Data Deleted
        </span>
      );
    }
    if (record.withdrawn_at) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-200 text-zinc-800 border border-zinc-300">
          Withdrawn — Pending Deletion
        </span>
      );
    }
    if (record.consent_given) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-900 text-white shadow-2xs">
          Active Consent
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-600">
        Unknown
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-zinc-900 tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-zinc-900" />
          <span>DPDP Act 2023 Consent Audit</span>
        </h2>
        <p className="text-xs text-zinc-500 mt-0.5">
          Maintain full statutory compliance under India&apos;s Digital Personal Data Protection Act 2023.
          Audit user consents, withdrawals, and 30-day automated deletion pipelines.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between bg-white border border-zinc-200 p-4 rounded-xl shadow-xs">
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-600 font-medium">Filter by Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className="bg-white border border-zinc-200 text-zinc-800 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-zinc-900 shadow-2xs"
          >
            <option value="all">All Records</option>
            <option value="active">Active Consent</option>
            <option value="withdrawn">Withdrawn</option>
            <option value="deleted">Data Deleted</option>
          </select>
        </div>

        <div className="text-xs text-zinc-400 hidden sm:block">
          Statutory 30-day deletion cycle enforced automatically.
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500 uppercase tracking-wider bg-zinc-50/80 font-bold text-[10px]">
                <th className="px-5 py-3">Client</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Consent Given</th>
                <th className="px-4 py-3">Withdrawn At</th>
                <th className="px-4 py-3">Deletion Scheduled</th>
                <th className="px-5 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <TableSkeleton rows={5} cols={6} />
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-zinc-500 text-xs">
                    No consent records match this filter.
                  </td>
                </tr>
              ) : (
                records.map((rec) => {
                  const scheduledDate =
                    rec.scheduled_deletion_date ||
                    (rec.withdrawn_at ? rec.data_deleted_at : null);

                  return (
                    <tr key={rec.id} className="hover:bg-zinc-50/70 transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-zinc-900">
                        <Link
                          href={`/admin/clients/${rec.client_id}`}
                          className="hover:underline"
                        >
                          {rec.client_name || rec.company_name || 'Client'}
                        </Link>
                      </td>
                      <td className="px-4 py-3.5 text-zinc-700">{rec.email}</td>
                      <td className="px-4 py-3.5 text-zinc-500">
                        {rec.consent_given_at
                          ? new Date(rec.consent_given_at).toLocaleString()
                          : '—'}
                      </td>
                      <td className="px-4 py-3.5 text-zinc-500">
                        {rec.withdrawn_at
                          ? new Date(rec.withdrawn_at).toLocaleString()
                          : '—'}
                      </td>
                      <td className="px-4 py-3.5 text-zinc-500">
                        {scheduledDate
                          ? new Date(scheduledDate).toLocaleDateString()
                          : '—'}
                      </td>
                      <td className="px-5 py-3.5 text-right">{renderConsentStatus(rec)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-600">
          <div>
            Showing <span className="font-semibold text-zinc-900">{records.length}</span> of{' '}
            <span className="font-semibold text-zinc-900">{pagination.total}</span> records
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
            <span className="font-semibold text-zinc-800">
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
    </div>
  );
}
