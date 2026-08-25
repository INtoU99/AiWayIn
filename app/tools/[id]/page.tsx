import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BrowserNavigationLink } from "@/components/BrowserNavigationLink";
import { ResourceLogo } from "@/components/ResourceLogo";
import { SiteHeader } from "@/components/SiteHeader";
import { ToolLogo } from "@/components/ToolLogo";
import { getToolDirectDownloads, networkNoticeToolIds } from "@/data/downloads";
import { getGitHubDifficultyClass, getGitHubProjectLogo, getGitHubProjectUrl, getRelatedGitHubProjects } from "@/data/githubProjects";
import { catalogTools, getTool, getToolCategory } from "@/data/tools";

type ToolPageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return catalogTools.map((tool) => ({ id: tool.id }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { id } = await params;
  const tool = getTool(id);
  if (!tool) return { title: "未找到工具" };
  const title = `${tool.name} 安装与使用说明 | 开启使用 AI 的第一步`;
  const description = tool.searchDescription;
  return {
    title,
    description,
    openGraph: { title, description, images: [] },
    twitter: { card: "summary", title, description, images: [] },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { id } = await params;
  const tool = getTool(id);

  if (!tool) notFound();

  const category = getToolCategory(tool.categoryId);
  const directDownloads = getToolDirectDownloads(tool.id);
  const directDownloadDomains = [...new Set(directDownloads.map((download) => download.sourceDomain))];
  const relatedProjects = getRelatedGitHubProjects(tool.id).slice(0, 4);

  return (
    <main className="site-shell detail-shell">
      <SiteHeader activePage="tools" />

      <nav className="breadcrumb" aria-label="面包屑"><BrowserNavigationLink href="/tools">工具导航</BrowserNavigationLink><span aria-hidden="true">/</span><BrowserNavigationLink href={`/tools#${tool.categoryId}`}>{category?.title ?? "工具分类"}</BrowserNavigationLink><span aria-hidden="true">/</span><span aria-current="page">{tool.shortName}</span></nav>

      <section className={`tool-detail-hero ${tool.tone}`}>
        <div className="detail-logo-column"><ToolLogo src={tool.logo} alt={tool.logoAlt} size="large" /></div>
        <div className="detail-title">
          <div className="detail-badges"><span>{category?.title ?? "工具导航"}</span><span>{tool.level}</span><span>{tool.status}</span></div>
          <h1>{tool.name}</h1>
          <p>{tool.overview}</p>
          <div className="platform-list" aria-label="支持平台">{tool.platforms.map((platform) => <span key={platform}>{platform}</span>)}</div>
        </div>
        <div className="detail-actions">
          <a className="primary-action" href={tool.href} target="_blank" rel="noreferrer">{tool.officialAction}<span aria-hidden="true">↗</span></a>
          {directDownloads.length > 0 && <div className="direct-download-panel"><strong>本站一键下载</strong><div>{directDownloads.map((download) => <a href={`/download/${download.toolId}/${download.platformId}`} key={download.platformId}>{download.label}<span aria-hidden="true">↓</span></a>)}</div><small>安装包由 {directDownloadDomains.join(" / ")} 官方服务器提供 · 核验于 {directDownloads[0].checkedAt}</small></div>}
          {tool.docsHref && <a className="secondary-action" href={tool.docsHref} target="_blank" rel="noreferrer">查看官方文档或源码 <span aria-hidden="true">↗</span></a>}
          {networkNoticeToolIds.has(tool.id) && <p className="network-requirement-note"><span aria-hidden="true">!</span>在下载或访问前请检查您的网络环境。</p>}
          <small>所有下载与访问入口均指向官方来源</small>
        </div>
      </section>

      <section className="detail-grid two-column">
        <article className="detail-panel">
          <span className="section-kicker">适合这些情况</span><h2>为什么选择它</h2>
          <ul className="check-points">{tool.bestFor.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
        <article className="detail-panel soft-panel">
          <span className="section-kicker">安装前确认</span><h2>环境与前置条件</h2>
          <ul className="requirement-list">{tool.requirements.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ul>
        </article>
      </section>

      <section className="detail-section">
        <div className="detail-section-heading"><div><span className="section-kicker">清晰安装</span><h2>三步完成首次安装</h2></div><p>先阅读完整步骤，再打开官方页面操作。</p></div>
        <ol className="installation-steps">{tool.installSteps.map((step, index) => <li key={step}><span>{index + 1}</span><p>{step}</p></li>)}</ol>
      </section>

      <section className="success-panel">
        <div><span className="section-kicker">完成检查</span><h2>看到这些，说明已经可以使用</h2></div>
        <div className="success-list">{tool.successChecks.map((item) => <span key={item}><b aria-hidden="true">✓</b>{item}</span>)}</div>
      </section>

      {relatedProjects.length > 0 && <section className="detail-section related-projects-section">
        <div className="detail-section-heading"><div><span className="section-kicker">继续探索</span><h2>与 {tool.shortName} 相关的开源项目</h2></div><p>从已准备好的基础工具继续出发，了解它能支持哪些实际项目。</p></div>
        <div className="related-project-grid">{relatedProjects.map((project) => <article className="related-project-card" key={project.id}>
          <ResourceLogo logo={getGitHubProjectLogo(project)} mark={project.mark} tone={project.tone} name={project.name} />
          <div><span className={`project-difficulty ${getGitHubDifficultyClass(project.difficulty)}`}>{project.difficulty}</span><h3>{project.name}</h3><p>{project.description}</p></div>
          <a href={getGitHubProjectUrl(project)} target="_blank" rel="noreferrer">查看 GitHub 仓库 <span aria-hidden="true">↗</span></a>
        </article>)}</div>
        <BrowserNavigationLink className="related-resources-link" href="/resources#github-projects">浏览全部 GitHub 项目 <span aria-hidden="true">→</span></BrowserNavigationLink>
      </section>}

      <section className="detail-section safety-detail">
        <div className="detail-section-heading"><div><span className="section-kicker">安全边界</span><h2>安装前必须知道</h2></div><p>工具越能自动执行任务，越需要限制它能访问的范围。</p></div>
        <div className="safety-grid">{tool.safetyNotes.map((item, index) => <article key={item}><span>0{index + 1}</span><p>{item}</p></article>)}</div>
      </section>

      <div className="detail-next"><BrowserNavigationLink href="/tools">← 返回全部工具</BrowserNavigationLink><a href={tool.href} target="_blank" rel="noreferrer">前往官方网站 ↗</a></div>
    </main>
  );
}
