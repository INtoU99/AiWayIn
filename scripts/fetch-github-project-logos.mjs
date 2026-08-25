import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { githubProjects } from "../data/githubProjects.ts";

const outputDirectory = path.resolve("public/github-project-logos");
const headers = {
  accept: "application/vnd.github+json",
  "user-agent": "AIGettingStartedResourceAudit/1.0",
  "x-github-api-version": "2022-11-28",
};

function extensionFor(contentType) {
  if (contentType.includes("png")) return "png";
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("svg")) return "svg";
  return "jpg";
}

await mkdir(outputDirectory, { recursive: true });
const map = [];
const sourceRows = [];

for (const project of githubProjects) {
  try {
    const repositoryResponse = await fetch(`https://api.github.com/repos/${project.repository}`, {
      headers,
      signal: AbortSignal.timeout(20000),
    });
    if (!repositoryResponse.ok) throw new Error(`repository ${repositoryResponse.status}`);
    const repository = await repositoryResponse.json();
    const avatarUrl = `${repository.owner.avatar_url}${repository.owner.avatar_url.includes("?") ? "&" : "?"}size=256`;
    const avatarResponse = await fetch(avatarUrl, {
      headers: { accept: "image/avif,image/webp,image/png,image/*,*/*;q=0.8", "user-agent": headers["user-agent"] },
      redirect: "follow",
      signal: AbortSignal.timeout(20000),
    });
    if (!avatarResponse.ok) throw new Error(`avatar ${avatarResponse.status}`);
    const extension = extensionFor(avatarResponse.headers.get("content-type") ?? "");
    const filename = `${project.id}.${extension}`;
    await writeFile(path.join(outputDirectory, filename), Buffer.from(await avatarResponse.arrayBuffer()));
    const localPath = `/github-project-logos/${filename}`;
    map.push({ id: project.id, path: localPath, repository: project.repository, source: repository.owner.avatar_url });
    sourceRows.push(`| ${project.name} | ${project.repository} | ${repository.owner.login} | ${repository.owner.avatar_url} | ${filename} |`);
    process.stdout.write(`OK ${project.id} ${filename}\n`);
  } catch (error) {
    process.stdout.write(`SKIP ${project.id} ${error instanceof Error ? error.message : String(error)}\n`);
  }
}

await writeFile(path.resolve("data/github-project-logo-map.json"), `${JSON.stringify(map, null, 2)}\n`, "utf8");
await writeFile(path.join(outputDirectory, "SOURCES.md"), `# GitHub 项目图标来源\n\n图标取自 GitHub 仓库当前所属账号或组织的公开头像，仅用于识别对应开源项目。\n\n| 项目 | 仓库 | 所属账号 | GitHub 图标源 | 本地文件 |\n| --- | --- | --- | --- | --- |\n${sourceRows.join("\n")}\n`, "utf8");
