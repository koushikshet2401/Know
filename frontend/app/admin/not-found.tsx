import React from 'react';
import Link from 'next/link';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export default function AdminNotFound() {
  return (
    <div className="min-h-[500px] flex items-center justify-center p-6 bg-zinc-50">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-xl p-8 shadow-xs text-center">
        <div className="w-12 h-12 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto mb-4 text-zinc-900">
          <FileQuestion className="w-6 h-6" />
        </div>

        <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
          404 — Page not found
        </h2>

        <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
          The requested admin page or resource does not exist or has been relocated.
        </p>

        <div className="mt-6">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-black transition shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
