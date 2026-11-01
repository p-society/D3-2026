"use client";

import { useEffect, useState } from "react";

export default function ScrollIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    const updateScrollIndicator = () => {
      const scrollTop = window.scrollY;
      const documentHeight =
        document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;

      const scrollableHeight = documentHeight - viewportHeight;

      if (scrollableHeight <= 0) {
        setIsScrollable(false);
        setScrollProgress(0);
        return;
      }

      setIsScrollable(true);

      const progress =
        (scrollTop / scrollableHeight) * 100;

      setScrollProgress(
        Math.min(100, Math.max(0, progress))
      );
    };

    updateScrollIndicator();

    window.addEventListener(
      "scroll",
      updateScrollIndicator,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      updateScrollIndicator
    );

    return () => {
      window.removeEventListener(
        "scroll",
        updateScrollIndicator
      );

      window.removeEventListener(
        "resize",
        updateScrollIndicator
      );
    };
  }, []);

  if (!isScrollable) {
    return null;
  }

  return (
    <div
      className="custom-scroll-indicator"
      aria-hidden="true"
    >
      <div className="scroll-indicator-track">
        <div
          className="scroll-indicator-dot"
          style={{
            top: `${scrollProgress}%`,
          }}
        />
      </div>
    </div>
  );
}