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
    <main className="site-shell detail-shell questions-page" id="top">
      <SiteHeader activePage="questions" />

      <section className="question-hero questions-directory-hero">
        <div className="questions-hero-copy">
          <span className="eyebrow">{questions.length} 个可执行答案</span>
          <h1>遇到问题先别乱改，<br />从现象找到安全的下一步</h1>
          <p>覆盖安装、环境、账号、API、权限和开源部署中的共性问题。具体操作仍以官方说明为准。</p>
        </div>
        <aside className="question-hero-guide" aria-label="阅读建议">
          <strong>先确认现象，再开始修改</strong>
          <div><span>描述</span><p>记下报错文字、所用设备与刚才执行的操作。</p></div>
          <div><span>判断</span><p>区分安装、环境、账号、权限或网络问题。</p></div>
          <div><span>验证</span><p>每次只改变一项，并检查结果是否符合预期。</p></div>
        </aside>
      </section>

      <QuestionDirectory />

      <aside className="brand-disclaimer question-disclaimer"><strong>内容边界</strong><p>本站不提供账号交易、代充值、代理线路或共享 API Key；费用、服务地区、模型和产品能力会发生变化，请以卡片链接的官方页面为准。</p></aside>
    </main>
  );
}
