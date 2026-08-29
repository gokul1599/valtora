import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { APP_NAME } from "@/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — Turn an idea into a startup`,
    template: `%s · ${APP_NAME}`,
  },
  description:
    "ForgeAI acts as your AI co-founder — validating your idea, researching the market, designing your MVP, and turning your vision into an executable startup plan.",
  metadataBase: new URL(process.env.APP_URL ?? "https://valtora.vercel.app"),
  openGraph: {
    title: `${APP_NAME} — Turn an idea into a startup`,
    description:
      "Your AI co-founder. Validate the idea, research the market, design the MVP, plan the launch.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{const t=localStorage.getItem("forgeai-theme");const d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark");}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}