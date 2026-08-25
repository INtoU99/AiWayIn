import type { ToolCatalogItem } from "@/data/tools";

export type EnvironmentDeviceId = "windows" | "macos" | "linux" | "mobile";

export type EnvironmentCommandHint = {
  commands: string[];
  helpHref?: string;
  note: string;
};

export const environmentDevices: Array<{ id: EnvironmentDeviceId; label: string }> = [
  { id: "windows", label: "Windows" },
  { id: "macos", label: "macOS" },
  { id: "linux", label: "Linux" },
  { id: "mobile", label: "手机或平板" },
];

export function detectEnvironmentDevice(userAgent: string): EnvironmentDeviceId {
  const normalized = userAgent.toLowerCase();
  if (/android|iphone|ipad|mobile/.test(normalized)) return "mobile";
  if (/macintosh|mac os x/.test(normalized)) return "macos";
  if (/linux/.test(normalized)) return "linux";
  return "windows";
}

export function toolSupportsEnvironmentDevice(tool: ToolCatalogItem, device: EnvironmentDeviceId) {
  const platforms = tool.platforms.join(" ").toLowerCase();
  if (device === "windows") return /windows|desktop|web/.test(platforms);
  if (device === "macos") return /macos|desktop|web/.test(platforms);
  if (device === "linux") return /linux|web/.test(platforms);
  return /mobile|android|iphone|ipad|web/.test(platforms);
}

export function getEnvironmentCommandHint(toolId: string, requirement: string, device: EnvironmentDeviceId): EnvironmentCommandHint | undefined {
  const normalized = requirement.toLowerCase();

  if ((toolId === "deepseek-harness" || toolId === "nodejs") && /node|npm|npx/.test(normalized)) {
    return { commands: ["node --version", "npm --version"], helpHref: "/tools/nodejs", note: "两条命令都能返回版本号，才说明 Node.js 与 npm 已可用。" };
  }

  if (toolId === "git" && /安装|git|版本/.test(normalized)) {
    return { commands: ["git --version"], note: "返回 Git 版本号即表示命令行可以识别 Git。" };
  }

  if (toolId === "python" && /版本|python|pip/.test(normalized)) {
    const pythonCommand = device === "windows" ? "py --version" : "python3 --version";
    const pipCommand = device === "windows" ? "py -m pip --version" : "python3 -m pip --version";
    return { commands: [pythonCommand, pipCommand], note: "两条命令应指向同一个 Python 环境。" };
  }

  if (toolId === "ollama" && /模型|硬件|内存|显卡|磁盘/.test(normalized)) {
    return { commands: ["ollama --version"], note: "仅在已经安装 Ollama 后使用；硬件是否足够仍需结合模型大小判断。" };
  }

  if (toolId === "docker" && device === "windows" && /wsl|虚拟化|系统/.test(normalized)) {
    return { commands: ["wsl --version"], note: "应显示 WSL 版本信息；硬件虚拟化还需要在系统信息或 BIOS / UEFI 中确认。" };
  }

  return undefined;
}
