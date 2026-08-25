import type { Metadata } from "next";

import { SiteHeader } from "@/components/SiteHeader";
import { ToolComparison } from "@/components/ToolComparison";
import { comparisonToolIds } from "@/data/toolComparisons";

export const metadata: Metadata = {
  title: "AI 助手与 Agent 对比 | 开启使用 AI 的第一步",
  description: "手动选择两到三个 AI 助手或 Agent，比较定位、入门门槛、图片能力、本地文件、自动化和权限边界。",
};

type ComparePageProps = { searchParams: Promise<{ tools?: string }> };

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const { tools } = await searchParams;
  const allowedToolIds = new Set<string>(comparisonToolIds);
  const initialToolIds = (tools ?? "").split(",").filter((toolId, index, values) => allowedToolIds.has(toolId) && values.indexOf(toolId) === index).slice(0, 3);

  return (
    <main className="site-shell detail-shell" id="top">
      <SiteHeader activePage="compare" />

      <section className="compare-hero">
        <div><span className="eyebrow">面向新手的进阶选择</span><h1>把犹豫的工具放在一起，<br />看清差异再决定</h1></div>
        <p>聚焦 AI 助手与 Agent，不把运行环境、版本管理或基础开发工具混入对比。选择两个工具即可开始，最多同时比较三个。</p>
      </section>

      <ToolComparison initialToolIds={initialToolIds} />

      <footer><span>开启使用 AI 的第一步</span><p>工具能力会随版本变化，对比内容以标注的核验范围为准。</p><a href="#top">回到顶部 ↑</a></footer>
    </main>
  );
}
