import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — KnowBridge",
  description: "KnowBridge Terms of Service.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24">
      <h1 className="text-3xl font-bold text-zinc-900 mb-6">Terms of Service</h1>
      <p className="text-zinc-600 text-sm leading-relaxed">
        These Terms of Service are a placeholder. Full legal text will be
        published before KnowBridge launches publicly. For questions, contact{" "}
        <a
          href="mailto:hello@knowbridge.io"
          className="text-zinc-900 font-medium hover:underline"
        >
          hello@knowbridge.io
        </a>
        .
      </p>
    </div>
  );
}
