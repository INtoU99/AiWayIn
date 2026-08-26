export type QuestionCategoryId = "download-install" | "environment" | "account-api" | "choosing" | "safety" | "open-source";

export type QuestionLink = {
  label: string;
  href: string;
};

export type QuestionItem = {
  id: string;
  categoryId: QuestionCategoryId;
  question: string;
  answer: string;
  keywords: string;
  steps?: string[];
  code?: string[];
  links?: QuestionLink[];
  notice?: { title: string; text: string; tone: "warning" | "safe" | "info" };
  featured?: boolean;
};

export const questionCategories: Array<{ id: QuestionCategoryId; title: string; mark: string; description: string }> = [
  { id: "download-install", title: "下载与安装", mark: "01", description: "处理下载、系统兼容、安装失败、更新与卸载。" },
  { id: "environment", title: "环境与终端", mark: "02", description: "认识命令行、Node.js、Python、Docker 与 API 配置。" },
  { id: "account-api", title: "账号、API 与费用", mark: "03", description: "说明注册、登录、API、订阅、计费与网络边界。" },
  { id: "choosing", title: "工具能力与选择", mark: "04", description: "区分桌面助手、Agent、图片能力与本地模型。" },
  { id: "safety", title: "权限、隐私与安全", mark: "05", description: "理解文件权限、管理员权限、敏感信息与容器边界。" },
  { id: "open-source", title: "开源项目与部署", mark: "06", description: "读懂 GitHub、Release、许可证和 Docker 部署。" },
];

export const questions: QuestionItem[] = [
  {
    id: "official-download-source",
    categoryId: "download-install",
    question: "应该从哪里下载工具？",
    answer: "优先使用本站标注的官方入口。下载前核对域名、操作系统和处理器架构，不要从网盘、陌生论坛或第三方“绿色版”页面下载安装包。",
    keywords: "官方 下载 安装包 域名 系统 架构 来源",
    links: [{ label: "前往工具导航", href: "/tools" }, { label: "查看安装指南", href: "/#guides" }],
    notice: { title: "下载边界", text: "本站只整理经过核对的官方入口，不镜像来历不明的安装包。", tone: "safe" },
    featured: true,
  },
  {
    id: "download-no-response",
    categoryId: "download-install",
    question: "点击下载后没有反应怎么办？",
    answer: "先查看浏览器下载记录、弹窗与下载权限，再确认网络连接和磁盘空间。仍然失败时，进入工具详情页并使用“前往官方下载”重新选择版本。",
    keywords: "点击 下载 没反应 浏览器 弹窗 权限 磁盘",
    steps: ["检查浏览器是否拦截弹窗或自动下载", "确认下载目录仍有足够空间", "从工具详情页重新进入官方页面"],
    links: [{ label: "浏览全部工具", href: "/tools" }],
  },
  {
    id: "installer-blocked",
    categoryId: "download-install",
    question: "安装包无法打开或被系统拦截怎么办？",
    answer: "常见原因包括文件未完整下载、系统版本不支持、处理器架构不符，或安装包来源无法验证。不要直接关闭安全防护，应先核对文件来源和官方系统要求。",
    keywords: "安装包 打不开 拦截 安全警告 系统版本 架构",
    steps: ["确认文件来自官方域名", "重新下载并核对文件大小", "查看详情页中的系统与前置条件"],
    notice: { title: "不要跳过验证", text: "如果系统持续提示来源未知，应停止安装并返回官方网站核对。", tone: "warning" },
  },
  {
    id: "update-uninstall-data",
    categoryId: "download-install",
    question: "更新或卸载工具会删除数据吗？",
    answer: "不同工具的处理方式不同。卸载前应备份本地项目、配置、对话导出、模型和容器数据，不要默认卸载程序会保留全部内容。",
    keywords: "更新 卸载 删除 数据 配置 备份 模型 容器",
    steps: ["查看官方卸载与更新说明", "备份项目和无法重新生成的数据", "区分应用程序、配置、缓存与用户文件"],
  },

  {
    id: "command-not-found",
    categoryId: "environment",
    question: "输入命令后提示“找不到命令”怎么办？",
    answer: "通常是工具尚未安装、终端没有重新打开，或安装目录没有加入系统路径。先关闭并重新打开终端，再运行对应的版本检测命令。",
    keywords: "命令 找不到 command not found path 终端 环境变量",
    links: [{ label: "开始环境自检", href: "/#guides" }],
    featured: true,
  },
  {
    id: "node-npm-npx",
    categoryId: "environment",
    question: "Node.js、npm 和 npx 是什么关系？",
    answer: "Node.js 是 JavaScript 运行环境，npm 和 npx 通常会随 Node.js 一起安装，不需要分别下载。三条检测命令都能返回版本信息，才说明基础环境可用。",
    keywords: "node nodejs npm npx 关系 安装 版本",
    code: ["node --version", "npm --version", "npx --version"],
    links: [{ label: "查看 Node.js 说明", href: "/tools/nodejs" }],
  },
  {
    id: "python-pip-mismatch",
    categoryId: "environment",
    question: "Python 已安装，为什么 pip 仍然不可用？",
    answer: "电脑中可能存在多个 Python 环境，导致 Python 与 pip 指向不同位置。项目依赖建议安装在独立虚拟环境中，并让 pip 通过同一个 Python 解释器运行。",
    keywords: "python pip 不可用 多版本 虚拟环境 venv",
    code: ["Windows：py -m pip --version", "macOS / Linux：python3 -m pip --version"],
    links: [{ label: "查看 Python 说明", href: "/tools/python" }],
  },
  {
    id: "docker-wsl-unavailable",
    categoryId: "environment",
    question: "Docker Desktop 为什么提示 WSL 2 或虚拟化不可用？",
    answer: "Windows 上运行 Docker Desktop 通常需要 WSL 2 和硬件虚拟化。先查看 WSL 版本，再检查 Windows 功能与 BIOS / UEFI 虚拟化设置，不要盲目修改不熟悉的系统选项。",
    keywords: "docker desktop wsl2 虚拟化 bios uefi windows",
    code: ["wsl --version"],
    links: [{ label: "查看 Docker 说明", href: "/tools/docker" }],
    featured: true,
  },
  {
    id: "use-api-key",
    categoryId: "environment",
    question: "如何使用 API Key？",
    answer: "API Key 需要填写到支持对应服务的应用、Agent、代码项目或配置工具中。以 DeepSeek 的 OpenAI 兼容接口为例，Base URL 是接口基础地址，不是端口；模型名称应以当前官方文档为准。",
    keywords: "api key base url endpoint deepseek 环境变量 配置",
    code: ["服务提供方：DeepSeek", "API Base URL：https://api.deepseek.com", "API Key：你在开放平台创建的密钥", "模型名称：以 DeepSeek 当前官方文档为准"],
    links: [{ label: "DeepSeek API 快速开始", href: "https://api-docs.deepseek.com/" }],
    notice: { title: "密钥安全", text: "不要把密钥写入公开代码、截图或聊天记录。发生泄漏时应立即停用旧密钥并创建新密钥。", tone: "warning" },
    featured: true,
  },

  {
    id: "no-google-email",
    categoryId: "account-api",
    question: "没有 Google 账号或 Gmail 怎么办？",
    answer: "如果你会频繁使用海外 AI 服务，个人 Gmail 通常是较通用、便捷的登录选择之一，因为不少产品提供 Google 登录；但它并不是所有服务的必需条件。应先查看官方登录页是否支持普通邮箱、Apple 或 Microsoft 等方式。Google 账号也不等同于 Gmail：Google 官方允许使用现有的非 Gmail 邮箱创建账号。",
    keywords: "google gmail 邮箱 谷歌账号 注册 登录 youtube bilibili",
    steps: ["先确认目标产品支持哪些登录方式", "计划长期使用多种海外 AI 服务时，可从 Google 官方页面注册由自己控制的 Gmail，并设置本人的恢复邮箱或手机号", "已有其他邮箱时，也可按官方说明用它创建 Google 账号", "视频教程只作为界面参考，不在陌生页面输入密码或验证码"],
    links: [{ label: "Google 官方注册说明", href: "https://support.google.com/accounts/answer/27441?hl=zh-Hans" }, { label: "YouTube", href: "https://www.youtube.com/" }, { label: "哔哩哔哩", href: "https://www.bilibili.com/" }],
    notice: { title: "购买账号前请确认风险", text: "是否购买由用户自行判断。交易前应确认账号来源、是否可更改密码与恢复邮箱或手机号、是否绑定他人实名或支付信息、是否多人共享，以及平台是否允许账号转让；不要向陌生卖家提供身份证件、验证码或常用密码，尽量使用具备争议处理能力的付款方式，并预先考虑账号被找回、封禁或无法退款的风险。本站不参与账号交易、代购或售后。", tone: "warning" },
  },
  {
    id: "downloaded-but-cannot-login",
    categoryId: "account-api",
    question: "为什么工具可以下载，却无法登录或使用？",
    answer: "安装包下载和在线服务访问是两个不同环节。问题可能来自网络连接、服务开放地区、账号状态、系统时间或官方服务故障，应优先查看官方状态和帮助页面。",
    keywords: "下载 登录 访问 账号 网络 地区 服务故障",
    notice: { title: "访问边界", text: "本站不提供代理、节点、线路或绕过地区限制的方法。", tone: "info" },
  },
  {
    id: "subscription-versus-api",
    categoryId: "account-api",
    question: "ChatGPT 或 Claude 的订阅可以直接用于 API 吗？",
    answer: "通常不能直接等同。网页或桌面应用订阅与开发者 API 一般拥有不同的额度和计费系统；使用前应分别查看产品订阅页和开发平台的官方说明。",
    keywords: "chatgpt claude 订阅 api 额度 计费 通用",
    links: [{ label: "了解 API 获取方式", href: "#question-access-api" }],
  },
  {
    id: "free-tool-costs",
    categoryId: "account-api",
    question: "免费工具为什么仍然可能产生费用？",
    answer: "工具本身免费不代表模型、API、云服务器或第三方服务免费。执行任务前应确认使用的是本地模型、免费额度，还是按量计费的在线接口。",
    keywords: "免费 费用 api token 云服务器 第三方 额度",
    steps: ["确认费用由工具、模型还是云服务收取", "设置余额提醒或使用上限", "先用小任务验证计费方式"],
  },
  {
    id: "proxy-service-boundary",
    categoryId: "account-api",
    question: "本站能否帮助解决网络代理或线路问题？",
    answer: "本站只整理客户端和官方入口，不提供、销售或推荐节点、线路、订阅及代理服务。涉及网络服务时，请遵守所在地规定并谨慎辨别第三方来源。",
    keywords: "代理 线路 节点 订阅 网络 vpn 边界",
    links: [{ label: "查看资源导航说明", href: "/resources#platform-clients" }],
    notice: { title: "资金安全", text: "不要向来源不明的个人或网站付款，也不要提供账号密码、验证码或身份证明。", tone: "warning" },
  },
  {
    id: "access-api",
    categoryId: "account-api",
    question: "如何开通并访问 API？",
    answer: "以 DeepSeek 为例，需要进入官方开放平台注册并登录，根据实际需求充值，再到 API Keys 页面创建密钥。API 通常按输入和输出量计费，与网页对话会员不是同一种服务。",
    keywords: "deepseek api 开通 充值 api keys 密钥 计费",
    steps: ["进入 DeepSeek 官方开放平台并登录", "阅读当前模型价格，根据实际需求充值", "在 API Keys 页面创建密钥并安全保存", "先用少量额度完成第一次测试"],
    links: [{ label: "DeepSeek 开放平台", href: "https://platform.deepseek.com/" }, { label: "API Keys 页面", href: "https://platform.deepseek.com/api_keys" }, { label: "官方价格说明", href: "https://api-docs.deepseek.com/quick_start/pricing/" }],
    notice: { title: "费用与密钥边界", text: "本站不代充、不出售 API Key，也不推荐共享密钥或低价代充值服务。", tone: "warning" },
  },
  {
    id: "subscribe-ai-service",
    categoryId: "account-api",
    question: "如何订阅 AI 服务？",
    answer: "以 ChatGPT 为例，应先确保可以通过官方网页或官方应用正常登录，再使用结账页面实际显示的官方支付方式。网页、Apple App Store 和 Google Play 会分别管理各自购买的订阅。iPhone 用户如果通过 ChatGPT 官方 iOS 应用订阅，可在所在地区、Apple 账户与礼品卡均符合 Apple 规则的前提下，将礼品卡兑换为 Apple 账户余额并尝试支付 App Store 订阅；实际是否可用仍以 Apple 付款页面为准，部分购买可能还会要求绑定其他付款方式。",
    keywords: "订阅 chatgpt 付款 visa mastercard app store apple 账户余额 礼品卡 充值卡 google play 续费",
    steps: ["确认账户和所在地区处于产品官方支持范围", "阅读套餐价格、续费周期和退款规则", "从官方网页或官方应用进入订阅页面", "iPhone 用户使用礼品卡前，确认卡片与 Apple 账户地区匹配、余额足够覆盖本次及后续续费", "付款前确认没有在其他渠道重复订阅"],
    links: [{ label: "ChatGPT 官方入口", href: "https://chatgpt.com/" }, { label: "ChatGPT iOS 订阅说明", href: "https://help.openai.com/en/articles/7905739-chatgpt-subscription" }, { label: "Apple 礼品卡兑换说明", href: "https://support.apple.com/zh-cn/118242" }],
    notice: { title: "账号与支付边界", text: "礼品卡和账户余额并非在所有地区或所有购买中都可用，兑换前请核对 Apple 官方规则；不要购买来源不明、地区不符或要求提供账号密码的礼品卡与代充服务。本站不出售、不代注册账号，也不提供代订阅、代充值或支付渠道。", tone: "warning" },
    featured: true,
  },

  {
    id: "desktop-versus-agent",
    categoryId: "choosing",
    question: "桌面 AI 应用和 Agent 有什么区别？",
    answer: "桌面 AI 应用更适合对话、文件分析、创作和轻量任务；Agent 通常还能访问工作目录、调用终端或执行多步骤操作，因此配置和权限风险也更高。",
    keywords: "桌面应用 agent 区别 终端 文件 自动化 权限",
    links: [{ label: "进入工具对比", href: "/compare" }],
    featured: true,
  },
  {
    id: "skill-versus-mcp",
    categoryId: "choosing",
    question: "什么是 Skill 与 MCP？",
    answer: "Skill（技能）是为 AI 整理的一套可复用任务方法和配套资源，可能包含操作步骤、模板、参考资料或脚本，让 Agent 处理某类工作时更加稳定。MCP（Model Context Protocol，模型上下文协议）是一套开放连接标准，让支持它的 AI 应用能够发现并使用外部服务提供的工具、数据资源和提示。通俗地说，Skill 像一份岗位操作手册，MCP 则像统一规格的插座与数据接口。",
    keywords: "skill skills 技能 mcp model context protocol 模型上下文协议 agent 工具 资源 插件 连接",
    steps: [
      "Skill 主要回答“这项任务应该怎么做”：例如规定制作报告时先核对数据、再生成图表，最后检查引用。",
      "MCP 主要解决“AI 可以连接什么、怎样调用”：例如通过 MCP 服务器读取数据库、访问 Git 仓库或调用业务系统工具。",
      "二者可以配合：Skill 负责告诉 Agent 采用什么流程，MCP 负责提供流程中需要的数据与操作能力；没有 MCP，Skill 也可以指导本地任务，没有专用 Skill，Agent 也可能直接调用 MCP 工具。",
    ],
    links: [{ label: "MCP 官方说明", href: "https://modelcontextprotocol.io/" }],
    notice: { title: "能力不等于可信", text: "Skill 可能包含脚本或操作指令，MCP 可能读取数据或执行写入、发送与删除操作。安装或连接前应核对来源、权限范围、密钥处理和具体操作，并只开放完成任务所需的最小权限。", tone: "warning" },
  },
  {
    id: "image-support-meaning",
    categoryId: "choosing",
    question: "“支持图片”是指能看图还是能生成图片？",
    answer: "图片理解是分析上传的图片；图片生成是根据文字创建新图；图片编辑则是在现有图片基础上修改。选择工具时应区分这三种能力。",
    keywords: "图片 理解 生图 生成 编辑 多模态",
    links: [{ label: "比较工具能力", href: "/compare" }],
  },
  {
    id: "choose-one-tool",
    categoryId: "choosing",
    question: "我应该只选择一个 AI 工具吗？",
    answer: "不需要。新手可以先选择一个通用工具，再按实际需求补充代码 Agent、本地模型或专业创作工具，没有必要一次安装全部工具。",
    keywords: "选择 一个 多个 ai 工具 新手 组合",
    links: [{ label: "使用入门路线", href: "/#guides" }],
  },
  {
    id: "local-model-safety",
    categoryId: "choosing",
    question: "本地模型是否一定比在线模型更安全？",
    answer: "不一定。本地运行可以减少部分数据离开设备，但模型服务、插件、开放端口和本地文件权限仍然需要正确配置，安全性取决于完整的使用方式。",
    keywords: "本地模型 在线模型 安全 隐私 端口 插件",
    links: [{ label: "查看 Ollama 说明", href: "/tools/ollama" }],
  },

  {
    id: "agent-file-access",
    categoryId: "safety",
    question: "为什么 Agent 可以修改我的文件？",
    answer: "Agent 需要读取和修改文件才能完成编程、整理或自动化任务。应只授权必要的工作目录，并使用 Git 或备份保留修改记录。",
    keywords: "agent 文件 修改 工作目录 权限 git 备份",
    links: [{ label: "查看 Git 说明", href: "/tools/git" }],
    featured: true,
  },
  {
    id: "administrator-permission",
    categoryId: "safety",
    question: "安装失败时可以直接使用管理员权限吗？",
    answer: "不建议把管理员权限作为默认解决办法。应先确认工具是否真的需要提升权限、安装包是否来自官方，以及即将执行的命令会修改哪些系统内容。",
    keywords: "管理员 root sudo 权限 安装失败 系统",
    notice: { title: "先理解再授权", text: "来源不明的脚本、命令或安装程序不应获得管理员权限。", tone: "warning" },
  },
  {
    id: "files-not-to-upload",
    categoryId: "safety",
    question: "哪些文件不应该上传给 AI？",
    answer: "密码、API Key、身份证明、财务资料、未公开合同、私人聊天记录和包含客户信息的文件都应谨慎处理。上传前应删除或遮盖不必要的敏感内容。",
    keywords: "上传 文件 隐私 密码 api key 合同 客户 脱敏",
    notice: { title: "最小化提供", text: "只提供完成任务真正需要的内容，并先确认账户与产品的数据设置。", tone: "safe" },
  },
  {
    id: "docker-not-absolute-isolation",
    categoryId: "safety",
    question: "Docker 容器是否完全隔离且绝对安全？",
    answer: "不是。容器可以限制部分环境，但挂载目录、开放端口、Docker socket 和高权限配置仍可能影响主机。不要运行来源不明的镜像或授权整个磁盘。",
    keywords: "docker 容器 隔离 安全 socket 端口 挂载 镜像",
    links: [{ label: "查看 Docker 安全边界", href: "/tools/docker" }],
  },

  {
    id: "github-project-cannot-run",
    categoryId: "open-source",
    question: "为什么 GitHub 项目下载后不能直接运行？",
    answer: "GitHub 仓库通常是源代码，不一定包含可直接打开的安装程序。运行前需要阅读 README，并确认 Node.js、Python、Docker、模型或其他依赖。",
    keywords: "github 项目 下载 不能运行 源码 readme 依赖",
    links: [{ label: "浏览 GitHub 项目", href: "/resources#github-projects" }],
    featured: true,
  },
  {
    id: "readme-release-source",
    categoryId: "open-source",
    question: "README、Release 和源码下载有什么区别？",
    answer: "README 是使用说明；Release 通常提供已经发布的版本和安装文件；“Download ZIP”通常只是下载源码。新手应优先阅读 README，并查看项目是否提供 Release。",
    keywords: "readme release download zip 源码 安装包 github",
  },
  {
    id: "open-source-commercial-use",
    categoryId: "open-source",
    question: "开源项目是否可以免费商用？",
    answer: "不一定。“开源”不代表可以无限制使用。需要查看 LICENSE 文件，并确认模型、字体、图片、声音和训练数据是否还有额外授权要求。",
    keywords: "开源 免费 商用 license 许可证 模型 素材 授权",
    notice: { title: "许可优先", text: "无法确认许可证或素材权利时，不应直接用于商业项目。", tone: "info" },
  },
  {
    id: "docker-versus-native-install",
    categoryId: "open-source",
    question: "Docker 部署和直接安装有什么区别？",
    answer: "直接安装会把运行环境和依赖放在本机系统中；Docker 将它们组织在容器内，更容易复现和清理，但需要额外理解镜像、容器、端口、卷和 Compose。",
    keywords: "docker 部署 直接安装 容器 镜像 compose 端口 卷",
    links: [{ label: "查看 Docker 说明", href: "/tools/docker" }],
  },
];

export function getQuestionCategory(categoryId: QuestionCategoryId) {
  return questionCategories.find((category) => category.id === categoryId);
}
