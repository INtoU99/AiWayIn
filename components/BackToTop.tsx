"use client";

import { useEffect, useState } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 480);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <button
      className={`back-to-top${visible ? " is-visible" : ""}`}
      type="button"
      onClick={scrollToTop}
      aria-label="返回网页顶部"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      title="返回顶部"
    >
      <span aria-hidden="true">↑</span>
    </button>
  );
}
