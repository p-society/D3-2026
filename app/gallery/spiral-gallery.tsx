"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/products";

/* ── Tilt card — no links, pure visual ──────────────────────────── */
interface SpiralCardProps {
  product: Product;
  x: number;
  y: number;
  z: number;
  rotY: number;
  opacity: number;
  blurVal: number;
  scale: number;
}

function SpiralCard({ product, x, y, z, rotY, opacity, blurVal, scale }: SpiralCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left - rect.width / 2;
    const my = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: (my / (rect.height / 2)) * -15,
      y: (mx / (rect.width / 2)) * 15,
    });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: "250px",
        height: "140px",
        marginLeft: "-125px",
        marginTop: "-70px",
        transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotY + tilt.y}deg) rotateX(${tilt.x}deg) scale(${scale})`,
        opacity,
        filter: blurVal > 0.5 ? `blur(${blurVal}px)` : "none",
        zIndex: Math.round(z + 2000),
        transition: "transform 0.15s ease-out, filter 0.15s ease-out, opacity 0.15s ease-out",
        transformStyle: "preserve-3d",
      }}
      className="group block select-none overflow-hidden rounded-[18px] border border-white/[0.04] bg-black shadow-[0_30px_70px_rgba(0,0,0,0.85)] transition-[border-color,box-shadow] duration-300 hover:border-white/10 hover:shadow-[0_0_60px_rgba(255,255,255,0.08)]"
    >
      <div className="relative h-full w-full">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="250px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          draggable={false}
          priority
        />
      </div>
    </div>
  );
}

/* ── Main spiral gallery ─────────────────────────────────────────── */
export function SpiralGallery({ products }: { products: Product[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  /* pad / cycle to 28 cards so the helix always looks full */
  const items = React.useMemo<Product[]>(() => {
    if (products.length === 0) return [];
    const out: Product[] = [];
    while (out.length < 28) out.push(...products);
    return out.slice(0, 28);
  }, [products]);

  const totalCards = items.length;

  const [scrollOffset, setScrollOffset] = useState(0);
  const targetOffset = useRef(0);
  const currentOffset = useRef(0);

  const [windowWidth, setWindowWidth] = useState(1200);
  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isMobile = windowWidth < 768;
  const radius = isMobile ? 200 : 400;
  const yStep = isMobile ? 55 : 70;
  const heightRange = yStep * totalCards;
  const minY = -heightRange / 2;
  const numTurns = 3;
  const TILT_RAD = (10 * Math.PI) / 180;
  const yCenterOffset = radius * Math.sin(TILT_RAD);


  useEffect(() => {
    if (totalCards === 0) return;
    let raf: number;
    const lastInteraction = { t: -Infinity };
    const AUTO_DRIFT = 0.45;
    const IDLE_MS = 1600;

    const tick = () => {
      const now = performance.now();
      if (now - lastInteraction.t > IDLE_MS) targetOffset.current += AUTO_DRIFT;
      currentOffset.current += (targetOffset.current - currentOffset.current) * 0.045;
      setScrollOffset(currentOffset.current);
      raf = requestAnimationFrame(tick);
    };
    tick();

    const mark = () => { lastInteraction.t = performance.now(); };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      mark();
      targetOffset.current += e.deltaY * 0.32;
    };

    let startY = 0;
    const onTouchStart = (e: TouchEvent) => { mark(); startY = e.touches[0].clientY; };
    const onTouchMove = (e: TouchEvent) => {
      mark();
      const dy = startY - e.touches[0].clientY;
      startY = e.touches[0].clientY;
      targetOffset.current += dy;
    };

    const el = containerRef.current;
    el?.addEventListener("wheel", onWheel, { passive: false });
    el?.addEventListener("touchstart", onTouchStart, { passive: true });
    el?.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      el?.removeEventListener("wheel", onWheel);
      el?.removeEventListener("touchstart", onTouchStart);
      el?.removeEventListener("touchmove", onTouchMove);
    };
  }, [totalCards]);

  return (
    <div
      ref={containerRef}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-black"
      style={{ perspective: "1100px" }}
    >
      {/* Super Mario corner gradient lights */}
      {/* top-left: Mario red */}
      <div aria-hidden className="pointer-events-none absolute -top-102 -left-62 z-[1] h-[980px] w-[980px] rounded-full opacity-30"
        style={{ background: "radial-gradient(circle, #e52521 0%, transparent 70%)" }} />
      {/* top-right: Luigi green */}
      <div aria-hidden className="pointer-events-none absolute -top-102 -right-62 z-[1] h-[980px] w-[980px] rounded-full opacity-25"
        style={{ background: "radial-gradient(circle, #43b047 0%, transparent 70%)" }} />
      {/* bottom-left: Toad blue */}
      <div aria-hidden className="pointer-events-none absolute -bottom-102 -left-62 z-[1] h-[980px] w-[980px] rounded-full opacity-25"
        style={{ background: "radial-gradient(circle, #049cd8 0%, transparent 70%)" }} />
      {/* bottom-right: coin yellow */}
      <div aria-hidden className="pointer-events-none absolute -bottom-102 -right-62 z-[1] h-[980px] w-[980px] rounded-full opacity-25"
        style={{ background: "radial-gradient(circle, #fbd000 0%, transparent 70%)" }} />

      {totalCards === 0 ? (
        <div className="relative z-10 text-center">
          <p className="font-mono text-xs tracking-widest text-[#ff00ff]/50 uppercase">
            No images found
          </p>
          <p className="mt-2 font-mono text-[10px] text-white/25">
            Add images to <code className="text-[#38bdf8]/60">/public/gallery/</code>
          </p>
        </div>
      ) : (
        /* 3-D spiral wrapper */
        <div
          className="relative h-full w-full pointer-events-none flex items-center justify-center"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateX(10deg) rotateY(-18deg)",
            zIndex: 2,
          }}
        >
          {items.map((product, i) => {
            const baseY = i * yStep;
            const rawY = baseY + scrollOffset;
            const wrappedY =
              ((rawY - minY) % heightRange + heightRange) % heightRange + minY;

            const theta =
              (wrappedY / heightRange) * (Math.PI * 2 * numTurns) + Math.PI / 2;
            const x = radius * Math.cos(theta);
            const z = radius * Math.sin(theta);
            const rotY = -(theta * (180 / Math.PI)) + 90;

            const t = (z + radius) / (2 * radius);
            const eased = t * t * (3 - 2 * t);

            return (
              <SpiralCard
                key={`${product.id}-${i}`}
                product={product}
                x={x}
                y={wrappedY + yCenterOffset}
                z={z}
                rotY={rotY}
                opacity={0.25 + eased * 0.75}
                blurVal={(1 - eased) * 2}
                scale={0.7 + eased * 0.3}
              />
            );
          })}
        </div>
      )}

      {/* scroll hint */}
      <p className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 select-none font-mono text-[9px] uppercase tracking-[0.3em] text-white/25 pointer-events-none">
        Scroll to traverse the spiral
      </p>
    </div>
  );
}
