"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import { HomeGuideLink } from "@/components/HomeGuideLink";

type SitePage = "compare" | "tools" | "resources" | "questions";

const pageLinks: Array<{ id: SitePage; label: string; href: string }> = [
  { id: "compare", label: "工具对比", href: "/compare" },
  { id: "tools", label: "工具导航", href: "/tools" },
  { id: "resources", label: "资源导航", href: "/resources" },
  { id: "questions", label: "常见问题", href: "/questions" },
];

export function SiteHeader({ activePage }: { activePage: SitePage }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavigationId = useId();

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 981px)");
    const closeAtDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };
    desktopQuery.addEventListener("change", closeAtDesktop);
    return () => desktopQuery.removeEventListener("change", closeAtDesktop);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const closeMenu = (event: KeyboardEvent | PointerEvent) => {
      if (event instanceof KeyboardEvent) {
        if (event.key !== "Escape") return;
        setMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };

    document.addEventListener("keydown", closeMenu);
    document.addEventListener("pointerdown", closeMenu);
    return () => {
      document.removeEventListener("keydown", closeMenu);
      document.removeEventListener("pointerdown", closeMenu);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="simple-topbar" aria-label="网站顶部导航" ref={headerRef}>
      <Link className="brand" href="/"><span className="brand-mark" aria-hidden="true">✣</span><span>开启使用 AI 的第一步</span></Link>
      <nav className="simple-desktop-nav" aria-label="主要导航">
        <Link href="/">首页</Link>
        <HomeGuideLink />
        {pageLinks.map((item) => <Link className={activePage === item.id ? "active" : undefined} href={item.href} aria-current={activePage === item.id ? "page" : undefined} key={item.id}>{item.label}</Link>)}
      </nav>
      <button ref={menuButtonRef} className="menu-button" type="button" aria-label={menuOpen ? "关闭导航菜单" : "打开导航菜单"} aria-controls={mobileNavigationId} aria-expanded={menuOpen} onClick={() => setMenuOpen((current) => !current)}>{menuOpen ? "关闭" : "菜单"}</button>
      {menuOpen && <nav className="mobile-nav" id={mobileNavigationId} aria-label="移动端导航">
        <Link href="/" onClick={closeMenu}>首页<span aria-hidden="true">→</span></Link>
        <HomeGuideLink onNavigate={closeMenu} showArrow />
        {pageLinks.map((item) => <Link className={activePage === item.id ? "active" : undefined} href={item.href} aria-current={activePage === item.id ? "page" : undefined} key={item.id} onClick={closeMenu}>{item.label}<span aria-hidden="true">→</span></Link>)}
      </nav>}
    </header>
  );
}
