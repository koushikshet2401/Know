import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Mail, ArrowLeft, Clock, Lock, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — KnowBridge",
  description:
    "KnowBridge Privacy Policy and Data Protection practices in compliance with the Digital Personal Data Protection Act 2023 (India).",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-16 md:py-24 min-h-screen bg-slate-50 text-slate-800">
      <div className="max-w-4xl mx-auto px-6">
        {/* Navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="border-b border-slate-200 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>DPDP Act 2023 Compliant</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Privacy Policy
          </h1>

          <p className="text-slate-500 text-sm">
            Last Updated: November 2026 · Effective Date: November 2026
          </p>

          <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm leading-relaxed">
            <strong>Legal Notice:</strong> This document contains sample compliance disclosures for KnowBridge.
            <span className="block font-semibold mt-1 text-amber-800">
              [PLACEHOLDER — have this reviewed by a legal professional prior to production deployment]
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-12 text-slate-700 text-sm sm:text-base leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>1. What Data We Collect</span>
            </h2>
            <p>
              When you submit a demo request, contact us, or subscribe to KnowBridge, we collect explicit personal and business information provided directly by you, which may include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li><strong>Contact Information:</strong> Full name, professional business email address, phone number.</li>
              <li><strong>Company Details:</strong> Company name, website URL, industry sector, company team size.</li>
              <li><strong>Operational Context:</strong> Planned AI support use case, message enquiry notes, preferred demo schedule.</li>
              <li><strong>Technical Identifiers:</strong> Internet Protocol (IP) address, browser user-agent header, and audit consent timestamps.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <Lock className="w-5 h-5 text-indigo-600" />
              <span>2. Why We Collect Your Data</span>
            </h2>
            <p>Your personal data is collected and processed strictly on the basis of your informed consent for the following specific purposes:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>To schedule, coordinate, and deliver your requested KnowBridge product walkthrough or demo.</li>
              <li>To respond to sales enquiries, support requests, and multi-tenant setup questions.</li>
              <li>To provision your trial or active subscription plan and generate compliant GST tax invoices.</li>
              <li>To maintain immutable consent and compliance audit trails mandated by Indian privacy regulations.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <Lock className="w-5 h-5 text-indigo-600" />
              <span>3. How We Store and Protect Your Data</span>
            </h2>
            <p>
              Personal data is maintained in secure, isolated PostgreSQL database instances with TLS encryption in transit and AES encryption at rest. Infrastructure is hosted with certified data centers observing strict access control, role-based authentication (RBAC), and automated threat monitoring.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-indigo-600" />
              <span>4. Data Retention and Deletion Timelines</span>
            </h2>
            <p>
              We retain personal data only for as long as necessary to fulfill the operational purpose for which consent was given, or until:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>You withdraw your data consent; or</li>
              <li>Your KnowBridge client subscription is cancelled or terminated.</li>
            </ul>
            <p>
              Under our automated DPDP compliance scheduler, once consent withdrawal is confirmed, personal records are placed in a scheduled purge cycle and permanently deleted within <strong>30 days</strong>.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <span>5. Your Rights Under the DPDP Act 2023</span>
            </h2>
            <p>
              As a Data Principal under India&apos;s Digital Personal Data Protection Act 2023, you have statutory rights concerning your personal data:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-white border border-slate-200 rounded-xl">
                <h3 className="font-semibold text-slate-900 mb-1">Right to Access</h3>
                <p className="text-xs text-slate-600">Request a summary of your personal data being processed.</p>
              </div>
              <div className="p-4 bg-white border border-slate-200 rounded-xl">
                <h3 className="font-semibold text-slate-900 mb-1">Right to Correction</h3>
                <p className="text-xs text-slate-600">Request update or rectification of outdated or inaccurate personal information.</p>
              </div>
              <div className="p-4 bg-white border border-slate-200 rounded-xl">
                <h3 className="font-semibold text-slate-900 mb-1">Right to Erasure</h3>
                <p className="text-xs text-slate-600">Request permanent deletion of data that is no longer required.</p>
              </div>
              <div className="p-4 bg-white border border-slate-200 rounded-xl">
                <h3 className="font-semibold text-slate-900 mb-1">Right to Withdraw Consent</h3>
                <p className="text-xs text-slate-600">Withdraw your processing consent at any moment without penalty.</p>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <Mail className="w-5 h-5 text-indigo-600" />
              <span>6. How to Exercise Your Rights & Contact DPO</span>
            </h2>
            <p>
              Withdrawing consent is as easy as giving it. You can exercise your rights at any time through either of the following mechanisms:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>
                <strong>One-Click Link:</strong> Click the <em>&quot;Click here to withdraw consent and request data deletion&quot;</em> link located at the bottom of every email sent by KnowBridge.
              </li>
              <li>
                <strong>Direct Email:</strong> Email our Data Protection Officer at{" "}
                <a href="mailto:hello@knowbridge.io" className="text-indigo-600 font-medium underline">
                  hello@knowbridge.io
                </a>.
              </li>
            </ul>
            <div className="mt-6 p-4 bg-slate-100 rounded-xl text-xs text-slate-600">
              <strong>Data Protection Officer (DPO):</strong> KnowBridge Privacy Office · Email: hello@knowbridge.io · Address: India
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
