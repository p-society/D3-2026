import Image from "next/image";
import Link from "next/link";
import { XIcon } from "lucide-react";
import RetroGrid from "@/components/ui/retro-grid";
import BitButton from "@/components/ui/8bit-button";

const COLORS = [
  "text-[#00BBFE]",
  "text-[#FFCC00]",
  "text-[#FF0103]",
  "text-[#34B900]",
] as const;

const COMING_SOON = "COMING SOON";

function InstagramLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

function LinkedInLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.2 10v5.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="8.2" cy="7.5" r="1" fill="currentColor" />
      <path d="M12.1 15.8V12.7c0-1.3.9-2.2 2.1-2.2 1.2 0 2 .8 2 2.3v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-black">
      <RetroGrid className="fixed inset-0 w-full h-full" />

      <main className="relative z-10 flex flex-1 items-center justify-center px-2 sm:px-4 py-10">
        <div className="flex flex-col items-center gap-10 sm:gap-14">
          <div className="w-[320px] sm:w-120 md:w-165 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
            <Image
              src="/D3logo.png"
              alt="D³ Fest 2026"
              width={600}
              height={300}
              priority
              className="w-full h-auto object-contain"
            />
          </div>

          <h1 className="font-(family-name:--font-mario) text-2xl sm:text-3xl md:text-4xl tracking-wide flex select-none drop-shadow-[0_4px_0_rgba(0,0,0,1)]">
            {COMING_SOON.split("").map((char, index) => {
              if (char === " ") {
                return <span key={index} className="w-4 sm:w-6" aria-hidden="true" />;
              }
              return (
                <span
                  key={index}
                  className={`inline-block ${COLORS[index % COLORS.length]} animate-retro-float`}
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {char}
                </span>
              );
            })}
          </h1>

          <div className="flex flex-col items-center gap-5 sm:gap-6 pt-4">
            <BitButton
              asChild
              aria-label="Go to gallery"
              className="font-(family-name:--font-steve) text-xl sm:text-2xl tracking-widest px-10 py-3"
            >
              <Link href="/gallery">GALLERY</Link>
            </BitButton>

            <BitButton
              asChild
              aria-label="Download brochure"
              variant="secondary"
              className="font-(family-name:--font-steve) text-lg sm:text-xl tracking-widest px-8 py-3"
            >
              <a
                href="https://drive.google.com/file/d/1iyiSNVeNCb1sEuLReG3oIY8hC8bFBZ0u/view"
                target="_blank"
                rel="noreferrer"
              >
                DOWNLOAD BROCHURE
              </a>
            </BitButton>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/10 bg-black/80 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:py-6">
          <div className="flex items-center gap-3">
            <Image
              src="/D3logo.png"
              alt="D³ Fest"
              width={120}
              height={60}
              className="h-auto w-20 sm:w-28 object-contain"
            />
          </div>

          <div className="flex shrink-0 items-center gap-2 text-white/80 sm:gap-3">
            <a
              href="https://instagram.com/d3fest.iiitbh"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="rounded-full border border-white/10 p-2 transition-colors hover:text-[#00BBFE] hover:border-white/25"
            >
              <InstagramLogo className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/company/tech-society-iiitbh/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="rounded-full border border-white/10 p-2 transition-colors hover:text-[#FFCC00] hover:border-white/25"
            >
              <LinkedInLogo className="h-5 w-5" />
            </a>
            <a
              href="https://x.com/techsociiitbh"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
              className="rounded-full border border-white/10 p-2 transition-colors hover:text-[#34B900] hover:border-white/25"
            >
              <XIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
