import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import { comparisonProfiles, comparisonToolIds, getComparisonProfile } from "../data/toolComparisons.ts";
import { directDownloads, getDirectDownload, networkNoticeToolIds } from "../data/downloads.ts";
import { getGitHubProjectLogo, getGitHubProjectUrl, getRelatedGitHubProjects, githubProjectCategories, githubProjects } from "../data/githubProjects.ts";
import { getQuestionCategory, questionCategories, questions } from "../data/questions.ts";
import { aiWebServices, apiPlatforms, featuredResources, getResourceCategory, networkCheckServices, platformClients, resourceCategories } from "../data/resources.ts";
import { catalogTools, getTool } from "../data/tools.ts";
import { detectEnvironmentDevice, environmentDevices, getEnvironmentCommandHint, toolSupportsEnvironmentDevice } from "../lib/environmentChecker.ts";
import { recommendTools } from "../lib/pathFinder.ts";
import { matchesSearch, tokenizeQuery } from "../lib/search.ts";

test("自然语言安装问题会提取有效关键词", () => {
  assert.deepEqual(tokenizeQuery("DeepSeek Harness 怎么安装？"), ["deepseek", "harness", "安装"]);
});

test("首页占位符示例能够命中 DeepSeek Harness", () => {
  const harness = catalogTools.find((tool) => tool.id === "deepseek-harness");
  assert.ok(harness);
  assert.equal(
    matchesSearch(
      { title: harness.name, description: harness.searchDescription, keywords: harness.keywords },
      "DeepSeek Harness 怎么安装？",
    ),
    true,
  );
});

test("无关查询不会产生错误匹配", () => {
  const claude = catalogTools.find((tool) => tool.id === "claude-desktop");
  assert.ok(claude);
  assert.equal(
    matchesSearch(
      { title: claude.name, description: claude.searchDescription, keywords: claude.keywords },
      "DeepSeek Harness 安装",
    ),
    false,
  );
});

test("工具目录包含 17 个不重复的工具入口", () => {
  assert.equal(catalogTools.length, 17);
  assert.equal(new Set(catalogTools.map((tool) => tool.id)).size, catalogTools.length);
});

test("跨页安装指南导航保留首页锚点且首页会切换激活标签", () => {
  for (const [file, activePage] of [["app/advanced/page.tsx", "advanced"], ["app/compare/page.tsx", "compare"], ["app/questions/page.tsx", "questions"], ["app/resources/page.tsx", "resources"], ["app/tools/page.tsx", "tools"], ["app/tools/[id]/page.tsx", "tools"]]) {
    const source = readFileSync(join(process.cwd(), file), "utf8");
    assert.match(source, new RegExp(`<SiteHeader activePage="${activePage}" \\/>`), `${file} 应使用统一导航并设置当前页面`);
    assert.doesNotMatch(source, /<Link href="\/#guides">/, `${file} 不应让客户端路由接管跨页锚点`);
  }

  const siteHeaderSource = readFileSync(join(process.cwd(), "components/SiteHeader.tsx"), "utf8");
  assert.match(siteHeaderSource, /<HomeGuideLink \/>/);
  assert.match(siteHeaderSource, /className="menu-button"/);
  assert.match(siteHeaderSource, /className="mobile-nav"/);
  assert.match(siteHeaderSource, /BrowserNavigationLink/);
  for (const href of ["/compare", "/tools", "/resources", "/questions", "/advanced"]) {
    assert.match(siteHeaderSource, new RegExp(`href: "${href}"`));
  }
  const guideLinkSource = readFileSync(join(process.cwd(), "components/HomeGuideLink.tsx"), "utf8");
  assert.match(guideLinkSource, /window\.location\.assign\("\/#guides"\)/);
  const homeSource = readFileSync(join(process.cwd(), "app/page.tsx"), "utf8");
  assert.match(homeSource, /id="guides"/);
  assert.match(homeSource, /activeHomeSection === "guides"/);
  for (const [href, label] of [["/compare", "工具对比"], ["/tools", "工具导航"], ["/resources", "资源导航"], ["/questions", "常见问题"], ["/advanced", "进阶计划"]]) {
    assert.match(homeSource, new RegExp(`<BrowserNavigationLink href="${href}">${label}<\\/BrowserNavigationLink>`), `首页顶部导航应通过浏览器完整跳转到 ${href}`);
  }
  assert.match(homeSource, /className="starter-card advanced-entry" href="\/advanced"/);
  assert.match(homeSource, /工具已经安装好了？/);
  assert.match(homeSource, /试试进阶路线/);
  assert.match(homeSource, /className="home-tool-rail"/);
  assert.doesNotMatch(homeSource, /className="home-pathway-grid"|今天想解决什么问题/);
  const browserNavigationSource = readFileSync(join(process.cwd(), "components/BrowserNavigationLink.tsx"), "utf8");
  assert.match(browserNavigationSource, /window\.location\.assign\(href\)/);
});

test("工具卡片与站内跨页面入口使用完整页面跳转", () => {
  const routedFiles = [
    "app/page.tsx",
    "app/tools/page.tsx",
    "app/tools/[id]/page.tsx",
    "app/not-found.tsx",
    "components/EnvironmentChecker.tsx",
    "components/GitHubProjectDirectory.tsx",
    "components/PathFinder.tsx",
    "components/QuestionDirectory.tsx",
    "components/ToolComparison.tsx",
  ];

  for (const file of routedFiles) {
    const source = readFileSync(join(process.cwd(), file), "utf8");
    assert.doesNotMatch(source, /import Link from "next\/link"/, `${file} 不应再依赖可能卡住的客户端跨页路由`);
    assert.match(source, /BrowserNavigationLink/, `${file} 应使用完整页面跳转入口`);
  }

  const toolsPageSource = readFileSync(join(process.cwd(), "app/tools/page.tsx"), "utf8");
  assert.match(toolsPageSource, /<BrowserNavigationLink className={`directory-card \$\{tool\.tone\}`} href={`\/tools\/\$\{tool\.id\}`}/);
});

test("工具导航使用等尺寸玻璃随笔卡片并提供便利贴式掀起反馈", () => {
  const pageSource = readFileSync(join(process.cwd(), "app/tools/page.tsx"), "utf8");
  const cssSource = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");

  assert.match(pageSource, /className="site-shell detail-shell tools-page"/);
  assert.match(pageSource, /className="tools-hero-index"/);
  assert.match(pageSource, /className="directory-card-surface"/);
  assert.match(cssSource, /\.tools-page \.directory-grid \{\s*grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(cssSource, /\.tools-page \.directory-card \{[\s\S]*?border: 0;[\s\S]*?border-radius: 0;/);
  assert.match(cssSource, /\.directory-card-surface::before,[\s\S]*?\.directory-card-surface::after/);
  assert.match(cssSource, /transform: perspective\(900px\) translate3d\(0, -5px, 0\) rotateX\(1\.7deg\) rotateY\(1\.15deg\) rotateZ\(-\.14deg\)/);
  assert.doesNotMatch(cssSource, /\.tools-page \.directory-section\[data-category="local-ai"\] \.directory-card \{\s*grid-column: 1 \/ -1/);
  assert.match(cssSource, /@media \(max-width: 760px\)[\s\S]*?\.tools-page \.directory-grid \{\s*grid-template-columns: 1fr/);
});

test("全部工具详情页沿用海玻璃层级与无外框随笔卡片", () => {
  const pageSource = readFileSync(join(process.cwd(), "app/tools/[id]/page.tsx"), "utf8");
  const cssSource = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");

  assert.match(pageSource, /className="site-shell detail-shell tool-detail-page"/);
  assert.ok((pageSource.match(/detail-note-card/g) ?? []).length >= 6);
  assert.doesNotMatch(pageSource, /directDownloadDomains|核验于/);
  assert.match(cssSource, /\.detail-note-card \{[\s\S]*?border: 0;[\s\S]*?border-radius: 0;/);
  assert.match(cssSource, /\.tool-detail-page \.detail-grid \.detail-panel \{[\s\S]*?rgba\(249, 253, 251, \.28\)/);
  assert.match(cssSource, /\.tool-detail-page \.installation-steps li \{[\s\S]*?rgba\(249, 253, 251, \.27\)/);
  assert.match(cssSource, /\.detail-note-card::before[\s\S]*?clip-path:/);
  assert.match(cssSource, /\.detail-note-card:hover,[\s\S]*?transform: perspective\(900px\) translate3d\(0, -5px, 0\)/);
  assert.match(cssSource, /\.tool-detail-page \.success-panel \{[\s\S]*?background: rgba\(235, 247, 242, \.5\)/);
  assert.match(cssSource, /@media \(hover: none\)[\s\S]*?\.detail-note-card:hover,[\s\S]*?transform: none/);
});

test("资源导航保留分类效率并沿用等高玻璃随笔卡片", () => {
  const pageSource = readFileSync(join(process.cwd(), "app/resources/page.tsx"), "utf8");
  const directorySource = readFileSync(join(process.cwd(), "components/ResourceDirectory.tsx"), "utf8");
  const githubSource = readFileSync(join(process.cwd(), "components/GitHubProjectDirectory.tsx"), "utf8");
  const cssSource = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");

  assert.match(pageSource, /className="site-shell detail-shell resources-page"/);
  assert.match(pageSource, /className="resource-hero-map"/);
  assert.ok((pageSource.match(/resource-note-card/g) ?? []).length >= 4);
  assert.match(directorySource, /resource-site-card resource-note-card/);
  assert.match(githubSource, /github-project-card resource-note-card/);
  assert.match(cssSource, /\.resources-page \.resource-note-card \{[\s\S]*?border: 0;[\s\S]*?border-radius: 0;/);
  assert.match(cssSource, /\.resources-page \.resource-note-card::before[\s\S]*?clip-path:/);
  assert.match(cssSource, /\.resources-page \.resource-note-card:hover,[\s\S]*?transform: perspective\(900px\) translate3d\(0, -5px, 0\)/);
  assert.match(cssSource, /\.resources-page \.resource-compact-grid,[\s\S]*?grid-auto-rows: 1fr/);
  assert.match(cssSource, /\.resources-page \.github-project-card \{\s*min-height: 278px;/);
  assert.doesNotMatch(cssSource, /\.resources-page \.github-project-card \{\s*min-height: 350px;/);
  assert.match(cssSource, /@media \(hover: none\)[\s\S]*?\.resources-page \.resource-note-card:hover,[\s\S]*?transform: none/);
});

test("常见问题页使用直接搜索与无外框玻璃问答列表", () => {
  const pageSource = readFileSync(join(process.cwd(), "app/questions/page.tsx"), "utf8");
  const directorySource = readFileSync(join(process.cwd(), "components/QuestionDirectory.tsx"), "utf8");
  const cssSource = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");

  assert.match(pageSource, /className="site-shell detail-shell questions-page"/);
  assert.match(pageSource, /className="question-hero-guide"/);
  assert.doesNotMatch(pageSource, /question-hero-map|category-jump/);
  assert.doesNotMatch(directorySource, /question-featured|question-category-summary|revealQuestion/);
  assert.match(directorySource, /className="question-controls"/);
  assert.match(directorySource, /className="question-list"/);
  assert.match(cssSource, /\.questions-page \.question-list article \{[\s\S]*?border: 0;[\s\S]*?border-radius: 0;/);
  assert.match(cssSource, /\.questions-page \.question-list article::before[\s\S]*?clip-path:/);
  assert.match(cssSource, /@media \(hover: none\)[\s\S]*?\.questions-page \.question-list article:not\(\.expanded\):hover,[\s\S]*?transform: none/);
  assert.match(cssSource, /@media \(prefers-reduced-transparency: reduce\)[\s\S]*?\.questions-page \.question-list article/);
});

test("进阶计划使用四个可折叠方向并提供跨形态应用框架", () => {
  const source = readFileSync(join(process.cwd(), "app/advanced/page.tsx"), "utf8");
  assert.match(source, /<details className=\{`advanced-direction-card/);
  assert.doesNotMatch(source, /open=\{/);
  assert.match(source, /先理解骨架，不必先学完理论/);
  assert.equal((source.match(/index: "0[1-4]"/g) ?? []).length, 8);
  assert.match(source, /\{direction\.index\}/);
  assert.match(source, /\{path\.index\}/);
  assert.doesNotMatch(source, /direction\.mark|path\.mark/);
  assert.match(source, /AI 应用构建与设计/);
  assert.doesNotMatch(source, /AI 设计与多模态/);
  assert.match(source, /产品形态与运行环境/);
  assert.match(source, /语言、运行时与版本/);
  assert.match(source, /框架、平台接口与依赖/);
  assert.match(source, /输入输出、数据与状态/);
  assert.match(source, /结构边界与质量要求/);
  assert.match(source, /界面与交互（按需）/);
  assert.match(source, /桌面轻应用、命令行工具、浏览器扩展还是宿主软件插件/);
  assert.match(source, /完成后检查/);
  assert.match(source, /从零构建原型/);
  assert.match(source, /目标 → 范围 → 输入输出 → 异常情况 → 验收标准/);
  assert.match(source, /运行 → 功能检查 → 异常测试 → 构建或打包 → 目标环境复查/);
  assert.doesNotMatch(source, /手机端检查/);
  assert.equal((source.match(/className="advanced-code-lesson-card"/g) ?? []).length, 20);
  assert.match(source, /className="advanced-code-starter-horizontal"/);
  assert.match(source, /<strong>可以先从这里开始<\/strong>/);
  assert.match(source, /<strong>先说明项目条件，AI 输出才更规范<\/strong>/);
  assert.match(source, /<strong>应用构建并非以页面生成为终点<\/strong>/);
  assert.match(source, /<strong>建立可复用的协作路径<\/strong>/);
  assert.match(source, /保持良好的习惯，是提升效率的高级途径/);
  assert.match(source, /创建精简的 AGENTS\.md/);
  assert.match(source, /帮我写一个任务管理工具/);
  assert.match(source, /帮我写一个番茄钟工具/);
  assert.match(source, /状态变化和完成条件。例如：/);
  assert.match(source, /把 AI 变成与你共同学习和解决问题的伙伴/);
  assert.match(source, /继续探索，你也许会掌握以下能力/);
  assert.match(source, /Prompt Engineering（提示词工程）/);
  assert.match(source, /自然语言编程（Vibe Coding）/);
  assert.match(source, /结构化信息检索/);
  assert.match(source, /工作流编排（Orchestration）/);
  assert.equal((source.match(/<strong>Tips<\/strong>/g) ?? []).length, 1);
  assert.match(source, /重要知识、事实与结论仍然需要查证/);
  assert.match(source, /祝你能在擅长的领域中发光发热，无限进步/);

  const cssSource = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");
  assert.match(cssSource, /\.advanced-page \.advanced-growth-closing \{[\s\S]*?color: var\(--brand\);[\s\S]*?border-top: 0;[\s\S]*?font-size: 16px;[\s\S]*?font-style: italic;[\s\S]*?text-align: center;/);
});

test("进阶计划统一教学层级并保留四个功能预览窗格", () => {
  const pageSource = readFileSync(join(process.cwd(), "app/advanced/page.tsx"), "utf8");
  const cssSource = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");
  const componentFiles = [
    "components/AdvancedPracticeLab.tsx",
    "components/OfficeResearchLab.tsx",
    "components/ContentCreationLab.tsx",
    "components/AgentAutomationLab.tsx",
  ];

  assert.match(pageSource, /className="site-shell detail-shell advanced-page"/);
  assert.match(cssSource, /\.advanced-page \.advanced-direction-card,[\s\S]*?border: 0;[\s\S]*?border-radius: 0;/);
  assert.match(cssSource, /\.advanced-page \.advanced-introduction::before,[\s\S]*?clip-path:/);
  assert.match(cssSource, /\.advanced-page :is\(\.advanced-practice-lab, \.office-research-lab, \.content-creation-lab, \.agent-automation-lab\)/);
  assert.match(cssSource, /\.advanced-page \.advanced-direction-card:not\(\[open\]\):focus-within/);
  assert.doesNotMatch(cssSource, /\.advanced-page \.advanced-direction-card:focus-within/);
  assert.match(cssSource, /@media \(hover: none\)[\s\S]*?\.advanced-page \.advanced-direction-card:not\(\[open\]\):hover,[\s\S]*?transform: none/);
  assert.match(cssSource, /@media \(prefers-reduced-transparency: reduce\)[\s\S]*?\.advanced-page \.advanced-direction-card/);

  for (const file of ["app/advanced/page.tsx", ...componentFiles]) {
    const source = readFileSync(join(process.cwd(), file), "utf8");
    assert.doesNotMatch(source, /[—–]/, `${file} 不应包含长破折号`);
  }
});

test("办公与研究方向提供三种差异化交付和完整教学边界", () => {
  const pageSource = readFileSync(join(process.cwd(), "app/advanced/page.tsx"), "utf8");
  const labSource = readFileSync(join(process.cwd(), "components/OfficeResearchLab.tsx"), "utf8");

  assert.match(pageSource, /import \{ OfficeResearchLab \}/);
  assert.match(pageSource, /direction\.id === "office"/);
  assert.match(pageSource, /<OfficeResearchLab \/>/);
  assert.match(pageSource, /任务与交付目标/);
  assert.match(pageSource, /来源与证据等级/);
  assert.match(pageSource, /上传前先脱敏/);
  assert.match(pageSource, /不要毫无戒备地上传身份证件、账号密码、财务信息、客户资料、商业机密、API Key/);
  assert.match(pageSource, /办公与研究不只是总结一篇文章/);
  assert.match(pageSource, /背景与用途 → 输入资料 → 处理任务/);

  assert.equal((labSource.match(/id: "(research|meeting|spreadsheet)"/g) ?? []).length, 3);
  assert.match(labSource, /mode: "file"/);
  assert.match(labSource, /mode: "inline"/);
  assert.match(labSource, /mode: "table"/);
  assert.match(labSource, /多来源研究简报/);
  assert.match(labSource, /会议记录整理/);
  assert.match(labSource, /表格清理与分析/);
  assert.match(labSource, /预设数据 · 无上传 · 无外部请求/);
  assert.match(labSource, /FileTypeIcon/);
  assert.match(labSource, /<svg viewBox="0 0 36 42"/);
  assert.match(labSource, /研究简报_v1\.docx/);
  assert.match(labSource, /活动报名表_清理结果\.xlsx/);
  assert.match(labSource, /07 · 项目验收清单/);
  assert.match(labSource, /08 · 常见问题与边界/);
  assert.match(labSource, /09 · 下一步升级/);
  assert.match(labSource, /文件卡片用于表现办公交付流程/);
  assert.doesNotMatch(labSource, /继续调整|第二轮|revision/i);
  assert.doesNotMatch(labSource, /fetch\(|https?:\/\//);
});

test("内容创作方向使用三个单次生成模板交付不同媒体成果", () => {
  const pageSource = readFileSync(join(process.cwd(), "app/advanced/page.tsx"), "utf8");
  const labSource = readFileSync(join(process.cwd(), "components/ContentCreationLab.tsx"), "utf8");

  assert.match(pageSource, /import \{ ContentCreationLab \}/);
  assert.match(pageSource, /direction\.id === "content"/);
  assert.match(pageSource, /<ContentCreationLab \/>/);
  assert.match(pageSource, /先写一份内容创作简报/);
  assert.match(pageSource, /AI 写文章只是内容创作的一环/);
  assert.match(pageSource, /素材、版权与授权/);
  assert.match(pageSource, /创作简报结构：目标 → 受众 → 核心信息/);
  assert.match(pageSource, /不要未经允许克隆声音或制作误导性内容/);

  assert.equal((labSource.match(/id: "(article|social|video)"/g) ?? []).length, 3);
  assert.match(labSource, /文章与文案编辑/);
  assert.match(labSource, /社交媒体图文包/);
  assert.match(labSource, /短视频创作工作流/);
  assert.match(labSource, /单次创作演示 · 非实时 AI/);
  assert.match(labSource, /内容稿 · 可继续编辑/);
  assert.match(labSource, /content-cover-canvas/);
  assert.match(labSource, /content-storyboard-grid/);
  assert.match(labSource, /content-video-timeline/);
  assert.match(labSource, /07 · 项目验收清单/);
  assert.match(labSource, /08 · 常见问题与边界/);
  assert.match(labSource, /09 · 下一步建议/);
  assert.doesNotMatch(labSource, /继续调整|第二轮|revision/i);
  assert.doesNotMatch(labSource, /fetch\(|https?:\/\//);
});

test("Agent 与自动化方向从单次可靠运行演示三种重复流程", () => {
  const pageSource = readFileSync(join(process.cwd(), "app/advanced/page.tsx"), "utf8");
  const labSource = readFileSync(join(process.cwd(), "components/AgentAutomationLab.tsx"), "utf8");

  assert.match(pageSource, /import \{ AgentAutomationLab \}/);
  assert.match(pageSource, /direction\.id === "agent"/);
  assert.match(pageSource, /<AgentAutomationLab \/>/);
  assert.match(pageSource, /自动化之前，先把流程手动跑通/);
  assert.match(pageSource, /Skill、MCP 与工具选择/);
  assert.match(pageSource, /状态、去重与重复运行/);
  assert.match(pageSource, /手动跑通 → 写成步骤 → 限定权限 → 单次执行/);
  assert.match(pageSource, /不绕过登录、验证和访问限制/);
  assert.match(pageSource, /网页关闭后不会自动运行/);

  assert.equal((labSource.match(/id: "(digest|monitor|report)"/g) ?? []).length, 3);
  assert.match(labSource, /定时资料摘要/);
  assert.match(labSource, /公开页面更新监测/);
  assert.match(labSource, /周期办公数据分析/);
  assert.match(labSource, /单次运行演示 · 非真实后台任务/);
  assert.match(labSource, /Agent 运行控制台/);
  assert.match(labSource, /预设任务 · 最小权限 · 无外部操作/);
  assert.match(labSource, /本周资料摘要/);
  assert.match(labSource, /agent-snapshot-compare/);
  assert.match(labSource, /本周办公数据分析/);
  assert.match(labSource, /07 · 项目验收清单/);
  assert.match(labSource, /08 · 常见问题与边界/);
  assert.match(labSource, /09 · 下一步升级/);
  assert.match(labSource, /不会创建真实定时任务、访问外部来源或在网页关闭后继续运行/);
  assert.doesNotMatch(labSource, /fetch\(|https?:\/\//);
});

test("四个进阶预览窗格使用无文字圆形发送箭头并提高最小字号", () => {
  const componentFiles = [
    "components/AdvancedPracticeLab.tsx",
    "components/OfficeResearchLab.tsx",
    "components/ContentCreationLab.tsx",
    "components/AgentAutomationLab.tsx",
  ];
  for (const file of componentFiles) {
    const source = readFileSync(join(process.cwd(), file), "utf8");
    assert.match(source, /<i className="composer-send-arrow" aria-hidden="true" \/><\/button>/, `${file} 应使用无文字发送箭头`);
  }

  const cssSource = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");
  assert.match(cssSource, /\.practice-composer-input > button, \.office-composer-input > button,[\s\S]*width: 46px;[\s\S]*border-radius: 50%/);
  assert.match(cssSource, /\.composer-send-arrow[\s\S]*border-bottom: 9px solid #fff/);
  assert.match(cssSource, /\.advanced-direction-card small,[\s\S]*font-size: 11px/);
  assert.match(cssSource, /\.questions-page \.question-toggle small[\s\S]*font-size: 11px/);
  assert.match(cssSource, /\.questions-page \.question-toggle strong[\s\S]*font-size: 16px/);
  assert.match(cssSource, /\.questions-page \.question-answer > p[\s\S]*font-size: 14px/);
  assert.match(cssSource, /\.advanced-agent-terms p \{[^}]*font-size: 11px/);

  const advancedLabSource = readFileSync(join(process.cwd(), "components/AdvancedPracticeLab.tsx"), "utf8");
  assert.match(advancedLabSource, /role="status" aria-live="polite" aria-atomic="true"/);
  assert.doesNotMatch(advancedLabSource, /className="practice-unified-scroll"[^>]*aria-live/);

  for (const oldClass of ["practice-lab-workspace", "practice-chat-panel", "practice-chat-scroll", "practice-choice-stack", "practice-primary-action", "practice-prompt-preview", "practice-action-row", "practice-term-grid", "practice-preview-panel", "practice-template-picker", "practice-chat-empty", "practice-playback-controls", "practice-preview-stage", "practice-preview-note", "practice-mobile-tabs", "practice-template-icon"]) {
    assert.equal(cssSource.includes(`.${oldClass}`), false, `旧版样式 .${oldClass} 应已移除`);
  }

  const packageSource = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf8")) as { scripts?: Record<string, string> };
  assert.equal(packageSource.scripts?.typecheck, "tsc --noEmit");
});

test("全局海玻璃背景不会拦截操作并尊重减少动态效果偏好", () => {
  const layoutSource = readFileSync(join(process.cwd(), "app/layout.tsx"), "utf8");
  const backgroundSource = readFileSync(join(process.cwd(), "components/AmbientFlowBackground.tsx"), "utf8");
  const cssSource = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");
  assert.match(layoutSource, /<AmbientFlowBackground \/>/);
  assert.match(backgroundSource, /className="tidal-glass-canvas"/);
  assert.match(backgroundSource, /className="tidal-glass-fallback"/);
  assert.match(backgroundSource, /getContext\("webgl"/);
  assert.match(backgroundSource, /requestAnimationFrame\(render\)/);
  assert.match(backgroundSource, /float tideField/);
  assert.match(backgroundSource, /uniform float uTime/);
  assert.match(backgroundSource, /webglcontextlost/);
  assert.match(backgroundSource, /ResizeObserver/);
  assert.doesNotMatch(backgroundSource, /addEventListener\("scroll"/);
  assert.match(backgroundSource, /<canvas ref=\{canvasRef\}/);
  assert.match(cssSource, /\.ambient-flow-background[\s\S]*pointer-events: none/);
  assert.match(cssSource, /\.ambient-flow-background[\s\S]*transform: translateZ\(0\)/);
  assert.match(cssSource, /tidal-glass-background\.png/);
  assert.match(cssSource, /\.ambient-flow-background\.is-ready \.tidal-glass-canvas[\s\S]*opacity: \.92/);
  assert.match(cssSource, /prefers-reduced-motion: reduce[\s\S]*\.tidal-glass-canvas \{ display: none; \}/);
  assert.equal(existsSync(join(process.cwd(), "public/tidal-glass-background.png")), true);
});

test("首屏标题使用统一紧凑尺度且首页入口同步收紧", () => {
  const cssSource = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");
  assert.match(cssSource, /Visual refinement batch one/);
  assert.match(cssSource, /\.home-page \.home-hero \{[\s\S]*?min-height: 548px/);
  assert.match(cssSource, /\.home-page \.starter-card \{[\s\S]*?min-height: 108px/);
  assert.match(cssSource, /@media \(max-width: 980px\) \{\s*\.home-page \.home-hero \{[\s\S]*?\.home-page \.home-hero-grid \{\s*grid-template-columns: 1fr;/);
  assert.match(cssSource, /\.compare-page \.compare-hero h1,[\s\S]*?\.advanced-page \.advanced-hero h1 \{[\s\S]*?font-size: clamp\(36px, 4\.05vw, 52px\)/);
  assert.match(cssSource, /@media \(max-width: 680px\)[\s\S]*?\.advanced-page \.advanced-hero h1,[\s\S]*?font-size: clamp\(30px, 9\.2vw, 40px\)/);
});

test("工具对比选择器不再使用负边距与首屏重叠", () => {
  const cssSource = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");
  assert.doesNotMatch(cssSource, /\.compare-page \.compare-picker\s*\{[^}]*margin:\s*-/g);
  assert.match(cssSource, /\.compare-page \.compare-picker\s*\{[^}]*margin:\s*18px 0 0/);
});

test("全站使用统一联系页脚并提供可点击的 Gmail 地址", () => {
  const layoutSource = readFileSync(join(process.cwd(), "app/layout.tsx"), "utf8");
  const footerSource = readFileSync(join(process.cwd(), "components/SiteFooter.tsx"), "utf8");
  assert.match(layoutSource, /<SiteFooter \/>/);
  assert.match(footerSource, /本站主要面向新手提供基础的资源导航/);
  assert.match(footerSource, /mailto:\$\{contactEmail\}/);
  assert.match(footerSource, /chuthachtung22013@gmail\.com/);
  assert.equal(existsSync(join(process.cwd(), "public/resource-logos/gmail-contact.svg")), true);
});

test("平台代理客户端的基本使用说明位于服务边界警示之前", () => {
  const resourcePageSource = readFileSync(join(process.cwd(), "app/resources/page.tsx"), "utf8");
  const usageNoteIndex = resourcePageSource.indexOf("基本使用方式");
  const boundaryNoticeIndex = resourcePageSource.indexOf("下载方式与服务边界");
  assert.ok(usageNoteIndex >= 0);
  assert.ok(boundaryNoticeIndex > usageNoteIndex);
  assert.match(resourcePageSource, /添加 VPN 服务提供商提供的订阅链接/);
  assert.match(resourcePageSource, /官方 GitHub 仓库的 Releases 板块/);
  assert.match(resourcePageSource, /App Store“媒体与购买项目”的账户/);
  assert.match(resourcePageSource, /第三方 VPN 服务均与本站无关/);
});

test("OpenCode 有完整工具详情与官方入口", () => {
  const opencode = getTool("opencode");
  assert.ok(opencode);
  assert.equal(opencode.categoryId, "agents");
  assert.equal(opencode.href, "https://opencode.ai/download");
  assert.equal(opencode.docsHref, "https://opencode.ai/docs/");
});

test("新增的四个工具均有独立详情入口", () => {
  for (const id of ["cursor", "tencent-workbuddy", "trae-work", "kimi-work"]) {
    assert.equal(getTool(id)?.id, id);
  }
});

test("每个工具都使用项目内的本地 Logo 文件", () => {
  for (const tool of catalogTools) {
    assert.match(tool.logo, /^\/logos\/[a-z0-9.-]+$/);
    assert.equal(existsSync(join(process.cwd(), "public", tool.logo)), true, `${tool.name} Logo 不存在`);
    assert.match(tool.logoSource, /^https:\/\//);
  }
});

test("空结果提示中的工具示例都能够命中", () => {
  const indexedItems = catalogTools.map((tool) => ({ title: tool.name, description: tool.searchDescription, keywords: tool.keywords }));

  for (const query of ["Node.js", "ChatGPT", "Ollama"]) {
    assert.equal(indexedItems.some((item) => matchesSearch(item, query)), true, `${query} 应当能够命中`);
  }
});

test("只有口语停用词的查询不会匹配全部内容", () => {
  assert.equal(matchesSearch({ title: "Node.js", description: "运行环境", keywords: "npm" }, "怎么如何"), false);
});

test("未知工具 id 不会返回错误的工具记录", () => {
  assert.equal(getTool("not-a-real-tool"), undefined);
});

test("综合图片、理解与代码需求优先推荐通用多模态工具", () => {
  const [first] = recommendTools({ capabilities: ["research", "image-generation", "image-understanding", "data", "code"], participation: "assist", device: "windows", setup: "direct", privacy: "balanced" });
  assert.equal(first.profile.toolId, "chatgpt-desktop");
});

test("只选择开箱生图不会误推 WorkBuddy 或 Kimi Work", () => {
  const recommendations = recommendTools({ capabilities: ["image-generation"], participation: "assist", device: "windows", setup: "direct", privacy: "balanced" });
  assert.equal(recommendations[0].profile.toolId, "chatgpt-desktop");
  assert.equal(recommendations.some(({ profile }) => profile.toolId === "tencent-workbuddy" || profile.toolId === "kimi-work"), false);
});

test("办公交付与本地文件需求优先推荐 WorkBuddy", () => {
  const [first] = recommendTools({ capabilities: ["documents", "data", "local-files"], participation: "deliver", device: "windows", setup: "direct", privacy: "balanced" });
  assert.equal(first.profile.toolId, "tencent-workbuddy");
});

test("可执行的代码项目需求优先推荐 Cursor", () => {
  const [first] = recommendTools({ capabilities: ["code", "local-files", "automation"], participation: "execute", device: "linux", setup: "advanced", privacy: "balanced" });
  assert.equal(first.profile.toolId, "cursor");
});

test("本机模型与本地优先需求推荐 Ollama", () => {
  const [first] = recommendTools({ capabilities: ["local-models"], participation: "local", device: "linux", setup: "advanced", privacy: "local" });
  assert.equal(first.profile.toolId, "ollama");
});

test("本地图片生成与进阶配置需求优先推荐 Ollama", () => {
  const [first] = recommendTools({ capabilities: ["image-generation"], participation: "local", device: "linux", setup: "advanced", privacy: "local" });
  assert.equal(first.profile.toolId, "ollama");
});

test("Agent 运行环境与插件编排需求优先推荐 DeepSeek Harness", () => {
  const [first] = recommendTools({ capabilities: ["agent-systems", "code", "local-files", "automation"], participation: "execute", device: "linux", setup: "advanced", privacy: "balanced" });
  assert.equal(first.profile.toolId, "deepseek-harness");
});

test("每个可对比的 AI 助手或 Agent 都有完整且唯一的资料", () => {
  assert.equal(comparisonToolIds.length, 9);
  assert.equal(new Set(comparisonToolIds).size, comparisonToolIds.length);

  for (const toolId of comparisonToolIds) {
    assert.ok(catalogTools.some((tool) => tool.id === toolId), `${toolId} 不在工具目录中`);
    const profile = comparisonProfiles.find((item) => item.toolId === toolId);
    assert.ok(profile, `${toolId} 缺少对比资料`);
    assert.ok(profile.positioning.length > 0, `${profile.toolId} 缺少定位`);
    assert.ok(profile.bestFor.length > 0, `${profile.toolId} 缺少适用人群`);
    assert.ok(profile.onboarding.title.length > 0, `${profile.toolId} 缺少入门标题`);
    assert.ok(profile.onboarding.detail.length > 0, `${profile.toolId} 缺少入门说明`);
    assert.ok(profile.boundary.length > 0, `${profile.toolId} 缺少能力边界`);
    assert.ok(profile.chooseWhen.length > 0, `${profile.toolId} 缺少选择建议`);
  }
});

test("基础开发工具与模型运行环境不会进入 Agent 对比选择", () => {
  const comparableIds = new Set<string>(comparisonToolIds);
  for (const toolId of ["vscode", "nodejs", "git", "python", "docker", "cc-switch", "github-desktop", "ollama"]) {
    assert.equal(comparableIds.has(toolId), false, `${toolId} 不应进入 Agent 对比`);
  }
});

test("图片能力的条件与实验状态不会被写成原生支持", () => {
  assert.equal(getComparisonProfile("kimi-work")?.visual.level, "conditional");
  assert.equal(getComparisonProfile("ollama")?.visual.level, "experimental");
  assert.equal(getComparisonProfile("github-desktop")?.visual.level, "not-primary");
});

test("环境自检可以识别常见设备类型", () => {
  assert.deepEqual(environmentDevices.map((item) => item.id), ["windows", "macos", "linux"]);
  assert.equal(detectEnvironmentDevice("Mozilla/5.0 (Windows NT 10.0; Win64; x64)"), "windows");
  assert.equal(detectEnvironmentDevice("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Mobile"), "mobile");
  assert.equal(detectEnvironmentDevice("Mozilla/5.0 (X11; Linux x86_64)"), "linux");
});

test("环境自检按官方平台范围排除不支持的设备", () => {
  const harness = getTool("deepseek-harness");
  const trae = getTool("trae-work");
  assert.ok(harness && trae);
  assert.equal(toolSupportsEnvironmentDevice(harness, "mobile"), false);
  assert.equal(toolSupportsEnvironmentDevice(trae, "mobile"), true);
});

test("DeepSeek Harness 的 Node.js 要求提供只读检测命令", () => {
  const hint = getEnvironmentCommandHint("deepseek-harness", "Node.js LTS 与 npm/npx", "windows");
  assert.deepEqual(hint?.commands, ["node --version", "npm --version"]);
  assert.equal(hint?.helpHref, "/tools/nodejs");
});

test("Docker 提供 WSL 检测提示并保持在基础工具范围", () => {
  const docker = getTool("docker");
  assert.ok(docker);
  assert.equal(docker.categoryId, "foundation");
  assert.deepEqual(getEnvironmentCommandHint("docker", docker.requirements[0], "windows")?.commands, ["wsl --version"]);
});

test("本站快捷下载只重定向到经过白名单登记的官方来源", () => {
  assert.equal(directDownloads.length, 23);
  const expectedToolIds = new Set(["chatgpt-desktop", "claude-desktop", "cursor", "vscode", "github-desktop", "ollama", "opencode"]);
  const actualToolIds = new Set(directDownloads.map((download) => download.toolId));
  assert.deepEqual(actualToolIds, expectedToolIds);

  const routeIds = new Set<string>();
  for (const download of directDownloads) {
    const url = new URL(download.officialUrl);
    assert.equal(url.protocol, "https:");
    assert.equal(url.hostname, download.sourceDomain);
    const routeId = `${download.toolId}/${download.platformId}`;
    assert.equal(routeIds.has(routeId), false);
    routeIds.add(routeId);
  }
  assert.equal(getDirectDownload("claude-desktop", "windows-x64")?.sourceDomain, "claude.ai");
  assert.equal(getDirectDownload("vscode", "windows-x64-user")?.sourceDomain, "update.code.visualstudio.com");
  assert.equal(getDirectDownload("ollama", "macos")?.officialUrl, "https://ollama.com/download/Ollama.dmg");
  assert.equal(getDirectDownload("chatgpt-desktop", "windows-classic")?.officialUrl, "https://get.microsoft.com/installer/download/9NT1R1C2HH7J?cid=website_cta_psi");
  assert.equal(getDirectDownload("chatgpt-desktop", "macos-classic")?.officialUrl, "https://persistent.oaistatic.com/classic/public/ChatGPT_Classic.dmg");
  assert.equal(getDirectDownload("opencode", "windows-x64")?.officialUrl, "https://opencode.ai/download/stable/windows-x64-nsis");
});

test("需要联网访问的桌面工具显示网络环境提示", () => {
  assert.equal(networkNoticeToolIds.has("claude-desktop"), true);
  assert.equal(networkNoticeToolIds.has("chatgpt-desktop"), true);
});

test("资源导航只收录 HTTPS 官方入口且不存在重复资源", () => {
  const resources = [...platformClients, ...networkCheckServices, ...aiWebServices, ...apiPlatforms, ...featuredResources];
  const ids = new Set<string>();
  for (const resource of resources) {
    assert.equal(new URL(resource.url).protocol, "https:");
    assert.equal(ids.has(resource.id), false);
    ids.add(resource.id);
    assert.ok(resource.domain.length > 0);
    assert.ok(resource.description.length > 0);
  }
});

test("平台代理客户端包含 FlClash 与 Clash Verge Rev 的官方仓库", () => {
  assert.equal(platformClients.length, 5);
  assert.equal(platformClients.find((resource) => resource.id === "flclash")?.url, "https://github.com/chen08209/FlClash");
  assert.deepEqual(platformClients.find((resource) => resource.id === "flclash")?.tags, ["全平台", "开源"]);
  assert.equal(platformClients.find((resource) => resource.id === "clash-verge-rev")?.url, "https://github.com/clash-verge-rev/clash-verge-rev");
  assert.deepEqual(platformClients.find((resource) => resource.id === "clash-verge-rev")?.tags, ["桌面端", "开源"]);
});

test("网络环境检测只收录三个指定的 HTTPS 入口", () => {
  assert.deepEqual(networkCheckServices.map((resource) => resource.id), ["ping0", "ipleak", "ipipseek"]);
  assert.deepEqual(networkCheckServices.map((resource) => resource.url), ["https://ping0.cc/", "https://ipleak.net/", "https://www.ipipseek.com/"]);
});

test("API 开放平台使用经过核对的官方入口", () => {
  assert.equal(apiPlatforms.length, 9);
  assert.equal(apiPlatforms.find((resource) => resource.id === "openai-api")?.url, "https://platform.openai.com/");
  assert.equal(apiPlatforms.find((resource) => resource.id === "claude-api")?.url, "https://platform.claude.com/");
  assert.equal(apiPlatforms.find((resource) => resource.id === "qwen-api")?.url, "https://bailian.console.aliyun.com/");
  assert.equal(apiPlatforms.find((resource) => resource.id === "siliconflow-api")?.url, "https://cloud.siliconflow.cn/");
});

test("精选网站均归入有效分类且新增资源保持指定分类与顺序", () => {
  assert.equal(resourceCategories.length, 6);
  for (const resource of featuredResources) assert.ok(getResourceCategory(resource.categoryId));
  assert.equal(featuredResources.find((resource) => resource.id === "libtv")?.url, "https://www.liblib.tv/");
  assert.equal(featuredResources.find((resource) => resource.id === "liblibai")?.url, "https://www.liblib.art/");
  assert.deepEqual(
    featuredResources.filter((resource) => resource.categoryId === "design-assets").slice(0, 6).map((resource) => resource.id),
    ["uiverse", "motionsites", "morphicons", "reactbits", "aceternity-ui", "originkit"],
  );
  for (const id of ["obsidian", "coze", "aishort"]) {
    assert.equal(featuredResources.find((resource) => resource.id === id)?.categoryId, "productivity");
  }
  assert.deepEqual(aiWebServices.slice(-3).map((resource) => resource.id), ["grok-web", "chatglm-web", "doubao-web"]);
});

test("资源导航的全部入口都使用项目内 Logo", () => {
  const resources = [...platformClients, ...networkCheckServices, ...aiWebServices, ...apiPlatforms, ...featuredResources];
  const resourcesWithLogo = resources.filter((resource) => resource.logo);
  assert.equal(resourcesWithLogo.length, 58);
  for (const resource of resourcesWithLogo) {
    assert.match(resource.logo ?? "", /^\/(logos|resource-logos)\/[a-z0-9.-]+$/);
    assert.equal(existsSync(join(process.cwd(), "public", resource.logo ?? "")), true, `${resource.name} Logo 不存在`);
  }
  assert.deepEqual(resources.filter((resource) => !resource.logo).map((resource) => resource.id), []);
});

test("GitHub 精选项目使用有效且唯一的官方仓库地址", () => {
  assert.equal(githubProjects.length, 29);
  assert.equal(githubProjectCategories.length, 6);
  const repositories = new Set<string>();
  const categoryIds = new Set(githubProjectCategories.map((category) => category.id));
  for (const project of githubProjects) {
    const url = new URL(getGitHubProjectUrl(project));
    assert.equal(url.protocol, "https:");
    assert.equal(url.hostname, "github.com");
    assert.equal(repositories.has(project.repository.toLowerCase()), false);
    repositories.add(project.repository.toLowerCase());
    assert.equal(categoryIds.has(project.categoryId as typeof githubProjectCategories[number]["id"]), true);
    const logo = getGitHubProjectLogo(project);
    assert.match(logo, /^\/github-project-logos\/[a-z0-9.-]+$/);
    assert.equal(existsSync(join(process.cwd(), "public", logo)), true, `${project.name} GitHub 图标不存在`);
  }
  assert.equal(githubProjects.find((project) => project.id === "goose")?.repository, "aaif-goose/goose");
  assert.equal(githubProjects.find((project) => project.id === "animejs")?.categoryId, "creative");
  assert.equal(githubProjects.find((project) => project.id === "stable-diffusion-webui")?.categoryId, "creative");
  assert.equal(githubProjects.find((project) => project.id === "voxcpm")?.repository, "OpenBMB/VoxCPM");
  assert.equal(githubProjects.find((project) => project.id === "voxcpm")?.categoryId, "speech");
  assert.equal(githubProjects.find((project) => project.id === "graphify")?.categoryId, "coding-data");
  assert.equal(githubProjects.find((project) => project.id === "open-design")?.categoryId, "creative");
  assert.equal(githubProjects.find((project) => project.id === "build-your-own-x")?.categoryId, "coding-data");
  for (const id of ["n8n-workflows", "deepagents", "langflow"]) {
    assert.equal(githubProjects.find((project) => project.id === id)?.categoryId, "automation");
  }
  assert.equal(githubProjects.find((project) => project.id === "lobehub")?.tags.includes("原 LobeChat"), true);
  assert.equal(githubProjects.find((project) => project.id === "vane")?.tags.includes("原 Perplexica"), true);
});

test("GitHub 项目难度标签和关联工具保持有效", () => {
  const difficulties = new Set(["入门友好", "需要配置", "进阶部署"]);
  for (const project of githubProjects) {
    assert.equal(difficulties.has(project.difficulty), true, `${project.name} 缺少有效难度标签`);
    for (const toolId of project.relatedToolIds ?? []) {
      assert.ok(getTool(toolId), `${project.name} 关联了不存在的工具 ${toolId}`);
    }
  }
  assert.deepEqual(getRelatedGitHubProjects("ollama").map((project) => project.id), ["open-webui", "vane", "ollama-repo"]);
  assert.deepEqual(getRelatedGitHubProjects("python").map((project) => project.id), ["n8n-workflows", "deepagents", "langflow", "stable-diffusion-webui", "comfyui", "real-esrgan", "graphify", "streamlit", "graphrag", "markitdown", "whisper", "voxcpm", "gpt-sovits"]);
  assert.deepEqual(getRelatedGitHubProjects("docker").map((project) => project.id), ["dify", "n8n", "n8n-workflows", "langflow", "firecrawl", "tabby", "ragflow", "open-webui"]);
});

test("常见问题页面包含六类 30 个有效问答", () => {
  assert.equal(questionCategories.length, 6);
  assert.equal(questions.length, 30);
  assert.equal(questions.filter((item) => item.featured).length, 8);
  const ids = new Set<string>();
  for (const item of questions) {
    assert.equal(ids.has(item.id), false, `${item.id} 重复`);
    ids.add(item.id);
    assert.ok(getQuestionCategory(item.categoryId), `${item.id} 分类不存在`);
    assert.ok(item.question.length > 5);
    assert.ok(item.answer.length > 20);
    for (const link of item.links ?? []) {
      if (link.href.startsWith("http")) assert.equal(new URL(link.href).protocol, "https:");
      else assert.match(link.href, /^(\/|#)/);
    }
  }
  assert.equal(questions.find((item) => item.id === "no-google-email")?.notice?.tone, "warning");
  assert.equal(questions.find((item) => item.id === "use-api-key")?.code?.includes("API Base URL：https://api.deepseek.com"), true);
  const skillAndMcp = questions.find((item) => item.id === "skill-versus-mcp");
  assert.equal(skillAndMcp?.categoryId, "choosing");
  assert.equal(skillAndMcp?.answer.includes("岗位操作手册"), true);
  assert.equal(skillAndMcp?.answer.includes("模型上下文协议"), true);
  assert.equal(skillAndMcp?.notice?.tone, "warning");
  const environmentQuestions = questions.filter((item) => item.categoryId === "environment");
  assert.equal(environmentQuestions[0]?.id, "what-is-terminal");
  const terminalQuestion = environmentQuestions[0];
  assert.ok(terminalQuestion);
  assert.equal(matchesSearch({ title: terminalQuestion.question, description: `${terminalQuestion.answer} ${terminalQuestion.steps?.join(" ")}`, keywords: terminalQuestion.keywords }, "终端怎么打开"), true);
  const questionDirectorySource = readFileSync(join(process.cwd(), "components/QuestionDirectory.tsx"), "utf8");
  assert.match(questionDirectorySource, /onSubmit=\{submitSearch\}/);
  assert.match(questionDirectorySource, /setCategoryId\("all"\)/);
  assert.match(questionDirectorySource, /scrollIntoView\(\{ behavior: "smooth", block: "center" \}\)/);
});

test("进阶计划使用五种模板提供动态对话与隔离预览", () => {
  const advancedPageSource = readFileSync(join(process.cwd(), "app/advanced/page.tsx"), "utf8");
  const practiceLabSource = readFileSync(join(process.cwd(), "components/AdvancedPracticeLab.tsx"), "utf8");

  assert.match(advancedPageSource, /direction\.id === "coding" && <AdvancedPracticeLab \/>/);
  assert.equal((practiceLabSource.match(/id: "(portfolio|todo|taskboard|pomodoro|hero)"/g) ?? []).length, 5);
  assert.match(practiceLabSource, /动态教学演示 · 非实时 AI/);
  assert.match(practiceLabSource, /个人作品主页/);
  assert.match(practiceLabSource, /待办事项清单/);
  assert.match(practiceLabSource, /动态落地页 Hero/);
  assert.match(practiceLabSource, /任务管理面板/);
  assert.match(practiceLabSource, /番茄钟计时器/);
  assert.match(practiceLabSource, /createTaskboardDocument/);
  assert.match(practiceLabSource, /createPomodoroDocument/);
  assert.match(practiceLabSource, /<button type="button">浏览案例<\/button><button class="secondary" type="button">开始交流<\/button>/);
  assert.doesNotMatch(practiceLabSource, /href="#(?:work|contact)"/);
  assert.match(practiceLabSource, /React、TypeScript、Tailwind CSS 和 Motion/);
  assert.match(practiceLabSource, /practice-conversation-window/);
  assert.match(practiceLabSource, /practice-inline-delivery/);
  assert.match(practiceLabSource, /发送并生成/);
  assert.match(practiceLabSource, /level: "入门"/);
  assert.match(practiceLabSource, /level: "进阶"/);
  assert.match(practiceLabSource, /practice-composer-template-copy/);
  assert.match(practiceLabSource, /practice-composer-revisions/);
  assert.match(practiceLabSource, /第二轮迭代/);
  assert.match(practiceLabSource, /createRevisionStyle/);
  assert.match(practiceLabSource, /项目说明/);
  assert.match(practiceLabSource, /01 · 项目目标/);
  assert.match(practiceLabSource, /02 · 最终成果/);
  assert.match(practiceLabSource, /03 · 开始前准备/);
  assert.match(practiceLabSource, /04 · 推荐工具组合/);
  assert.match(practiceLabSource, /05 · 实际操作流程/);
  assert.match(practiceLabSource, /06 · 起始提示词/);
  assert.match(practiceLabSource, /07 · 项目验收清单/);
  assert.match(practiceLabSource, /08 · 常见问题与边界/);
  assert.match(practiceLabSource, /09 · 下一步升级/);
  assert.match(practiceLabSource, /主要方案/);
  assert.match(practiceLabSource, /替代方案/);
  assert.match(practiceLabSource, /项目验收清单/);
  assert.match(practiceLabSource, /当前结果是隔离的效果预演/);
  assert.match(practiceLabSource, /当前窗口仅以简单页面演示 AI 构建流程/);
  assert.match(practiceLabSource, /搭配设计类 Skill/);
  assert.doesNotMatch(practiceLabSource, /这是经过设计的教学提示词/);
  assert.match(practiceLabSource, /以白色为主，加入一种低饱和辅助色/);
  assert.match(practiceLabSource, /以白色为主，只搭配一种接近中性的浅灰蓝色/);
  assert.doesNotMatch(practiceLabSource.split("function createWaitingDocument")[0], /#[\da-f]{3,8}/i);
  assert.match(practiceLabSource, /white-space:nowrap/);
  assert.match(practiceLabSource, /replace\('<div class="portrait">✦<\/div>', ""\)/);
  assert.doesNotMatch(practiceLabSource, /practice-mobile-tabs/);
  assert.match(practiceLabSource, /window\.setTimeout/);
  assert.match(practiceLabSource, /prefers-reduced-motion: reduce/);
  assert.match(practiceLabSource, /sandbox="allow-scripts"/);
  assert.match(practiceLabSource, /Content-Security-Policy/);
  assert.match(practiceLabSource, /default-src 'none'/);
  assert.doesNotMatch(practiceLabSource, /fetch\(|https?:\/\//);
});
