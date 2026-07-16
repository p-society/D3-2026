"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { Product } from "@/lib/products";

const LazySpiralGallery = dynamic(
  () => import("./spiral-gallery").then((mod) => mod.SpiralGallery),
  { ssr: false }
);

const LazyGridGallery = dynamic(
  () => import("./grid-gallery").then((mod) => mod.GridGallery),
  { ssr: false }
);

export function ResponsiveGallery({
  products,
}: {
  products: Product[];
}) {
  const [isMobile, setIsMobile] = useState<boolean | null>(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 767px)").matches
      : null
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  if (isMobile === null) {
    return null;
  }

  return isMobile ? (
    <LazyGridGallery products={products} />
  ) : (
    <LazySpiralGallery products={products} />
  );
}