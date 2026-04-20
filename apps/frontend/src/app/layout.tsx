import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "../context/Providers";
import GlobalUI from "@/components/ui/GlobalUI";

export const metadata: Metadata = {
  title: "Casano | India's Last Minute App",
  description:
    "Get groceries, stationery, medicines and more delivered in 15 minutes. Casano — shop cheap from your local Kirana store.",
  keywords:
    "quick commerce, groceries, stationary, pharmacy, instant delivery, India, hyperlocal, kirana",
  openGraph: {
    title: "Casano | India's Last Minute App",
    description: "Delivered from your Kirana store in 15 minutes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <GlobalUI />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
