"use client";

import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import {
  MessageSquare,
  UserCheck,
  BookOpen,
  Settings,
  Users,
  CheckCircle2,
  ArrowRight,
  Globe,
  Copy,
  LayoutDashboard,
  ShieldCheck,
  UploadCloud,
  FileText,
  Clock,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface FeaturePillar {
  id: string;
  tabLabel: string;
  icon: typeof MessageSquare;
  title: string;
  description: string;
  bullets: string[];
  mockup: {
    title: string;
    badge: string;
    renderContent: () => React.ReactNode;
  };
}

export function AdminFeatures() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const prefersReducedMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState(0);

  const pillars: FeaturePillar[] = [
    {
      id: "conversations",
      tabLabel: "Live Conversations",
      icon: MessageSquare,
      title: "Watch every customer conversation in real time",
      description:
        "The moment a visitor opens the chat on your website, it appears in your feed instantly. Watch queries, AI replies, and customer sentiment as it happens.",
      bullets: [
        "Live conversation stream with real-time updates",
        "Instant filtering: AI-handled, escalated, or resolved",
        "Complete message history with timestamps & user metadata",
        "Referrer and page URL tracking for immediate context",
      ],
      mockup: {
        title: "Live Support Feed",
        badge: "Real-Time",
        renderContent: () => (
          <div className="space-y-3 font-sans">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-zinc-900 animate-pulse" />
                <span className="text-xs font-semibold text-zinc-900">3 Active Chats</span>
              </div>
              <span className="text-[11px] text-zinc-500 font-mono">avg response: 0.8s</span>
            </div>

            <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-900">Sarah Jenkins (Acme Corp)</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-900 text-white font-medium">AI Active</span>
              </div>
              <p className="text-xs text-zinc-600 line-clamp-1">
                &quot;Does your Enterprise plan include custom webhook integrations?&quot;
              </p>
              <div className="text-[10px] text-zinc-500 flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                <span>Just now • /pricing page</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-white border border-zinc-200/80 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-900">Rahul Verma</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-200 text-zinc-800 font-medium">Escalated</span>
              </div>
              <p className="text-xs text-zinc-600 line-clamp-1">
                &quot;Need assistance configuring billing GST details for India&quot;
              </p>
              <div className="text-[10px] text-zinc-500 flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                <span>2m ago • Waiting for agent</span>
              </div>
            </div>
          </div>
        ),
      },
    },
    {
      id: "takeover",
      tabLabel: "Agent Takeover",
      icon: UserCheck,
      title: "Take control of any conversation with one click",
      description:
        "When a complex customer request requires human empathy or custom sales quoting, your human agent can step in seamlessly without the user noticing.",
      bullets: [
        "Instant one-click 'Take Over' button from the feed",
        "Full conversation transcript preserved — no repetition needed",
        "Internal agent notes visible only to team members",
        "Hand back to AI or mark resolved with a single action",
      ],
      mockup: {
        title: "Agent Takeover Console",
        badge: "Seamless Handoff",
        renderContent: () => (
          <div className="space-y-3 font-sans">
            <div className="p-2.5 rounded-lg bg-zinc-900 text-white text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-white" />
                <span className="font-semibold">Human Agent Connected</span>
              </div>
              <span className="text-[10px] text-zinc-300 font-mono">Agent: Priya K.</span>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <div className="p-2.5 rounded-lg bg-zinc-100 max-w-[85%] text-zinc-800">
                <p className="font-semibold text-[10px] text-zinc-500 mb-0.5">Visitor</p>
                Can we negotiate pricing for 50,000 monthly conversations?
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-900 text-white max-w-[85%] ml-auto">
                <p className="font-semibold text-[10px] text-zinc-400 mb-0.5">Priya (Support Lead)</p>
                Hi there! Yes, we offer tiered volume discounts. Let me prepare a custom quote for you right now.
              </div>
            </div>
          </div>
        ),
      },
    },
    {
      id: "knowledge",
      tabLabel: "Knowledge Base",
      icon: BookOpen,
      title: "Build your AI's brain from your documents & website",
      description:
        "Upload documentation, PDFs, return policies, and pricing guides, or paste your website URL. Your AI learns exclusively from your content.",
      bullets: [
        "Direct PDF and markdown upload with instant vector indexing",
        "Automated website crawler for recursive documentation indexing",
        "Zero AI hallucinations — bot only cites uploaded sources",
        "Live status indicators for index sync and document freshness",
      ],
      mockup: {
        title: "Document Indexer",
        badge: "Vector Synced",
        renderContent: () => (
          <div className="space-y-3 font-sans">
            <div className="p-3 border-2 border-dashed border-zinc-300 rounded-lg text-center bg-zinc-50 hover:bg-zinc-100/60 transition-colors cursor-pointer">
              <UploadCloud className="w-5 h-5 text-zinc-700 mx-auto mb-1" />
              <p className="text-xs font-semibold text-zinc-900">Drop PDF or documentation here</p>
              <p className="text-[10px] text-zinc-500">Supports PDF, Markdown, DOCX up to 50MB</p>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-md bg-white border border-zinc-200">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-3.5 h-3.5 text-zinc-700 shrink-0" />
                  <span className="font-medium text-zinc-900 truncate">saas-pricing-v3.pdf</span>
                </div>
                <span className="px-1.5 py-0.5 text-[10px] bg-zinc-100 text-zinc-800 rounded font-mono shrink-0">Indexed</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md bg-white border border-zinc-200">
                <div className="flex items-center gap-2 truncate">
                  <Globe className="w-3.5 h-3.5 text-zinc-700 shrink-0" />
                  <span className="font-medium text-zinc-900 truncate">https://docs.acme.com/*</span>
                </div>
                <span className="px-1.5 py-0.5 text-[10px] bg-zinc-100 text-zinc-800 rounded font-mono shrink-0">24 Pages</span>
              </div>
            </div>
          </div>
        ),
      },
    },
    {
      id: "widget",
      tabLabel: "Widget Customiser",
      icon: Settings,
      title: "Customise the chat widget to match your brand",
      description:
        "Change the bot name, greeting, theme color, and escalation behavior directly from the dashboard. Generates a one-line embed snippet.",
      bullets: [
        "Pick exact brand hex colors and custom avatars",
        "Set personalized greeting messages and fallback behaviors",
        "Live interactive preview before pushing changes live",
        "One-click embed script code generator for any CMS or web framework",
      ],
      mockup: {
        title: "Widget Preview & Embed",
        badge: "No-Code",
        renderContent: () => (
          <div className="space-y-3 font-sans">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded bg-zinc-50 border border-zinc-200">
                <span className="text-[10px] text-zinc-500 block">Bot Persona</span>
                <span className="font-semibold text-zinc-900">KnowBridge Assistant</span>
              </div>
              <div className="p-2 rounded bg-zinc-50 border border-zinc-200">
                <span className="text-[10px] text-zinc-500 block">Theme Palette</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-3 h-3 rounded-full bg-zinc-950 inline-block border border-zinc-300" />
                  <span className="font-mono text-[11px] text-zinc-700">#09090B</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded bg-zinc-900 text-white font-mono text-[11px] space-y-1 overflow-x-auto">
              <p className="text-zinc-400 text-[10px] font-sans">One-line embed snippet:</p>
              <code>&lt;script src=&quot;https://cdn.knowbridge.io/widget.js&quot; data-tenant=&quot;kb_live_9a1&quot;&gt;&lt;/script&gt;</code>
            </div>
          </div>
        ),
      },
    },
    {
      id: "agents",
      tabLabel: "Team & Access",
      icon: Users,
      title: "Add your whole support team with role-based access",
      description:
        "Invite support agents, managers, and admins with separate credentials. Each agent sees their assigned queue, while admins retain platform-wide oversight.",
      bullets: [
        "Individual agent accounts with secure JWT authentication",
        "Role-based permission boundaries (Admin vs Support Agent)",
        "Live presence dots showing online agent availability",
        "Team audit logs and conversation resolution metrics",
      ],
      mockup: {
        title: "Team Access Control",
        badge: "RBAC Security",
        renderContent: () => (
          <div className="space-y-2 text-xs font-sans">
            <div className="flex items-center justify-between pb-1 text-[11px] font-semibold text-zinc-500 border-b border-zinc-100">
              <span>Member</span>
              <span>Role</span>
              <span>Status</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-white border border-zinc-200">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[10px] font-bold">
                  AK
                </div>
                <div>
                  <p className="font-semibold text-zinc-900 text-xs">Amit Kumar</p>
                  <p className="text-[10px] text-zinc-500">amit@knowbridge.io</p>
                </div>
              </div>
              <span className="text-[11px] font-medium text-zinc-700">Admin</span>
              <span className="inline-flex items-center gap-1 text-[10px] text-zinc-900 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                Active
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-white border border-zinc-200">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-zinc-200 text-zinc-800 flex items-center justify-center text-[10px] font-bold">
                  PS
                </div>
                <div>
                  <p className="font-semibold text-zinc-900 text-xs">Priya Sharma</p>
                  <p className="text-[10px] text-zinc-500">priya@knowbridge.io</p>
                </div>
              </div>
              <span className="text-[11px] font-medium text-zinc-700">Agent</span>
              <span className="inline-flex items-center gap-1 text-[10px] text-zinc-900 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                Online
              </span>
            </div>
          </div>
        ),
      },
    },
  ];

  const currentPillar = pillars[activeTab];

  return (
    <SectionWrapper className="py-8 sm:py-10 md:py-12 lg:py-16">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
        <Badge className="mb-2.5">Admin Features</Badge>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight leading-tight mb-3">
          Full control from a centralised dashboard.
        </h2>
        <p className="text-sm sm:text-base text-zinc-600 max-w-2xl mx-auto">
          Manage live conversations, train your AI on custom documents, customise your chat widget, and organise your support team — all from one interface.
        </p>
      </div>

      {/* Main Interactive Showcase */}
      <div ref={ref} className="max-w-6xl mx-auto">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none border-b border-zinc-200">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            const isActive = activeTab === idx;
            return (
              <button
                key={pillar.id}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-zinc-900 text-white shadow-xs"
                    : "bg-white text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 border border-zinc-200/80"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-zinc-500"}`} />
                <span>{pillar.tabLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Card */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content (Text & Bullets) */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-700 text-xs font-mono font-medium">
                <span>Panel 0{activeTab + 1}</span>
                <span>•</span>
                <span>{currentPillar.tabLabel}</span>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-900 tracking-tight leading-snug">
                {currentPillar.title}
              </h3>

              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
                {currentPillar.description}
              </p>

              <div className="space-y-2.5 pt-2">
                {currentPillar.bullets.map((bullet, bIdx) => (
                  <div key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-700">
                    <CheckCircle2 className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center gap-3">
                <Button variant="primary" size="sm" asChild>
                  <Link href="/book-a-demo" className="flex items-center gap-1.5">
                    <span>Book Live Demo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
                <Button variant="secondary" size="sm" asChild>
                  <Link href="/admin/login" className="flex items-center gap-1.5">
                    <span>Sign In to Admin</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Content (Dashboard Window Mockup) */}
            <div className="lg:col-span-6">
              <div className="rounded-xl border border-zinc-200/90 bg-white overflow-hidden shadow-sm">
                {/* Window Topbar */}
                <div className="bg-zinc-100/90 px-4 py-2.5 border-b border-zinc-200 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                    <span className="ml-2 text-[11px] font-mono text-zinc-500 font-medium truncate">
                      knowbridge.io/admin/{currentPillar.id}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-200 text-zinc-700 font-semibold">
                    {currentPillar.mockup.badge}
                  </span>
                </div>

                {/* Window Body */}
                <div className="p-4 sm:p-5 bg-white min-h-[260px] flex flex-col justify-center">
                  {currentPillar.mockup.renderContent()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Capabilities Grid */}
        <div className="mt-8 pt-6 border-t border-zinc-200/80">
          <p className="text-center text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">
            Included in every KnowBridge subscription
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {[
              { icon: MessageSquare, label: "Live Feed" },
              { icon: UserCheck, label: "Agent Takeover" },
              { icon: BookOpen, label: "PDF Training" },
              { icon: Globe, label: "Web Crawling" },
              { icon: Settings, label: "Widget Customizer" },
              { icon: Users, label: "Team Accounts" },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white border border-zinc-200/80 text-center flex flex-col items-center justify-center shadow-2xs hover:border-zinc-300 transition-colors"
                >
                  <Icon className="w-4 h-4 text-zinc-800 mb-1.5" />
                  <span className="text-[11px] font-semibold text-zinc-700">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
