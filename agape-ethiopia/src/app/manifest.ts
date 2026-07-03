import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Agape Ethiopia",
    short_name: "Agape",
    description:
      "Beneficiary registration and management system for Agape Ethiopia.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f766e",
    orientation: "portrait",
    lang: "en",
    icons: [
      {
        src: "/agape-logo.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}