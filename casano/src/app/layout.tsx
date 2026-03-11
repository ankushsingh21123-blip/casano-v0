import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Casano | India\'s Last Minute App',
  description: 'Groceries delivered in 10 minutes.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#f4f4f4] text-[#121212] antialiased`}>
        {/* Mobile Viewport Wrapper - Centers app on desktop to simulate mobile app */}
        <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-white shadow-2xl relative overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
