"use client";

import { useEffect, useRef, useState } from "react";

import { BrowserNavigationLink } from "@/components/BrowserNavigationLink";
import { HomeGuideLink } from "@/components/HomeGuideLink";

type SitePage = "compare" | "tools" | "resources" | "questions" | "advanced";

const pageLinks: Array<{ id: SitePage; label: string; href: string }> = [
  { id: "compare", label: "工具对比", href: "/compare" },
  { id: "tools", label: "工具导航", href: "/tools" },
  { id: "resources", label: "资源导航", href: "/resources" },
  { id: "questions", label: "常见问题", href: "/questions" },
  { id: "advanced", label: "进阶计划", href: "/advanced" },
];

export function SiteHeader({ activePage }: { activePage: SitePage }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sentinelRef = useRef<HTMLSpanElement>(null);
  const mobileNavigationId = "site-mobile-navigation";

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 981px)");
    const closeAtDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };
    desktopQuery.addEventListener("change", closeAtDesktop);
    return () => desktopQuery.removeEventListener("change", closeAtDesktop);
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => setHeaderScrolled(!entry.isIntersecting), { threshold: 0 });
    observer.observe(sentinel);
    return () => observer.disconnect();
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
    <>
    <span className="header-scroll-sentinel" ref={sentinelRef} aria-hidden="true" />
    <header className={`simple-topbar${headerScrolled ? " is-scrolled" : ""}`} aria-label="网站顶部导航" ref={headerRef}>
      <BrowserNavigationLink className="brand" href="/"><span className="brand-mark" aria-hidden="true">✣</span><span>开启使用 AI 的第一步</span></BrowserNavigationLink>
      <nav className="simple-desktop-nav" aria-label="主要导航">
        <BrowserNavigationLink href="/">首页</BrowserNavigationLink>
        <HomeGuideLink />
        {pageLinks.map((item) => <BrowserNavigationLink className={activePage === item.id ? "active" : undefined} href={item.href} aria-current={activePage === item.id ? "page" : undefined} key={item.id}>{item.label}</BrowserNavigationLink>)}
      </nav>
      <button ref={menuButtonRef} className="menu-button" type="button" aria-label={menuOpen ? "关闭导航菜单" : "打开导航菜单"} aria-controls={mobileNavigationId} aria-expanded={menuOpen} onClick={() => setMenuOpen((current) => !current)}>{menuOpen ? "关闭" : "菜单"}</button>
      {menuOpen && <nav className="mobile-nav" id={mobileNavigationId} aria-label="移动端导航">
        <BrowserNavigationLink href="/" onNavigate={closeMenu}>首页<span aria-hidden="true">→</span></BrowserNavigationLink>
        <HomeGuideLink onNavigate={closeMenu} showArrow />
        {pageLinks.map((item) => <BrowserNavigationLink className={activePage === item.id ? "active" : undefined} href={item.href} aria-current={activePage === item.id ? "page" : undefined} key={item.id} onNavigate={closeMenu}>{item.label}<span aria-hidden="true">→</span></BrowserNavigationLink>)}
      </nav>}
    </header>
    </>
  );
}
