"use client";

import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";

import { BrowserNavigationLink } from "@/components/BrowserNavigationLink";
import { EnvironmentChecker } from "@/components/EnvironmentChecker";
import { PathFinder } from "@/components/PathFinder";
import { ToolLogo } from "@/components/ToolLogo";
import { catalogTools, getToolCategory } from "@/data/tools";
import { matchesSearch } from "@/lib/search";

type SearchItem = { title: string; description: string; keywords: string; href: string; category: string };

const searchItems: SearchItem[] = [
  ...catalogTools.map((tool) => ({ title: tool.name, description: tool.searchDescription, keywords: tool.keywords, href: `/tools/${tool.id}`, category: getToolCategory(tool.categoryId)?.title ?? "工具导航" })),
  { title: "Node.js 环境准备", description: "安装 DeepSeek Harness 前，先确认 Node.js 与 npm 是否可用。", keywords: "node nodejs npm 环境 版本 检测 命令", href: "/tools/nodejs", category: "安装指南" },
];

const starterPaths = [
  { index: "01", icon: "⌁", title: "帮我判断怎么开始", description: "按设备和目标选择路线，不需要先理解专业术语。", action: "1 分钟找到路线", guideMode: "route" as const, tone: "blue" },
  { index: "02", icon: "⌗", title: "查看设备与环境要求", description: "确认系统、Node.js 和必要的软件环境。", action: "开始环境自检", guideMode: "environment" as const, tone: "mint" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [guideMode, setGuideMode] = useState<"route" | "environment">("route");
  const [activeHomeSection, setActiveHomeSection] = useState<"top" | "guides">("top");
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);

  const results = useMemo(() => {
    if (!submittedQuery.trim()) return [];
    return searchItems.filter((item) => matchesSearch(item, submittedQuery));
  }, [submittedQuery]);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 981px)");
    const closeAtDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };
    desktopQuery.addEventListener("change", closeAtDesktop);
    return () => desktopQuery.removeEventListener("change", closeAtDesktop);
  }, []);

  useEffect(() => {
    const updateActiveHomeSection = () => {
      const guides = document.getElementById("guides");
      if (!guides) return;
      setActiveHomeSection(guides.getBoundingClientRect().top <= 140 ? "guides" : "top");
    };

    updateActiveHomeSection();
    window.addEventListener("scroll", updateActiveHomeSection, { passive: true });
    window.addEventListener("resize", updateActiveHomeSection);
    window.addEventListener("hashchange", updateActiveHomeSection);
    return () => {
      window.removeEventListener("scroll", updateActiveHomeSection);
      window.removeEventListener("resize", updateActiveHomeSection);
      window.removeEventListener("hashchange", updateActiveHomeSection);
    };
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

  function revealResults(value: string) {
    const nextQuery = value.trim();
    if (!nextQuery) {
      searchInputRef.current?.focus();
      return;
    }
    setSubmittedQuery(nextQuery);
    window.requestAnimationFrame(() => {
      resultsHeadingRef.current?.focus();
      resultsHeadingRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  function clearSearch() {
    setSubmittedQuery("");
    setQuery("");
    window.requestAnimationFrame(() => searchInputRef.current?.focus());
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    revealResults(query);
  }

  return (
    <main className="site-shell">
      <header className="topbar" aria-label="网站顶部导航" ref={headerRef}>
        <a className="brand" href="#top" aria-label="开启使用 AI 的第一步，返回首页" onClick={() => setActiveHomeSection("top")}><span className="brand-mark" aria-hidden="true">✣</span><span>开启使用 AI 的第一步</span></a>
        <nav className="desktop-nav" aria-label="主要导航">
          <a className={activeHomeSection === "top" ? "active" : undefined} href="#top" aria-current={activeHomeSection === "top" ? "page" : undefined} onClick={() => setActiveHomeSection("top")}>首页</a><a className={activeHomeSection === "guides" ? "active" : undefined} href="#guides" aria-current={activeHomeSection === "guides" ? "page" : undefined} onClick={() => setActiveHomeSection("guides")}>安装指南</a><BrowserNavigationLink href="/compare">工具对比</BrowserNavigationLink><BrowserNavigationLink href="/tools">工具导航</BrowserNavigationLink><BrowserNavigationLink href="/resources">资源导航</BrowserNavigationLink><BrowserNavigationLink href="/questions">常见问题</BrowserNavigationLink>
        </nav>
        <button ref={menuButtonRef} className="menu-button" type="button" aria-label={menuOpen ? "关闭导航菜单" : "打开导航菜单"} aria-controls="mobile-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((current) => !current)}>{menuOpen ? "关闭" : "菜单"}</button>
        {menuOpen && <nav className="mobile-nav" id="mobile-navigation" aria-label="移动端导航">{[["首页", "#top"], ["安装指南", "#guides"], ["工具对比", "/compare"], ["工具导航", "/tools"], ["资源导航", "/resources"], ["常见问题", "/questions"]].map(([label, href]) => href.startsWith("/") ? <BrowserNavigationLink href={href} key={href} onNavigate={() => setMenuOpen(false)}>{label}<span aria-hidden="true">→</span></BrowserNavigationLink> : <a className={href === `#${activeHomeSection}` ? "active" : undefined} href={href} key={href} aria-current={href === `#${activeHomeSection}` ? "page" : undefined} onClick={() => { setActiveHomeSection(href === "#guides" ? "guides" : "top"); setMenuOpen(false); }}>{label}<span aria-hidden="true">→</span></a>)}</nav>}
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span aria-hidden="true">✣</span> 为中文零基础用户准备</div>
          <h1>不会安装、不会配置？<br />从这里迈出使用 AI 的第一步</h1>
          <p className="hero-lead">找到可信的官方入口、清晰的安装方法，以及真正能解决问题的中文说明。</p>
          <form className="search-box" role="search" onSubmit={submitSearch}>
            <span className="search-icon" aria-hidden="true">⌕</span><label className="sr-only" htmlFor="site-search">搜索工具或安装指南</label>
            <input ref={searchInputRef} id="site-search" name="q" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="例如：DeepSeek Harness 怎么安装？" />
            <button type="submit">搜索工具</button>
          </form>
          <div className="popular-searches" role="group" aria-label="热门搜索"><span>热门：</span>{["ChatGPT 桌面版", "Node.js", "Ollama"].map((item) => <button type="button" key={item} onClick={() => { setQuery(item); revealResults(item); }}>{item}</button>)}</div>
        </div>
        <div className="starter-panel" role="group" aria-label="新手入口">
          {starterPaths.map((item) => <a className={`starter-card ${item.tone}`} href="#guides" key={item.index} onClick={() => setGuideMode(item.guideMode)}><span className="starter-icon" aria-hidden="true">{item.icon}</span><span className="starter-content"><strong>{item.title}</strong><small>{item.description}</small><span className="starter-action">{item.action}</span></span><span className="starter-index">{item.index}</span><span className="arrow" aria-hidden="true">→</span></a>)}
        </div>
      </section>

      {submittedQuery && <section className="search-results" id="search-results" aria-live="polite">
        <div className="results-heading"><div><span className="section-kicker">站内搜索</span><h2 ref={resultsHeadingRef} tabIndex={-1}>“{submittedQuery}”的结果</h2></div><button type="button" onClick={clearSearch}>清除</button></div>
        {results.length > 0 ? <div className="result-list">{results.map((item) => <BrowserNavigationLink href={item.href} key={`${item.category}-${item.title}`}><span><small>{item.category}</small><strong>{item.title}</strong><p>{item.description}</p></span><span aria-hidden="true">→</span></BrowserNavigationLink>)}</div> : <div className="empty-result"><strong>暂时没有直接匹配的工具</strong><p>可以尝试只输入工具名，例如“Node.js”“ChatGPT”或“Ollama”。</p></div>}
      </section>}

      <section className="section-block" id="tools">
        <div className="section-heading"><div><span className="section-kicker">官方入口</span><h2>先选择你要使用的工具</h2></div><p>首页展示推荐入口，完整目录按用途分为五个板块。</p></div>
        <div className="tool-grid">{catalogTools.filter((tool) => tool.featured).map((tool) => <article className={`tool-card ${tool.tone}`} key={tool.id}><div className="tool-top"><ToolLogo src={tool.logo} alt={tool.logoAlt} /><span className="tool-badge">{tool.badge}</span></div><h3>{tool.name}</h3><p>{tool.description}</p><small>{tool.system}</small><BrowserNavigationLink href={`/tools/${tool.id}`}>查看安装与说明<span aria-hidden="true">→</span></BrowserNavigationLink></article>)}</div>
        <BrowserNavigationLink className="all-tools-link" href="/tools">浏览全部 {catalogTools.length} 个工具与分类 <span aria-hidden="true">→</span></BrowserNavigationLink>
      </section>

      <section className="section-block" id="guides">
        <div className="section-heading"><div><span className="section-kicker">安装指南</span><h2>从选择路线到确认环境</h2></div><p>先找到合适的工具，再确认设备和必要环境是否已经准备好。</p></div>
        <div className="guide-mode-tabs" role="tablist" aria-label="安装指南功能">
          <button className={guideMode === "route" ? "active" : ""} type="button" role="tab" aria-selected={guideMode === "route"} aria-controls="route-guide-panel" onClick={() => setGuideMode("route")}><span>01</span><strong>入门路线</strong><small>按目标与偏好推荐工具</small></button>
          <button className={guideMode === "environment" ? "active" : ""} type="button" role="tab" aria-selected={guideMode === "environment"} aria-controls="environment-guide-panel" onClick={() => setGuideMode("environment")}><span>02</span><strong>环境自检</strong><small>确认设备与安装前条件</small></button>
        </div>
        <div id={guideMode === "route" ? "route-guide-panel" : "environment-guide-panel"} role="tabpanel">
          {guideMode === "route" ? <PathFinder /> : <EnvironmentChecker />}
        </div>
      </section>

      <footer><span>开启使用 AI 的第一步</span><p>面向中文新手的 AI 工具导航与安装说明。</p><a href="#top">回到顶部 ↑</a></footer>
    </main>
  );
}
