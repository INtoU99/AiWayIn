"use client";

import Link from "next/link";
import type { MouseEvent } from "react";

type HomeGuideLinkProps = {
  onNavigate?: () => void;
  showArrow?: boolean;
};

export function HomeGuideLink({ onNavigate, showArrow = false }: HomeGuideLinkProps) {
  function navigateToGuide(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onNavigate?.();
    window.location.assign("/#guides");
  }

  return <Link href="/#guides" onClick={navigateToGuide}>安装指南{showArrow && <span aria-hidden="true">→</span>}</Link>;
}
