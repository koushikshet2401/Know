'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AdminErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[AdminErrorBoundary caught error]:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      const isDev = process.env.NODE_ENV === 'development';

      return (
        <div className="min-h-[500px] flex items-center justify-center p-6 bg-zinc-50">
          <div className="w-full max-w-md bg-white border border-zinc-200 rounded-xl p-8 shadow-xs text-center">
            <div className="w-12 h-12 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto mb-4 text-zinc-800">
              <AlertCircle className="w-6 h-6" />
            </div>

            <h2 className="text-lg font-bold text-zinc-900 tracking-tight">
              Something went wrong loading this page.
            </h2>

            <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
              An unexpected client error occurred while rendering the admin view.
            </p>

            {isDev && this.state.error && (
              <div className="mt-4 p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-left overflow-x-auto text-[11px] text-zinc-700 font-mono">
                {this.state.error.message}
              </div>
            )}

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => this.setState({ hasError: false, error: null })}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 bg-white text-zinc-900 text-xs font-semibold hover:bg-zinc-50 transition shadow-2xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>

              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-black transition shadow-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Go to Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
