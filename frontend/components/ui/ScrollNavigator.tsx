"use client";

import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ScrollNavigator() {
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      setIsAtTop(scrollY < 100);
      setIsAtBottom(scrollY + windowHeight >= fullHeight - 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div
      className="hidden lg:flex fixed right-4 bottom-6 z-50 flex-col items-center gap-1 p-1 bg-white/90 backdrop-blur-md border border-zinc-200 rounded-full shadow-lg shadow-zinc-900/5 transition-all"
      role="region"
      aria-label="Scroll controls"
    >
      {/* Scroll Up Button */}
      <button
        type="button"
        onClick={scrollToTop}
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
          isAtTop
            ? "text-zinc-300 hover:text-zinc-500 hover:bg-zinc-100"
            : "text-zinc-800 hover:text-black hover:bg-zinc-100 active:scale-95 shadow-2xs"
        }`}
        aria-label="Scroll to top"
        title="Scroll to top"
      >
        <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
      </button>

      {/* Divider */}
      <div className="w-4 h-px bg-zinc-200" />

      {/* Scroll Down Button */}
      <button
        type="button"
        onClick={scrollToBottom}
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
          isAtBottom
            ? "text-zinc-300 hover:text-zinc-500 hover:bg-zinc-100"
            : "text-zinc-800 hover:text-black hover:bg-zinc-100 active:scale-95 shadow-2xs"
        }`}
        aria-label="Scroll to bottom"
        title="Scroll to bottom"
      >
        <ArrowDown className="w-4 h-4" strokeWidth={2.5} />
      </button>
    </div>
  );
}
