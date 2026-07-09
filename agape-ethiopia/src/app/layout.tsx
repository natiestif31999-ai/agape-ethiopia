import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LanguageProvider } from "@/components/layout/LanguageProvider";
import { SupabaseProvider } from "@/components/layout/SupabaseProvider";
import ServiceWorker from "@/components/ServiceWorker";
import "./globals.css";

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

  alternates: {
    manifest: "/manifest.webmanifest",
  },

  icons: {
    icon: [
      {
        url: "/app-icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/app-icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],

    shortcut: ["/app-icons/icon-192.png"],

    apple: [
      {
        url: "/app-icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/app-icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
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

  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: siteTitle,
  },

  formatDetection: {
    telephone: false,
  },

  category: "productivity",

  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": siteTitle,
    "theme-color": "#0f766e",
    "msapplication-TileColor": "#0f766e",
    "msapplication-config": "/browserconfig.xml",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
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