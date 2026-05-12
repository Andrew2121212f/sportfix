import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export const metadata: Metadata = {
  title: {
    default: "SportFix — Live Sports Scores, Odds & Betting",
    template: "%s | SportFix",
  },
  description:
    "Live sports scores, real-time odds and match results. Football, basketball, tennis and 30+ sports. Bet on the action with 1xBet.",
  keywords: ["live scores", "sports", "odds", "betting", "1xbet", "football", "basketball", "tennis"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://sportfix.bet"),
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/icon-192.svg",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    siteName: "SportFix",
    locale: "en_US",
    title: "SportFix — Live Sports Scores, Odds & Betting",
    description: "Real-time scores across 500+ leagues. Compare odds. Bet on 1xBet.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SportFix — Live Sports Scores, Odds & Betting",
    description: "Real-time scores across 500+ leagues. Bet on 1xBet.",
  },
  robots: { index: true, follow: true },
  other: {
    // Тёмно-синий + золото — фирменная палитра SportFix
    "theme-color": "#0a1428",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased overflow-x-hidden`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
