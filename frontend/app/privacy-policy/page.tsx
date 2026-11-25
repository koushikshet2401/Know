import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — KnowBridge",
  description: "KnowBridge Privacy Policy.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24">
      <h1 className="text-3xl font-bold text-zinc-900 mb-6">Privacy Policy</h1>
      <p className="text-zinc-600 text-sm leading-relaxed">
        This Privacy Policy is a placeholder. Full legal text will be published
        before KnowBridge launches publicly. For questions, contact{" "}
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
