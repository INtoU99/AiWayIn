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
import { detectEnvironmentDevice, getEnvironmentCommandHint, toolSupportsEnvironmentDevice } from "../lib/environmentChecker.ts";
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
  for (const [file, activePage] of [["app/compare/page.tsx", "compare"], ["app/questions/page.tsx", "questions"], ["app/resources/page.tsx", "resources"], ["app/tools/page.tsx", "tools"], ["app/tools/[id]/page.tsx", "tools"]]) {
    const source = readFileSync(join(process.cwd(), file), "utf8");
    assert.match(source, new RegExp(`<SiteHeader activePage="${activePage}" \\/>`), `${file} 应使用统一导航并设置当前页面`);
    assert.doesNotMatch(source, /<Link href="\/#guides">/, `${file} 不应让客户端路由接管跨页锚点`);
  }

  const siteHeaderSource = readFileSync(join(process.cwd(), "components/SiteHeader.tsx"), "utf8");
  assert.match(siteHeaderSource, /<HomeGuideLink \/>/);
  assert.match(siteHeaderSource, /className="menu-button"/);
  assert.match(siteHeaderSource, /className="mobile-nav"/);
  assert.match(siteHeaderSource, /BrowserNavigationLink/);
  for (const href of ["/compare", "/tools", "/resources", "/questions"]) {
    assert.match(siteHeaderSource, new RegExp(`href: "${href}"`));
  }
  const guideLinkSource = readFileSync(join(process.cwd(), "components/HomeGuideLink.tsx"), "utf8");
  assert.match(guideLinkSource, /window\.location\.assign\("\/#guides"\)/);
  const homeSource = readFileSync(join(process.cwd(), "app/page.tsx"), "utf8");
  assert.match(homeSource, /id="guides"/);
  assert.match(homeSource, /activeHomeSection === "guides"/);
  for (const [href, label] of [["/compare", "工具对比"], ["/tools", "工具导航"], ["/resources", "资源导航"], ["/questions", "常见问题"]]) {
    assert.match(homeSource, new RegExp(`<BrowserNavigationLink href="${href}">${label}<\\/BrowserNavigationLink>`), `首页顶部导航应通过浏览器完整跳转到 ${href}`);
  }
  const browserNavigationSource = readFileSync(join(process.cwd(), "components/BrowserNavigationLink.tsx"), "utf8");
  assert.match(browserNavigationSource, /window\.location\.assign\(href\)/);
});

test("全局流场背景不会拦截操作并尊重减少动态效果偏好", () => {
  const layoutSource = readFileSync(join(process.cwd(), "app/layout.tsx"), "utf8");
  const backgroundSource = readFileSync(join(process.cwd(), "components/AmbientFlowBackground.tsx"), "utf8");
  const cssSource = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");
  assert.match(layoutSource, /<AmbientFlowBackground \/>/);
  assert.match(backgroundSource, /prefers-reduced-motion: reduce/);
  assert.match(backgroundSource, /document\.hidden/);
  assert.doesNotMatch(backgroundSource, /addEventListener\("scroll"/);
  assert.match(cssSource, /\.ambient-flow-background[\s\S]*pointer-events: none/);
  assert.match(cssSource, /prefers-reduced-motion: reduce[\s\S]*\.ambient-flow-background \{ display: none; \}/);
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

test("精选网站均归入有效分类且 LibTV 与 LiblibAI 使用独立入口", () => {
  assert.equal(resourceCategories.length, 6);
  for (const resource of featuredResources) assert.ok(getResourceCategory(resource.categoryId));
  assert.equal(featuredResources.find((resource) => resource.id === "libtv")?.url, "https://www.liblib.tv/");
  assert.equal(featuredResources.find((resource) => resource.id === "liblibai")?.url, "https://www.liblib.art/");
});

test("资源导航的全部入口都使用项目内 Logo", () => {
  const resources = [...platformClients, ...networkCheckServices, ...aiWebServices, ...apiPlatforms, ...featuredResources];
  const resourcesWithLogo = resources.filter((resource) => resource.logo);
  assert.equal(resourcesWithLogo.length, 46);
  for (const resource of resourcesWithLogo) {
    assert.match(resource.logo ?? "", /^\/(logos|resource-logos)\/[a-z0-9.-]+$/);
    assert.equal(existsSync(join(process.cwd(), "public", resource.logo ?? "")), true, `${resource.name} Logo 不存在`);
  }
  assert.deepEqual(resources.filter((resource) => !resource.logo).map((resource) => resource.id), []);
});

test("GitHub 精选项目使用有效且唯一的官方仓库地址", () => {
  assert.equal(githubProjects.length, 20);
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
  assert.deepEqual(getRelatedGitHubProjects("python").map((project) => project.id), ["comfyui", "real-esrgan", "streamlit", "graphrag", "markitdown", "whisper", "gpt-sovits"]);
  assert.deepEqual(getRelatedGitHubProjects("docker").map((project) => project.id), ["dify", "n8n", "firecrawl", "tabby", "ragflow", "open-webui"]);
});

test("常见问题页面包含六类 28 个有效问答", () => {
  assert.equal(questionCategories.length, 6);
  assert.equal(questions.length, 28);
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
});
