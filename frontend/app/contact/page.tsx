import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { Badge } from "@/components/ui/Badge";
import { CONTACT_EMAIL } from "@/lib/constants";
import { Mail, Clock, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the KnowBridge team.",
};

export default function ContactPage() {
  return (
    <div className="py-12 md:py-20 min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          {/* Left Column */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            <Badge>Direct Communication</Badge>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight leading-tight">
              Get in touch.
            </h1>

            <p className="text-zinc-600 text-base md:text-lg leading-relaxed">
              Have questions about multi-tenant architecture, integration with your
              existing knowledge base, or custom plans? We are here to help.
            </p>

            <div className="pt-4 border-t border-zinc-200 space-y-4">
              <div className="flex items-start gap-3 text-sm text-zinc-700">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-zinc-900" />
                </div>
                <div>
                  <div className="text-xs text-zinc-500 font-medium">Email us directly</div>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-zinc-900 hover:text-black font-semibold transition-colors"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm text-zinc-700">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-zinc-900" />
                </div>
                <div>
                  <div className="text-xs text-zinc-500 font-medium">Response time</div>
                  <span className="text-zinc-700">Under 24 hours (Monday to Friday)</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm text-zinc-700">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4 text-zinc-900" />
                </div>
                <div>
                  <div className="text-xs text-zinc-500 font-medium">Looking for a live walkthrough?</div>
                  <a
                    href="/book-a-demo"
                    className="text-zinc-900 hover:underline font-semibold"
                  >
                    Book a demo instead &rarr;
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Form) */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
