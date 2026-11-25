"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  TrendingUp,
  Zap,
  UserCheck,
  LayoutDashboard,
  Code2,
  ShieldCheck,
  Lock,
  Check,
  MessageSquare,
  BookOpen,
  Users,
  Settings,
  Sliders,
  FileText,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { BenefitColor, BenefitItem } from "@/lib/constants";

const iconMap: Record<string, LucideIcon> = {
  TrendingUp,
  Zap,
  UserCheck,
  LayoutDashboard,
  Code2,
  ShieldCheck,
};

interface BenefitCardProps {
  benefit?: BenefitItem;
  id?: string;
  icon?: string;
  headline?: string;
  subheadline?: string;
  description?: string;
  points?: readonly string[] | string[];
  color?: BenefitColor;
  index: number;
  reversed: boolean;
}

export function BenefitCard({
  benefit,
  id: propId,
  icon: propIcon,
  headline: propHeadline,
  subheadline: propSubheadline,
  description: propDescription,
  points: propPoints,
  index,
  reversed,
}: BenefitCardProps) {
  const item = benefit ?? {
    id: propId!,
    icon: propIcon!,
    headline: propHeadline!,
    subheadline: propSubheadline!,
    description: propDescription!,
    points: propPoints!,
  };
  const { id, icon, headline, subheadline, description, points } = item;
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const prefersReducedMotion = useReducedMotion();

  const Icon = iconMap[icon] ?? Zap;

  // Alternating entrance animation
  const textX = prefersReducedMotion ? 0 : reversed ? 40 : -40;
  const visualX = prefersReducedMotion ? 0 : reversed ? -40 : 40;

  return (
    <div
      ref={ref}
      id={id}
      className="py-16 md:py-20 scroll-mt-24"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Text Side */}
        <motion.div
          initial={{ opacity: 0, x: textX }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: textX }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`lg:col-span-6 flex flex-col items-start ${
            reversed ? "lg:order-2" : "lg:order-1"
          }`}
        >
          {/* Index Label */}
          <div className="font-mono text-xs text-zinc-400 uppercase tracking-widest mb-4">
            0{index + 1}
          </div>

          {/* Icon */}
          <div
            className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center mb-5 shadow-2xs"
          >
            <Icon className="w-6 h-6 text-zinc-900" />
          </div>

          {/* Headline & Subheadline */}
          <h2 className="text-zinc-900 font-bold text-2xl sm:text-3xl leading-snug">
            {headline}
          </h2>
          <p className="text-zinc-600 font-medium text-base mt-2">
            {subheadline}
          </p>

          {/* Description */}
          <p className="text-zinc-600 text-sm sm:text-base leading-relaxed mt-4 max-w-md">
            {description}
          </p>

          {/* Points list */}
          <div className="mt-6 space-y-3 w-full max-w-lg">
            {points.map((point, pIdx) => (
              <motion.div
                key={point}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
                animate={
                  isInView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: prefersReducedMotion ? 0 : 8 }
                }
                transition={{
                  duration: 0.4,
                  delay: prefersReducedMotion ? 0 : 0.2 + pIdx * 0.07,
                  ease: "easeOut",
                }}
                className="flex items-start gap-3"
              >
                <div
                  className="w-2 h-2 rounded-full bg-zinc-900 mt-2 shrink-0"
                />
                <span className="text-zinc-700 text-sm leading-relaxed">
                  {point}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Visual Mock Side */}
        <motion.div
          initial={{ opacity: 0, x: visualX }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: visualX }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className={`lg:col-span-6 w-full ${
            reversed ? "lg:order-1" : "lg:order-2"
          }`}
        >
          <div className="w-full rounded-2xl bg-zinc-50 border border-zinc-200 p-6 sm:p-8 shadow-xs relative overflow-hidden">
            {/* Benefit Specific Mock */}
            <div className="relative z-10">
              {id === "never-miss-lead" && <NeverMissLeadMock />}
              {id === "instant-answers" && <InstantAnswersMock />}
              {id === "human-handoff" && <HumanHandoffMock />}
              {id === "admin-panel" && <AdminPanelMock />}
              {id === "one-script" && <OneScriptMock />}
              {id === "data-isolation" && <DataIsolationMock />}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK 1: Never Miss a Lead (Lead Stack Cards)
// ─────────────────────────────────────────────────────────────────────────────
function NeverMissLeadMock() {
  const leads = [
    {
      initials: "JD",
      name: "Jessica Diaz",
      company: "CloudScale Inc.",
      time: "3:14 AM",
      tag: "Qualified",
      tagBg: "bg-zinc-100 text-zinc-900 border-zinc-300",
    },
    {
      initials: "MK",
      name: "Marcus Kim",
      company: "HyperLogic B2B",
      time: "2:41 AM",
      tag: "Hot lead",
      tagBg: "bg-zinc-900 text-white border-zinc-800",
    },
    {
      initials: "AR",
      name: "Alice Rodriguez",
      company: "Apex Payments",
      time: "1:18 AM",
      tag: "New",
      tagBg: "bg-zinc-100 text-zinc-700 border-zinc-200",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Counter Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-zinc-900 animate-pulse" />
          <span className="text-xs font-semibold text-zinc-700">
            Leads collected today
          </span>
        </div>
        <span className="text-xs font-mono font-bold text-zinc-900 bg-zinc-100 px-2.5 py-0.5 rounded-full border border-zinc-200">
          12 captured
        </span>
      </div>

      {/* 3 Staggered Lead Cards */}
      <div className="space-y-3">
        {leads.map((lead, idx) => (
          <motion.div
            key={lead.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.12 }}
            className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-zinc-200 hover:border-zinc-300 shadow-2xs transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-900">
                {lead.initials}
              </div>
              <div>
                <div className="text-sm font-semibold text-zinc-900">
                  {lead.name}
                </div>
                <div className="text-xs text-zinc-500">
                  {lead.company} · <span className="font-mono text-zinc-400">{lead.time}</span>
                </div>
              </div>
            </div>

            <span
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${lead.tagBg}`}
            >
              {lead.tag}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK 2: Instant Answers (Mini Chat Exchange Loop)
// ─────────────────────────────────────────────────────────────────────────────
function InstantAnswersMock() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev >= 2 ? 0 : prev + 1));
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-4 font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-zinc-900" />
          <span className="text-xs font-semibold text-zinc-700">
            RAG Grounded Response
          </span>
        </div>
        <span className="text-[10px] font-mono text-zinc-500">
          Latency: 480ms
        </span>
      </div>

      <div className="space-y-3 min-h-[170px] flex flex-col justify-start">
        {/* Customer Question */}
        <div className="flex justify-end">
          <div className="bg-zinc-900 text-white font-medium text-xs sm:text-sm px-3.5 py-2.5 rounded-2xl rounded-tr-xs max-w-[85%] shadow-xs leading-relaxed">
            What is included in the Pro plan?
          </div>
        </div>

        {/* Bot Typing Indicator or Response */}
        {step === 0 && (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
              <Sparkles className="w-3 h-3 text-zinc-700" />
            </div>
            <div className="bg-white border border-zinc-200 px-3 py-2 rounded-2xl rounded-tl-xs flex items-center gap-1 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" />
            </div>
          </div>
        )}

        {step >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-start gap-2"
          >
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0 mt-1">
                <Sparkles className="w-3 h-3 text-zinc-700" />
              </div>
              <div className="bg-white text-zinc-800 border border-zinc-200 text-xs sm:text-sm px-3.5 py-2.5 rounded-2xl rounded-tl-xs max-w-[88%] leading-relaxed shadow-2xs">
                The Pro plan includes 3 websites, 2,000 conversations per month,
                web crawling, and human handoff support.
              </div>
            </div>

            {/* Source Citation Pill */}
            <div className="pl-7">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 text-[11px] border border-zinc-200 font-mono">
                <FileText className="w-3 h-3 text-zinc-600" />
                <span>Answered from: pricing-guide.pdf</span>
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK 3: Human Agent Handoff (Transfer Moment Loop)
// ─────────────────────────────────────────────────────────────────────────────
function HumanHandoffMock() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStage((prev) => (prev >= 2 ? 0 : prev + 1));
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-4 font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-zinc-900" />
          <span className="text-xs font-semibold text-zinc-700">
            Seamless Agent Takeover
          </span>
        </div>
        <span className="text-[10px] font-mono uppercase text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
          Live Sync
        </span>
      </div>

      <div className="space-y-3 min-h-[170px] flex flex-col justify-start">
        {/* Bot Message */}
        <div className="flex items-start gap-2">
          <div className="w-6 h-6 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0 text-xs text-zinc-900 font-bold">
            AI
          </div>
          <div className="bg-white text-zinc-800 border border-zinc-200 text-xs sm:text-sm px-3.5 py-2.5 rounded-2xl rounded-tl-xs max-w-[85%] leading-relaxed shadow-2xs">
            This seems like something our team can help with better. Connecting you now...
          </div>
        </div>

        {/* Transfer pill appears */}
        {stage >= 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center my-1"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-zinc-100 text-zinc-900 border border-zinc-200 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 animate-pulse" />
              Sarah (Support) has joined
            </span>
          </motion.div>
        )}

        {/* Live Agent Message */}
        {stage >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2"
          >
            <div className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center shrink-0 text-xs font-bold">
              S
            </div>
            <div className="bg-white text-zinc-800 border border-zinc-200 text-xs sm:text-sm px-3.5 py-2.5 rounded-2xl rounded-tl-xs max-w-[85%] leading-relaxed shadow-2xs">
              <div className="text-[10px] text-zinc-500 font-semibold mb-0.5">
                Sarah · Live Agent
              </div>
              Hi! I can see your full conversation. Let me help.
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK 4: Admin Dashboard Sidebar Mock
// ─────────────────────────────────────────────────────────────────────────────
function AdminPanelMock() {
  const navItems = [
    { label: "Conversations", icon: MessageSquare, active: true, badge: "3" },
    { label: "Knowledge Base", icon: BookOpen, active: false },
    { label: "Widget Config", icon: Sliders, active: false },
    { label: "Agents", icon: Users, active: false },
    { label: "Settings", icon: Settings, active: false },
  ];

  return (
    <div className="rounded-xl bg-white border border-zinc-200 p-4 font-sans shadow-2xs">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-200">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-4 h-4 text-zinc-900" />
          <span className="text-xs font-bold text-zinc-900">KnowBridge Admin</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 animate-pulse" />
          <span>Realtime Stream</span>
        </div>
      </div>

      {/* Sidebar Items */}
      <div className="space-y-1.5">
        {navItems.map((item) => {
          const ItemIcon = item.icon;
          return (
            <div
              key={item.label}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                item.active
                  ? "bg-zinc-100 text-zinc-900 border-l-2 border-zinc-900 font-semibold"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ItemIcon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 animate-pulse" />
                  <span className="px-1.5 py-0.5 rounded-full bg-zinc-200 text-zinc-800 font-mono text-[10px] font-semibold">
                    {item.badge}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK 5: One Script Embed Code Snippet
// ─────────────────────────────────────────────────────────────────────────────
function OneScriptMock() {
  const [showLiveCheck, setShowLiveCheck] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowLiveCheck(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-zinc-900" />
          <span className="text-xs font-semibold text-zinc-700">
            One Script Installation
          </span>
        </div>
        <span className="text-[10px] font-mono text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
          Client-Side Safe
        </span>
      </div>

      {/* Code Block with Syntax Coloring */}
      <div className="rounded-lg bg-zinc-900 p-4 font-mono text-xs border border-zinc-800 leading-relaxed overflow-x-auto">
        <div>
          <span className="text-zinc-500">&lt;</span>
          <span className="text-zinc-200 font-medium">div</span>{" "}
          <span className="text-zinc-400">id</span>=
          <span className="text-zinc-300">&quot;knowbridge-chat-root&quot;</span>
          <span className="text-zinc-500">&gt;&lt;/</span>
          <span className="text-zinc-200 font-medium">div</span>
          <span className="text-zinc-500">&gt;</span>
        </div>
        <div>
          <span className="text-zinc-500">&lt;</span>
          <span className="text-zinc-200 font-medium">script</span>
          <span className="text-zinc-500">&gt;</span>
          <span className="text-zinc-400">window.CHAT_CONFIG = &#123; tenantId: </span>
          <span className="text-zinc-200">&quot;acme-123&quot;</span>
          <span className="text-zinc-400">, theme: </span>
          <span className="text-zinc-200">&quot;light&quot;</span>
          <span className="text-zinc-400"> &#125;;</span>
          <span className="text-zinc-500">&lt;/</span>
          <span className="text-zinc-200 font-medium">script</span>
          <span className="text-zinc-500">&gt;</span>
        </div>
        <div>
          <span className="text-zinc-500">&lt;</span>
          <span className="text-zinc-200 font-medium">script</span>{" "}
          <span className="text-zinc-400">src</span>=
          <span className="text-zinc-300">
            &quot;https://cdn.knowbridge.io/widget
            <span className="text-white font-bold">.bundle.js</span>&quot;
          </span>{" "}
          <span className="text-zinc-400">async</span>
          <span className="text-zinc-500">&gt;&lt;/</span>
          <span className="text-zinc-200 font-medium">script</span>
          <span className="text-zinc-500">&gt;</span>
        </div>
      </div>

      {/* Animated Live Checkmark Row */}
      {showLiveCheck && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs font-medium"
        >
          <Check className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={3} />
          <span>Widget is live on your website</span>
        </motion.div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK 6: Data Isolation (3 Tenant Boxes with Dissolving Boundary)
// ─────────────────────────────────────────────────────────────────────────────
function DataIsolationMock() {
  const tenants = [
    { name: "Acme Corp", color: "bg-zinc-900", id: "acme-uuid-1" },
    { name: "BrightStore", color: "bg-zinc-600", id: "bright-uuid-2" },
    { name: "DevTools Inc", color: "bg-zinc-400", id: "devtools-uuid-3" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-zinc-900" />
          <span className="text-xs font-semibold text-zinc-700">
            Multi-Tenant Boundary
          </span>
        </div>
        <span className="text-[10px] font-mono text-zinc-500">
          Strict UUID Scoping
        </span>
      </div>

      {/* 3 Isolated Tenant Boxes */}
      <div className="relative">
        <motion.div
          animate={{ opacity: [0.8, 0.2, 0.8] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -inset-1 border border-dashed border-zinc-300 rounded-xl pointer-events-none -z-0"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10">
          {tenants.map((tenant) => (
            <div
              key={tenant.name}
              className="p-3.5 rounded-xl bg-white border border-zinc-200 flex flex-col items-start gap-2 shadow-2xs"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${tenant.color}`} />
                  <span className="text-xs font-bold text-zinc-900">
                    {tenant.name}
                  </span>
                </div>
                <Lock className="w-3 h-3 text-zinc-400" />
              </div>
              <span className="font-mono text-[10px] text-zinc-400 truncate w-full">
                {tenant.id}
              </span>
              <div className="text-[10px] font-medium text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded-md border border-zinc-200 mt-1">
                Isolated DB
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Caption */}
      <div className="text-center pt-1">
        <p className="text-xs text-zinc-500 font-medium">
          Zero cross-tenant access — by architecture
        </p>
      </div>
    </div>
  );
}
