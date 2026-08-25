export type CapabilityId =
  | "research"
  | "documents"
  | "image-generation"
  | "interface-design"
  | "presentation-design"
  | "image-understanding"
  | "data"
  | "code"
  | "local-files"
  | "automation"
  | "agent-systems"
  | "local-models";
export type ParticipationId = "assist" | "deliver" | "local" | "execute";
export type DeviceId = "windows" | "macos" | "linux" | "mobile";
export type SetupId = "direct" | "simple" | "advanced";
export type PrivacyId = "cloud" | "balanced" | "local";

export type PathAnswers = {
  capabilities: CapabilityId[];
  participation: ParticipationId;
  device: DeviceId;
  setup: SetupId;
  privacy: PrivacyId;
};

export type ToolProfile = {
  toolId: string;
  core: CapabilityId[];
  extended: CapabilityId[];
  participation: ParticipationId[];
  devices: DeviceId[];
  setup: SetupId[];
  privacy: PrivacyId[];
  strengths: string[];
  coreSummary: string;
  extendedSummary: string;
  boundary: string;
};

export const capabilityOptions: Array<{ id: CapabilityId; label: string; shortLabel: string; hint: string }> = [
  { id: "research", label: "查找、理解和整理信息", shortLabel: "研究整理", hint: "搜索、阅读、总结与综合判断" },
  { id: "documents", label: "写作和文档内容", shortLabel: "写作文档", hint: "从文字草稿到结构化长文档" },
  { id: "image-generation", label: "生成或编辑图片", shortLabel: "图片生成", hint: "文生图、局部修改与风格转换" },
  { id: "interface-design", label: "设计网页、UI 或交互原型", shortLabel: "界面原型", hint: "通过代码或设计模式制作可交互界面" },
  { id: "presentation-design", label: "制作 PPT、图表与视觉排版", shortLabel: "演示视觉", hint: "演示文稿、图表和可编辑视觉成果" },
  { id: "image-understanding", label: "理解图片、截图或设计稿", shortLabel: "图片理解", hint: "识别、分析、描述或根据参考图工作" },
  { id: "data", label: "分析文件、表格和数据", shortLabel: "文件数据", hint: "提取信息、计算、整理与图表" },
  { id: "code", label: "编写代码或构建项目", shortLabel: "代码构建", hint: "从代码解释到多文件开发" },
  { id: "local-files", label: "操作本地文件和应用", shortLabel: "本地文件", hint: "在授权范围内读取或修改电脑文件" },
  { id: "automation", label: "执行命令或自动化任务", shortLabel: "命令自动化", hint: "调用终端、浏览器或其他工具" },
  { id: "agent-systems", label: "组合模型、插件与 Agent 工作流", shortLabel: "Agent 系统", hint: "搭建或研究可扩展、可追踪的智能体" },
  { id: "local-models", label: "在本机运行 AI 模型", shortLabel: "本地模型", hint: "使用自己的硬件运行模型" },
];

export const participationOptions: Array<{ id: ParticipationId; label: string; hint: string }> = [
  { id: "assist", label: "给出建议，由我自己操作", hint: "适合先熟悉 AI，不开放本地操作权限" },
  { id: "deliver", label: "帮我生成文件和完整成果", hint: "希望得到文档、表格、演示或项目成品" },
  { id: "local", label: "在授权后处理本地文件", hint: "允许工具访问指定文件夹，但仍由我复核" },
  { id: "execute", label: "可以执行命令和自动化步骤", hint: "接受更强能力，也愿意管理更高权限" },
];

export const deviceOptions: Array<{ id: DeviceId; label: string }> = [
  { id: "windows", label: "Windows" },
  { id: "macos", label: "macOS" },
  { id: "linux", label: "Linux" },
  { id: "mobile", label: "手机或平板" },
];

export const setupOptions: Array<{ id: SetupId; label: string }> = [
  { id: "direct", label: "安装后直接使用" },
  { id: "simple", label: "可以做简单配置" },
  { id: "advanced", label: "可以准备开发环境" },
];

export const privacyOptions: Array<{ id: PrivacyId; label: string }> = [
  { id: "cloud", label: "普通云端使用" },
  { id: "balanced", label: "敏感文件谨慎授权" },
  { id: "local", label: "优先在本机运行" },
];

const toolProfiles: ToolProfile[] = [
  {
    toolId: "chatgpt-desktop",
    core: ["research", "documents", "image-generation", "interface-design", "presentation-design", "image-understanding", "data", "code"],
    extended: ["local-files", "automation", "agent-systems"],
    participation: ["assist", "deliver"],
    devices: ["windows", "macos", "linux", "mobile"],
    setup: ["direct", "simple"],
    privacy: ["cloud", "balanced"],
    strengths: ["研究、写作与多模态理解", "图片生成、视觉与创意协作", "文件、数据、代码和原型构建"],
    coreSummary: "覆盖研究、图片、视觉、文件、数据、代码与多模态任务，适合希望先用一个入口处理多种需求的用户。",
    extendedSummary: "部分版本还可连接应用、参与构建或执行代理任务，具体能力取决于平台、套餐和当前功能开放情况。",
    boundary: "本地执行和应用协作并不等于可以任意控制电脑；启用连接器或代理能力前仍需检查权限与操作范围。",
  },
  {
    toolId: "claude-desktop",
    core: ["research", "documents", "interface-design", "presentation-design", "image-understanding", "data", "code"],
    extended: ["local-files", "automation", "agent-systems"],
    participation: ["assist", "deliver"],
    devices: ["windows", "macos", "linux", "mobile"],
    setup: ["direct", "simple"],
    privacy: ["cloud", "balanced"],
    strengths: ["长文阅读与结构化写作", "复杂代码理解与协作", "Artifacts 原型和视觉理解"],
    coreSummary: "适合长文档、复杂分析、代码协作和交互原型，也能理解图片并参与广泛的创意工作。",
    extendedSummary: "通过桌面集成、连接器或开发工作流可进一步处理工具和项目上下文，但可用性随平台与账户变化。",
    boundary: "可以分析图片和参与设计，但不应描述为原生图片生成工具；本地文件与工具调用也必须经过明确授权。",
  },
  {
    toolId: "tencent-workbuddy",
    core: ["research", "documents", "presentation-design", "data", "local-files", "automation"],
    extended: ["code", "interface-design"],
    participation: ["deliver", "local", "execute"],
    devices: ["windows", "macos"],
    setup: ["direct", "simple"],
    privacy: ["cloud", "balanced"],
    strengths: ["文档、表格与演示交付", "授权文件夹批量处理", "研究、浏览器与办公自动化"],
    coreSummary: "更偏向把任务真正做完，可在授权范围内处理本地文件，并交付文档、表格、演示与分析成果。",
    extendedSummary: "还能调用浏览器、执行代码或连接办公流程，适合需要从指令直接走到交付物的用户。",
    boundary: "模型服务仍需要联网；本地文件、邮件、浏览器和远程控制权限应分别按需开放。",
  },
  {
    toolId: "trae-work",
    core: ["research", "documents", "interface-design", "presentation-design", "data", "code"],
    extended: ["image-understanding", "local-files", "automation"],
    participation: ["assist", "deliver", "local"],
    devices: ["windows", "macos", "linux", "mobile"],
    setup: ["direct", "simple"],
    privacy: ["cloud", "balanced"],
    strengths: ["文档、设计与研究", "数据分析、演示与代码", "多端项目工作区"],
    coreSummary: "覆盖日常办公、设计、研究、数据和代码，可在统一工作区中组织多种文件并输出完整成果。",
    extendedSummary: "支持桌面、Web 与移动端协作，并可根据任务调用工具和组织项目级交付。",
    boundary: "工作区文件和云端任务可能涉及上传与外部处理；导出的代码、设计和数据结论仍需人工复核。",
  },
  {
    toolId: "kimi-work",
    core: ["research", "documents", "presentation-design", "data", "code", "local-files", "automation"],
    extended: ["image-generation", "interface-design", "image-understanding", "agent-systems"],
    participation: ["deliver", "local", "execute"],
    devices: ["windows", "macos"],
    setup: ["simple", "advanced"],
    privacy: ["cloud", "balanced"],
    strengths: ["本地文件与浏览器任务", "文档、表格和演示交付", "Python、Shell 与定时任务"],
    coreSummary: "适合需要同时处理本地文件、浏览器研究、代码和办公成果的用户，执行深度高于普通对话工具。",
    extendedSummary: "可通过创意设计插件生成图片，并用 Python、Shell、插件和定时任务扩展工作流；这些能力需要单独启用。",
    boundary: "能访问本地文件不代表模型在本机运行；生图依赖插件，命令、浏览器和定时任务也可能产生持续或外部影响。",
  },
  {
    toolId: "opencode",
    core: ["code", "local-files", "automation", "agent-systems"],
    extended: ["research", "documents", "interface-design", "image-understanding"],
    participation: ["deliver", "local", "execute"],
    devices: ["windows", "macos", "linux"],
    setup: ["simple", "advanced"],
    privacy: ["balanced", "local"],
    strengths: ["开源编程 Agent 与多模型连接", "终端、桌面端和 IDE 多种入口", "项目文件、命令与可扩展工具工作流"],
    coreSummary: "适合希望在代码项目中使用开源 Agent，并自由选择模型提供方、终端界面、桌面端或 IDE 的用户。",
    extendedSummary: "可通过 LSP、MCP、插件和自定义 Agent 扩展研究、界面构建与多步开发工作流。",
    boundary: "本地运行客户端不代表数据必然留在本机；实际数据流取决于模型提供方、插件、共享设置和所执行的工具。",
  },
  {
    toolId: "cursor",
    core: ["code", "interface-design", "local-files", "automation"],
    extended: ["research", "documents", "image-understanding", "agent-systems"],
    participation: ["deliver", "local", "execute"],
    devices: ["windows", "macos", "linux"],
    setup: ["simple", "advanced"],
    privacy: ["cloud", "balanced"],
    strengths: ["理解和修改完整代码库", "多文件编辑与重构", "开发终端和 Agent 工作流"],
    coreSummary: "面向软件项目的 AI 代码编辑器，擅长理解项目上下文、多文件修改、调试与构建。",
    extendedSummary: "也可协助技术研究、文档和开发流程自动化，但核心仍是代码库与软件工程。",
    boundary: "不适合作为通用办公助手；Agent 执行终端命令或修改大量文件前，应先建立 Git 记录并审查差异。",
  },
  {
    toolId: "deepseek-harness",
    core: ["code", "local-files", "automation", "agent-systems"],
    extended: ["research", "documents", "interface-design"],
    participation: ["local", "execute"],
    devices: ["windows", "macos", "linux"],
    setup: ["advanced"],
    privacy: ["balanced"],
    strengths: ["组合模型、插件与 Agent 工作流", "文件、终端、工具和子 Agent 调用", "可追踪的开发与自动化实验"],
    coreSummary: "面向 Agent Harness 开发与运行，适合希望组合模型、插件、本地工具和工作流，并检查完整执行轨迹的用户。",
    extendedSummary: "可通过插件、Skills 或外部服务扩展研究、文档、界面构建和更多工具能力，但这些不是统一的开箱功能。",
    boundary: "属于本地优先的开发者预览环境，不等于本地模型或通用办公助手；Node.js、模型、凭据、插件权限和外部数据流都需自行管理。",
  },
  {
    toolId: "hermes-agent",
    core: ["automation", "local-files", "code", "agent-systems"],
    extended: ["research", "documents", "image-generation", "image-understanding"],
    participation: ["local", "execute"],
    devices: ["windows", "macos", "linux"],
    setup: ["simple", "advanced"],
    privacy: ["balanced"],
    strengths: ["自主任务与工具调用", "可积累的技能工作流", "多模型自动化实验"],
    coreSummary: "适合持续执行任务、调用工具并积累技能的自主 Agent 使用场景。",
    extendedSummary: "可连接不同模型和工具网关，并在配置图片后端后进行图片生成或编辑，将研究、开发与重复任务组合成长工作流。",
    boundary: "图片能力依赖 Nous Portal 或单独配置的生成后端；自主程度越高，误操作影响也越大，首次使用应限制到测试目录和低权限账户。",
  },
  {
    toolId: "ollama",
    core: ["local-models"],
    extended: ["code", "research", "image-generation", "image-understanding"],
    participation: ["assist", "local"],
    devices: ["windows", "macos", "linux"],
    setup: ["simple", "advanced"],
    privacy: ["local", "balanced"],
    strengths: ["在本机下载和运行模型", "为其他工具提供本地模型接口", "自行控制模型与硬件资源"],
    coreSummary: "用于在自己的电脑上下载、运行和调用模型，适合明确希望采用本地模型路线的用户。",
    extendedSummary: "可运行视觉模型，并通过实验性接口调用适配的图片生成模型，也可作为开发工具或 Agent 的本地模型接口。",
    boundary: "图片生成接口仍属实验性；本地运行还需考虑模型许可证、磁盘、内存和显卡，对外开放接口时必须配置访问控制。",
  },
];

function scoreProfile(profile: ToolProfile, answers: PathAnswers) {
  let score = 0;

  for (const capability of answers.capabilities) {
    if (profile.core.includes(capability)) score += 5;
    else if (profile.extended.includes(capability)) score += 2;
  }

  score += profile.participation.includes(answers.participation) ? 4 : -2;
  score += profile.devices.includes(answers.device) ? 3 : -14;
  score += profile.setup.includes(answers.setup) ? 2 : answers.setup === "direct" ? -5 : -1;
  score += profile.privacy.includes(answers.privacy) ? 2 : answers.privacy === "local" ? -5 : -1;

  if (answers.capabilities.includes("local-models") && profile.toolId === "ollama") score += 10;
  if (answers.capabilities.includes("image-generation") && profile.toolId === "chatgpt-desktop") score += 4;
  if (answers.capabilities.includes("image-generation") && answers.privacy === "local" && profile.toolId === "ollama") score += 6;
  if (answers.capabilities.includes("agent-systems") && answers.setup === "advanced" && profile.toolId === "deepseek-harness") score += 6;
  if (answers.capabilities.includes("code") && answers.participation === "execute" && profile.toolId === "cursor") score += 3;
  if (answers.capabilities.includes("local-files") && answers.capabilities.includes("documents") && profile.toolId === "tencent-workbuddy") score += 3;

  return score;
}

export function recommendTools(answers: PathAnswers) {
  return toolProfiles
    .map((profile) => ({ profile, score: scoreProfile(profile, answers) }))
    .sort((left, right) => right.score - left.score)
    .slice(0, 3);
}
