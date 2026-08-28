import type { Metadata } from "next";

import { GitHubProjectDirectory } from "@/components/GitHubProjectDirectory";
import { ResourceDirectory } from "@/components/ResourceDirectory";
import { ResourceLogo } from "@/components/ResourceLogo";
import { SiteHeader } from "@/components/SiteHeader";
import { aiWebServices, apiPlatforms, networkCheckServices, platformClients } from "@/data/resources";

export const metadata: Metadata = {
  title: "AI 资源导航与常用网站 | 开启使用 AI 的第一步",
  description: "整理平台客户端、网络环境检测、AI 官方对话入口、API 开放平台、精选网站与适合继续探索的 GitHub 开源项目。",
};

export default function ResourcesPage() {
  return (
    <main className="site-shell detail-shell" id="top">
      <SiteHeader activePage="resources" />

      <section className="resource-hero">
        <div><span className="eyebrow">可信入口 · 简明说明</span><h1>常用资源集中找，<br />少在陌生页面里绕路</h1></div>
        <p>这里不做复杂排行榜，只整理适合 AI 入门、创作、设计、开发与学习的官方入口。访问前请核对页面显示的域名。</p>
      </section>

      <nav className="category-jump" aria-label="资源分类快速跳转"><a href="#platform-clients">平台代理客户端</a><a href="#network-checks">网络环境检测</a><a href="#ai-services">AI 官方入口</a><a href="#api-platforms">API 开放平台</a><a href="#featured-sites">精选网站</a><a href="#github-projects">GitHub 项目</a></nav>

      <section className="directory-section" id="platform-clients">
        <div className="directory-heading"><div><span className="section-kicker">按设备选择</span><h2>平台代理客户端</h2></div><p>这里只提供客户端项目或应用商店入口，不提供任何线路、节点或订阅。</p></div>
        <div className="resource-compact-grid">{platformClients.map((resource) => <article className="resource-compact-card" key={resource.id}><ResourceLogo logo={resource.logo} mark={resource.mark} tone={resource.tone} name={resource.name} /><div><h3>{resource.name}</h3><p>{resource.description}</p><div className="resource-tags">{resource.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div><a href={resource.url} target="_blank" rel="noreferrer"><small>{resource.domain}</small><strong>查看官方入口 <span aria-hidden="true">↗</span></strong></a></article>)}</div>
        <aside className="resource-notice github-notice"><span aria-hidden="true">i</span><p><strong>基本使用方式</strong>通常在代理客户端中添加 VPN 服务提供商提供的订阅链接，并选择可用节点后即可使用。具体操作和配置参数请以您的 VPN 服务提供商说明为准。</p></aside>
        <aside className="resource-notice warning"><span aria-hidden="true">!</span><p><strong>下载方式与服务边界</strong>除 Shadowrocket 外，上述开源客户端通常可以在官方 GitHub 仓库的 Releases 板块下载适用于对应设备的安装包。GitHub 在部分网络环境中可以直接访问；若页面加载缓慢，可稍后刷新或重试，并注意核对仓库所有者、版本说明和安装包名称。Shadowrocket 是付费应用，通常需要使用美区 App Store 的 Apple Account 下载；这里指用于 App Store“媒体与购买项目”的账户，并非必须更改设备当前登录 iCloud 的账户。若美区商店链接无法正确打开，请同时检查网络访问条件与 App Store 商店地区，仅改变网络不会自动切换账户地区。代理客户端内展示、推荐或引导购买的任何第三方 VPN 服务均与本站无关，使用或付款前请自行核对服务主体、隐私政策、费用与退款规则。本站仅整理客户端的官方信息与下载入口，不提供、销售或推荐任何网络代理、节点、订阅及线路服务。请遵守所在地法律法规，谨慎辨别第三方服务，切勿向不可信来源付款或提供个人信息。</p></aside>
      </section>

      <section className="directory-section" id="network-checks">
        <div className="directory-heading"><div><span className="section-kicker">访问前自检</span><h2>常用网络环境检测</h2></div><p>检查公开 IP、DNS、WebRTC 与基础风险信号；本站不会读取或保存检测结果。</p></div>
        <div className="resource-compact-grid">{networkCheckServices.map((resource) => <article className="resource-compact-card" key={resource.id}><ResourceLogo logo={resource.logo} mark={resource.mark} tone={resource.tone} name={resource.name} /><div><h3>{resource.name}</h3><p>{resource.description}</p><div className="resource-tags">{resource.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div><a href={resource.url} target="_blank" rel="noreferrer"><small>{resource.domain}</small><strong>开始检测 <span aria-hidden="true">↗</span></strong></a></article>)}</div>
        <aside className="resource-notice safe"><span aria-hidden="true">?</span><p><strong>为什么提供这个板块？</strong>在登录 AI 服务或提交重要数据前，可以先查看公开 IP、DNS 与 WebRTC 等基础信号是否异常，减少因出口频繁变化、定位不一致或意外泄露引发登录验证、访问受限，以及数据暂时无法取回的风险。检测结果仅供排查，不能预测或保证账号状态；这些第三方网站会直接看到您的公开网络信息，使用前请查看其隐私条款。</p></aside>
        <aside className="resource-notice warning"><span aria-hidden="true">!</span><p><strong>Claude 与 Anthropic API 提醒</strong>官方服务仅面向支持地区开放，访问、订阅和 API 使用均应遵守适用地区与服务条款。长期使用时，优先选择本人可控、稳定、来源可信且合规的独享或固定网络出口，避免多人共享或频繁切换。自建网络或购买静态住宅 IP 也不等于账号安全保证；选择服务商前请核对合法资质、隐私政策与退款规则。本站不提供、销售或推荐任何节点、线路及 IP 服务。</p></aside>
      </section>

      <section className="directory-section" id="ai-services">
        <div className="directory-heading"><div><span className="section-kicker">无需安装</span><h2>AI 官方对话入口</h2></div><p>适合基础对话、轻量任务，以及在安装桌面应用前快速体验。</p></div>
        <div className="resource-compact-grid ai-entry-grid">{aiWebServices.map((resource) => <article className="resource-compact-card" key={resource.id}><ResourceLogo logo={resource.logo} mark={resource.mark} tone={resource.tone} name={resource.name} /><div><h3>{resource.name}</h3><p>{resource.description}</p><div className="resource-tags">{resource.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div><a href={resource.url} target="_blank" rel="noreferrer"><small>{resource.domain}</small><strong>开始使用 <span aria-hidden="true">↗</span></strong></a></article>)}</div>
        <aside className="resource-notice safe"><span aria-hidden="true">✓</span><p><strong>账号安全</strong>请以卡片展示的官方域名为准，不要在陌生网站输入账号密码、验证码或其他个人信息。</p></aside>
      </section>

      <section className="directory-section" id="api-platforms">
        <div className="directory-heading"><div><span className="section-kicker">面向开发与接入</span><h2>API 开放平台</h2></div><p>同时收录模型厂商官方平台与有明确官方主体的聚合平台；额度、价格和开放地区请以平台最新说明为准。</p></div>
        <div className="resource-compact-grid">{apiPlatforms.map((resource) => <article className="resource-compact-card" key={resource.id}><ResourceLogo logo={resource.logo} mark={resource.mark} tone={resource.tone} name={resource.name} /><div><h3>{resource.name}</h3><p>{resource.description}</p><div className="resource-tags">{resource.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div><a href={resource.url} target="_blank" rel="noreferrer"><small>{resource.domain}</small><strong>进入开放平台 <span aria-hidden="true">↗</span></strong></a></article>)}</div>
        <aside className="resource-notice github-notice"><span aria-hidden="true">≈</span><p><strong>订阅还是 API？</strong>是否接入或充值 API，应综合考虑访问频率、任务类型、自动化需求与实际用量。若主要是高频人工对话、写作或文件处理，固定订阅通常更省心，费用也更容易预估；若需要程序接入、批量处理或按量调用，API 通常更合适。最终请以各平台当前价格、额度与使用限制为准。</p></aside>
        <aside className="resource-notice warning"><span aria-hidden="true">!</span><p><strong>数据与密钥安全</strong>为了您的数据安全，请勿使用来路不明的 API 中转服务。充值、创建密钥或提交数据前，请核对官方域名、计费规则、隐私政策与数据保留说明；不要把 API Key 发送给陌生人或写入公开代码。</p></aside>
      </section>

      <section className="directory-section" id="featured-sites">
        <div className="directory-heading"><div><span className="section-kicker">按用途浏览</span><h2>精选网站</h2></div><p>只保留简要定位和官方地址；价格、额度、许可与功能变化请以对应网站为准。</p></div>
        <ResourceDirectory />
      </section>

      <section className="directory-section" id="github-projects">
        <div className="directory-heading"><div><span className="section-kicker">开源项目精选</span><h2>从 GitHub 找到可继续探索的工具</h2></div><p>首版只收录仓库来源清晰、用途明确的项目；不展示容易过期的 Star 数。</p></div>
        <GitHubProjectDirectory />
        <aside className="resource-notice github-notice"><span aria-hidden="true">⌘</span><p><strong>使用前检查</strong>开源不代表无需配置或可以任意商用。安装前请阅读仓库 README、许可证、硬件要求与安全说明；涉及人物图像或声音时，应确认素材授权与隐私边界。</p></aside>
      </section>

      <aside className="brand-disclaimer"><strong>收录说明</strong><p>页面中的名称和标志仅用于识别对应服务，权利归各自所有者；收录不代表本站与其存在赞助或合作关系。</p></aside>
    </main>
  );
}
