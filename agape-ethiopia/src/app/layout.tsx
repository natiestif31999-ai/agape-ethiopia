import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agape-ethiopia.vercel.app";
const siteTitle = "Agape Ethiopia";
const siteDescription = "Agape Ethiopia Beneficiary Management System for managing registrations, beneficiaries, support services, reporting, and organizational operations.";

export const metadata: Metadata = {
  title: {
    default: `Dashboard | ${siteTitle}`,
    template: `%s | ${siteTitle}`,
  },
  description: siteDescription,
  applicationName: siteTitle,
  keywords: ["beneficiary management", "Ethiopia", "mobility assistance", "wheelchairs", "equipment tracking"],
  authors: [{ name: "Agape Ethiopia" }],
  creator: "Agape Ethiopia",
  icons: {
    icon: [
      { url: "/agape-logo.png", sizes: "any" },
      { url: "/agape-logo.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/agape-logo.png",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: siteTitle,
    description: siteDescription,
    siteName: siteTitle,
    images: [
      {
        url: `${siteUrl}/agape-logo.png`,
        width: 1200,
        height: 630,
        alt: "Agape Ethiopia Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [`${siteUrl}/agape-logo.png`],
  },
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
  metadataBase: new URL(siteUrl),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/agape-logo.png" sizes="any" />
        <link rel="apple-touch-icon" href="/agape-logo.png" />
        <meta name="theme-color" content="#0f766e" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
