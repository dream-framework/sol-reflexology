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

const SITE_URL = process.env.NEXT_PUBLIC_BASE_PATH
  ? `https://dream-framework.github.io${process.env.NEXT_PUBLIC_BASE_PATH}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Reflexology & Holistic Bodywork",
  description:
    "Personalized reflexology in a calm, plant-filled studio. Slow, intentional sessions rooted in traditional practice.",
  keywords: [
    "reflexology",
    "holistic wellness",
    "foot reflexology",
    "bodywork",
    "spa",
    "wellness",
    "self care",
  ],
  icons: {
    icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/logo.svg`,
  },
  openGraph: {
    title: "Reflexology & Holistic Bodywork",
    description:
      "Personalized reflexology in a calm, plant-filled studio. Slow, intentional sessions rooted in traditional practice.",
    type: "website",
    url: SITE_URL,
    images: [{
      url: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/og-cover-light.png`,
      width: 1344,
      height: 768,
      alt: "Reflexology studio",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reflexology & Holistic Bodywork",
    description: "Personalized reflexology in a calm, plant-filled studio.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${cormorant.variable} antialiased bg-background text-foreground font-sans`}
      >
        {children}
        <SonnerToaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "oklch(1 0.003 85)",
              border: "1px solid oklch(0.30 0.028 155 / 12%)",
              color: "oklch(0.27 0.025 155)",
            },
          }}
        />
      </body>
    </html>
  );
}
