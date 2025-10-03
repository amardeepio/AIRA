import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "./providers";
import Script from "next/script";
import { ChatWidget } from '@/components/chat/ChatWidget';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.airalabs.xyz"),
  title: {
    default: "AIRA - AI-Powered Real Estate Investment",
    template: "%s | AIRA",
  },
  description: "AIRA is a next-generation Real World Asset (RWA) marketplace that makes investing in real estate as simple, liquid, and transparent as trading stocks, powered by AI-driven insights.",
  keywords: ["real estate", "investing", "fractional ownership", "RWA", "AI", "blockchain", "NFT"],
  openGraph: {
    title: "AIRA - AI-Powered Real Estate Investment",
    description: "The new way to own real estate. Fractional, liquid, and transparent.",
    url: "https://www.airalabs.xyz",
    siteName: "AIRA",
    images: [
      {
        url: "/logo/aira.png",
        width: 512,
        height: 512,
        alt: "AIRA Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AIRA - AI-Powered Real Estate Investment",
    description: "The new way to own real estate. Fractional, liquid, and transparent.",
    images: ["/logo/aira.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <ChatWidget />
            <Footer />
          </div>
        </Providers>
        {/* Vanta.js Scripts */}
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.waves.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}