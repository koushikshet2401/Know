"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { VIDEO_ADMIN_OVERVIEW_URL } from "@/lib/constants";

export function AdminVideoSection() {
  const isPlaceholder =
    !VIDEO_ADMIN_OVERVIEW_URL ||
    VIDEO_ADMIN_OVERVIEW_URL.includes("PLACEHOLDER");
  const isYouTube = VIDEO_ADMIN_OVERVIEW_URL?.includes("youtube.com/embed");

  return (
    <section className="w-full bg-zinc-50 py-20 md:py-24 border-y border-zinc-200">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* H2 */}
        <h2 className="text-zinc-900 font-bold text-3xl sm:text-4xl tracking-tight">
          See the full dashboard in 2 minutes
        </h2>

        {/* Subtext */}
        <p className="text-zinc-600 mt-4 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          A complete walkthrough — from uploading your first document to
          handling your first live conversation.
        </p>

        {/* Video Container */}
        <div className="mt-12 max-w-4xl mx-auto aspect-video rounded-xl overflow-hidden border border-zinc-200 bg-white shadow-sm group">
          {isPlaceholder ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center select-none">
              <div className="w-20 h-20 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-300">
                <Play className="w-10 h-10 text-zinc-900 fill-zinc-900/10 ml-1" />
              </div>
              <span className="text-zinc-600 text-sm sm:text-base mt-4 font-medium">
                Full dashboard walkthrough — coming soon
              </span>
            </div>
          ) : isYouTube ? (
            <iframe
              src={VIDEO_ADMIN_OVERVIEW_URL}
              title="KnowBridge Admin Dashboard Overview"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <video
              src={VIDEO_ADMIN_OVERVIEW_URL}
              controls
              muted
              playsInline
              className="w-full h-full object-cover bg-black"
            />
          )}
        </div>

        {/* Ghost link */}
        <div className="mt-8">
          <Link
            href="/book-a-demo"
            className="text-zinc-900 hover:text-black hover:underline text-sm font-semibold inline-flex items-center gap-1 group"
          >
            <span>Want a live walkthrough? Book a demo</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
