'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Building,
  Mail,
  Phone,
  Globe,
  Calendar,
  ShieldCheck,
  CreditCard,
  FileText,
  FileDown,
  Send,
  UserX,
  UserCheck,
} from 'lucide-react';
import {
  getClientById,
  suspendClient,
  reactivateClient,
  downloadInvoicePdf,
  sendInvoiceEmail,
  ClientDetail,
  InvoiceItem,
} from '@/lib/adminApi';
import { useToast } from '@/components/admin/Toast';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { AssignPlanModal } from '@/components/admin/AssignPlanModal';

type TabType = 'overview' | 'subscriptions' | 'invoices' | 'consent';

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const clientId = resolvedParams.id;

  const [client, setClient] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [sendingInvoiceId, setSendingInvoiceId] = useState<string | null>(null);
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<string | null>(null);

  // Modals & Dialogs
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

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const { success, error } = useToast();

  const loadClient = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getClientById(clientId);
      const clientData = res.client || res.data;
      if (clientData) {
        setClient(clientData);
      } else {
        setClient(null);
      }
    } catch (err: any) {
      console.error('Failed to load client details:', err);
      error(err.message || 'Client not found');
    } finally {
      setLoading(false);
    }
  }, [clientId, error]);

  useEffect(() => {
    loadClient();
  }, [loadClient]);

  const handleSuspend = () => {
    if (!client) return;
    setConfirmDialog({
      open: true,
      title: `Suspend ${client.name}?`,
      description: `This will suspend access for ${client.company_name || client.name}. The client chatbot will be stopped immediately.`,
      confirmLabel: 'Suspend Client',
      variant: 'warning',
      action: async () => {
        try {
          await suspendClient(client.id);
          success(`Suspended ${client.name}`);
          setConfirmDialog((prev) => ({ ...prev, open: false }));
          loadClient();
        } catch (err: any) {
          error(err.message || 'Failed to suspend client');
        }
      },
    });
  };

  const handleReactivate = () => {
    if (!client) return;
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
          loadClient();
        } catch (err: any) {
          error(err.message || 'Failed to reactivate client');
        }
      },
    });
  };

  const handleDownloadInvoice = async (invoice: InvoiceItem) => {
    setDownloadingInvoiceId(invoice.id);
    try {
      await downloadInvoicePdf(invoice.id, invoice.invoice_number);
      success(`Downloaded ${invoice.invoice_number}.pdf`);
    } catch (err: any) {
      error(err.message || 'Failed to download invoice PDF');
    } finally {
      setDownloadingInvoiceId(null);
    }
  };

  const handleSendInvoiceEmail = async (invoiceId: string) => {
    setSendingInvoiceId(invoiceId);
    try {
      await sendInvoiceEmail(invoiceId);
      success('Invoice sent to client email successfully');
    } catch (err: any) {
      error(err.message || 'Failed to send invoice email');
    } finally {
      setSendingInvoiceId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-900 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-zinc-500 text-xs font-medium">Loading client details...</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="py-20 text-center bg-white border border-zinc-200 rounded-xl p-8 max-w-md mx-auto">
        <p className="text-zinc-700 text-sm font-semibold mb-4">Client not found.</p>
        <Link
          href="/admin/clients"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 text-xs font-semibold text-white hover:bg-black transition shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Clients</span>
        </Link>
      </div>
    );
  }

  const renderStatusBadge = (status: string, large = false) => {
    const sizeClasses = large ? 'px-3 py-1 text-xs font-bold' : 'px-2 py-0.5 text-[11px] font-semibold';
    switch (status) {
      case 'active':
        return (
          <span className={`${sizeClasses} rounded-full bg-zinc-900 text-white shadow-2xs`}>
            Active
          </span>
        );
      case 'lead':
        return (
          <span className={`${sizeClasses} rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200`}>
            Lead
          </span>
        );
      case 'suspended':
        return (
          <span className={`${sizeClasses} rounded-full bg-zinc-200 text-zinc-800 border border-zinc-300`}>
            Suspended
          </span>
        );
      case 'cancelled':
        return (
          <span className={`${sizeClasses} rounded-full bg-zinc-100 text-zinc-500 border border-zinc-200`}>
            Cancelled
          </span>
        );
      default:
        return (
          <span className={`${sizeClasses} rounded-full bg-zinc-100 text-zinc-700`}>
            {status}
          </span>
        );
    }
  };

  const tabs: Array<{ id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'overview', label: 'Overview', icon: Building },
    { id: 'subscriptions', label: `Subscriptions (${client.subscriptions?.length || 0})`, icon: CreditCard },
    { id: 'invoices', label: `Invoices (${client.invoices?.length || 0})`, icon: FileText },
    { id: 'consent', label: 'DPDP Consent', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/clients"
            className="p-2 rounded-lg bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition shadow-2xs"
            aria-label="Back to Clients"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-zinc-900 tracking-tight">{client.name}</h2>
              {renderStatusBadge(client.status)}
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              {client.company_name || 'Individual client'} • Added{' '}
              {new Date(client.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: 2/3 Content, 1/3 Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2/3: Tabs and Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs Navigation */}
          <div className="flex items-center gap-2 border-b border-zinc-200 pb-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                    isActive
                      ? 'bg-zinc-900 text-white shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Client Info Card */}
              <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-4 flex items-center gap-2">
                  <Building className="w-4 h-4 text-zinc-900" />
                  <span>Client Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-zinc-500 block mb-1">Full Name</span>
                    <span className="text-zinc-900 font-semibold">{client.name}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block mb-1">Email Address</span>
                    <span className="text-zinc-900 font-semibold">{client.email}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block mb-1">Company Name</span>
                    <span className="text-zinc-900 font-semibold">{client.company_name || '—'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block mb-1">Phone Number</span>
                    <span className="text-zinc-900 font-semibold">{client.phone || '—'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block mb-1">Industry</span>
                    <span className="text-zinc-900 font-semibold">{client.industry || '—'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block mb-1">Company Size</span>
                    <span className="text-zinc-900 font-semibold">{client.company_size || '—'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block mb-1">Website</span>
                    {client.website ? (
                      <a
                        href={client.website.startsWith('http') ? client.website : `https://${client.website}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-900 underline font-semibold flex items-center gap-1"
                      >
                        <Globe className="w-3 h-3" />
                        <span>{client.website}</span>
                      </a>
                    ) : (
                      <span className="text-zinc-400">—</span>
                    )}
                  </div>
                  <div>
                    <span className="text-zinc-500 block mb-1">Registration Date</span>
                    <span className="text-zinc-900 font-semibold">
                      {new Date(client.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Current Active Subscription Card */}
              <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-zinc-900" />
                  <span>Current Subscription Status</span>
                </h3>

                {client.current_plan_name ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-zinc-900">{client.current_plan_name} Plan</div>
                        <div className="text-xs text-zinc-500">
                          Expires on {client.ends_at ? new Date(client.ends_at).toLocaleDateString() : '—'}
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-900 text-white shadow-2xs">
                        {client.subscription_status || 'Active'}
                      </span>
                    </div>

                    {/* Usage Meter */}
                    <div>
                      <div className="flex items-center justify-between text-xs text-zinc-600 mb-1.5 font-mono">
                        <span>Conversations Consumed</span>
                        <span className="font-bold text-zinc-900">
                          {(client.conversations_used || 0).toLocaleString()} /{' '}
                          {(client.plan_conversations_limit || 0).toLocaleString()}
                        </span>
                      </div>
                      {(() => {
                        const used = client.conversations_used || 0;
                        const limit = client.plan_conversations_limit || 1;
                        const pct = Math.min(100, Math.round((used / limit) * 100));
                        return (
                          <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                            <div className="h-full bg-zinc-900 rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-xs text-zinc-500 mb-3">No active subscription plan assigned.</p>
                    <button
                      onClick={() => setAssignModalOpen(true)}
                      className="px-4 py-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-black rounded-lg transition shadow-xs"
                    >
                      Assign Plan Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: SUBSCRIPTIONS HISTORY */}
          {activeTab === 'subscriptions' && (
            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs">
              <div className="p-4 border-b border-zinc-200 bg-zinc-50/50">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Subscription History</h3>
                <p className="text-[11px] text-zinc-500">All plans active or expired for this account</p>
              </div>

              <div className="overflow-x-auto">
                {(!client.subscriptions || client.subscriptions.length === 0) ? (
                  <div className="p-8 text-center text-zinc-500 text-xs">
                    No subscriptions found for this client.
                  </div>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-200 text-zinc-500 bg-zinc-50/80 font-bold uppercase text-[10px]">
                        <th className="px-5 py-3">Plan</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Started</th>
                        <th className="px-4 py-3">Ends</th>
                        <th className="px-4 py-3">Conversations Used</th>
                        <th className="px-4 py-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {client.subscriptions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-zinc-50/80">
                          <td className="px-5 py-3 font-semibold text-zinc-900">{sub.plan_name}</td>
                          <td className="px-4 py-3 text-zinc-800 font-mono">₹{Number(sub.price_inr).toLocaleString()}</td>
                          <td className="px-4 py-3 text-zinc-500">
                            {new Date(sub.started_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-zinc-500">
                            {new Date(sub.ends_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-zinc-900 font-semibold font-mono">
                            {(sub.conversations_used || 0).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {renderStatusBadge(sub.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: INVOICES */}
          {activeTab === 'invoices' && (
            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs">
              <div className="p-4 border-b border-zinc-200 bg-zinc-50/50">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Invoices & Billing History</h3>
                <p className="text-[11px] text-zinc-500">Generated tax invoices with GST breakdown</p>
              </div>

              <div className="overflow-x-auto">
                {(!client.invoices || client.invoices.length === 0) ? (
                  <div className="p-8 text-center text-zinc-500 text-xs">
                    No invoices generated yet for this client.
                  </div>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-200 text-zinc-500 bg-zinc-50/80 font-bold uppercase text-[10px]">
                        <th className="px-5 py-3">Invoice #</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">GST (18%)</th>
                        <th className="px-4 py-3">Total</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-5 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {client.invoices.map((inv) => {
                        const amount = Number(inv.amount_inr || inv.amount || 0);
                        const gst = Number(inv.gst_amount || inv.gst_amount_inr || 0);
                        const total = Number(inv.total_inr || inv.total || (amount + gst));

                        return (
                          <tr key={inv.id} className="hover:bg-zinc-50/80">
                            <td className="px-5 py-3 font-bold text-zinc-900 font-mono">
                              {inv.invoice_number}
                            </td>
                            <td className="px-4 py-3 text-zinc-700 font-mono">₹{amount.toLocaleString()}</td>
                            <td className="px-4 py-3 text-zinc-700 font-mono">₹{gst.toLocaleString()}</td>
                            <td className="px-4 py-3 text-zinc-900 font-bold font-mono">₹{total.toLocaleString()}</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-800 border border-zinc-200">
                                {inv.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-zinc-500">
                              {new Date(inv.issued_at).toLocaleDateString()}
                            </td>
                            <td className="px-5 py-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleDownloadInvoice(inv)}
                                  disabled={downloadingInvoiceId === inv.id}
                                  className="p-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 hover:text-zinc-900 transition shadow-2xs"
                                  title="Download PDF"
                                >
                                  {downloadingInvoiceId === inv.id ? (
                                    <div className="w-3.5 h-3.5 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
                                  ) : (
                                    <FileDown className="w-3.5 h-3.5" />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleSendInvoiceEmail(inv.id)}
                                  disabled={sendingInvoiceId === inv.id}
                                  className="p-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 hover:text-zinc-900 transition shadow-2xs"
                                  title="Send Email to Client"
                                >
                                  {sendingInvoiceId === inv.id ? (
                                    <div className="w-3.5 h-3.5 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
                                  ) : (
                                    <Send className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: CONSENT & DPDP ACT */}
          {activeTab === 'consent' && (
            <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-zinc-900" />
                    <span>DPDP Act 2023 Consent Audit</span>
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Consent lifecycle compliance record as required by Indian Data Protection laws
                  </p>
                </div>
                {client.consent ? (
                  client.consent.data_deleted ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-500 border border-zinc-200">
                      Data Deleted
                    </span>
                  ) : client.consent.withdrawn_at ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-200 text-zinc-800 border border-zinc-300">
                      Withdrawn — Pending Deletion
                    </span>
                  ) : client.consent.consent_given ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-900 text-white shadow-2xs">
                      Active Consent
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-500 border border-zinc-200">
                      No Consent
                    </span>
                  )
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-500 border border-zinc-200">
                    No Consent Record
                  </span>
                )}
              </div>

              {client.consent ? (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-zinc-500 block mb-1">Consent Given At</span>
                      <span className="text-zinc-900 font-semibold">
                        {client.consent.consent_given_at
                          ? new Date(client.consent.consent_given_at).toLocaleString()
                          : '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block mb-1">IP Address</span>
                      <span className="text-zinc-900 font-mono font-medium">
                        {client.consent.ip_address || 'Not recorded'}
                      </span>
                    </div>
                    {client.consent.withdrawn_at && (
                      <div>
                        <span className="text-zinc-500 block mb-1">Withdrawn At</span>
                        <span className="text-zinc-900 font-semibold">
                          {new Date(client.consent.withdrawn_at).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {(client.consent.scheduled_deletion_date || (client.consent.withdrawn_at && client.consent.data_deleted_at)) && (
                      <div>
                        <span className="text-zinc-500 block mb-1">Scheduled Deletion (30-day mandate)</span>
                        <span className="text-zinc-900 font-semibold">
                          {new Date(
                            client.consent.scheduled_deletion_date || client.consent.data_deleted_at!
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="text-zinc-500 block mb-1.5">Consent Text Acknowledged:</span>
                    <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-700 leading-relaxed text-[11px]">
                      &ldquo;{client.consent.consent_text}&rdquo;
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-zinc-500 text-xs py-4 text-center">
                  No DPDP consent record on file for this email.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right 1/3: Action Panel (Sticky) */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs sticky top-6 space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Client Actions</h3>
            {renderStatusBadge(client.status, true)}
          </div>

          <div className="space-y-2.5">
            {/* Suspend / Reactivate */}
            {client.status === 'active' && (
              <button
                onClick={handleSuspend}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900 text-xs font-semibold transition shadow-2xs"
              >
                <UserX className="w-4 h-4 text-zinc-700" />
                <span>Suspend Client</span>
              </button>
            )}

            {client.status === 'suspended' && (
              <button
                onClick={handleReactivate}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-900 hover:bg-black text-white text-xs font-semibold transition shadow-xs"
              >
                <UserCheck className="w-4 h-4 text-white" />
                <span>Reactivate Client</span>
              </button>
            )}

            {/* Assign Plan */}
            <button
              onClick={() => setAssignModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-900 hover:bg-black text-white text-xs font-semibold transition shadow-xs"
            >
              <CreditCard className="w-4 h-4" />
              <span>Assign / Change Plan</span>
            </button>

            {/* Send Invoice Action */}
            {client.invoices && client.invoices.length > 0 && (
              <div className="pt-2">
                <span className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Dispatch Invoice
                </span>
                <button
                  onClick={() => handleSendInvoiceEmail(client.invoices[0].id)}
                  disabled={sendingInvoiceId === client.invoices[0].id}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-semibold transition shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5 text-zinc-700" />
                  <span>Send Latest Invoice ({client.invoices[0].invoice_number})</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Dialog */}
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
        open={assignModalOpen}
        onOpenChange={setAssignModalOpen}
        clientId={client.id}
        clientName={client.company_name || client.name}
        onSuccess={loadClient}
      />
    </div>
  );
}
