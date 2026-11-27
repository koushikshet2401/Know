'use client';

import React from 'react';
import { Settings, Server, User } from 'lucide-react';
import { useAdmin } from '@/lib/adminContext';

export default function SettingsPage() {
  const { admin } = useAdmin();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-lg font-bold text-zinc-900 tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-zinc-900" />
          <span>System & Admin Settings</span>
        </h2>
        <p className="text-xs text-zinc-500 mt-0.5">
          Review authenticated administrator details, service endpoints, and compliance status.
        </p>
      </div>

      <div className="space-y-4">
        {/* Administrator Profile */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-zinc-900" />
            <span>Admin Profile</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-zinc-500 block mb-1">Email Address</span>
              <span className="text-zinc-900 font-semibold">{admin?.email}</span>
            </div>
            <div>
              <span className="text-zinc-500 block mb-1">Admin ID</span>
              <span className="text-zinc-700 font-mono">{admin?.id}</span>
            </div>
            <div>
              <span className="text-zinc-500 block mb-1">Role</span>
              <span className="text-zinc-900 font-bold">Super Administrator</span>
            </div>
            <div>
              <span className="text-zinc-500 block mb-1">Session Expiration</span>
              <span className="text-zinc-700">8 Hours (JWT Bearer)</span>
            </div>
          </div>
        </div>

        {/* Backend & Connectivity */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-3 flex items-center gap-2">
            <Server className="w-4 h-4 text-zinc-900" />
            <span>Service Infrastructure</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-zinc-500 block mb-1">API Endpoint</span>
              <span className="text-zinc-900 font-mono font-medium">
                {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}
              </span>
            </div>
            <div>
              <span className="text-zinc-500 block mb-1">Database Engine</span>
              <span className="text-zinc-700">PostgreSQL (Pool: 10 connections)</span>
            </div>
            <div>
              <span className="text-zinc-500 block mb-1">Mail Protocol</span>
              <span className="text-zinc-700">SMTP (Nodemailer Transporter)</span>
            </div>
            <div>
              <span className="text-zinc-500 block mb-1">Data Protection Act</span>
              <span className="text-zinc-900 font-bold">India DPDP Act 2023 Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
