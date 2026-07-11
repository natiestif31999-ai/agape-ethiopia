import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Agape Ethiopia - Beneficiary Management",
    short_name: "Agape",
    description:
      "Beneficiary registration and management system for Agape Ethiopia. Manage registrations, track equipment distributions, and organize support services.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#ffffff",
    theme_color: "#0f766e",
    lang: "en",
    dir: "ltr",
    
    // Application icons for various sizes
    icons: [
      {
        src: "/app-icons/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        src: "/app-icons/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/app-icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/app-icons/maskable-icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/app-icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/app-icons/maskable-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],

    // Screenshots for installation prompts
    screenshots: [
      {
        src: "/app-icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        form_factor: "wide",
      },
      {
        src: "/app-icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        form_factor: "narrow",
      },
    ],

    // Categories for app stores
    categories: ["productivity", "business"],

    // For future mobile app generation (Capacitor)
    prefer_related_applications: false,

    // Share target for receiving shared content
    share_target: {
      action: "/share",
      method: "POST",
      enctype: "multipart/form-data",
      params: {
        title: "title",
        text: "text",
        url: "url",
        files: [
          {
            name: "file",
            accept: ["image/*", ".pdf"],
          },
        ],
      },
    },
  };
}