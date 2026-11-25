"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, ContactFormInput } from "@/lib/validations";
import { submitContactForm } from "@/lib/api";
import { FormField, inputBaseClasses, inputErrorClasses } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { CONTACT_EMAIL } from "@/lib/constants";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      subject: "",
      message: "",
      _honeypot: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = form;

  const onSubmit = async (values: ContactFormInput) => {
    setApiError(null);
    try {
      const res = await submitContactForm(values as unknown as Record<string, unknown>);

      if (res.success) {
        setSubmittedData({ name: values.name, email: values.email });
        setIsSuccess(true);
      } else {
        if (res.errors && Array.isArray(res.errors)) {
          res.errors.forEach((err) => {
            setError(err.field as keyof ContactFormInput, {
              type: "server",
              message: err.message,
            });
          });
        }
        setApiError(
          res.message ??
            `Something went wrong. Please try again or email us at ${CONTACT_EMAIL}.`
        );
      }
    } catch {
      setApiError(
        `Something went wrong. Please try again or email us at ${CONTACT_EMAIL}.`
      );
    }
  };

  // ─── Success State ───
  if (isSuccess && submittedData) {
    return (
      <div className="p-8 sm:p-10 rounded-card bg-white border border-zinc-200 text-center shadow-sm flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8 text-zinc-900" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 mb-3">Message sent!</h2>
        <p className="text-zinc-600 text-sm sm:text-base leading-relaxed max-w-md mb-8">
          Thanks for reaching out,{" "}
          <span className="text-zinc-900 font-semibold">{submittedData.name}</span>. We
          have received your message and will reply to{" "}
          <span className="text-zinc-900 font-semibold">{submittedData.email}</span> within
          24 hours.
        </p>
        <Link href="/">
          <Button variant="primary" size="md">
            Back to home
          </Button>
        </Link>
      </div>
    );
  }

  // ─── Form State ───
  return (
    <div className="p-6 sm:p-8 md:p-10 rounded-card bg-white border border-zinc-200 shadow-sm">
      {/* Error Banner */}
      {apiError && (
        <div className="mb-6 p-4 rounded-btn bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm leading-relaxed">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span>{apiError}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Hidden Honeypot Field */}
        <input
          type="text"
          {...register("_honeypot")}
          style={{ display: "none" }}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        {/* Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Your Name"
            required
            error={errors.name?.message}
          >
            <input
              type="text"
              placeholder="Sarah Connor"
              disabled={isSubmitting}
              className={cn(
                inputBaseClasses,
                errors.name && inputErrorClasses
              )}
              {...register("name")}
            />
          </FormField>

          <FormField
            label="Email Address"
            required
            error={errors.email?.message}
          >
            <input
              type="email"
              placeholder="sarah@company.com"
              disabled={isSubmitting}
              className={cn(
                inputBaseClasses,
                errors.email && inputErrorClasses
              )}
              {...register("email")}
            />
          </FormField>
        </div>

        {/* Company & Subject */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Company Name"
            error={errors.company?.message}
          >
            <input
              type="text"
              placeholder="Acme Inc. (optional)"
              disabled={isSubmitting}
              className={cn(
                inputBaseClasses,
                errors.company && inputErrorClasses
              )}
              {...register("company")}
            />
          </FormField>

          <FormField
            label="Subject"
            required
            error={errors.subject?.message}
          >
            <input
              type="text"
              placeholder="Question about..."
              disabled={isSubmitting}
              className={cn(
                inputBaseClasses,
                errors.subject && inputErrorClasses
              )}
              {...register("subject")}
            />
          </FormField>
        </div>

        {/* Message */}
        <FormField
          label="Your Message"
          required
          error={errors.message?.message}
        >
          <textarea
            rows={5}
            placeholder="How can we help? Tell us about your setup or requirements..."
            disabled={isSubmitting}
            className={cn(
              inputBaseClasses,
              errors.message && inputErrorClasses,
              "resize-y min-h-[120px]"
            )}
            {...register("message")}
          />
        </FormField>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            className="w-full justify-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span>Sending...</span>
              </>
            ) : (
              "Send Message"
            )}
          </Button>

          <p className="text-center text-xs text-zinc-500 mt-3">
            We respond to all messages within 24 hours.
          </p>
        </div>
      </form>
    </div>
  );
}
