import type { Metadata } from "next";

import { QuestionDirectory } from "@/components/QuestionDirectory";
import { SiteHeader } from "@/components/SiteHeader";
import { questions } from "@/data/questions";

export const metadata: Metadata = {
  title: "AI 新手常见问题与解决指南 | 开启使用 AI 的第一步",
  description: "按下载、环境、账号与 API、工具选择、安全和开源部署六类，整理 AI 新手最常遇到的问题与下一步操作。",
};

export default function QuestionsPage() {
  return (
    <main className="site-shell detail-shell" id="top">
      <SiteHeader activePage="questions" />

      <section className="question-hero">
        <div><span className="eyebrow">六类问题 · {questions.length} 个简明答案</span><h1>遇到问题先别乱改，<br />从现象找到安全的下一步</h1></div>
        <p>这里回答安装、环境、账号、API、权限和开源部署中的共性问题。工具专属步骤仍以详情页和官方文档为准。</p>
      </section>

      <QuestionDirectory />

      <aside className="brand-disclaimer question-disclaimer"><strong>内容边界</strong><p>本站不提供账号交易、代充值、代理线路或共享 API Key；费用、服务地区、模型和产品能力会发生变化，请以卡片链接的官方页面为准。</p></aside>
    </main>
  );
}
