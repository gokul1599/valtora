import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "VALTORA — Your AI Co-Founder",
    template: "%s · VALTORA",
  },
  description:
    "Turn an idea into a company. VALTORA is your AI co-founder for validating ideas, understanding markets, designing products, planning technology, and launching with confidence.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--bg)] text-[var(--fg)]">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}