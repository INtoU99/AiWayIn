import type { Metadata } from "next";

import { AdvancedPracticeLab } from "@/components/AdvancedPracticeLab";
import { AgentAutomationLab } from "@/components/AgentAutomationLab";
import { ContentCreationLab } from "@/components/ContentCreationLab";
import { OfficeResearchLab } from "@/components/OfficeResearchLab";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "AI 与 Agent 进阶计划 | 开启使用 AI 的第一步",
  description: "从一个真实的小目标出发，选择内容创作、应用构建与设计、办公研究或 Agent 自动化方向，逐步建立适合自己的 AI 工作流。",
};

const advancedDirections = [
  {
    id: "content",
    index: "01",
    title: "AI 内容创作",
    description: "从内容目标出发，组织策划、写作、视觉与视频素材，形成适合不同平台的完整成果。",
    tags: ["策划与表达", "图文与视听", "发布与复用"],
    starter: "先完成一份简洁的内容创作简报，再决定使用文字、图片还是视频表达",
    foundations: [
      ["目标、受众与行动", "明确内容给谁看、解决什么问题，以及希望用户阅读或观看后理解什么、采取什么行动。"],
      ["核心信息与事实依据", "区分必须准确的事实、来源观点与允许创作的表达，重要数字、日期和引用需要人工核对。"],
      ["渠道与内容规格", "提前说明发布平台、篇幅、画幅、时长、分辨率和文件格式，避免完成后才发现无法使用。"],
      ["风格、语气与视觉一致性", "约定文字语气、色彩方向、构图、镜头语言和禁止出现的内容，让不同素材保持统一。"],
      ["素材、版权与授权", "确认图片、字体、音乐、声音、人物肖像和品牌素材是否允许使用，AI 生成不等于天然没有版权风险。"],
      ["版本、反馈与人工复核", "先生成结构或样稿，再检查事实、表达、画面与平台要求；保留原始素材和不同版本。"],
    ],
    checks: ["核心信息和行动目标是否清楚", "事实、数字与引用是否可核对", "文字与视觉是否保持一致", "素材是否具备使用与发布权限"],
    tone: "blue",
  },
  {
    id: "coding",
    index: "02",
    title: "AI 应用构建与设计",
    description: "让 AI 参与需求、原型、交互、代码与交付，构建网页、轻应用、小工具、脚本或插件。",
    tags: ["需求与原型", "代码与交互", "测试与交付"],
    starter: "从一个小型原型、现有项目中的明确功能，或一个能够稳定复现的问题开始",
    foundations: [
      ["产品形态与运行环境", "先说明要构建网页、桌面轻应用、命令行工具、浏览器扩展还是宿主软件插件，以及目标系统、设备和交付方式。"],
      ["语言、运行时与版本", "明确 JavaScript、TypeScript、Python 等语言，以及浏览器、Node.js、Python 等运行环境和版本要求，避免混用不兼容的语法。"],
      ["框架、平台接口与依赖", "说明现有框架、允许增加的第三方依赖，以及扩展权限、插件接口或系统能力等平台约束；能用已有能力完成时不盲目增加依赖。"],
      ["输入输出、数据与状态", "说明工具读取什么、处理什么、保存到哪里，并考虑空数据、重复执行、运行失败和状态变化等情况。"],
      ["结构边界与质量要求", "约定目录与模块职责、命名、错误处理、修改范围、测试方式和交付形式；小项目保持清楚即可，不必强行套用复杂架构。"],
      ["界面与交互（按需）", "项目包含界面时，再补充信息层级、组件状态、操作反馈、响应式和可访问性；脚本或后台工具不必为了展示而增加界面。"],
    ],
    checks: ["功能是否符合需求", "原有功能是否受到影响", "代码是否可运行、可测试并说明改动"],
    tone: "violet",
  },
  {
    id: "office",
    index: "03",
    title: "AI 办公与研究",
    description: "处理真实资料与数据，通过来源核对、格式约束和人工复查，得到可以继续使用的办公成果。",
    tags: ["资料与证据", "文档与数据", "整理与交付"],
    starter: "从一份真实但范围较小的资料开始，把它整理成可以检查和继续使用的结果",
    foundations: [
      ["任务与交付目标", "明确要生成摘要、报告、表格、演示文稿、会议纪要还是行动清单，以及交付给谁继续使用。"],
      ["输入资料与上下文", "区分原始文件、任务说明、参考范例和不可修改内容，避免 AI 把不同来源或不同版本混在一起。"],
      ["来源与证据等级", "优先使用官方资料、一手数据和可信机构，明确区分已证实事实、来源观点与 AI 推断。"],
      ["文档与数据规范", "约定标题层级、字段、日期、单位、缺失值、文件格式和命名方式，让结果便于继续编辑。"],
      ["隐私、权限与版本", "保留原始文件和版本记录；上传前先脱敏，只提供完成任务真正需要的内容。"],
      ["验证与人工复核", "数字、日期、引用、公式和关键结论必须回到原始资料检查，不能因为表达流畅就默认正确。"],
    ],
    checks: ["结论能否追溯到资料", "数字、日期与引用是否准确", "是否把推断写成事实", "文件是否便于继续编辑"],
    tone: "mint",
  },
  {
    id: "agent",
    index: "04",
    title: "AI Agent 与自动化",
    description: "从一项已经人工跑通的重复任务开始，组合 Skills、MCP、定时触发与工具权限，建立可复用流程。",
    tags: ["触发与流程", "Skills 与 MCP", "验收与恢复"],
    starter: "先找到一项能够稳定重复的小任务，人工完整执行一次并记录每一步",
    foundations: [
      ["触发条件与运行频率", "说明流程由用户手动、定时、文件变化还是外部事件触发，并明确时区、重复触发和停止条件。"],
      ["输入、步骤与输出", "把任务写成“读取什么、处理什么、判断什么、生成什么、保存或通知到哪里”的简单链路。"],
      ["Skill、MCP 与工具选择", "Skill 约定任务做法，MCP 连接外部工具或资料，API 提供结构化能力；只选择当前流程真正需要的部分。"],
      ["权限与人工确认", "遵循最小权限，默认优先读取和生成；发送、发布、付款、删除和覆盖等高风险操作保留人工确认。"],
      ["状态、去重与重复运行", "记录已经处理的内容和上次运行位置，避免重复发送、重复创建任务或反复处理同一文件。"],
      ["失败、恢复与运行记录", "为网络超时、来源失效、格式异常和部分成功保留日志、停止条件与恢复方式。"],
    ],
    checks: ["重复运行是否会产生冲突", "失败后能否发现并恢复", "权限是否限制在必要范围", "关键外部操作是否保留人工确认"],
    tone: "indigo",
  },
] as const;

const advancedGrowthPaths = [
  {
    index: "01",
    title: "AI 内容创作",
    tone: "content",
    abilities: [
      ["Prompt Engineering（提示词工程）", "掌握角色与目标设定、受众和风格控制、示例与限制条件、多轮迭代，以及在支持的生成工具中使用负面提示，让输出从能用逐步变得准确可控。"],
      ["AI 工作流搭建", "把文案、图片、视频、配音、字幕与剪辑按顺序组织成可复用流程，减少重复整理，避免无差别批量生成。"],
      ["多模态内容整合", "根据表达目标组合文本、图像、音频和视频，让不同媒介承担各自适合的信息，避免简单堆叠素材。"],
      ["AI 版权与伦理合规", "了解不同地区、平台和素材来源对版权、人物授权、声音使用与 AI 标识的要求，降低下架、侵权和误导风险。"],
      ["内容策略 × AI 协同", "让 AI 参与草稿、变体与素材整理，人负责选题、事实、受众洞察和最终调性。"],
    ],
    tip: "先固定受众、目标和交付形式，再讨论风格，通常比单纯堆叠形容词更有效。",
  },
  {
    index: "02",
    title: "AI 应用构建与设计",
    tone: "coding",
    abilities: [
      ["自然语言编程（Vibe Coding）", "用自然语言描述需求，驱动 AI 生成可运行代码，并通过阅读、测试、调试和小步修改把结果变成能够理解与维护的项目。"],
      ["AI 辅助 UI/UX 设计", "使用 AI 辅助生成页面结构、组件、交互原型和视觉方案，再由人检查信息层级、使用体验与整体一致性。"],
      ["API 集成与数据流设计", "理解应用如何读取输入、调用模型或外部服务、处理结果并保存数据，为文本、图像或语音能力建立清晰的数据流。"],
      ["快速原型验证（MVP 思维）", "用较短时间完成可以点击、运行或演示的最小版本，先验证核心需求，再决定是否增加复杂功能。"],
      ["AI 产品需求拆解", "把模糊想法拆成界面、数据、Prompt、知识检索、Agent 和存储等可执行模块，并只采用项目真正需要的部分。"],
    ],
    tip: "先让 AI 做出最小可运行版本，再逐步增加功能；改动范围越清楚，出现问题时越容易定位。",
  },
  {
    index: "03",
    title: "AI 办公与研究",
    tone: "office",
    abilities: [
      ["结构化信息检索", "围绕明确问题组织检索、来源和证据，优先使用一手资料，并对不同来源的结论进行交叉核验。"],
      ["提示词模板化", "为会议纪要、邮件、报告和数据分析等高频场景保存可修改的任务模板，让背景、输入、输出与验收要求能够复用。"],
      ["AI 辅助数据分析", "通过自然语言协助清理 Excel 或 CSV、生成图表、识别趋势与异常，同时回到原始数据检查计算和结论。"],
      ["文档智能处理", "处理长文档摘要、多文档比较、关键信息提取与引用整理，更高效地阅读论文、合同、报告或内部资料。"],
      ["人机协作写作规范", "建立“AI 起草 → 人工审核 → AI 按反馈修改 → 人工定稿”的稳定流程，保留版本和事实依据。"],
    ],
    tip: "要求 AI 明确区分原文事实、合理推断和待确认内容，可以显著降低误用信息的风险。",
  },
  {
    index: "04",
    title: "AI Agent 与自动化",
    tone: "agent",
    abilities: [
      ["工作流编排（Orchestration）", "理解触发、条件分支、循环、人工确认与错误处理，再使用合适的平台组织更复杂的自动化流程。"],
      ["RAG 系统搭建", "理解文档整理、切片、向量化、检索与生成的基本链路，让 AI 在可追溯的私有知识范围内回答问题。"],
      ["Agent 架构设计", "逐步理解 ReAct、Plan-and-Execute 等决策方式，并根据任务复杂度判断单个 Agent、多个角色或普通脚本哪种更合适。"],
      ["工具调用（Tool Use）", "为 Agent 配置搜索、API、数据库、文件或代码执行能力，同时限定参数、目录、权限与需要人工确认的操作。"],
      ["自动化监控与调试", "查看执行日志、费用、失败原因和输出质量，持续优化任务说明、工具配置与恢复流程，让自动化能够长期稳定运行。"],
    ],
    tip: "先把同一流程手动稳定完成三次，再考虑自动执行；无法稳定复现的流程不适合直接自动化。",
  },
] as const;

export default function AdvancedPage() {
  return (
    <main className="site-shell detail-shell advanced-page" id="top">
      <SiteHeader activePage="advanced" />

      <section className="advanced-hero">
        <div>
          <span className="eyebrow">从会使用，到能够独立完成</span>
          <h1>从一个真实的小目标开始，<br />建立属于你的 AI 工作流</h1>
        </div>
        <p>工具可以按实际需要安装。进阶阶段需要理解目标、组织上下文、选择合适的能力，并让每一步都有可以检查的结果。</p>
      </section>

      <aside className="advanced-introduction" aria-labelledby="advanced-introduction-title">
        <span className="advanced-introduction-mark" aria-hidden="true">↗</span>
        <div>
          <strong id="advanced-introduction-title">使用 AI 没有标准化的唯一路径，适合你的方向才是更好的选择。</strong>
          <p>不必急于构建大型项目，先从一个能够落地的小目标开始。你可以把 AI 用在真实场景中，例如处理重复性工作、搜集和整合资料、整理办公文档或编排日程，再逐步把有效的步骤组合成属于自己的工作流。如果暂时不知道从哪里开始，可以先参考下面这些方向。</p>
          <div className="advanced-example-tags" aria-label="适合开始尝试的场景">
            <span>重复工作</span><span>资料整合</span><span>文档处理</span><span>日程编排</span>
          </div>
        </div>
      </aside>

      <section className="advanced-directions" aria-labelledby="advanced-directions-title">
        <div className="advanced-section-heading">
          <div><span className="section-kicker">选择你的进阶方向</span><h2 id="advanced-directions-title">先找到值得解决的问题，再决定使用什么工具</h2></div>
          <p>这些方向可以单独开始，也可以在熟悉后相互组合。首个目标越具体，就越容易判断 AI 是否真正帮到了你。</p>
        </div>

        <aside className="advanced-learning-note"><span aria-hidden="true">i</span><p><strong>先理解骨架，不必先学完理论</strong>下面的专业概念用于帮助你给 AI 更明确的背景、限制和验收标准。开始时只需知道它们分别解决什么问题，再在实际项目中逐步深入。</p></aside>

        <div className="advanced-direction-grid">
          {advancedDirections.map((direction) => (
            <details className={`advanced-direction-card ${direction.tone}`} key={direction.id}>
              <summary>
                <span className="advanced-direction-index">{direction.index}</span>
                <span className="advanced-direction-summary-copy"><small>进阶方向</small><strong>{direction.title}</strong><span>{direction.description}</span></span>
                <span className="advanced-direction-summary-side"><span className="advanced-direction-tags">{direction.tags.map((tag) => <span key={tag}>{tag}</span>)}</span><b aria-hidden="true">＋</b></span>
              </summary>
              {direction.id === "content" ? <div className="advanced-code-lesson-stack advanced-content-lesson-stack">
                <details className="advanced-code-lesson-card">
                  <summary><span><small>起点</small><strong>先写一份内容创作简报</strong></span><b aria-hidden="true">＋</b></summary>
                  <div className="advanced-code-starter-horizontal"><div><strong>{direction.starter}</strong><p>先确定目标、受众和发布渠道，再决定是否需要长文、图片、配音或视频，不必一开始同时制作所有媒介。</p></div><div className="advanced-coding-entry-tags" aria-label="内容创作的常见起点"><span>文章与文案</span><span>社交图文</span><span>短视频工作流</span></div></div>
                </details>
                <details className="advanced-code-lesson-card">
                  <summary><span><small>基础框架</small><strong>开始生成前，先把创作条件说明清楚</strong></span><b aria-hidden="true">＋</b></summary>
                  <div className="advanced-code-lesson-body"><div className="advanced-foundation-grid">{direction.foundations.map(([title, description]) => <article key={title}><strong>{title}</strong><p>{description}</p></article>)}</div></div>
                </details>
                <details className="advanced-code-lesson-card">
                  <summary><span><small>能力范围</small><strong>AI 写文章只是内容创作的一环</strong></span><b aria-hidden="true">＋</b></summary>
                  <div className="advanced-code-lesson-body"><div className="advanced-coding-scope-intro"><p>AI 可以参与选题、大纲、写作与编辑，也能协助封面构图、图片提示、视频脚本、分镜、旁白、字幕和多平台内容转换。这些能力需要组织成连续工作流，避免分别生成无法配合的素材。它们通常按照“选题与结构 → 文字与视觉 → 组合交付 → 发布复核”的顺序协作。</p></div><div className="advanced-content-capability-grid"><span>选题、大纲与长文编辑</span><span>标题、文案与品牌语气</span><span>封面、海报与图片说明</span><span>视频脚本、分镜与旁白</span><span>字幕、配音与素材组织</span><span>一份内容的多平台复用</span></div></div>
                </details>
                <details className="advanced-code-lesson-card">
                  <summary><span><small>创作流程</small><strong>从内容目标到可以发布的完整成果</strong></span><b aria-hidden="true">＋</b></summary>
                  <div className="advanced-code-lesson-body"><ol className="advanced-content-workflow"><li><span>01</span><p><strong>明确目标与受众</strong>说明内容解决什么问题，以及希望产生什么行动。</p></li><li><span>02</span><p><strong>准备事实与素材</strong>整理可用资料、品牌信息和已经获得授权的素材。</p></li><li><span>03</span><p><strong>建立内容结构</strong>先确认大纲、叙事顺序或镜头结构，再生成完整内容。</p></li><li><span>04</span><p><strong>完成文字与视觉</strong>统一语气、构图、色彩、镜头和信息层级。</p></li><li><span>05</span><p><strong>组合媒介成果</strong>将文案、图片、旁白、字幕和视频素材对应起来。</p></li><li><span>06</span><p><strong>人工检查与导出</strong>核对事实、版权、平台规格和文件格式。</p></li><li><span>07</span><p><strong>按渠道重新组织</strong>从可靠母内容生成不同平台版本，不机械复制同一份文本。</p></li></ol><p className="advanced-content-prompt-formula">创作简报结构：目标 → 受众 → 核心信息 → 发布渠道 → 内容形式 → 风格语气 → 已有素材 → 交付要求 → 验收标准</p></div>
                </details>
                <details className="advanced-code-lesson-card">
                  <summary><span><small>验收与边界</small><strong>发布前检查事实、授权与误导风险</strong></span><b aria-hidden="true">＋</b></summary>
                  <div className="advanced-code-lesson-body"><div className="advanced-direction-checklist"><ul>{direction.checks.map((item) => <li key={item}>{item}</li>)}</ul></div><div className="advanced-content-boundaries"><article><strong>事实与表达</strong><p>AI 初稿不等于成稿。事实性内容需要核对，观点与想象不能伪装成已经发生的事实。</p></article><article><strong>素材与授权</strong><p>使用人物照片、声音、字体、音乐和品牌素材前确认授权，不要未经允许克隆声音或制作误导性内容。</p></article><article><strong>隐私与平台规则</strong><p>上传素材前先脱敏，并在发布前检查平台对 AI 内容、广告和敏感主题的规则。</p></article></div></div>
                </details>
              </div> : direction.id === "coding" ? <div className="advanced-code-lesson-stack">
                <details className="advanced-code-lesson-card">
                  <summary><span><small>起点</small><strong>可以先从这里开始</strong></span><b aria-hidden="true">＋</b></summary>
                  <div className="advanced-code-starter-horizontal"><div><strong>{direction.starter}</strong><p>先完成一次人工可检查的小流程，确认方法有效后，再考虑扩大项目范围、增加依赖或引入自动化。</p></div><div className="advanced-coding-entry-tags" aria-label="代码构建的常见起点"><span>从零构建原型</span><span>迭代现有项目</span><span>调试、测试与交付</span></div></div>
                </details>
                <details className="advanced-code-lesson-card">
                  <summary><span><small>基础框架</small><strong>让 AI 输出更规范，需要先说明哪些项目条件？</strong></span><b aria-hidden="true">＋</b></summary>
                  <div className="advanced-code-lesson-body"><div className="advanced-foundation-grid">{direction.foundations.map(([title, description]) => <article key={title}><strong>{title}</strong><p>{description}</p></article>)}</div></div>
                </details>
                <details className="advanced-code-lesson-card">
                  <summary><span><small>能力范围</small><strong>应用构建并非以页面生成为终点</strong></span><b aria-hidden="true">＋</b></summary>
                  <div className="advanced-code-lesson-body"><div className="advanced-coding-scope-intro"><p>AI 可以参与需求拆解、原型与交互设计、代码实现、问题排查、测试、文档和部署。它既能从零构建网站、脚本、轻应用、小工具或插件，也能在理解已有项目后增加功能、修复问题或整理代码。涉及界面时再明确视觉层级和交互规范；没有界面时则优先保证输入输出、运行稳定性和交付方式。每次限定改动范围，并以每一步的可验证结果判断进展。</p></div><div className="advanced-coding-process-grid"><article><small>开始前</small><strong>把需求拆成可以执行的任务</strong><p>说明目标、修改范围、输入输出、异常情况和验收标准，避免直接要求 AI 一次完成一个含义模糊的大项目。</p><span>目标 → 范围 → 输入输出 → 异常情况 → 验收标准</span></article><article><small>交付前</small><strong>测试、构建并在目标环境复查</strong><p>确认代码能够运行、核心功能符合预期、异常输入得到处理，再完成构建或打包，并检查依赖、权限、环境变量、文件路径和启动方式。</p><span>运行 → 功能检查 → 异常测试 → 构建或打包 → 目标环境复查</span></article></div></div>
                </details>
                <details className="advanced-code-lesson-card">
                  <summary><span><small>实战路径</small><strong>建立可复用的协作路径</strong></span><b aria-hidden="true">＋</b></summary>
                  <div className="advanced-code-lesson-body advanced-practice-path"><header><strong>保持良好的习惯，是提升效率的高级途径。</strong><p>先建立可恢复的版本记录和清晰的协作约束，再优化每一次交给 AI 的需求。这样即使结果不符合预期，也能定位改动、回到稳定状态并继续迭代。</p></header><div className="advanced-practice-path-steps"><article><span>01</span><div><strong>先建立版本基线</strong><p>新项目开始时使用 Git 初始化仓库；如果项目已经是仓库，不要重复初始化。确认忽略依赖、构建产物和密钥等文件，再保存一份能够正常运行的初始版本。之后尽量让一次提交只对应一个明确目标。</p></div></article><article><span>02</span><div><strong>创建精简的 AGENTS.md</strong><p>使用支持项目级指令的 AI 编程工具时，可以在仓库中放置 AGENTS.md，说明项目结构、验证命令和稳定的协作边界。它不是需求清单，也不需要写成长篇说明。</p><ul><li>执行前先确认我的真实意图，存在关键歧义时指出问题。</li><li>我的判断可能不完整，不要把它默认视为百分之百正确。</li><li>完成构建或修改后进行与风险相称的复核和验证。</li><li>避免超出需求的修改，并可以单独指出后续优化空间。</li></ul></div></article></div><section className="advanced-prompt-examples" aria-labelledby="advanced-prompt-examples-title"><div><small>03 · 提示词优化</small><strong id="advanced-prompt-examples-title">把模糊想法改成可验证的实现说明</strong><p>清晰提示词不是堆砌专业术语，而是交代技术环境、界面结构、交互路径、状态变化和完成条件。例如：</p></div><div className="advanced-prompt-example-grid"><article><h4>任务管理面板</h4><div className="prompt-before"><small>不要写</small><p>帮我写一个任务管理工具。</p></div><div className="prompt-after"><small>可以改为</small><p>用 React 和 TypeScript 做一个极简任务面板。顶部输入框通过回车添加任务；列表按未完成和已完成分组，每条任务可用复选框切换状态，底部显示未完成数量。数据在本地管理，不连接后端。页面以白色为主，完成项使用删除线并降低文字对比度。</p></div><p className="prompt-reason"><strong>为什么：</strong>明确了输入、分组、状态切换、统计方式、数据边界和完成态反馈，AI 不必再猜测业务流程。</p></article><article><h4>番茄钟计时器</h4><div className="prompt-before"><small>不要写</small><p>帮我写一个番茄钟工具。</p></div><div className="prompt-after"><small>可以改为</small><p>用原生 HTML、CSS 和 JavaScript 做一个番茄钟。中央显示分钟与秒数，初始为二十五分钟；下方提供开始、暂停和重置。倒计时归零时播放简单提示音并自动重置，最后五秒使用明确的文字与动画反馈。交付一个可以直接运行的完整 HTML 文件。</p></div><p className="prompt-reason"><strong>为什么：</strong>定义了界面结构、完整状态流转、时间条件、反馈方式和交付格式，更容易一次得到可运行结果。</p></article></div></section><aside><strong>再补充两点：</strong>不要把密钥、令牌或真实账号写进提示词和仓库；提示词仍可能遗漏条件，第一版完成后应通过运行结果继续提出小范围修改。</aside></div>
                </details>
                <details className="advanced-code-lesson-card">
                  <summary><span><small>验收</small><strong>完成后检查</strong></span><b aria-hidden="true">＋</b></summary>
                  <div className="advanced-code-lesson-body"><div className="advanced-direction-checklist"><ul>{direction.checks.map((item) => <li key={item}>{item}</li>)}</ul></div></div>
                </details>
              </div> : direction.id === "office" ? <div className="advanced-code-lesson-stack advanced-office-lesson-stack">
                <details className="advanced-code-lesson-card">
                  <summary><span><small>起点</small><strong>可以先从这里开始</strong></span><b aria-hidden="true">＋</b></summary>
                  <div className="advanced-code-starter-horizontal"><div><strong>{direction.starter}</strong><p>先明确手中已有的资料、仍然缺少的信息和最终交付格式，再让 AI 开始处理。</p></div><div className="advanced-coding-entry-tags" aria-label="办公与研究的常见起点"><span>整理已有资料</span><span>比较多个来源</span><span>转换文档或数据</span></div></div>
                </details>
                <details className="advanced-code-lesson-card">
                  <summary><span><small>基础框架</small><strong>让结果可信且可继续使用，需要先说明什么？</strong></span><b aria-hidden="true">＋</b></summary>
                  <div className="advanced-code-lesson-body"><div className="advanced-foundation-grid">{direction.foundations.map(([title, description]) => <article key={title}><strong>{title}</strong><p>{description}</p></article>)}</div></div>
                </details>
                <details className="advanced-code-lesson-card">
                  <summary><span><small>能力范围</small><strong>办公与研究不只是总结一篇文章</strong></span><b aria-hidden="true">＋</b></summary>
                  <div className="advanced-code-lesson-body"><div className="advanced-coding-scope-intro"><p>AI 可以协助长文摘要、多来源比较、研究问题拆解、引用整理、文档差异对照、表格清洗与统计、会议纪要、演示大纲和资料归档。它可以缩短资料整理过程，事实核验与专业判断仍需由人完成。</p></div><div className="advanced-office-capability-grid"><span>长文与多来源研究</span><span>文档比较与格式整理</span><span>表格清洗与数据分析</span><span>会议纪要与行动项</span><span>演示大纲与讲述逻辑</span><span>知识归档与资料转换</span></div></div>
                </details>
                <details className="advanced-code-lesson-card">
                  <summary><span><small>实战路径</small><strong>从原始资料到可复核的交付成果</strong></span><b aria-hidden="true">＋</b></summary>
                  <div className="advanced-code-lesson-body"><ol className="advanced-office-workflow"><li><span>01</span><p><strong>保留原始资料</strong>建立副本或新版本，不让 AI 直接覆盖唯一原件。</p></li><li><span>02</span><p><strong>定义用途与受众</strong>说明结果给谁看、解决什么问题以及最终格式。</p></li><li><span>03</span><p><strong>整理输入边界</strong>区分事实、观点、待确认信息和不可修改内容。</p></li><li><span>04</span><p><strong>要求保留来源</strong>让 AI 标记引用依据和无法确认的内容。</p></li><li><span>05</span><p><strong>先看结构或小样</strong>确认方向正确后再处理全部资料。</p></li><li><span>06</span><p><strong>逐项人工复核</strong>检查数字、日期、引用、公式和关键结论。</p></li><li><span>07</span><p><strong>导出并记录版本</strong>保存为可继续编辑的文件，同时保留处理说明。</p></li></ol><p className="advanced-office-prompt-formula">通用任务结构：背景与用途 → 输入资料 → 处理任务 → 不可更改内容 → 输出结构 → 来源规则 → 验收标准</p></div>
                </details>
                <details className="advanced-code-lesson-card">
                  <summary><span><small>验收与边界</small><strong>提交成果前，再做一次事实与隐私检查</strong></span><b aria-hidden="true">＋</b></summary>
                  <div className="advanced-code-lesson-body"><div className="advanced-direction-checklist"><ul>{direction.checks.map((item) => <li key={item}>{item}</li>)}</ul></div><aside className="advanced-office-privacy"><strong>上传前先脱敏</strong><p>只提供完成任务真正需要的内容。不要毫无戒备地上传身份证件、账号密码、财务信息、客户资料、商业机密、API Key 或其他高度敏感内容；确实需要处理时，应优先删除、替换或模糊无关字段，并确认所用服务的数据与隐私规则。</p></aside></div>
                </details>
              </div> : <div className="advanced-code-lesson-stack advanced-agent-lesson-stack">
                <details className="advanced-code-lesson-card">
                  <summary><span><small>起点</small><strong>自动化之前，先把流程手动跑通</strong></span><b aria-hidden="true">＋</b></summary>
                  <div className="advanced-code-starter-horizontal"><div><strong>{direction.starter}</strong><p>适合自动化的任务通常经常重复、步骤稳定、输入输出清楚，而且结果能够人工检查。不要从高风险或无法判断正确性的任务开始。</p></div><div className="advanced-coding-entry-tags" aria-label="Agent 自动化的常见起点"><span>定时资料摘要</span><span>公开来源监测</span><span>周期办公分析</span></div></div>
                </details>
                <details className="advanced-code-lesson-card">
                  <summary><span><small>基础框架</small><strong>让 Agent 稳定重复工作，需要先定义什么？</strong></span><b aria-hidden="true">＋</b></summary>
                  <div className="advanced-code-lesson-body"><div className="advanced-foundation-grid">{direction.foundations.map(([title, description]) => <article key={title}><strong>{title}</strong><p>{description}</p></article>)}</div><div className="advanced-agent-terms"><article><strong>Skill</strong><p>任务已有稳定做法时，用它告诉 Agent 应该怎样完成。</p></article><article><strong>MCP</strong><p>Agent 需要读取文件、浏览器、文档或其他服务时，用它建立连接。</p></article><article><strong>API</strong><p>程序需要按固定规则访问外部能力或数据时，通过它进行调用。</p></article><article><strong>定时任务</strong><p>流程需要在指定时间重复运行时，用它设置触发频率。</p></article></div></div>
                </details>
                <details className="advanced-code-lesson-card">
                  <summary><span><small>能力范围</small><strong>先从固定重复工作开始，熟悉后再考虑复杂节点</strong></span><b aria-hidden="true">＋</b></summary>
                  <div className="advanced-code-lesson-body"><div className="advanced-coding-scope-intro"><p>Agent 可以定时整理摘要、监测公开公告、批量处理文档与表格、生成周期报告、提取会议行动项、检查文件异常或转换固定格式。公开信息收集应优先使用官方 API、RSS 或允许访问的公开页面，并遵守访问频率、使用条款与版权要求。</p></div><div className="advanced-agent-capability-grid"><span>定时日报与周报</span><span>公开来源变化监测</span><span>批量文档与表格处理</span><span>会议行动项整理</span><span>文件异常与格式检查</span><span>固定内容格式转换</span></div></div>
                </details>
                <details className="advanced-code-lesson-card">
                  <summary><span><small>实战路径</small><strong>从一次可靠执行，逐步升级到定时运行</strong></span><b aria-hidden="true">＋</b></summary>
                  <div className="advanced-code-lesson-body"><ol className="advanced-agent-workflow"><li><span>01</span><p><strong>找到重复工作</strong>选择每周至少重复一次、结果可以检查的任务。</p></li><li><span>02</span><p><strong>记录人工步骤</strong>完整执行一次，写下输入、判断、工具和输出。</p></li><li><span>03</span><p><strong>删除不稳定步骤</strong>暂时保留需要主观判断或风险较高的人工环节。</p></li><li><span>04</span><p><strong>限定工具与权限</strong>只开放任务需要的资料、目录和服务。</p></li><li><span>05</span><p><strong>先手动触发运行</strong>观察日志、输出和异常，不急于设置定时。</p></li><li><span>06</span><p><strong>处理重复与失败</strong>加入去重、停止条件、错误说明和恢复位置。</p></li><li><span>07</span><p><strong>最后加入定时</strong>连续稳定后再设置频率，并定期检查费用与失效来源。</p></li></ol><p className="advanced-agent-prompt-formula">可靠路径：手动跑通 → 写成步骤 → 限定权限 → 单次执行 → 验证结果 → 处理失败 → 最后定时</p></div>
                </details>
                <details className="advanced-code-lesson-card">
                  <summary><span><small>验收与边界</small><strong>自动运行不等于无需人工负责</strong></span><b aria-hidden="true">＋</b></summary>
                  <div className="advanced-code-lesson-body"><div className="advanced-direction-checklist"><ul>{direction.checks.map((item) => <li key={item}>{item}</li>)}</ul></div><div className="advanced-agent-boundaries"><article><strong>不建议直接自动化</strong><p>自动付款、交易、订阅、删除重要文件、批量外发消息和未经审核的公开发布。</p></article><article><strong>公开信息收集边界</strong><p>不绕过登录、验证和访问限制，不以过高频率请求页面，优先采用官方接口和公开订阅源。</p></article><article><strong>持续运行条件</strong><p>网页关闭后不会自动运行。真实任务需要本地 Agent、桌面程序、服务器或云端调度环境持续执行。</p></article></div></div>
                </details>
              </div>}
              {direction.id === "content" && <ContentCreationLab />}
              {direction.id === "coding" && <AdvancedPracticeLab />}
              {direction.id === "office" && <OfficeResearchLab />}
              {direction.id === "agent" && <AgentAutomationLab />}
            </details>
          ))}
        </div>
      </section>

      <section className="advanced-growth" aria-labelledby="advanced-growth-title">
        <div className="advanced-growth-intro">
          <span className="section-kicker">继续探索</span>
          <h2 id="advanced-growth-title">把 AI 变成与你共同学习和解决问题的伙伴</h2>
          <p>AI 也能与你讨论理论知识、拆解复杂问题，并在实践中帮助你逐步建立自己的方法。在探索过程中，它可以成为随时交流的学习伙伴，但重要知识、事实与结论仍然需要查证。</p>
        </div>

        <div className="advanced-growth-grid">
          {advancedGrowthPaths.map((path) => (
            <article className={`advanced-growth-card ${path.tone}`} key={path.title}>
              <header>
                <span>{path.index}</span>
                <div><small>继续探索，你也许会掌握以下能力</small><h3>{path.title}</h3></div>
              </header>
              <dl>
                {path.abilities.map(([title, description]) => (
                  <div key={title}><dt>{title}</dt><dd>{description}</dd></div>
                ))}
              </dl>
              <aside><strong>Tips</strong><p>{path.tip}</p></aside>
            </article>
          ))}
        </div>

        <p className="advanced-growth-closing">有时候一个成熟的案例或工具可以让你事半功倍。保持你的探索欲，让 AI 帮你把想法一步步落地。祝你能在擅长的领域中发光发热，无限进步。</p>
      </section>
    </main>
  );
}
