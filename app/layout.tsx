import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { RetroAudioProvider } from "@/components/retro-audio";
import { SmoothScroll } from "@/components/smooth-scroll";
import { RetroNavbar } from "@/components/retro-navbar";
import ScrollIndicator from "@/components/ScrollIndicator";

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

const pacFont = localFont({
  src: "../public/fonts/pacfont.ttf",
  variable: "--font-pac",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#05020c",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "D³ FEST 2026 | IIIT Bhubaneswar",
  icons: {
    icon: "/assets/logo.png",
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
      className={`${marioFont.variable} ${steveFont.variable} ${pacFont.variable} h-full dark`}
    >
      <body className="min-h-full flex flex-col bg-[#05020c] text-white selection:bg-[#ff7bf5] selection:text-white antialiased overflow-x-hidden">
        <RetroAudioProvider>

          {/* Navigation */}
          <RetroNavbar />

          {/* Main Page Content */}
          <main className="flex-1 w-full">
            {children}
          </main>

          {/* Custom Scroll Indicator */}
          <ScrollIndicator />

        </RetroAudioProvider>
      </body>
    </html>
  );
}