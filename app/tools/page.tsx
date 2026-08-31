import type { Metadata } from "next";

import { BrowserNavigationLink } from "@/components/BrowserNavigationLink";
import { SiteHeader } from "@/components/SiteHeader";
import { ToolLogo } from "@/components/ToolLogo";
import { catalogTools, getToolsByCategory, toolCategories } from "@/data/tools";

export const metadata: Metadata = {
  title: "AI 工具导航与安装入口 | 开启使用 AI 的第一步",
  description: "按桌面应用、本地 Agent、开发环境、配置工具和本地模型分类查找可信的官方入口与中文说明。",
};

export default function ToolsPage() {
  return (
    <main className="site-shell detail-shell tools-page" id="top">
      <SiteHeader activePage="tools" />

      <section className="directory-hero tools-directory-hero">
        <div className="tools-hero-copy">
          <span className="eyebrow">{catalogTools.length} 个已核验入口</span>
          <h1>按目标找到工具，<br />再决定需要哪些环境</h1>
          <p>桌面应用可以直接开始，Agent 与开发工具按需求安装。详情页会说明适用场景、环境依赖与验收方法。</p>
          <nav className="category-jump tools-category-jump" aria-label="工具分类快速跳转">
            {toolCategories.map((category) => <a href={`#${category.id}`} key={category.id}>{category.title}</a>)}
          </nav>
        </div>

        <aside className="tools-hero-index" aria-label="工具选择建议">
          <strong>从与你当前目标最接近的一类开始</strong>
          <div>
            {toolCategories.map((category) => (
              <a href={`#${category.id}`} key={category.id}>
                <span>{category.title}</span>
                <small>{getToolsByCategory(category.id).length} 个工具</small>
                <b aria-hidden="true">↘</b>
              </a>
            ))}
          </div>
        </aside>
      </section>

      {toolCategories.map((category) => {
        const tools = getToolsByCategory(category.id);
        return (
          <section className="directory-section" id={category.id} key={category.id} data-category={category.id}>
            <div className="directory-heading">
              <div>
                <h2>{category.title}</h2>
                <p>{category.description}</p>
              </div>
              <span className="directory-count">{tools.length} 个入口</span>
            </div>
            <div className="directory-grid">
              {tools.map((tool) => (
                <BrowserNavigationLink className={`directory-card ${tool.tone}`} href={`/tools/${tool.id}`} key={tool.id} data-featured={tool.featured ? "true" : "false"}>
                  <div className="directory-card-surface">
                    <div className="directory-card-top"><ToolLogo src={tool.logo} alt={tool.logoAlt} /><span className="tool-badge">{tool.badge}</span></div>
                    <h3>{tool.name}</h3>
                    <p>{tool.description}</p>
                    <div className="tool-meta"><span>{tool.level}</span><span>{tool.system}</span></div>
                    <strong>查看安装与说明 <span aria-hidden="true">→</span></strong>
                  </div>
                </BrowserNavigationLink>
              ))}
            </div>
          </section>
        );
      })}

      <aside className="brand-disclaimer">
        <strong>关于品牌标志</strong>
        <p>页面中的产品名称与标志仅用于识别对应工具，权利归各自所有者；本站不代表与这些品牌存在赞助或合作关系。</p>
      </aside>

    </main>
  );
}
