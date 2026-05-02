import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "../context/Providers";
import CustomCursor from "@/components/ui/CustomCursor";
import ScrollProgress from "@/components/ui/ScrollProgress";
import FloatingMarquee from "@/components/ui/FloatingMarquee";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Casano | India's Last Minute App",
  description: "Get groceries, stationery, medicines and more delivered in 15 minutes. Casano — shop cheap from your local Kirana store.",
  keywords: "quick commerce, groceries, stationary, pharmacy, instant delivery, India, Casano",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Casano",
    startupImage: [
      {
        url: "/icons/icon-512x512.png",
        media: "(device-width: 375px) and (device-height: 812px)",
      },
    ],
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
  openGraph: {
    title: "Casano — India's Last Minute App",
    description: "Groceries, stationery, medicines delivered in 15 minutes from your local Kirana store.",
    type: "website",
    locale: "en_IN",
    siteName: "Casano",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#C1492E" },
    { media: "(prefers-color-scheme: dark)", color: "#121110" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <head>
        {/* PWA / iOS meta tags */}
        <link rel="apple-touch-icon" href="/icons/icon-512x512.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Casano" />
        
        {/* Preconnect fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <ServiceWorkerRegistration />
        <ScrollProgress />
        <FloatingMarquee />
        <Providers>
          {children}
          <PWAInstallPrompt />
        </Providers>
      </body>
    </html>
  );
}
