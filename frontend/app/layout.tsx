import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ClientLayoutShell } from "@/components/layout/ClientLayoutShell";
import { SITE_URL } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "KnowBridge — AI-Powered Customer Support & Lead Qualification",
    template: "%s | KnowBridge",
  },
  description:
    "KnowBridge embeds an AI chatbot into your website that answers customer questions instantly — trained on your own documents, connected to your team, and live in under 10 minutes.",
  keywords: [
    "AI Customer Support",
    "AI Chatbot for SaaS",
    "Lead Qualification Chatbot",
    "Website Support Widget",
    "Human Handoff Chatbot",
    "Document Trained AI",
    "Multi-tenant AI Chat",
    "Customer Service Automation",
    "KnowBridge",
  ],
  authors: [{ name: "KnowBridge Team", url: SITE_URL }],
  creator: "KnowBridge",
  publisher: "KnowBridge Inc.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "KnowBridge — AI-Powered Customer Support & Lead Qualification",
    description:
      "Never miss a customer lead again. Embed an AI chatbot trained on your own documents with instant replies and seamless human agent handoff.",
    url: SITE_URL,
    siteName: "KnowBridge",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "KnowBridge AI Customer Support Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KnowBridge — AI-Powered Customer Support & Lead Qualification",
    description:
      "Embed an AI chatbot into your website that answers customer questions instantly. Live in under 10 minutes.",
    creator: "@knowbridge",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "KnowBridge",
      url: SITE_URL,
      logo: `${SITE_URL}/favicon.ico`,
      sameAs: [
        "https://x.com/knowbridge",
        "https://linkedin.com/company/knowbridge",
        "https://github.com/knowbridge",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        email: "hello@knowbridge.io",
        contactType: "customer support",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "KnowBridge",
      publisher: { "@id": `${SITE_URL}/#organization` },
      description:
        "AI customer support chatbot trained on your company documents.",
    },
    {
      "@type": "SoftwareApplication",
      name: "KnowBridge",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web-based",
      offers: {
        "@type": "Offer",
        price: "29.00",
        priceCurrency: "USD",
        priceValidUntil: "2027-12-31",
      },
      description:
        "Embeddable AI customer support chatbot widget with lead qualification and human agent handoff.",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-zinc-900">
        <ClientLayoutShell>{children}</ClientLayoutShell>
      </body>
    </html>
  );
}
