import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Didifairy — Premium Human Hair Lagos | Wigs, Bundles & Closures',
  description: 'Shop 100% raw and virgin human hair in Lagos. Wigs, bundles, closures and frontal sets — curated, quality-checked and delivered to your door across Nigeria.',
  keywords: 'human hair Lagos, buy hair Nigeria, virgin hair Lagos, wigs Lagos Nigeria, bundles and closure Lagos, lace frontal Lagos, raw hair Nigeria, hair vendor Lagos',
  openGraph: {
    title: 'Didifairy — Premium Human Hair Lagos',
    description: 'Raw, virgin, unprocessed human hair. Wigs, bundles, closures & frontals delivered across Nigeria. Loved by 500+ customers.',
    url: 'https://didifairy.vercel.app/',
    siteName: 'Didifairy',
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Didifairy — Premium Human Hair Lagos',
    description: 'Raw, virgin, unprocessed human hair delivered across Nigeria.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://didifairy.vercel.app/' },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
