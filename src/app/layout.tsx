import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/next";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "L.D.Chinh — AI-Native Developer",
  description:
    "Portfolio of L.D.Chinh — an AI-assisted developer building web, mobile and desktop apps, working toward making games with AI.",
  keywords: [
    "AI developer",
    "Next.js",
    "React Native",
    ".NET",
    "game development",
    "Vietnam",
  ],
  openGraph: {
    title: "L.D.Chinh — AI-Native Developer",
    description:
      "Building web, mobile and desktop apps with AI, and making games with AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.variable} antialiased`}
      >
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
