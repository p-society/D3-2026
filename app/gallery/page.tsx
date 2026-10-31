import fs from "fs";
import path from "path";
import Image from "next/image";
import Link from "next/link";
import BitButton from "@/components/ui/8bit-button";
import { ResponsiveGallery } from "./responsive-gallery";
import type { Product } from "@/lib/products";
import { ArrowLeft } from "lucide-react";

const IMAGE_EXTS = /\.(jpg|jpeg|png|webp|gif|avif)$/i;

function getProducts(): Product[] {
  const dir = path.join(process.cwd(), "public", "gallery");
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => IMAGE_EXTS.test(f))
      .map((f, i) => ({
        id: `gallery-${i}`,
        title: f.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
        image: `/gallery/${f}`,
      }));
  } catch {
    return [];
  }
}

export default function GalleryPage() {
  const products = getProducts();

  return (
    <main className="relative w-full h-[100dvh] overflow-hidden bg-black">

      <div className="absolute left-4 right-4 top-4 z-20 sm:left-6 sm:right-6 sm:top-6">
        <div className="flex items-center justify-between">
          <Image
            src="/d3logo.png"
            alt="D³ Fest 2026"
            width={80}
            height={40}
            className="h-auto w-[120px] object-contain sm:w-[150px]"
            priority
          />

          <BitButton
            asChild
            className="font-[family-name:var(--font-steve)] text-[10px] tracking-widest px-1.5 py-0.25 sm:text-sm sm:px-3 sm:py-0.5"
          >
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              BACK
            </Link>
          </BitButton>
        </div>
      </div>

      <ResponsiveGallery products={products} />
    </main>
  );
}
