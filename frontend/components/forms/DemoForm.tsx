"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { demoRequestSchema, DemoRequestInput } from "@/lib/validations";
import { submitDemoRequest } from "@/lib/api";
import { FormField, inputBaseClasses, inputErrorClasses } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { CONTACT_EMAIL } from "@/lib/constants";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function DemoForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<DemoRequestInput>({
    resolver: zodResolver(demoRequestSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company_name: "",
      website: "",
      industry: "",
      company_size: "",
      use_case: "",
      preferred_date: "",
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

  const onSubmit = async (values: DemoRequestInput) => {
    setApiError(null);
    try {
      const res = await submitDemoRequest(values as unknown as Record<string, unknown>);

      if (res.success) {
        setSubmittedData({ name: values.name, email: values.email });
        setIsSuccess(true);
      } else {
        if (res.errors && Array.isArray(res.errors)) {
          res.errors.forEach((err) => {
            setError(err.field as keyof DemoRequestInput, {
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
        <h2 className="text-2xl font-bold text-zinc-900 mb-3">Request received!</h2>
        <p className="text-zinc-600 text-sm sm:text-base leading-relaxed max-w-md mb-8">
          We will reach out to{" "}
          <span className="text-zinc-900 font-semibold">{submittedData.name}</span> at{" "}
          <span className="text-zinc-900 font-semibold">{submittedData.email}</span> within
          24 hours to confirm your demo time.
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

        {/* Full Name & Business Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Full Name"
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
            label="Business Email"
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

        {/* Company Name & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Company Name"
            required
            error={errors.company_name?.message}
          >
            <input
              type="text"
              placeholder="Acme Inc."
              disabled={isSubmitting}
              className={cn(
                inputBaseClasses,
                errors.company_name && inputErrorClasses
              )}
              {...register("company_name")}
            />
          </FormField>

          <FormField
            label="Phone Number"
            error={errors.phone?.message}
          >
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              disabled={isSubmitting}
              className={cn(
                inputBaseClasses,
                errors.phone && inputErrorClasses
              )}
              {...register("phone")}
            />
          </FormField>
        </div>

        {/* Website URL & Industry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Website URL"
            error={errors.website?.message}
          >
            <input
              type="url"
              placeholder="https://example.com"
              disabled={isSubmitting}
              className={cn(
                inputBaseClasses,
                errors.website && inputErrorClasses
              )}
              {...register("website")}
            />
          </FormField>

          <FormField
            label="Industry"
            error={errors.industry?.message}
          >
            <input
              type="text"
              placeholder="B2B SaaS, E-commerce, etc."
              disabled={isSubmitting}
              className={cn(
                inputBaseClasses,
                errors.industry && inputErrorClasses
              )}
              {...register("industry")}
            />
          </FormField>
        </div>

        {/* Company Size & Preferred Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Company Size"
            error={errors.company_size?.message}
          >
            <select
              disabled={isSubmitting}
              className={cn(
                inputBaseClasses,
                errors.company_size && inputErrorClasses
              )}
              {...register("company_size")}
            >
              <option value="">Select company size...</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="500+">500+ employees</option>
            </select>
          </FormField>

          <FormField
            label="Preferred Demo Date"
            error={errors.preferred_date?.message}
          >
            <input
              type="date"
              disabled={isSubmitting}
              className={cn(
                inputBaseClasses,
                errors.preferred_date && inputErrorClasses
              )}
              {...register("preferred_date")}
            />
          </FormField>
        </div>

        {/* Use Case */}
        <FormField
          label="How do you plan to use KnowBridge?"
          error={errors.use_case?.message}
        >
          <textarea
            rows={3}
            placeholder="Tell us about your support volume and what documents you'd like to ingest..."
            disabled={isSubmitting}
            className={cn(
              inputBaseClasses,
              errors.use_case && inputErrorClasses,
              "resize-y min-h-[80px]"
            )}
            {...register("use_case")}
          />
        </FormField>

        {/* Anything Else */}
        <FormField
          label="Anything else?"
          error={errors.message?.message}
        >
          <textarea
            rows={2}
            placeholder="Any specific questions or requirements?"
            disabled={isSubmitting}
            className={cn(
              inputBaseClasses,
              errors.message && inputErrorClasses,
              "resize-y min-h-[60px]"
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
              "Request a Demo"
            )}
          </Button>

          <p className="text-center text-xs text-zinc-500 mt-3">
            We respond to all requests within 24 hours.
          </p>
        </div>
      </form>
    </div>
  );
}
