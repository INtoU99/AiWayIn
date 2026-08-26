import type { ResourceTone } from "./resources";

export type GitHubProject = {
  id: string;
  name: string;
  repository: string;
  description: string;
  categoryId: string;
  tags: string[];
  mark: string;
  tone: ResourceTone;
  difficulty: "入门友好" | "需要配置" | "进阶部署";
  relatedToolIds?: string[];
};

export const githubProjectCategories = [
  { id: "automation", title: "自动化与应用" },
  { id: "creative", title: "创作与界面" },
  { id: "coding-data", title: "编程与数据" },
  { id: "knowledge-docs", title: "知识库与文档" },
  { id: "local-chat", title: "本地模型与交互" },
  { id: "speech", title: "语音处理" },
] as const;

export const githubProjects: GitHubProject[] = [
  { id: "crawlee", name: "Crawlee", repository: "apify/crawlee", description: "面向网页抓取和浏览器自动化的 JavaScript / TypeScript 框架。", categoryId: "automation", tags: ["Node.js", "浏览器自动化"], mark: "CR", tone: "blue", difficulty: "需要配置", relatedToolIds: ["nodejs"] },
  { id: "dify", name: "Dify", repository: "langgenius/dify", description: "用于构建 Agent 工作流、RAG 应用和模型工具链的协作平台。", categoryId: "automation", tags: ["工作流", "RAG"], mark: "DI", tone: "violet", difficulty: "进阶部署", relatedToolIds: ["docker"] },
  { id: "n8n", name: "n8n", repository: "n8n-io/n8n", description: "结合可视化流程、代码节点与 AI 能力的自动化平台。", categoryId: "automation", tags: ["流程自动化", "集成"], mark: "N8", tone: "peach", difficulty: "需要配置", relatedToolIds: ["nodejs", "docker"] },
  { id: "firecrawl", name: "Firecrawl", repository: "firecrawl/firecrawl", description: "将网页搜索与抓取结果转换为适合 AI 使用的结构化内容。", categoryId: "automation", tags: ["网页数据", "AI 上下文"], mark: "FC", tone: "mint", difficulty: "进阶部署", relatedToolIds: ["nodejs", "docker"] },

  { id: "animejs", name: "Anime.js", repository: "juliangarnier/anime", description: "轻量且用途广泛的 JavaScript 动画引擎，可驱动 CSS、SVG、DOM 属性与 JavaScript 对象。", categoryId: "creative", tags: ["前端动画", "JavaScript"], mark: "AN", tone: "peach", difficulty: "需要配置", relatedToolIds: ["nodejs", "vscode"] },
  { id: "stable-diffusion-webui", name: "Stable Diffusion WebUI", repository: "AUTOMATIC1111/stable-diffusion-webui", description: "基于 Gradio 的 Stable Diffusion 本地 Web 界面，提供文生图、图生图与扩展工作流。", categoryId: "creative", tags: ["图像生成", "本地部署"], mark: "SD", tone: "violet", difficulty: "进阶部署", relatedToolIds: ["python", "git"] },
  { id: "comfyui", name: "ComfyUI", repository: "Comfy-Org/ComfyUI", description: "通过节点图编排扩散模型生成流程的模块化图形界面与后端。", categoryId: "creative", tags: ["节点工作流", "图像生成"], mark: "CU", tone: "violet", difficulty: "进阶部署", relatedToolIds: ["python", "git"] },
  { id: "screenshot-to-code", name: "screenshot-to-code", repository: "abi/screenshot-to-code", description: "将截图转换为 HTML、Tailwind、React 或 Vue 代码的参考项目。", categoryId: "creative", tags: ["前端", "截图转代码"], mark: "SC", tone: "blue", difficulty: "需要配置", relatedToolIds: ["nodejs", "vscode"] },
  { id: "real-esrgan", name: "Real-ESRGAN", repository: "xinntao/Real-ESRGAN", description: "用于真实图像、动漫图片与视频画面的实用型超分辨率修复。", categoryId: "creative", tags: ["图像修复", "超分辨率"], mark: "RE", tone: "peach", difficulty: "进阶部署", relatedToolIds: ["python"] },

  { id: "tabby", name: "Tabby", repository: "TabbyML/tabby", description: "可以自行托管的开源 AI 编码助手。", categoryId: "coding-data", tags: ["自托管", "编程助手"], mark: "TA", tone: "mint", difficulty: "进阶部署", relatedToolIds: ["vscode", "docker"] },
  { id: "goose", name: "Goose", repository: "aaif-goose/goose", description: "可扩展的开源 AI Agent，可执行安装、编辑、运行和测试等开发任务。", categoryId: "coding-data", tags: ["Agent", "开发流程"], mark: "GO", tone: "peach", difficulty: "需要配置", relatedToolIds: ["vscode"] },
  { id: "streamlit", name: "Streamlit", repository: "streamlit/streamlit", description: "使用 Python 快速构建和分享交互式数据应用。", categoryId: "coding-data", tags: ["Python", "数据应用"], mark: "ST", tone: "blue", difficulty: "入门友好", relatedToolIds: ["python"] },

  { id: "ragflow", name: "RAGFlow", repository: "infiniflow/ragflow", description: "结合文档理解、检索增强生成与 Agent 能力的开源 RAG 引擎。", categoryId: "knowledge-docs", tags: ["RAG", "文档理解"], mark: "RF", tone: "mint", difficulty: "进阶部署", relatedToolIds: ["docker"] },
  { id: "graphrag", name: "GraphRAG", repository: "microsoft/graphrag", description: "微软开源的模块化图结构检索增强生成系统。", categoryId: "knowledge-docs", tags: ["知识图谱", "微软"], mark: "GR", tone: "violet", difficulty: "进阶部署", relatedToolIds: ["python"] },
  { id: "markitdown", name: "MarkItDown", repository: "microsoft/markitdown", description: "将 Office 文档和其他常见文件转换为 Markdown 的 Python 工具。", categoryId: "knowledge-docs", tags: ["文档转换", "微软"], mark: "MD", tone: "blue", difficulty: "入门友好", relatedToolIds: ["python"] },
  { id: "appflowy", name: "AppFlowy", repository: "AppFlowy-IO/AppFlowy", description: "支持自托管和数据控制的开源协作工作空间。", categoryId: "knowledge-docs", tags: ["知识管理", "自托管"], mark: "AF", tone: "mint", difficulty: "入门友好" },

  { id: "open-webui", name: "Open WebUI", repository: "open-webui/open-webui", description: "支持 Ollama、OpenAI API 等后端的本地友好型 AI 交互界面。", categoryId: "local-chat", tags: ["聊天界面", "Ollama"], mark: "OW", tone: "blue", difficulty: "需要配置", relatedToolIds: ["ollama", "docker"] },
  { id: "lobehub", name: "LobeHub", repository: "lobehub/lobehub", description: "用于组织、运行和管理多个 AI Agent 的开源平台。", categoryId: "local-chat", tags: ["原 LobeChat", "Agent"], mark: "LH", tone: "violet", difficulty: "需要配置", relatedToolIds: ["nodejs"] },
  { id: "vane", name: "Vane", repository: "ItzCrazyKns/Vane", description: "支持联网检索与来源整理的开源 AI 问答引擎。", categoryId: "local-chat", tags: ["原 Perplexica", "AI 搜索"], mark: "VA", tone: "peach", difficulty: "进阶部署", relatedToolIds: ["nodejs", "ollama"] },
  { id: "ollama-repo", name: "Ollama", repository: "ollama/ollama", description: "在本地运行和管理多种大语言模型的跨平台工具。", categoryId: "local-chat", tags: ["本地模型", "跨平台"], mark: "OL", tone: "mint", difficulty: "入门友好", relatedToolIds: ["ollama"] },

  { id: "whisper", name: "Whisper", repository: "openai/whisper", description: "OpenAI 开源的多语言语音识别模型与推理代码。", categoryId: "speech", tags: ["语音识别", "多语言"], mark: "WH", tone: "blue", difficulty: "需要配置", relatedToolIds: ["python"] },
  { id: "gpt-sovits", name: "GPT-SoVITS", repository: "RVC-Boss/GPT-SoVITS", description: "面向少样本语音合成与音色建模的开源项目。", categoryId: "speech", tags: ["语音合成", "进阶"], mark: "GS", tone: "violet", difficulty: "进阶部署", relatedToolIds: ["python"] },
];

export function getGitHubProjectUrl(project: GitHubProject) {
  return `https://github.com/${project.repository}`;
}

export function getGitHubProjectLogo(project: GitHubProject) {
  const extension = project.id === "real-esrgan" ? "jpg" : "png";
  return `/github-project-logos/${project.id}.${extension}`;
}

export function getGitHubDifficultyClass(difficulty: GitHubProject["difficulty"]) {
  return difficulty === "入门友好" ? "beginner" : difficulty === "需要配置" ? "setup" : "advanced";
}

export function getRelatedGitHubProjects(toolId: string) {
  return githubProjects.filter((project) => project.relatedToolIds?.includes(toolId));
}
