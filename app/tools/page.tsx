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
    <main className="site-shell detail-shell" id="top">
      <SiteHeader activePage="tools" />

      <section className="directory-hero">
        <div><span className="eyebrow">{catalogTools.length} 个已核验入口</span><h1>先按目的选工具，<br />不必一次装完所有环境</h1></div>
        <p>桌面应用可以直接开始；Agent 与开发工具按需求安装。每个详情页都会说明适合谁、依赖什么，以及如何判断安装成功。</p>
      </section>

      <nav className="category-jump" aria-label="工具分类快速跳转">
        {toolCategories.map((category) => <a href={`#${category.id}`} key={category.id}>{category.title}</a>)}
      </nav>

      {toolCategories.map((category) => {
        const tools = getToolsByCategory(category.id);
        return (
          <section className="directory-section" id={category.id} key={category.id}>
            <div className="directory-heading">
              <div><span className="section-kicker">{category.eyebrow}</span><h2>{category.title}</h2></div>
              <p>{category.description}</p>
            </div>
            <div className="directory-grid">
              {tools.map((tool) => (
                <BrowserNavigationLink className={`directory-card ${tool.tone}`} href={`/tools/${tool.id}`} key={tool.id}>
                  <div className="directory-card-top"><ToolLogo src={tool.logo} alt={tool.logoAlt} /><span className="tool-badge">{tool.badge}</span></div>
                  <h3>{tool.name}</h3>
                  <p>{tool.description}</p>
                  <div className="tool-meta"><span>{tool.level}</span><span>{tool.system}</span></div>
                  <strong>查看安装与说明 <span aria-hidden="true">→</span></strong>
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

      <footer><span>开启使用 AI 的第一步</span><p>面向中文新手的 AI 工具导航与安装说明。</p><a href="#top">回到顶部 ↑</a></footer>
    </main>
  );
}
