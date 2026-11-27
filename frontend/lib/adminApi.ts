import Cookies from 'js-cookie';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface AdminUser {
  id: string;
  email: string;
  created_at?: string;
}

export interface ClientItem {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company_name?: string | null;
  website?: string | null;
  industry?: string | null;
  company_size?: string | null;
  status: 'lead' | 'active' | 'suspended' | 'cancelled';
  created_at: string;
  updated_at?: string;
  current_plan_name?: string | null;
  ends_at?: string | null;
  conversations_used?: number | null;
  plan_conversations_limit?: number | null;
  subscription_status?: string | null;
}

export interface SubscriptionItem {
  id: string;
  client_id: string;
  plan_id: string;
  plan_name: string;
  price_inr: number;
  started_at: string;
  ends_at: string;
  status: 'active' | 'expired' | 'cancelled';
  conversations_used: number;
  created_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_number: string;
  client_id: string;
  subscription_id?: string | null;
  amount_inr?: number | string;
  amount?: number | string;
  gst_amount?: number | string;
  gst_amount_inr?: number | string;
  total_inr?: number | string;
  total?: number | string;
  status: 'paid' | 'pending' | 'cancelled';
  issued_at: string;
  paid_at?: string | null;
  due_date?: string | null;
  due_at?: string | null;
  name?: string;
  email?: string;
  company_name?: string;
  plan_name?: string;
}

export interface ConsentRecord {
  id: string;
  client_id: string;
  email: string;
  consent_given: boolean;
  consent_given_at: string;
  consent_text: string;
  ip_address?: string | null;
  withdrawn_at?: string | null;
  scheduled_deletion_date?: string | null;
  data_deleted_at?: string | null;
  data_deleted?: boolean;
  created_at: string;
  client_name?: string;
  company_name?: string;
}

export interface PlanItem {
  id: string;
  name: string;
  price_inr: number;
  conversations: number;
  features?: string[];
  created_at?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ClientDetail extends ClientItem {
  subscriptions: SubscriptionItem[];
  invoices: InvoiceItem[];
  consent: ConsentRecord | null;
}

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('kb_admin_token') || Cookies.get('kb_admin_token') || null;
}

export function setAdminAuth(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('kb_admin_token', token);
  // Set cookie for Next.js middleware (8 hours)
  document.cookie = `kb_admin_token=${token}; path=/; max-age=28800; SameSite=Strict`;
}

export function clearAdminAuth() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('kb_admin_token');
  document.cookie = 'kb_admin_token=; path=/; max-age=0; SameSite=Strict';
  Cookies.remove('kb_admin_token', { path: '/' });
}

async function fetchAdmin<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; [key: string]: any }> {
  const token = getAdminToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    clearAdminAuth();
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin/login')) {
      window.location.href = '/admin/login';
    }
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'Unauthorized');
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data;
}

export async function loginAdmin(email: string, password: string): Promise<{
  success: boolean;
  token: string;
  admin: AdminUser;
  message?: string;
}> {
  const res = await fetch(`${API_BASE}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error: any = new Error(data.message || 'Login failed');
    error.status = res.status;
    throw error;
  }

  return data;
}

export async function getMe(): Promise<{ success: boolean; admin: AdminUser }> {
  return fetchAdmin<{ admin: AdminUser }>('/api/admin/auth/me') as any;
}

export async function getClients(params: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  industry?: string;
} = {}): Promise<{
  success: boolean;
  data: ClientItem[];
  pagination: Pagination;
}> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.status && params.status !== 'all') query.set('status', params.status);
  if (params.search) query.set('search', params.search);
  if (params.industry && params.industry !== 'all') query.set('industry', params.industry);

  const qs = query.toString();
  return fetchAdmin(`/api/admin/clients${qs ? `?${qs}` : ''}`) as any;
}

export async function getClientById(id: string): Promise<{
  success: boolean;
  client: ClientDetail;
  data: ClientDetail;
}> {
  const res: any = await fetchAdmin(`/api/admin/clients/${id}`);
  const client = res.client || res.data;
  return {
    ...res,
    client,
    data: client,
  };
}

export async function updateClientStatus(id: string, status: string): Promise<{
  success: boolean;
  data: ClientItem;
}> {
  return fetchAdmin(`/api/admin/clients/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }) as any;
}

export async function suspendClient(id: string): Promise<{
  success: boolean;
  message: string;
  data: ClientItem;
}> {
  return fetchAdmin(`/api/admin/clients/${id}/suspend`, {
    method: 'POST',
  }) as any;
}

export async function reactivateClient(id: string): Promise<{
  success: boolean;
  message: string;
  data: ClientItem;
}> {
  return fetchAdmin(`/api/admin/clients/${id}/reactivate`, {
    method: 'POST',
  }) as any;
}

export async function getExpiringClients(days: number = 7): Promise<{
  success: boolean;
  count?: number;
  subscriptions: Array<{
    id?: string;
    client_id: string;
    name: string;
    company_name?: string;
    email: string;
    plan_name: string;
    ends_at: string;
    conversations_used?: number;
    days_left?: number;
  }>;
  data: Array<{
    id?: string;
    client_id: string;
    name: string;
    company_name?: string;
    email: string;
    plan_name: string;
    ends_at: string;
    conversations_used?: number;
    days_left?: number;
  }>;
}> {
  const res: any = await fetchAdmin(`/api/admin/clients/expiring?days=${days}`);
  const list = res.subscriptions || res.data || [];
  const normalized = list.map((item: any) => {
    const diffDays = Math.ceil(
      (new Date(item.ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return {
      ...item,
      id: item.id || item.client_id,
      days_left: item.days_left !== undefined ? item.days_left : diffDays,
    };
  });

  return {
    ...res,
    subscriptions: normalized,
    data: normalized,
  };
}

export async function getPlans(): Promise<{
  success: boolean;
  data: PlanItem[];
}> {
  return fetchAdmin('/api/admin/plans') as any;
}

export async function assignPlan(clientId: string, planId: string): Promise<{
  success: boolean;
  message: string;
  subscription: SubscriptionItem;
}> {
  return fetchAdmin(`/api/admin/clients/${clientId}/assign-plan`, {
    method: 'POST',
    body: JSON.stringify({ planId }),
  }) as any;
}

export async function getInvoices(params: {
  page?: number;
  limit?: number;
  status?: string;
  clientId?: string;
  from?: string;
  to?: string;
} = {}): Promise<{
  success: boolean;
  data: InvoiceItem[];
  pagination: Pagination;
}> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.status && params.status !== 'all') query.set('status', params.status);
  if (params.clientId) query.set('clientId', params.clientId);
  if (params.from) query.set('from', params.from);
  if (params.to) query.set('to', params.to);

  const qs = query.toString();
  return fetchAdmin(`/api/admin/invoices${qs ? `?${qs}` : ''}`) as any;
}

export async function getInvoiceById(id: string): Promise<{
  success: boolean;
  invoice: InvoiceItem;
}> {
  return fetchAdmin(`/api/admin/invoices/${id}`) as any;
}

export async function downloadInvoicePdf(id: string, invoiceNumber: string = 'invoice'): Promise<void> {
  const token = getAdminToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}/api/admin/invoices/${id}/download`, {
    headers,
  });

  if (!res.ok) {
    throw new Error('Failed to download invoice PDF');
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${invoiceNumber}.pdf`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

export async function sendInvoiceEmail(id: string): Promise<{
  success: boolean;
  message: string;
}> {
  return fetchAdmin(`/api/admin/invoices/${id}/send-email`, {
    method: 'POST',
  }) as any;
}

export async function getConsentRecords(params: {
  page?: number;
  limit?: number;
  status?: string;
} = {}): Promise<{
  success: boolean;
  data: ConsentRecord[];
  pagination: Pagination;
}> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.status && params.status !== 'all') query.set('status', params.status);

  const qs = query.toString();
  return fetchAdmin(`/api/admin/consent${qs ? `?${qs}` : ''}`) as any;
}

export async function getConsentByClientId(clientId: string): Promise<{
  success: boolean;
  data: ConsentRecord;
}> {
  return fetchAdmin(`/api/admin/consent/${clientId}`) as any;
}
