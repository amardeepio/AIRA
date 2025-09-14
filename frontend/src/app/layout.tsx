import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Providers } from "./providers";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AIRA - AI-Powered Real Estate Investment",
  description: "Fractional real estate investing powered by AI.",
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
          <Header />
          <main>{children}</main>
        </Providers>
        {/* Vanta.js Scripts */}
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.waves.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}