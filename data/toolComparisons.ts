export type SupportLevel = "direct" | "conditional" | "experimental" | "not-primary";

export type ComparisonValue = {
  level?: SupportLevel;
  title: string;
  detail: string;
};

export type ToolComparisonProfile = {
  toolId: string;
  positioning: string;
  onboarding: ComparisonValue;
  bestFor: string;
  visual: ComparisonValue;
  files: ComparisonValue;
  automation: ComparisonValue;
  boundary: string;
  chooseWhen: string;
};

export const supportLevelLabels: Record<SupportLevel, string> = {
  direct: "直接支持",
  conditional: "条件支持",
  experimental: "实验性",
  "not-primary": "非主要能力",
};

export const comparisonToolIds = [
  "chatgpt-desktop",
  "claude-desktop",
  "deepseek-harness",
  "hermes-agent",
  "tencent-workbuddy",
  "trae-work",
  "kimi-work",
  "cursor",
  "opencode",
] as const;

export const comparisonProfiles: ToolComparisonProfile[] = [
  {
    toolId: "chatgpt-desktop",
    positioning: "覆盖研究、创意、图片、文件、数据与代码的综合多模态工作台。",
    onboarding: { level: "direct", title: "登录即可开始", detail: "桌面端不需要预先配置开发环境。" },
    bestFor: "希望用一个入口处理多种任务，并需要原生图片生成的用户。",
    visual: { level: "direct", title: "多模态与图片生成", detail: "支持图片理解、生成、编辑和视觉创意；部分能力受套餐与版本影响。" },
    files: { level: "conditional", title: "文件分析与应用协作", detail: "可分析上传文件；本地应用和文件协作取决于系统、连接方式与授权。" },
    automation: { level: "conditional", title: "构建与代理任务", detail: "可参与代码、构建和代理流程，但可执行范围随产品形态变化。" },
    boundary: "桌面应用不等于任意控制电脑；连接应用、账户或本地资源时应单独检查权限。",
    chooseWhen: "你需要综合能力、图片生成和较低入门门槛。",
  },
  {
    toolId: "claude-desktop",
    positioning: "擅长长文档、复杂分析、代码协作和 Artifacts 原型的综合助手。",
    onboarding: { level: "direct", title: "登录即可开始", detail: "基础对话、文件和 Artifacts 不要求开发环境。" },
    bestFor: "经常处理长文、复杂代码、结构化写作或交互原型的用户。",
    visual: { level: "direct", title: "图片理解与代码化视觉", detail: "可分析图片，制作 SVG、图表、网页和交互原型；不提供同类原生位图生图。" },
    files: { level: "conditional", title: "文件与连接器", detail: "基础文件分析可直接使用；本地资源或外部服务需要对应连接器和授权。" },
    automation: { level: "conditional", title: "开发与工具工作流", detail: "可参与代码和工具调用，但执行深度依赖客户端、集成与账户能力。" },
    boundary: "图片理解与视觉原型不能等同于原生图片生成，本地工具调用也不是所有用户都默认开放。",
    chooseWhen: "你更看重长文、复杂代码、结构化表达和可交互原型。",
  },
  {
    toolId: "deepseek-harness",
    positioning: "本地优先、插件化、可组合且运行轨迹可检查的 Agent Harness。",
    onboarding: { level: "experimental", title: "开发者预览", detail: "需要 Node.js、模型、凭据，并理解插件与工作目录。" },
    bestFor: "研究或搭建 Agent 运行环境、插件、Skills、工具链和执行轨迹的开发者。",
    visual: { level: "conditional", title: "通过插件或代码扩展", detail: "可构建网页与界面；图片能力取决于自行接入的插件、模型或外部工具。" },
    files: { level: "direct", title: "受控工作目录", detail: "可读取和修改文件，并在本地保存会话、附件和运行记录。" },
    automation: { level: "direct", title: "终端、工具与子 Agent", detail: "核心能力是组合插件、工具、沙箱、调度和多步工作流。" },
    boundary: "本地优先不等于本地模型；外部模型、MCP、插件与网络工具仍可能发送数据。",
    chooseWhen: "你要搭建或研究 Agent 系统，而不是寻找免配置办公助手。",
  },
  {
    toolId: "hermes-agent",
    positioning: "具备工具调用、技能积累和长期自动化能力的自主 Agent。",
    onboarding: { level: "conditional", title: "安装简单，配置较多", detail: "需要选择模型提供方，并按用途启用工具网关或凭据。" },
    bestFor: "需要持续任务、定时执行、多模型和可扩展工具工作流的进阶用户。",
    visual: { level: "conditional", title: "可配置生成与编辑", detail: "配置 Nous Portal 或图片后端后，可文生图、图片编辑和视觉分析。" },
    files: { level: "direct", title: "文件与长期任务", detail: "可操作授权文件，并将任务、技能和自动化组合成持续工作流。" },
    automation: { level: "direct", title: "自主 Agent 与定时任务", detail: "支持工具、浏览器、子 Agent、技能和定时执行。" },
    boundary: "图片和部分工具需要额外服务；自主程度越高，越要限制目录、账户和外部动作。",
    chooseWhen: "你想让 Agent 长期工作，并愿意管理模型、工具和权限。",
  },
  {
    toolId: "tencent-workbuddy",
    positioning: "面向知识工作的桌面 Agent，强调本地文件处理和办公成果交付。",
    onboarding: { level: "direct", title: "桌面安装后使用", detail: "不要求 Node.js，但需要账户、联网和按需系统权限。" },
    bestFor: "希望 AI 处理授权文件夹并交付文档、表格、演示和研究成果的用户。",
    visual: { level: "direct", title: "演示、图表与视觉交付", detail: "适合 PPT、图表和办公排版；不作为已确认的开箱通用生图工具。" },
    files: { level: "direct", title: "本地文件是核心能力", detail: "可读取授权文件夹、批量处理文件并生成可核验结果。" },
    automation: { level: "direct", title: "办公与浏览器任务", detail: "可执行多步任务、脚本或外部程序，具体动作受权限模式控制。" },
    boundary: "模型服务仍需联网；文件、邮件、浏览器和辅助控制权限应分别按需开放。",
    chooseWhen: "你的目标是本地文件处理和可直接交付的办公成果。",
  },
  {
    toolId: "trae-work",
    positioning: "覆盖文档、设计、研究、数据和代码的多端项目工作助手。",
    onboarding: { level: "direct", title: "多端直接使用", detail: "可从桌面端或 Web 开始，不要求先准备开发环境。" },
    bestFor: "希望在统一工作区中混合处理文档、设计、数据和代码的用户。",
    visual: { level: "direct", title: "Design 模式与视觉交付", detail: "适合界面、演示和项目视觉工作；不直接等同于通用位图生图。" },
    files: { level: "conditional", title: "项目工作区文件", detail: "可理解和组织多种项目文件，云端任务可能涉及上传和外部处理。" },
    automation: { level: "conditional", title: "工具调用与并行任务", detail: "可以拆解和并行执行任务，执行方式随客户端与云端能力变化。" },
    boundary: "需要区分设计工作流和图片生成；导出的设计、代码和分析结论仍应人工复核。",
    chooseWhen: "你需要文档、设计、数据和代码混合在一个项目工作区。",
  },
  {
    toolId: "kimi-work",
    positioning: "可操作本地文件、浏览器、代码和定时任务的桌面知识工作 Agent。",
    onboarding: { level: "conditional", title: "安装后需要理解权限", detail: "无需手写命令开始，但更深能力会调用浏览器、插件、Python 或 Shell。" },
    bestFor: "需要本地文件、浏览器研究、办公交付和较深自动化的用户。",
    visual: { level: "conditional", title: "PPT 直接，生图需插件", detail: "可完成演示视觉设计；图片生成、视频和音频需要创意设计插件。" },
    files: { level: "direct", title: "本地文件与项目", detail: "可在授权后创建、整理和处理本地文件夹及交付物。" },
    automation: { level: "direct", title: "浏览器、Shell 与定时任务", detail: "可执行长任务、工具调用、浏览器操作和自动化步骤。" },
    boundary: "本地 Agent 不等于本地模型；插件、浏览器和命令可能引入外部服务与持续影响。",
    chooseWhen: "你需要比普通办公助手更深的本地执行和长任务能力。",
  },
  {
    toolId: "opencode",
    positioning: "可连接多种模型、覆盖终端、桌面端与 IDE 的开源 AI 编程 Agent。",
    onboarding: { level: "conditional", title: "桌面版直接安装，模型需连接", detail: "可以从桌面端开始，也可使用 CLI；首次使用需要选择模型提供方并理解项目权限。" },
    bestFor: "希望使用开源编程 Agent，并自由选择云端或本地模型与操作界面的开发用户。",
    visual: { level: "conditional", title: "理解设计稿并构建代码界面", detail: "可读取参考图片并实现网页或 UI，但不是通用图片生成或画布设计工具。" },
    files: { level: "direct", title: "项目文件与代码上下文", detail: "可分析和修改代码库文件，并通过差异与撤销能力检查结果。" },
    automation: { level: "direct", title: "终端工具与开发 Agent", detail: "可调用终端、工具、LSP、MCP 和自定义 Agent 完成多步开发任务。" },
    boundary: "开源不等于默认安全；连接的模型提供方、插件、共享链接和执行命令都可能扩大数据与权限范围。",
    chooseWhen: "你需要跨终端、桌面端和 IDE 使用的开源编程 Agent，并希望自行选择模型。",
  },
  {
    toolId: "cursor",
    positioning: "围绕代码库理解、多文件编辑、重构和开发 Agent 构建的 AI 编辑器。",
    onboarding: { level: "conditional", title: "安装简单，使用需项目基础", detail: "应用可直接安装，但需要理解项目、终端、差异和测试。" },
    bestFor: "主要目标是开发软件、修改已有代码库或构建网页界面的用户。",
    visual: { level: "direct", title: "代码化 UI 与网页", detail: "适合构建界面和原型，但不是通用图片生成或画布设计工具。" },
    files: { level: "direct", title: "完整代码库上下文", detail: "可读取和修改多文件项目，并在差异视图中审查结果。" },
    automation: { level: "direct", title: "终端与开发 Agent", detail: "可执行开发命令、测试和多步编码任务。" },
    boundary: "Agent 可能修改多个文件或执行命令；应先建立 Git 记录并逐步审查差异。",
    chooseWhen: "你明确要构建软件或网页，而不是处理通用办公任务。",
  },
  {
    toolId: "vscode",
    positioning: "通用代码编辑器和开发工作台，本身不是独立 AI 助手。",
    onboarding: { level: "direct", title: "基础安装简单", detail: "可直接编辑文件；AI 能力需要另装扩展或连接服务。" },
    bestFor: "需要稳定编辑器、终端和可自由选择扩展的开发用户。",
    visual: { level: "conditional", title: "通过代码和扩展实现", detail: "可开发网页与 UI，图片能力取决于扩展、模型或项目工具。" },
    files: { level: "direct", title: "项目文件工作台", detail: "直接编辑本地项目，并提供扩展、调试和版本控制界面。" },
    automation: { level: "conditional", title: "终端、任务与扩展", detail: "可运行终端和项目任务，自动化能力来自配置与扩展。" },
    boundary: "扩展拥有不同权限；只安装可信发布者，并理解工作区任务可能执行命令。",
    chooseWhen: "你需要可控、通用的开发环境，并愿意自行选择 AI 扩展。",
  },
  {
    toolId: "nodejs",
    positioning: "JavaScript 运行环境，是许多 Agent、脚本和开发工具的基础依赖。",
    onboarding: { level: "direct", title: "安装 LTS 即可", detail: "安装后获得 node、npm 和 npx，但它不是面向任务的 AI 界面。" },
    bestFor: "运行 npm 工具、JavaScript 项目和 DeepSeek Harness 等依赖。",
    visual: { level: "not-primary", title: "不是设计工具", detail: "可作为网页或图片处理项目的运行基础，但自身不提供设计能力。" },
    files: { level: "conditional", title: "由脚本决定", detail: "Node.js 脚本可以读写文件，权限和影响由具体项目决定。" },
    automation: { level: "conditional", title: "脚本运行基础", detail: "能够执行自动化脚本，但需要具体代码或上层工具。" },
    boundary: "npm 包可能执行安装脚本；只运行可信项目和官方命令。",
    chooseWhen: "目标工具明确要求 Node.js、npm 或 npx。",
  },
  {
    toolId: "git",
    positioning: "记录和恢复文件变更的版本控制基础工具。",
    onboarding: { level: "conditional", title: "概念多于安装难度", detail: "安装简单，但需要理解仓库、提交、分支和远程同步。" },
    bestFor: "保护代码和文件修改、建立可恢复记录及团队协作。",
    visual: { level: "not-primary", title: "不生成视觉内容", detail: "只负责记录视觉或代码文件的版本变化。" },
    files: { level: "direct", title: "记录文件变更", detail: "跟踪、比较和恢复项目文件，但不会理解其内容。" },
    automation: { level: "conditional", title: "命令与钩子", detail: "可通过命令、Hooks 和 CI 工作流参与自动化。" },
    boundary: "强制覆盖和清理命令可能丢失工作；提交前还要排除密钥与隐私文件。",
    chooseWhen: "你需要保护修改、恢复错误或与代码平台协作。",
  },
  {
    toolId: "python",
    positioning: "适用于自动化、数据和 AI 项目的通用编程语言与运行环境。",
    onboarding: { level: "conditional", title: "基础安装容易，项目配置按需", detail: "需要理解 pip、虚拟环境和不同项目的版本要求。" },
    bestFor: "编写自动化脚本、处理数据或运行依赖 Python 的 AI 项目。",
    visual: { level: "conditional", title: "依赖库和模型", detail: "可通过绘图、图像处理或生成模型库完成视觉任务，本身不提供统一界面。" },
    files: { level: "direct", title: "脚本可处理本地文件", detail: "能够读写、转换和批量处理文件，范围由代码决定。" },
    automation: { level: "direct", title: "通用自动化语言", detail: "适合数据、文件、网络和 AI 工作流脚本。" },
    boundary: "第三方包和脚本可能执行任意代码；应使用虚拟环境并核对来源。",
    chooseWhen: "你需要自己编写或运行数据、自动化和 AI 脚本。",
  },
  {
    toolId: "cc-switch",
    positioning: "集中管理多种 AI 编程 CLI 提供方、模型和配置的图形工具。",
    onboarding: { level: "conditional", title: "已有 CLI 后再使用", detail: "界面直观，但需要先理解 API 密钥、提供方和配置文件。" },
    bestFor: "已经同时使用多种 AI CLI，并经常切换模型或提供方的用户。",
    visual: { level: "not-primary", title: "不负责视觉生成", detail: "只管理 CLI 配置，不是内容或设计工具。" },
    files: { level: "conditional", title: "管理配置文件", detail: "会读取、修改和备份受支持 CLI 的配置。" },
    automation: { level: "not-primary", title: "不执行 Agent 任务", detail: "帮助切换配置，但实际任务由对应 CLI 完成。" },
    boundary: "配置和备份可能包含 API 密钥，不应上传或发送给他人。",
    chooseWhen: "你已经有多个 AI CLI，需要集中切换和备份配置。",
  },
  {
    toolId: "github-desktop",
    positioning: "用图形界面完成 Git 提交、分支和同步的版本管理工具。",
    onboarding: { level: "direct", title: "适合 Git 新手", detail: "可视化显示变更，但仍需理解提交、发布和仓库可见性。" },
    bestFor: "想先用图形界面学习 Git 和管理 GitHub 仓库的用户。",
    visual: { level: "not-primary", title: "不生成视觉内容", detail: "图形界面只用于查看和管理文件变更。" },
    files: { level: "direct", title: "可视化管理仓库", detail: "显示差异、提交、分支和同步状态。" },
    automation: { level: "not-primary", title: "以手动版本操作为主", detail: "不负责执行 AI 或通用自动化任务。" },
    boundary: "发布前确认仓库公开性，并检查密钥、隐私文件和删除范围。",
    chooseWhen: "你需要用图形界面保护项目修改并同步到 GitHub。",
  },
  {
    toolId: "ollama",
    positioning: "在自己的电脑上下载、运行和调用模型的本地模型环境。",
    onboarding: { level: "conditional", title: "安装不难，硬件与模型选择较难", detail: "需要评估内存、显卡、磁盘和模型尺寸。" },
    bestFor: "希望在本机运行模型，或为其他开发工具提供本地模型接口的用户。",
    visual: { level: "experimental", title: "视觉理解与实验性生图", detail: "可运行视觉模型；图片生成接口与适配模型仍属实验性路线。" },
    files: { level: "conditional", title: "通过上层应用处理文件", detail: "Ollama 提供模型服务，文件操作通常由连接它的客户端或 Agent 完成。" },
    automation: { level: "conditional", title: "API 与工具调用", detail: "可连接脚本、开发工具和 Agent，但本身不是完整自动化工作台。" },
    boundary: "本地运行仍需遵守模型许可证并保护网络接口；硬件不足会直接影响可用性。",
    chooseWhen: "你明确需要本地模型，并愿意承担硬件、模型和接口配置。",
  },
];

export const comparisonPresets = [
  { label: "ChatGPT vs Claude", toolIds: ["chatgpt-desktop", "claude-desktop"] },
  { label: "办公 Agent 三选", toolIds: ["tencent-workbuddy", "kimi-work", "trae-work"] },
  { label: "开发 Agent 三选", toolIds: ["cursor", "deepseek-harness", "hermes-agent"] },
];

export function getComparisonProfile(toolId: string) {
  return comparisonProfiles.find((profile) => profile.toolId === toolId);
}
