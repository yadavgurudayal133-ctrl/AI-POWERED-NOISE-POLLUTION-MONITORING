import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Inter as FontSans } from "next/font/google";
import { GeistMono as FontMono } from "geist/font/mono";
import { cn } from '@/lib/utils';

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: 'Silent Sentinel',
  description: 'AI-Powered Noise Pollution Monitoring System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
          "font-sans antialiased",
          fontSans.variable
        )}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
