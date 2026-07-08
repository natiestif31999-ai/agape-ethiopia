import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LanguageProvider } from "@/components/layout/LanguageProvider";
import { SupabaseProvider } from "@/components/layout/SupabaseProvider";
import "./globals.css";
import ServiceWorker from "@/components/ServiceWorker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Uses your environment variable if available.
// Falls back to your current Vercel deployment.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://agape-ethiopia-navy.vercel.app";

const siteTitle = "Agape Ethiopia";

const siteDescription =
  "Agape Ethiopia Beneficiary Management System for managing registrations, beneficiaries, support services, reporting, and organizational operations.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: `Home | ${siteTitle}`,
    template: `%s | ${siteTitle}`,
  },

  applicationName: siteTitle,

  description: siteDescription,

  keywords: [
    "beneficiary management",
    "Ethiopia",
    "Agape Ethiopia",
    "mobility assistance",
    "wheelchairs",
    "equipment tracking",
    "NGO",
    "non-profit",
  ],

  authors: [
    {
      name: "Agape Ethiopia",
    },
  ],

  creator: "Agape Ethiopia",

  manifest: "/manifest.webmanifest",

  icons: {
    icon: [
      {
        url: "/agape-logo.png",
      },
    ],

    shortcut: "/agape-logo.png",

    apple: [
      {
        url: "/agape-logo.png",
      },
    ],
  },

  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: siteTitle,
    title: siteTitle,
    description: siteDescription,

    images: [
      {
        url: "/final.png",
        width: 1200,
        height: 630,
        alt: "Agape Ethiopia",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/final.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f766e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ServiceWorker />
        
        <LanguageProvider>
          <SupabaseProvider>{children}</SupabaseProvider>
        </LanguageProvider>
        
      </body>
    </html>
  );
}