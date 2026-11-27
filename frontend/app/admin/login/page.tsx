'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { loginAdmin } from '@/lib/adminApi';
import { useAdmin } from '@/lib/adminContext';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAdmin();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const data = await loginAdmin(email.trim().toLowerCase(), password);
      login(data.token, data.admin);
      router.push('/admin');
    } catch (err: any) {
      if (err.status === 401 || err.message?.includes('Invalid')) {
        setErrorMsg('Invalid email or password');
      } else if (err.status === 429 || err.message?.includes('Too many')) {
        setErrorMsg('Too many attempts. Wait 15 minutes.');
      } else {
        setErrorMsg(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-zinc-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl p-8 shadow-xs relative">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-zinc-900 text-white font-bold text-lg mb-3 shadow-xs">
            K
          </div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">KnowBridge</h1>
          <div className="mt-1">
            <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200">
              Admin Panel
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-2.5">
            Sign in with administrative credentials to manage client operations
          </p>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-lg bg-zinc-50 border border-zinc-300 flex items-center gap-2.5 text-zinc-900 text-xs font-medium">
            <AlertCircle className="w-4 h-4 text-zinc-900 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5" htmlFor="admin-email">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                placeholder="admin@knowbridge.io"
                className="w-full bg-white border border-zinc-200 text-zinc-900 rounded-lg pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition placeholder:text-zinc-400 shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5" htmlFor="admin-password">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-white border border-zinc-200 text-zinc-900 rounded-lg pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition placeholder:text-zinc-400 shadow-2xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-zinc-900 hover:bg-black text-white font-semibold py-2.5 px-4 rounded-lg text-xs transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-zinc-100 text-center">
          <p className="text-[11px] text-zinc-400">
            Internal protected area. Unauthorized access attempts are monitored and recorded.
          </p>
        </div>
      </div>
    </div>
  );
}
