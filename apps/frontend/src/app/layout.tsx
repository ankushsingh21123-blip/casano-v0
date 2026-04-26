import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "../context/Providers";
import CustomCursor from "@/components/ui/CustomCursor";
import ScrollProgress from "@/components/ui/ScrollProgress";
import FloatingMarquee from "@/components/ui/FloatingMarquee";

export const metadata: Metadata = {
  title: "Casano | India's Last Minute App",
  description: "Get groceries, stationery, medicines and more delivered in 15 minutes. Casano — shop cheap from your local Kirana store.",
  keywords: "quick commerce, groceries, stationary, pharmacy, instant delivery, India",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ScrollProgress />
        <FloatingMarquee />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
