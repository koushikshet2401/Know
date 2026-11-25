"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Check, Mail, Clock, ShieldCheck, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

export function ContactSection() {
  const prefersReducedMotion = useReducedMotion();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    companyName: "",
    phone: "",
    websiteUrl: "",
    useCase: "",
    additionalInfo: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage(
          data.message || "Thank you! Your demo request has been received."
        );
        setFormData({
          fullName: "",
          email: "",
          companyName: "",
          phone: "",
          websiteUrl: "",
          useCase: "",
          additionalInfo: "",
        });
      } else {
        setErrorMessage(
          data.error || "Something went wrong. Please try again."
        );
      }
    } catch {
      setErrorMessage(
        "Network error. Please try again or email hello@knowbridge.io directly."
      );
    } finally {
      setLoading(false);
    }
  };

  const expectations = [
    "Live product walkthrough",
    "Setup on your actual website",
    "Answers to your specific questions",
    "No sales pressure",
  ];

  return (
    <SectionWrapper className="py-6 sm:py-8 md:py-10 lg:py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
        <Badge className="mb-2">Get In Touch</Badge>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-zinc-900 tracking-tight leading-tight mb-2">
          Ready to stop missing leads?
        </h2>
        <p className="text-zinc-600 text-xs sm:text-sm md:text-base leading-relaxed">
          Book a 20-minute demo. We will show you KnowBridge live and help you
          configure it for your business — no commitment required.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-6xl mx-auto items-start">
        {/* Left Side Info */}
        <motion.div
          initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-5 flex flex-col gap-6"
        >
          <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-xs">
            <h3 className="text-base font-bold text-zinc-900 mb-4">
              What to expect:
            </h3>
            <ul className="space-y-3 mb-6">
              {expectations.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm text-zinc-700"
                >
                  <div className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2.5 pt-4 border-t border-zinc-100 text-xs sm:text-sm text-zinc-600 font-medium">
              <Clock className="w-4 h-4 text-zinc-500 shrink-0" />
              <span>Most demos take less than 20 minutes.</span>
            </div>
          </div>

          {/* Direct Email Card */}
          <div className="p-5 rounded-2xl bg-zinc-100/80 border border-zinc-200/80 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-zinc-800" />
            </div>
            <div>
              <div className="text-xs text-zinc-500 font-medium">
                Email us directly:
              </div>
              <a
                href="mailto:hello@knowbridge.io"
                className="text-sm sm:text-base font-bold text-zinc-900 hover:underline"
              >
                hello@knowbridge.io
              </a>
            </div>
          </div>
        </motion.div>

        {/* Right Side Form */}
        <motion.div
          initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm"
        >
          {successMessage ? (
            <div className="p-8 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900">Request Sent!</h3>
              <p className="text-sm text-zinc-600 max-w-md">
                {successMessage}
              </p>
              <Button
                variant="secondary"
                size="md"
                onClick={() => setSuccessMessage(null)}
                className="mt-4"
              >
                Send Another Request
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-xs font-semibold text-zinc-900 mb-1"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Sarah Miller"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all placeholder:text-zinc-400"
                  />
                </div>

                {/* Business Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold text-zinc-900 mb-1"
                  >
                    Business Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="sarah@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all placeholder:text-zinc-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Company Name */}
                <div>
                  <label
                    htmlFor="companyName"
                    className="block text-xs font-semibold text-zinc-900 mb-1"
                  >
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Acme Inc."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all placeholder:text-zinc-400"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs font-semibold text-zinc-900 mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all placeholder:text-zinc-400"
                  />
                </div>
              </div>

              {/* Website URL */}
              <div>
                <label
                  htmlFor="websiteUrl"
                  className="block text-xs font-semibold text-zinc-900 mb-1"
                >
                  Website URL
                </label>
                <input
                  id="websiteUrl"
                  name="websiteUrl"
                  type="url"
                  value={formData.websiteUrl}
                  onChange={handleChange}
                  placeholder="https://company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all placeholder:text-zinc-400"
                />
              </div>

              {/* Use Case */}
              <div>
                <label
                  htmlFor="useCase"
                  className="block text-xs font-semibold text-zinc-900 mb-1"
                >
                  How do you plan to use KnowBridge?
                </label>
                <textarea
                  id="useCase"
                  name="useCase"
                  rows={2}
                  value={formData.useCase}
                  onChange={handleChange}
                  placeholder="e.g. Ingest 50 product guides and qualify inbound SaaS trial leads..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all placeholder:text-zinc-400 resize-none"
                />
              </div>

              {/* Anything else */}
              <div>
                <label
                  htmlFor="additionalInfo"
                  className="block text-xs font-semibold text-zinc-900 mb-1"
                >
                  Anything else you want us to know?
                </label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  rows={2}
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  placeholder="Tell us about your team size, support channels, or timeline..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all placeholder:text-zinc-400 resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                variant="primary"
                size="lg"
                className="w-full justify-center text-sm sm:text-base py-3.5 group cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <span>Request a Demo</span>
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>

              {/* Microcopy */}
              <p className="text-center text-xs text-zinc-400 pt-1">
                We respond to all requests within 24 hours.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
