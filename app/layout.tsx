import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const marioFont = localFont({
  src: "../public/fonts/SuperMario256.ttf",
  variable: "--font-mario",
  display: "swap",
});

const steveFont = localFont({
  src: "../public/fonts/Steve.ttf",
  variable: "--font-steve",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "D³ Fest 2026",
  description: "D³ Fest 2026 — Coming Soon",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${marioFont.variable} ${steveFont.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-black">{children}</body>
    </html>
  );
}
