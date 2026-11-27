// ─── Site Meta ───────────────────────────────────────────────────────────────
export const SITE_URL = "https://knowbridge.io";
export const CONTACT_EMAIL = "hello@knowbridge.io";
export const VIDEO_URL = "https://www.youtube.com/embed/PLACEHOLDER";

// ─── Navigation ──────────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Why KnowBridge", href: "#why-knowbridge" },
  { label: "What You Get", href: "#what-you-get" },
  { label: "Contact", href: "#contact" },
] as const;

// ─── Features ────────────────────────────────────────────────────────────────
export const FEATURES = [
  {
    icon: "MessageSquare",
    title: "AI Chat Widget",
    description:
      "Embeds on any website with a single script tag. No iframes, no plugins.",
  },
  {
    icon: "BookOpen",
    title: "Document Knowledge Base",
    description:
      "Upload PDFs and docs. The AI answers only from your content.",
  },
  {
    icon: "Globe",
    title: "Web Crawling",
    description:
      "Give the bot your website URL. It reads your pages and learns your product.",
  },
  {
    icon: "Users",
    title: "Human Agent Handoff",
    description:
      "Bot transfers conversations automatically when it cannot answer.",
  },
  {
    icon: "ShieldCheck",
    title: "Multi-Tenant Isolation",
    description:
      "Each business has a fully isolated knowledge base and conversation history.",
  },
  {
    icon: "Zap",
    title: "Instant AI Responses",
    description:
      "Vector search over your documents returns answers in under a second.",
  },
  {
    icon: "LayoutDashboard",
    title: "Admin Dashboard",
    description:
      "Manage conversations, upload documents, and configure the bot in real time.",
  },
  {
    icon: "Filter",
    title: "Lead Qualification",
    description:
      "The bot collects context before escalating — so your team gets warm leads, not cold enquiries.",
  },
] as const;

// ─── How It Works ────────────────────────────────────────────────────────────
export const HOW_IT_WORKS_STEPS = [
  {
    number: "01",
    title: "Add your knowledge",
    description:
      "Upload your product docs, FAQs, pricing pages. Or paste your website URL for web crawling.",
  },
  {
    number: "02",
    title: "Configure your bot",
    description:
      "Set your bot name, greeting message, and escalation behavior from the admin dashboard.",
  },
  {
    number: "03",
    title: "Embed on your site",
    description:
      "Copy one script tag. Paste it into your website body. The widget goes live instantly.",
  },
  {
    number: "04",
    title: "Manage and grow",
    description:
      "Monitor conversations, update knowledge, and have your team jump in whenever needed.",
  },
] as const;

// ─── Pricing ─────────────────────────────────────────────────────────────────
export const PRICING_TIERS = [
  {
    name: "Starter",
    price: "$29/mo (placeholder)",
    period: "",
    description: "1 website, 500 conversations/mo, PDF uploads, basic widget",
    features: [
      "1 website connected",
      "500 AI conversations / month",
      "PDF document uploads",
      "Basic chat widget theme",
      "Email support",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$79/mo (placeholder)",
    period: "",
    description: "3 websites, 2,000 conversations/mo, web crawling, human handoff",
    features: [
      "3 websites connected",
      "2,000 AI conversations / month",
      "Web crawling & doc uploads",
      "Human agent handoff",
      "Custom widget branding",
      "Priority email support",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Business",
    price: "$199/mo (placeholder)",
    period: "",
    description: "10 websites, 10,000 conversations/mo, priority support, multi-agent",
    features: [
      "10 websites connected",
      "10,000 AI conversations / month",
      "Multi-agent routing",
      "Advanced conversation logs",
      "Priority 24/7 support",
      "Dedicated onboarding call",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    name: "Enterprise",
    price: "Custom pricing",
    period: "",
    description: "Unlimited, dedicated support, custom integration, SLA discussion",
    features: [
      "Unlimited websites",
      "Unlimited AI conversations",
      "Dedicated database cluster",
      "Custom integration support",
      "SLA & compliance review",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
] as const;

// ─── FAQ ─────────────────────────────────────────────────────────────────────
export const FAQ_ITEMS = [
  {
    question: "What is KnowBridge?",
    answer:
      "KnowBridge is an AI-powered customer support platform. You upload your product documents or provide your website URL, and it deploys an intelligent chat widget that answers customer questions using your own content.",
  },
  {
    question: "How does the AI know about my product?",
    answer:
      "You upload PDFs, docs, or provide a URL. KnowBridge processes these into a knowledge base. The AI only answers from that knowledge — it never pulls from the open internet.",
  },
  {
    question: "Can I embed it on any website?",
    answer:
      "Yes. KnowBridge works on any website that lets you add a script tag — including React, Next.js, plain HTML, WordPress, Webflow, and Shopify.",
  },
  {
    question: "What happens when the bot cannot answer a question?",
    answer:
      "The bot automatically transfers the conversation to a human agent. The agent can see the full conversation history and pick up without the customer having to repeat themselves.",
  },
  {
    question: "Is my data isolated from other businesses?",
    answer:
      "Yes. KnowBridge uses multi-tenant architecture. Your knowledge base, conversations, and customer data are completely isolated from every other business on the platform.",
  },
  {
    question: "Can I use it on multiple websites?",
    answer:
      "Yes. Depending on your plan, you can connect multiple websites, each with its own widget configuration and knowledge base.",
  },
  {
    question: "How do I get started?",
    answer:
      "Book a demo using the form on this page. We will walk you through the setup and get your first bot live.",
  },
  {
    question: "Do I need a developer to set it up?",
    answer:
      "Adding the widget requires pasting one script tag. For most websites a developer is not needed. The admin dashboard is fully no-code.",
  },
] as const;

// ─── What You Get — Integration Benefits ────────────────────────────────────
export type BenefitColor = "indigo" | "violet" | "green" | "blue";

export interface BenefitItem {
  id: string;
  icon: string;
  headline: string;
  subheadline: string;
  description: string;
  points: string[];
  color: BenefitColor;
}

export const INTEGRATION_BENEFITS: readonly BenefitItem[] = [
  {
    id: "never-miss-lead",
    icon: "TrendingUp",
    headline: "Never miss a lead again",
    subheadline: "Your chatbot qualifies visitors 24/7 — even at 3am.",
    description:
      "Most websites lose leads silently. A visitor lands, has a question, finds no one to ask, and leaves. KnowBridge changes that. The moment someone opens the chat, they get an instant response — no forms, no waiting, no bouncing.",
    points: [
      "Chatbot engages visitors the moment they open the widget",
      "Collects name, email, and use case before escalating",
      "Works 24 hours a day, 7 days a week — no human required",
      "You wake up to qualified leads in your dashboard, not missed visitors",
    ],
    color: "indigo",
  },
  {
    id: "instant-answers",
    icon: "Zap",
    headline: "Customers get instant answers from your own content",
    subheadline: "No generic responses. No hallucinations. Just your knowledge.",
    description:
      "The bot answers only from documents and pages you provide — your product guides, FAQs, pricing, return policies. If you did not write it, the bot does not say it. This means accurate, on-brand answers every single time.",
    points: [
      "Upload your PDFs and docs to train the bot on your business",
      "Give the bot your website URL — it reads and learns your pages",
      "Answers reference your actual content, not the open internet",
      "Update your knowledge base anytime — changes go live immediately",
    ],
    color: "violet",
  },
  {
    id: "human-handoff",
    icon: "UserCheck",
    headline: "Complex questions go straight to your team",
    subheadline: "AI handles the volume. Your team handles what matters.",
    description:
      "When the bot cannot confidently answer, it does not guess. It automatically transfers the conversation to one of your human agents — with the full chat history already visible. Your customer never has to repeat themselves.",
    points: [
      "Bot detects when a question is outside its knowledge",
      "Transfers conversation to a human agent automatically",
      "Agent sees the full chat history before they type a word",
      "Customer experience stays smooth — no drop-off, no frustration",
    ],
    color: "green",
  },
  {
    id: "admin-panel",
    icon: "LayoutDashboard",
    headline: "Full control from a centralised dashboard",
    subheadline: "Manage conversations, knowledge, and your bot — all in one place.",
    description:
      "You get a complete admin panel the moment you integrate KnowBridge. No third-party tools, no extra subscriptions. Upload documents, configure the widget, watch live conversations, and manage your team — from one login.",
    points: [
      "Live conversation feed — see every chat as it happens",
      "Upload and manage documents from the dashboard",
      "Configure bot name, greeting, theme, and behaviour",
      "Add team members and manage agent access",
      "Generate your embed code from the same screen",
    ],
    color: "blue",
  },
  {
    id: "one-script",
    icon: "Code2",
    headline: "Integrated in under 10 minutes",
    subheadline: "One script tag. Any website. Done.",
    description:
      "You do not need a developer team or a week of setup. KnowBridge generates a single script tag from your dashboard. Paste it into your website body. Your AI chatbot goes live immediately — with your branding and your knowledge.",
    points: [
      "Works on any website: React, Next.js, HTML, WordPress, Webflow, Shopify",
      "No iframes, no plugins, no complex configuration",
      "Your Tenant ID is the only thing you need in the snippet",
      "Bot inherits your configured theme and knowledge automatically",
    ],
    color: "indigo",
  },
  {
    id: "data-isolation",
    icon: "ShieldCheck",
    headline: "Your data stays yours — always",
    subheadline:
      "Multi-tenant isolation means no business can ever see another's data.",
    description:
      "KnowBridge uses enterprise-grade multi-tenant architecture. Your knowledge base, your conversations, your customer data — all locked to your account. No other business on the platform can access it. Ever.",
    points: [
      "Every business gets a unique isolated tenant",
      "Vector search is scoped to your documents only",
      "Origin validation ensures only your registered domain can use your bot",
      "No cross-tenant data leakage by architecture — not just by policy",
    ],
    color: "violet",
  },
] as const;

// ─── Admin Panel Showcase ───────────────────────────────────────────────────
export const VIDEO_ADMIN_OVERVIEW_URL =
  "https://www.youtube.com/embed/PLACEHOLDER_ADMIN_OVERVIEW";

export interface AdminPanelFeature {
  id: string;
  title: string;
  description: string;
  bullets: string[];
  videoUrl: string;
  side: "left" | "right";
}

export const ADMIN_PANEL_FEATURES: AdminPanelFeature[] = [
  {
    id: "conversations",
    side: "left",
    title: "Watch every customer conversation in real time",
    description:
      "As soon as a visitor opens the chat widget on your website, it appears in your dashboard instantly. You see every message as it happens.",
    bullets: [
      "See all active and past conversations in one feed",
      "Filter by status: AI-handled, escalated, resolved",
      "View full message history with timestamps",
      "Know which page the customer was on when they started chatting",
    ],
    videoUrl: "PLACEHOLDER",
  },
  {
    id: "takeover",
    side: "right",
    title: "Take control of any conversation with one click",
    description:
      "When the AI cannot answer or a customer needs personal help, your agent joins without the customer having to restart. The transition is invisible to them.",
    bullets: [
      "Click Take Over to join any AI conversation",
      "Customer sees agent name and continues in the same chat",
      "Full conversation context visible — no need to repeat",
      "Mark conversations resolved when done",
    ],
    videoUrl: "PLACEHOLDER",
  },
  {
    id: "knowledge",
    side: "left",
    title: "Build your AI's brain from your own documents",
    description:
      "Upload product documentation, FAQs, pricing guides, return policies — anything your AI should know. Changes take effect immediately.",
    bullets: [
      "Upload PDF files directly from the dashboard",
      "Paste your website URL for automatic web crawling",
      "See which documents are indexed and active",
      "Add, remove, or update documents at any time",
      "No redeployment needed — changes are instant",
    ],
    videoUrl: "PLACEHOLDER",
  },
  {
    id: "widget",
    side: "right",
    title: "Customise the chat widget to match your brand",
    description:
      "The widget on your website is configured entirely from the dashboard. Change the name, colour, greeting, and behaviour without touching code.",
    bullets: [
      "Set bot name and greeting message",
      "Choose widget theme colour",
      "Configure escalation trigger message",
      "Preview widget before going live",
      "Generate and copy your embed code from one screen",
    ],
    videoUrl: "PLACEHOLDER",
  },
  {
    id: "agents",
    side: "left",
    title: "Add your whole support team",
    description:
      "Invite team members to the dashboard. Each agent sees live conversations and can take over from the AI when needed.",
    bullets: [
      "Add agents with individual logins",
      "Agents see only their assigned conversations",
      "Admin controls who has access",
      "Real-time presence — see which agents are online",
    ],
    videoUrl: "PLACEHOLDER",
  },
];

export const ADMIN_CAPABILITY_GRID = [
  { icon: "MessageSquare", label: "Live conversation feed" },
  { icon: "UserCheck", label: "Human agent takeover" },
  { icon: "BookOpen", label: "Document uploads" },
  { icon: "Globe", label: "Web crawling" },
  { icon: "Settings", label: "Widget configuration" },
  { icon: "Copy", label: "Embed code generator" },
  { icon: "Users", label: "Agent management" },
  { icon: "LayoutDashboard", label: "Multi-website switching" },
  { icon: "CheckCircle", label: "Conversation resolution" },
] as const;

export const EMBED_SNIPPET = `<div id="knowbridge-chat-root"></div>
<script>window.CHAT_CONFIG = { tenantId: "your-id", theme: "light" };</script>
<script src="https://cdn.knowbridge.io/widget.js" async></script>`;


