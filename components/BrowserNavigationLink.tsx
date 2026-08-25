"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef, MouseEvent } from "react";

type BrowserNavigationLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href" | "onClick"> & {
  href: string;
  onNavigate?: () => void;
};

export function BrowserNavigationLink({ href, onNavigate, ...props }: BrowserNavigationLinkProps) {
  function navigate(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onNavigate?.();
    window.location.assign(href);
  }

  return <Link {...props} href={href} onClick={navigate} />;
}
