import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://solreflexology.com"),
  title: "Sōl — Reflexology & Holistic Bodywork",
  description:
    "A sanctuary for grounding reflexology and holistic bodywork. Slow, intentional sessions rooted in traditional practice and contemporary wellness.",
  keywords: [
    "reflexology",
    "holistic wellness",
    "foot reflexology",
    "bodywork",
    "spa",
    "wellness",
    "self care",
    "meditation",
  ],
  authors: [{ name: "Sōl Reflexology" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Sōl — Reflexology & Holistic Bodywork",
    description:
      "A sanctuary for grounding reflexology and holistic bodywork. Slow, intentional sessions rooted in traditional practice.",
    siteName: "Sōl Reflexology",
    type: "website",
    images: [{ url: "/images/og-cover.png", width: 1344, height: 768, alt: "Sōl Reflexology" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sōl — Reflexology & Holistic Bodywork",
    description: "A sanctuary for grounding reflexology and holistic bodywork.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${inter.variable} ${cormorant.variable} antialiased bg-background text-foreground font-sans`}
      >
        {children}
        <SonnerToaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "oklch(0.21 0.014 150)",
              border: "1px solid oklch(0.96 0.012 90 / 12%)",
              color: "oklch(0.96 0.012 90)",
            },
          }}
        />
      </body>
    </html>
  );
}
