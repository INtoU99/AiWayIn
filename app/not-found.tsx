import { BrowserNavigationLink } from "@/components/BrowserNavigationLink";

export default function NotFoundPage() {
  return (
    <main className="site-shell missing-tool">
      <span className="eyebrow">页面未找到</span>
      <h1>这里暂时没有对应的工具</h1>
      <p>链接可能已经更新，也可能输入了不存在的工具名称。</p>
      <div className="detail-next">
        <BrowserNavigationLink href="/tools">返回工具导航</BrowserNavigationLink>
        <BrowserNavigationLink href="/">返回首页</BrowserNavigationLink>
      </div>
    </main>
  );
}
