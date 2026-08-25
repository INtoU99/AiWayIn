export type DirectDownload = {
  toolId: string;
  platformId: string;
  label: string;
  officialUrl: string;
  sourceDomain: string;
  checkedAt: string;
};

export const directDownloads: DirectDownload[] = [
  {
    toolId: "chatgpt-desktop",
    platformId: "windows-classic",
    label: "Windows（ChatGPT Classic）",
    officialUrl: "https://get.microsoft.com/installer/download/9NT1R1C2HH7J?cid=website_cta_psi",
    sourceDomain: "get.microsoft.com",
    checkedAt: "2026-08-24",
  },
  {
    toolId: "chatgpt-desktop",
    platformId: "macos-classic",
    label: "macOS（ChatGPT Classic）",
    officialUrl: "https://persistent.oaistatic.com/classic/public/ChatGPT_Classic.dmg",
    sourceDomain: "persistent.oaistatic.com",
    checkedAt: "2026-08-24",
  },
  {
    toolId: "claude-desktop",
    platformId: "windows-x64",
    label: "Windows x64",
    officialUrl: "https://claude.ai/api/desktop/win32/x64/setup/latest/redirect",
    sourceDomain: "claude.ai",
    checkedAt: "2026-08-24",
  },
  {
    toolId: "claude-desktop",
    platformId: "windows-arm64",
    label: "Windows ARM64",
    officialUrl: "https://claude.ai/api/desktop/win32/arm64/setup/latest/redirect",
    sourceDomain: "claude.ai",
    checkedAt: "2026-08-24",
  },
  {
    toolId: "claude-desktop",
    platformId: "macos-universal",
    label: "macOS 通用版",
    officialUrl: "https://claude.ai/api/desktop/darwin/universal/dmg/latest/redirect",
    sourceDomain: "claude.ai",
    checkedAt: "2026-08-24",
  },
  {
    toolId: "cursor",
    platformId: "windows-x64-user",
    label: "Windows x64",
    officialUrl: "https://api2.cursor.sh/updates/download/golden/win32-x64-user/cursor/3.17",
    sourceDomain: "api2.cursor.sh",
    checkedAt: "2026-08-24",
  },
  {
    toolId: "cursor",
    platformId: "windows-arm64-user",
    label: "Windows ARM64",
    officialUrl: "https://api2.cursor.sh/updates/download/golden/win32-arm64-user/cursor/3.17",
    sourceDomain: "api2.cursor.sh",
    checkedAt: "2026-08-24",
  },
  {
    toolId: "cursor",
    platformId: "macos-universal",
    label: "macOS 通用版",
    officialUrl: "https://api2.cursor.sh/updates/download/golden/darwin-universal/cursor/3.17",
    sourceDomain: "api2.cursor.sh",
    checkedAt: "2026-08-24",
  },
  {
    toolId: "cursor",
    platformId: "linux-deb-x64",
    label: "Linux .deb x64",
    officialUrl: "https://api2.cursor.sh/updates/download/golden/linux-x64-deb/cursor/3.17",
    sourceDomain: "api2.cursor.sh",
    checkedAt: "2026-08-24",
  },
  {
    toolId: "vscode",
    platformId: "windows-x64-user",
    label: "Windows x64",
    officialUrl: "https://update.code.visualstudio.com/latest/win32-x64-user/stable",
    sourceDomain: "update.code.visualstudio.com",
    checkedAt: "2026-08-24",
  },
  {
    toolId: "vscode",
    platformId: "windows-arm64-user",
    label: "Windows ARM64",
    officialUrl: "https://update.code.visualstudio.com/latest/win32-arm64-user/stable",
    sourceDomain: "update.code.visualstudio.com",
    checkedAt: "2026-08-24",
  },
  {
    toolId: "vscode",
    platformId: "macos-universal",
    label: "macOS 通用版",
    officialUrl: "https://update.code.visualstudio.com/latest/darwin-universal/stable",
    sourceDomain: "update.code.visualstudio.com",
    checkedAt: "2026-08-24",
  },
  {
    toolId: "vscode",
    platformId: "linux-deb-x64",
    label: "Linux .deb x64",
    officialUrl: "https://update.code.visualstudio.com/latest/linux-deb-x64/stable",
    sourceDomain: "update.code.visualstudio.com",
    checkedAt: "2026-08-24",
  },
  {
    toolId: "github-desktop",
    platformId: "windows-x64",
    label: "Windows x64",
    officialUrl: "https://central.github.com/deployments/desktop/desktop/latest/win32",
    sourceDomain: "central.github.com",
    checkedAt: "2026-08-24",
  },
  {
    toolId: "github-desktop",
    platformId: "macos-arm64",
    label: "macOS Apple 芯片",
    officialUrl: "https://central.github.com/deployments/desktop/desktop/latest/darwin-arm64",
    sourceDomain: "central.github.com",
    checkedAt: "2026-08-24",
  },
  {
    toolId: "github-desktop",
    platformId: "macos-x64",
    label: "macOS Intel 芯片",
    officialUrl: "https://central.github.com/deployments/desktop/desktop/latest/darwin",
    sourceDomain: "central.github.com",
    checkedAt: "2026-08-24",
  },
  {
    toolId: "ollama",
    platformId: "windows-x64",
    label: "Windows",
    officialUrl: "https://ollama.com/download/OllamaSetup.exe",
    sourceDomain: "ollama.com",
    checkedAt: "2026-08-24",
  },
  {
    toolId: "ollama",
    platformId: "macos",
    label: "macOS 14 或更高版本",
    officialUrl: "https://ollama.com/download/Ollama.dmg",
    sourceDomain: "ollama.com",
    checkedAt: "2026-08-24",
  },
  {
    toolId: "opencode",
    platformId: "windows-x64",
    label: "Windows x64",
    officialUrl: "https://opencode.ai/download/stable/windows-x64-nsis",
    sourceDomain: "opencode.ai",
    checkedAt: "2026-08-24",
  },
  {
    toolId: "opencode",
    platformId: "macos-arm64",
    label: "macOS Apple 芯片",
    officialUrl: "https://opencode.ai/download/stable/darwin-aarch64-dmg",
    sourceDomain: "opencode.ai",
    checkedAt: "2026-08-24",
  },
  {
    toolId: "opencode",
    platformId: "macos-x64",
    label: "macOS Intel 芯片",
    officialUrl: "https://opencode.ai/download/stable/darwin-x64-dmg",
    sourceDomain: "opencode.ai",
    checkedAt: "2026-08-24",
  },
  {
    toolId: "opencode",
    platformId: "linux-deb-x64",
    label: "Linux .deb x64",
    officialUrl: "https://opencode.ai/download/stable/linux-x64-deb",
    sourceDomain: "opencode.ai",
    checkedAt: "2026-08-24",
  },
  {
    toolId: "opencode",
    platformId: "linux-rpm-x64",
    label: "Linux .rpm x64",
    officialUrl: "https://opencode.ai/download/stable/linux-x64-rpm",
    sourceDomain: "opencode.ai",
    checkedAt: "2026-08-24",
  },
];

export const networkNoticeToolIds = new Set(["claude-desktop", "chatgpt-desktop"]);

export function getToolDirectDownloads(toolId: string) {
  return directDownloads.filter((download) => download.toolId === toolId);
}

export function getDirectDownload(toolId: string, platformId: string) {
  return directDownloads.find((download) => download.toolId === toolId && download.platformId === platformId);
}
