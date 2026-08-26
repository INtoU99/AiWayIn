import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const outputDirectory = path.resolve("public/resource-logos");

const targets = [
  ["v2rayn", "https://github.com/2dust/v2rayN", "https://raw.githubusercontent.com/2dust/v2rayN/master/v2rayN/v2rayN.Desktop/Assets/v2rayN.ico"],
  ["v2rayng", "https://github.com/2dust/v2rayNG", "https://raw.githubusercontent.com/2dust/v2rayNG/master/V2rayNG/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png"],
  ["shadowrocket", "https://apps.apple.com/us/app/shadowrocket/id932747118", "itunes:932747118"],
  ["gemini-web", "https://gemini.google.com/", "https://cdn.simpleicons.org/googlegemini"],
  ["deepseek-web", "https://chat.deepseek.com/"],
  ["kimi-web", "https://www.kimi.com/", "https://www.kimi.com/favicon.ico"],
  ["grok-web", "https://grok.com/"],
  ["chatglm-web", "https://chatglm.cn/main/alltoolsdetail?lang=zh"],
  ["doubao-web", "https://www.doubao.com/"],
  ["midjourney", "https://www.midjourney.com/", "https://www.midjourney.com/favicon.ico"],
  ["civitai", "https://civitai.com/", "https://civitai.com/favicon.ico"],
  ["dreamina", "https://jimeng.jianying.com/ai-tool/home"],
  ["kling", "https://kling.ai/cn"],
  ["libtv", "https://www.liblib.tv/"],
  ["liblibai", "https://www.liblib.art/"],
  ["notion", "https://www.notion.com/"],
  ["canva", "https://www.canva.com/", "https://www.canva.com/favicon.ico"],
  ["perplexity", "https://www.perplexity.ai/", "https://cdn.simpleicons.org/perplexity"],
  ["obsidian", "https://obsidian.md/", "https://cdn.simpleicons.org/obsidian"],
  ["coze", "https://www.coze.cn/"],
  ["aishort", "https://www.aishort.top/", "https://github.com/rockbenben.png?size=256"],
  ["uiverse", "https://uiverse.io/", "https://github.com/uiverse-io.png?size=256"],
  ["motionsites", "https://motionsites.ai/"],
  ["morphicons", "https://www.morphicons.com/"],
  ["reactbits", "https://www.reactbits.dev/"],
  ["aceternity-ui", "https://ui.aceternity.com/"],
  ["originkit", "https://www.originkit.dev/"],
  ["figma", "https://www.figma.com/"],
  ["dribbble", "https://dribbble.com/", "https://cdn.simpleicons.org/dribbble"],
  ["behance", "https://www.behance.net/", "https://cdn.simpleicons.org/behance"],
  ["pinterest", "https://www.pinterest.com/", "https://cdn.simpleicons.org/pinterest"],
  ["unsplash", "https://unsplash.com/", "https://cdn.simpleicons.org/unsplash"],
  ["youtube", "https://www.youtube.com/", "https://cdn.simpleicons.org/youtube"],
  ["medium", "https://medium.com/", "https://cdn.simpleicons.org/medium"],
  ["reddit", "https://www.reddit.com/", "https://cdn.simpleicons.org/reddit"],
  ["discord", "https://discord.com/", "https://cdn.simpleicons.org/discord"],
  ["github", "https://github.com/"],
  ["stackoverflow", "https://stackoverflow.com/", "https://cdn.simpleicons.org/stackoverflow"],
  ["khan-academy", "https://www.khanacademy.org/"],
  ["coursera", "https://www.coursera.org/"],
  ["google", "https://www.google.com/", "https://cdn.simpleicons.org/google"],
  ["wikipedia", "https://www.wikipedia.org/", "https://cdn.simpleicons.org/wikipedia"],
];

function attribute(tag, name) {
  const match = tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`, "i"));
  return match?.[1];
}

function findIconUrl(html, pageUrl) {
  const links = html.match(/<link\b[^>]*>/gi) ?? [];
  const icons = links.flatMap((tag) => {
    const rel = attribute(tag, "rel")?.toLowerCase() ?? "";
    const href = attribute(tag, "href");
    if (!rel.includes("icon") || !href || href.startsWith("data:")) return [];
    const sizes = attribute(tag, "sizes") ?? "";
    const numericSize = Math.max(0, ...[...sizes.matchAll(/(\d+)x\d+/g)].map((match) => Number(match[1])));
    const score = (rel.includes("apple-touch") ? 10000 : 0) + numericSize + (href.endsWith(".svg") ? 500 : 0);
    return [{ url: new URL(href, pageUrl).href, score }];
  });
  return icons.sort((left, right) => right.score - left.score)[0]?.url;
}

function extensionFor(contentType, url) {
  const type = contentType.toLowerCase();
  if (type.includes("svg")) return "svg";
  if (type.includes("png")) return "png";
  if (type.includes("jpeg") || type.includes("jpg")) return "jpg";
  if (type.includes("webp")) return "webp";
  if (type.includes("icon") || type.includes("ico")) return "ico";
  const extension = new URL(url).pathname.split(".").pop()?.toLowerCase();
  return ["svg", "png", "jpg", "jpeg", "webp", "ico"].includes(extension ?? "") ? extension : "png";
}

async function fetchWithTimeout(url, accept) {
  return fetch(url, {
    headers: { accept, "user-agent": "Mozilla/5.0 (compatible; AIGettingStartedResourceAudit/1.0)" },
    redirect: "follow",
    signal: AbortSignal.timeout(20000),
  });
}

await mkdir(outputDirectory, { recursive: true });
const sourceRows = [];
const resultRows = [];
const requestedIds = new Set(process.argv.slice(2));
const selectedTargets = requestedIds.size > 0 ? targets.filter(([id]) => requestedIds.has(id)) : targets;

for (const [id, pageUrl, providedLogoUrl] of selectedTargets) {
  try {
    let logoUrl = providedLogoUrl;
    if (logoUrl?.startsWith("itunes:")) {
      const appId = logoUrl.slice("itunes:".length);
      const lookupResponse = await fetchWithTimeout(`https://itunes.apple.com/lookup?id=${appId}`, "application/json,text/javascript");
      const lookup = JSON.parse(await lookupResponse.text());
      logoUrl = lookup.results?.[0]?.artworkUrl512;
      if (!logoUrl) throw new Error("App Store artwork unavailable");
    }
    if (!logoUrl) {
      const pageResponse = await fetchWithTimeout(pageUrl, "text/html,application/xhtml+xml");
      if (!pageResponse.ok) throw new Error(`page ${pageResponse.status}`);
      logoUrl = findIconUrl(await pageResponse.text(), pageResponse.url) ?? new URL("/favicon.ico", pageResponse.url).href;
    }

    const logoResponse = await fetchWithTimeout(logoUrl, "image/avif,image/webp,image/svg+xml,image/png,image/*,*/*;q=0.8");
    if (!logoResponse.ok) throw new Error(`logo ${logoResponse.status}`);
    const contentType = logoResponse.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/") && !/\.(svg|png|jpe?g|webp|ico)(?:\?|$)/i.test(logoUrl)) throw new Error(`unexpected ${contentType}`);
    const extension = extensionFor(contentType, logoResponse.url);
    const filename = `${id}.${extension}`;
    await writeFile(path.join(outputDirectory, filename), Buffer.from(await logoResponse.arrayBuffer()));
    sourceRows.push(`| ${id} | ${pageUrl} | ${logoResponse.url} | ${filename} |`);
    resultRows.push({ id, path: `/resource-logos/${filename}`, source: logoResponse.url });
    process.stdout.write(`OK ${id} ${filename}\n`);
  } catch (error) {
    process.stdout.write(`SKIP ${id} ${error instanceof Error ? error.message : String(error)}\n`);
  }
}

let finalSourceRows = sourceRows;
let finalResultRows = resultRows;
if (requestedIds.size > 0) {
  const successfulIds = new Set(resultRows.map(({ id }) => id));
  try {
    const existingMap = JSON.parse(await readFile(path.resolve("data/resource-logo-map.json"), "utf8"));
    finalResultRows = [...existingMap.filter(({ id }) => !successfulIds.has(id)), ...resultRows];
  } catch {
    // 首次生成时不存在旧映射，直接使用本次结果。
  }
  try {
    const existingSource = await readFile(path.join(outputDirectory, "SOURCES.md"), "utf8");
    const existingRows = existingSource.split(/\r?\n/).filter((line) => line.startsWith("| ") && !line.startsWith("| 资源 ID ") && !line.startsWith("| ---"));
    finalSourceRows = [
      ...existingRows.filter((line) => !successfulIds.has(line.split("|")[1]?.trim())),
      ...sourceRows,
    ];
  } catch {
    // 首次生成时不存在旧来源文件，直接使用本次结果。
  }
}

const sourceDocument = `# 资源导航图标来源\n\n优先使用对应官方网站声明的 favicon、应用图标或官方站点资源；少数阻止自动获取的品牌使用 Simple Icons 或官方 GitHub 账号头像的本地化版本。全部素材仅用于识别资源入口。\n\n| 资源 ID | 官方页面 | 图标源文件 | 本地文件 |\n| --- | --- | --- | --- |\n${finalSourceRows.join("\n")}\n`;
await writeFile(path.join(outputDirectory, "SOURCES.md"), sourceDocument, "utf8");
await writeFile(path.resolve("data/resource-logo-map.json"), `${JSON.stringify(finalResultRows, null, 2)}\n`, "utf8");
