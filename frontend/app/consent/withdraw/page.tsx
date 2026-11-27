"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Loader2, ArrowLeft, ShieldCheck } from "lucide-react";

function WithdrawConsentContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("");
  const [deletionDate, setDeletionDate] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing consent withdrawal token.");
      return;
    }

    const apiBase =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

    async function processWithdrawal() {
      try {
        const res = await fetch(
          `${apiBase}/api/consent/withdraw?token=${encodeURIComponent(token!)}`
        );
        const data = await res.json();

        if (res.ok && data.success) {
          setStatus("success");
          setMessage(data.message || "Your consent has been withdrawn.");
          if (data.deletionDate) {
            const formatted = new Date(data.deletionDate).toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            );
            setDeletionDate(formatted);
          }
        } else {
          setStatus("error");
          setMessage(data.message || "This link is invalid or has already been used.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("Unable to connect to the compliance server. Please try again later.");
      }
    }

    processWithdrawal();
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2 mb-6 text-slate-400 text-xs font-semibold tracking-wider uppercase">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span>DPDP Act 2023 Compliance</span>
        </div>

        {status === "loading" && (
          <div className="text-center py-8">
            <Loader2 className="w-12 h-12 text-indigo-400 animate-spin mx-auto mb-4" />
            <h1 className="text-xl font-bold text-white mb-2">Processing Your Request...</h1>
            <p className="text-sm text-slate-400">Verifying security token and updating privacy records.</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-9 h-9 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Consent Withdrawn</h1>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              Your personal data will be deleted within 30 days as required by the Digital Personal Data Protection Act 2023.
            </p>

            {deletionDate && (
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 mb-6 text-left">
                <span className="text-xs text-slate-400 block mb-1">Scheduled Deletion Date</span>
                <span className="text-base font-semibold text-emerald-400">{deletionDate}</span>
              </div>
            )}

            <p className="text-xs text-slate-400 mb-6">
              Confirmation and deletion notices will be sent to your email address.
            </p>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-9 h-9 text-rose-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Unable to Withdraw Consent</h1>
            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              {message || "This link is invalid or has already been used."}
            </p>
            <p className="text-xs text-slate-400 mb-6">
              If you need help or have questions regarding your data privacy, contact our Data Protection Officer at{" "}
              <a href="mailto:hello@knowbridge.io" className="text-indigo-400 hover:underline">
                hello@knowbridge.io
              </a>.
            </p>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function WithdrawConsentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-slate-100 flex justify-center items-center p-4">
          <div className="flex items-center gap-3 text-slate-400 text-sm">
            <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
            <span>Loading privacy portal...</span>
          </div>
        </div>
      }
    >
      <WithdrawConsentContent />
    </Suspense>
  );
}
