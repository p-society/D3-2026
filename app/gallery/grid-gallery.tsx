"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import type { Product } from "@/lib/products";

function hashString(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function shuffleProducts(products: Product[]) {
  const shuffled = [...products];
  const seed = products.reduce((accumulator, product) => accumulator + hashString(product.id), 0) || 1;
  let current = seed;

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    current = (current * 1664525 + 1013904223) >>> 0;
    const swapIndex = current % (index + 1);
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function splitProducts(products: Product[]) {
  const topLane: Product[] = [];
  const bottomLane: Product[] = [];

  products.forEach((product, index) => {
    if (index % 2 === 0) {
      topLane.push(product);
    } else {
      bottomLane.push(product);
    }
  });

  if (topLane.length === 0) {
    return { topLane: [], bottomLane: [] };
  }

  if (bottomLane.length === 0) {
    bottomLane.push(topLane[0]);
  }

  return { topLane, bottomLane };
}

function preloadImages(products: Product[]) {
  products.forEach((product) => {
    const image = new window.Image();
    image.src = product.image;
  });
}

function ContinuousLane({
  products,
  reverse = false,
}: {
  products: Product[];
  reverse?: boolean;
}) {
  const laneItems = useMemo(() => {
    if (products.length === 0) return [];

    const repeated: Product[] = [];
    while (repeated.length < products.length * 2) {
      repeated.push(...products);
    }

    return repeated.slice(0, products.length * 2);
  }, [products]);

  const innerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const style = window.getComputedStyle(el);
    const animName = style.getPropertyValue("animation-name");
    const animDuration = parseFloat(style.getPropertyValue("animation-duration") || "0");

    // If CSS animation disabled (e.g., prefers-reduced-motion) or not running,
    // provide a lightweight JS fallback to keep the lane scrolling.
    if (!animName || animName === "none" || animDuration === 0) {
      let start: number | null = null;
      const DURATION = 48000; // match CSS 48s
      let frameId: number;

      const tick = (t: number) => {
        if (start === null) start = t;
        const elapsed = (t - start) % DURATION;
        const progress = elapsed / DURATION; // 0 -> 1

        // translate from 0 -> -50% (left) or -50% -> 0 (right)
        const from = reverse ? -50 : 0;
        const to = reverse ? 0 : -50;
        const value = from + (to - from) * progress;

        el.style.transform = `translateX(${value}%)`;
        frameId = requestAnimationFrame(tick);
      };

      frameId = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(frameId);
    }
    return;
  }, [reverse]);

  return (
    <div className="relative flex-1 min-h-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.42)]">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-60" />

      <div
        ref={innerRef}
        className={`absolute inset-0 flex h-full w-max will-change-transform ${reverse ? "lane-scroll-right" : "lane-scroll-left"}`}
      >
        {laneItems.map((product, index) => (
          <div key={`${product.id}-${index}`} className="relative h-full w-[72vw] shrink-0 sm:w-[48vw] md:w-[32vw]">
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 767px) 72vw, (max-width: 1023px) 48vw, 32vw"
              loading="eager"
              fetchPriority="high"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function GridGallery({
  products,
}: {
  products: Product[];
}) {
  const shuffledProducts = useMemo(() => shuffleProducts(products), [products]);
  const { topLane, bottomLane } = useMemo(
    () => splitProducts(shuffledProducts),
    [shuffledProducts]
  );

  useEffect(() => {
    preloadImages(shuffledProducts);
  }, [shuffledProducts]);

  return (
    <div className="h-[100dvh] overflow-hidden bg-black px-4 pb-5 pt-20 sm:px-6 sm:pt-24">
      <div className="mx-auto flex h-full max-w-5xl flex-col gap-4 sm:gap-5">
        {topLane.length > 0 ? (
          <ContinuousLane products={topLane} />
        ) : (
          <div className="flex-1 rounded-2xl border border-white/10 bg-white/5" />
        )}

        {bottomLane.length > 0 ? (
          <ContinuousLane products={bottomLane} reverse />
        ) : (
          <div className="flex-1 rounded-2xl border border-white/10 bg-white/5" />
        )}
      </div>
    </div>
  );
}