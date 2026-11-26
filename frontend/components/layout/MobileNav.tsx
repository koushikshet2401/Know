"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Sparkles,
  LayoutDashboard,
  Calendar,
  LayoutGrid,
  X,
  Zap,
  ArrowRight,
  Shield,
  FileText,
  HelpCircle,
  CreditCard,
  Layers,
  Info,
  Mail,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface MobileNavProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export function MobileNav({ isOpen, onOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();

  // Lock body scroll when second screen is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navItems = [
    {
      label: "HOME",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: "BENEFITS",
      href: "/what-you-get",
      icon: Sparkles,
      isActive: pathname === "/what-you-get",
    },
    {
      label: "ADMIN",
      href: "/admin-panel",
      icon: LayoutDashboard,
      isActive: pathname === "/admin-panel",
    },
    {
      label: "DEMO",
      href: "/book-a-demo",
      icon: Calendar,
      isActive: pathname === "/book-a-demo",
    },
    {
      label: "MORE",
      href: "#",
      icon: LayoutGrid,
      isActive: isOpen,
      onClick: () => {
        if (isOpen) {
          onClose();
        } else {
          onOpen();
        }
      },
    },
  ];

  const mainPages = [
    {
      title: "Home",
      desc: "AI-first support widget for modern SaaS",
      href: "/",
      icon: Home,
      badge: "Main",
    },
    {
      title: "What You Get",
      desc: "Everything included after widget integration",
      href: "/what-you-get",
      icon: Sparkles,
      badge: "Overview",
    },
    {
      title: "Admin Panel",
      desc: "Live conversations & agent takeover dashboard",
      href: "/admin-panel",
      icon: LayoutDashboard,
      badge: "Dashboard",
    },
    {
      title: "Book a Demo",
      desc: "20-minute live walkthrough for your business",
      href: "/book-a-demo",
      icon: Calendar,
      badge: "Live Walkthrough",
    },
    {
      title: "Contact Us",
      desc: "Questions about custom setups, onboarding, or team",
      href: "/contact",
      icon: Mail,
      badge: "Support",
    },
  ];

  const pageSections = [
    {
      title: "The Problem & Solution",
      href: "/#about",
      icon: Info,
    },
    {
      title: "Platform Features",
      href: "/#features",
      icon: Layers,
    },
    {
      title: "How It Works (Setup)",
      href: "/#how-it-works",
      icon: Zap,
    },
    {
      title: "Why KnowBridge",
      href: "/#why-knowbridge",
      icon: Sparkles,
    },
    {
      title: "What You Get",
      href: "/#what-you-get",
      icon: Layers,
    },
    {
      title: "Contact & Demo",
      href: "/#contact",
      icon: Mail,
    },
  ];

  const legalLinks = [
    { title: "Privacy Policy", href: "/privacy-policy", icon: Shield },
    { title: "Terms of Service", href: "/terms", icon: FileText },
  ];

  return (
    <>
      {/* ─── Fixed Bottom Navigation Bar (Mobile Only) ─── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 backdrop-blur-md border-t border-zinc-200 shadow-lg shadow-zinc-900/5 pb-[env(safe-area-inset-bottom)]"
        aria-label="Mobile Bottom Navigation"
      >
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const content = (
              <div className="flex flex-col items-center justify-center py-1 px-2 relative group select-none">
                <Icon
                  className={`w-5 h-5 transition-transform duration-150 ${
                    item.isActive
                      ? "text-zinc-950 scale-110"
                      : "text-zinc-500 group-hover:text-zinc-800"
                  }`}
                  strokeWidth={item.isActive ? 2.5 : 2}
                />
                <span
                  className={`text-[10px] tracking-wider mt-1 transition-colors ${
                    item.isActive
                      ? "text-zinc-950 font-bold"
                      : "text-zinc-500 font-medium group-hover:text-zinc-700"
                  }`}
                >
                  {item.label}
                </span>

                {/* Active Indicator Dot (Like in the screenshot reference) */}
                {item.isActive && (
                  <motion.span
                    layoutId="mobileActiveDot"
                    className="w-1.5 h-1.5 rounded-full bg-zinc-950 absolute -bottom-1 shadow-xs"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </div>
            );

            if (item.onClick) {
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.onClick}
                  className="flex-1 flex justify-center items-center py-1 cursor-pointer"
                  aria-label={item.label}
                >
                  {content}
                </button>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex-1 flex justify-center items-center py-1"
                onClick={onClose}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ─── Second Screen: Full Mobile Navigation Drawer / Hub ─── */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[70] lg:hidden flex flex-col justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
              aria-hidden="true"
            />

            {/* Second Screen Sheet (Full height on mobile) */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="relative w-full h-[92vh] bg-white rounded-t-3xl shadow-2xl flex flex-col overflow-hidden border-t border-zinc-200"
              role="dialog"
              aria-modal="true"
              aria-label="All Navigation Options"
            >
              {/* Sheet Drag Indicator */}
              <div className="w-12 h-1.5 bg-zinc-300 rounded-full mx-auto mt-3 mb-1" />

              {/* Second Screen Header */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shadow-xs border border-zinc-200/80 bg-white">
                    <Image
                      src="/logo.png"
                      alt="KnowBridge Logo"
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-zinc-950 font-extrabold text-base tracking-tight block leading-none">
                      KnowBridge
                    </span>
                    <span className="text-[11px] text-zinc-500 font-medium">
                      All Navigation Options
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-600 hover:text-black transition-colors cursor-pointer"
                  aria-label="Close second screen"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Second Screen Scrollable Body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                {/* 1. Core Pages Section */}
                <div>
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                    Main Pages
                  </h3>
                  <div className="space-y-2">
                    {mainPages.map((page) => {
                      const PageIcon = page.icon;
                      const isCurrent = pathname === page.href;
                      return (
                        <Link
                          key={page.href}
                          href={page.href}
                          onClick={onClose}
                          className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                            isCurrent
                              ? "bg-zinc-900 text-white border-zinc-900 shadow-xs"
                              : "bg-zinc-50 hover:bg-zinc-100 border-zinc-200/80 text-zinc-900"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                                isCurrent
                                  ? "bg-white/20 text-white"
                                  : "bg-white border border-zinc-200 text-zinc-900 shadow-2xs"
                              }`}
                            >
                              <PageIcon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm">
                                  {page.title}
                                </span>
                                {page.badge && (
                                  <span
                                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                                      isCurrent
                                        ? "bg-white/20 text-white border-white/30"
                                        : "bg-zinc-200/70 text-zinc-800 border-zinc-300"
                                    }`}
                                  >
                                    {page.badge}
                                  </span>
                                )}
                              </div>
                              <p
                                className={`text-xs mt-0.5 ${
                                  isCurrent ? "text-zinc-300" : "text-zinc-500"
                                }`}
                              >
                                {page.desc}
                              </p>
                            </div>
                          </div>
                          <ChevronRight
                            className={`w-4 h-4 shrink-0 ${
                              isCurrent ? "text-white" : "text-zinc-400"
                            }`}
                          />
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Page Sections / Jump Links */}
                <div>
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                    On This Page
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {pageSections.map((sec) => {
                      const SecIcon = sec.icon;
                      return (
                        <Link
                          key={sec.href}
                          href={sec.href}
                          onClick={onClose}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/60 text-zinc-800 text-xs font-semibold transition-colors"
                        >
                          <SecIcon className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                          <span className="truncate">{sec.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Legal & Policies */}
                <div>
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    Policies & Trust
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-zinc-600">
                    {legalLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className="hover:text-zinc-950 font-medium underline-offset-4 hover:underline"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* 4. Action Buttons Box */}
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                  <div className="flex flex-col gap-2.5">
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full justify-center"
                      onClick={onClose}
                      asChild
                    >
                      <Link href="/book-a-demo">
                        <span>Book a Live Demo</span>
                        <ArrowRight className="w-4 h-4 ml-1.5" />
                      </Link>
                    </Button>

                    <Button
                      variant="secondary"
                      size="md"
                      className="w-full justify-center"
                      onClick={onClose}
                      asChild
                    >
                      <a
                        href="https://app.knowbridge.io/login"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1.5"
                      >
                        <span>Login to Dashboard</span>
                        <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                      </a>
                    </Button>
                  </div>

                  <div className="pt-2 border-t border-zinc-200/80 text-center">
                    <span className="text-[11px] text-zinc-500 font-medium">
                      Need custom setup help?{" "}
                      <a
                        href="mailto:team@knowbridge.io"
                        className="text-zinc-900 font-semibold underline hover:text-black"
                      >
                        team@knowbridge.io
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
