"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { MobileNav } from "@/components/layout/MobileNav";

const navItems = [
  { label: "Home", href: "/#hero" },
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Why KnowBridge", href: "/#why-knowbridge" },
  { label: "What You Get", href: "/#what-you-get" },
  { label: "Admin Features", href: "/admin-panel" },
  { label: "Contact", href: "/#contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[60] h-16 transition-all duration-300",
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-xs border-b border-zinc-200"
            : "bg-white/80 backdrop-blur-md border-b border-zinc-200/80"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            aria-label="KnowBridge home"
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shadow-xs border border-zinc-200/80 group-hover:scale-105 transition-transform duration-200 bg-white">
              <Image
                src="/logo.png"
                alt="KnowBridge Logo"
                width={32}
                height={32}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <span className="text-zinc-900 font-bold text-lg tracking-tight">
              KnowBridge
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav
            className="hidden lg:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-3 py-1.5 text-sm text-zinc-600 hover:text-zinc-950 transition-colors duration-150 rounded-lg hover:bg-zinc-100/70 font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-2.5">
            <Link
              href="/admin/login"
              className="px-3 py-1.5 text-sm font-medium text-zinc-700 hover:text-black hover:bg-zinc-100/70 rounded-lg transition-colors"
            >
              Log In
            </Link>
            <Button variant="primary" size="sm" asChild>
              <Link href="/#contact" className="px-4 py-2 text-sm font-semibold">
                Book a Demo
              </Link>
            </Button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden p-2 text-zinc-700 hover:text-zinc-950 transition-colors rounded-lg hover:bg-zinc-100 cursor-pointer"
            onClick={() => setIsMobileNavOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={isMobileNavOpen}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onOpen={() => setIsMobileNavOpen(true)}
        onClose={() => setIsMobileNavOpen(false)}
      />
    </>
  );
}
