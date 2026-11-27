'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  FileText,
  FileDown,
  Mail,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
} from 'lucide-react';
import {
  getInvoices,
  downloadInvoicePdf,
  sendInvoiceEmail,
  InvoiceItem,
  Pagination,
} from '@/lib/adminApi';
import { useToast } from '@/components/admin/Toast';
import { TableSkeleton } from '@/components/admin/TableSkeleton';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });
  const [statusFilter, setStatusFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const { success, error } = useToast();

  const fetchInvoicesList = useCallback(
    async (pageToFetch: number = 1) => {
      setLoading(true);
      try {
        const res = await getInvoices({
          page: pageToFetch,
          limit: 10,
          status: statusFilter,
          from: fromDate || undefined,
          to: toDate || undefined,
        });
        setInvoices(res.data || []);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      } catch (err: any) {
        console.error('Failed to fetch invoices:', err);
        error(err.message || 'Failed to load invoices');
      } finally {
        setLoading(false);
      }
    },
    [statusFilter, fromDate, toDate, error]
  );

  useEffect(() => {
    fetchInvoicesList(pagination.page);
  }, [fetchInvoicesList, pagination.page]);

  // Compute stats bar from current list
  const totalPaid = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((acc, inv) => {
      const tot = Number(inv.total_inr || inv.total || 0);
      return acc + tot;
    }, 0);

  const totalPending = invoices
    .filter((inv) => inv.status === 'pending')
    .reduce((acc, inv) => {
      const tot = Number(inv.total_inr || inv.total || 0);
      return acc + tot;
    }, 0);

  const handleDownload = async (invoice: InvoiceItem) => {
    setDownloadingId(invoice.id);
    try {
      await downloadInvoicePdf(invoice.id, invoice.invoice_number);
      success(`Downloaded ${invoice.invoice_number}.pdf`);
    } catch (err: any) {
      error(err.message || 'Failed to download invoice PDF');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleSendEmail = async (invoice: InvoiceItem) => {
    setSendingId(invoice.id);
    try {
      await sendInvoiceEmail(invoice.id);
      success(`Invoice ${invoice.invoice_number} sent to client`);
    } catch (err: any) {
      error(err.message || 'Failed to send invoice email');
    } finally {
      setSendingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Invoices & Billing</h2>
        <p className="text-xs text-zinc-500 mt-0.5">
          Review GST-compliant tax invoices, track payment status, and dispatch receipts.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-zinc-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[11px] font-semibold text-zinc-500 block mb-1">Total Paid (Filtered)</span>
            <span className="text-xl font-bold text-zinc-900 font-mono">
              ₹{totalPaid.toLocaleString()}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-zinc-100 text-zinc-900 border border-zinc-200">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[11px] font-semibold text-zinc-500 block mb-1">Total Pending</span>
            <span className="text-xl font-bold text-zinc-900 font-mono">
              ₹{totalPending.toLocaleString()}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-zinc-100 text-zinc-900 border border-zinc-200">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[11px] font-semibold text-zinc-500 block mb-1">Total Invoices</span>
            <span className="text-xl font-bold text-zinc-900 font-mono">
              {pagination.total}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-zinc-100 text-zinc-900 border border-zinc-200">
            <FileText className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-zinc-200 p-4 rounded-xl shadow-xs">
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
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-600 font-medium">From:</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="bg-white border border-zinc-200 text-zinc-800 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-zinc-900 shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-600 font-medium">To:</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="bg-white border border-zinc-200 text-zinc-800 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-zinc-900 shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500 uppercase tracking-wider bg-zinc-50/80 font-bold text-[10px]">
                <th className="px-5 py-3">Invoice #</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">GST (18%)</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <TableSkeleton rows={5} cols={9} />
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-zinc-500 text-xs">
                    No invoices found.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => {
                  const amount = Number(inv.amount_inr || inv.amount || 0);
                  const gst = Number(inv.gst_amount || inv.gst_amount_inr || 0);
                  const total = Number(inv.total_inr || inv.total || (amount + gst));

                  return (
                    <tr key={inv.id} className="hover:bg-zinc-50/70 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-zinc-900 font-mono">
                        {inv.invoice_number}
                      </td>
                      <td className="px-4 py-3.5">
                        <Link
                          href={`/admin/clients/${inv.client_id}`}
                          className="font-semibold text-zinc-900 hover:underline"
                        >
                          {inv.name || 'Client'}
                        </Link>
                        <div className="text-[11px] text-zinc-500">{inv.email}</div>
                      </td>
                      <td className="px-4 py-3.5 text-zinc-700 font-medium">
                        {inv.company_name || '—'}
                      </td>
                      <td className="px-4 py-3.5 text-zinc-700 font-mono">
                        ₹{amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-zinc-700 font-mono">
                        ₹{gst.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-zinc-900 font-bold font-mono">
                        ₹{total.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-800 border border-zinc-200">
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-zinc-500">
                        {new Date(inv.issued_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDownload(inv)}
                            disabled={downloadingId === inv.id}
                            className="p-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 hover:text-zinc-900 transition shadow-2xs"
                            title="Download PDF"
                          >
                            {downloadingId === inv.id ? (
                              <div className="w-3.5 h-3.5 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
                            ) : (
                              <FileDown className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleSendEmail(inv)}
                            disabled={sendingId === inv.id}
                            className="p-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 hover:text-zinc-900 transition shadow-2xs"
                            title="Send to client email"
                          >
                            {sendingId === inv.id ? (
                              <div className="w-3.5 h-3.5 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
                            ) : (
                              <Mail className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
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
            Showing <span className="font-semibold text-zinc-900">{invoices.length}</span> of{' '}
            <span className="font-semibold text-zinc-900">{pagination.total}</span> invoices
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
