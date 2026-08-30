"use client";

import { useEffect, useState } from "react";

type ContentTemplateId = "article" | "social" | "video";
type RunState = "idle" | "running" | "complete";

type ContentTemplate = {
  id: ContentTemplateId;
  icon: string;
  title: string;
  category: string;
  prompt: string;
  goal: string;
  outcome: string;
  preparation: string[];
  tools: string;
  alternatives: string;
  workflow: string[];
  statuses: string[];
  acceptance: string[];
  boundaries: string[];
  next: string;
};

const contentTemplates: ContentTemplate[] = [
  {
    id: "article",
    icon: "✎",
    title: "文章与文案编辑",
    category: "写作与编辑",
    prompt: "面向第一次尝试数字整理的普通读者，写一篇关于“如何从一个小习惯开始整理个人资料”的短文。语气友好但不过度口语化，先给出大纲，再完成正文；不要编造统计数据，并标记仍需要事实核对的内容。",
    goal: "从清晰简报出发，完成结构、初稿和事实检查提示。",
    outcome: "一篇带大纲、正文、待核验标记和发布摘要的内容稿。",
    preparation: ["明确读者与发布渠道", "整理必须准确的信息和参考资料", "确定语气、篇幅与希望读者采取的行动"],
    tools: "通用写作 AI + 可保留批注和版本的文档工具",
    alternatives: "先人工完成大纲，再让 AI 逐段协助编辑",
    workflow: ["确认目标与读者", "整理事实和限制", "建立大纲", "完成初稿", "检查事实、语气与重复内容"],
    statuses: ["读取创作简报与受众信息", "建立标题和内容大纲", "按照大纲生成初稿", "检查重复、空泛和事实性表述", "整理发布摘要与待核验项"],
    acceptance: ["标题与正文目标一致", "结构容易浏览", "事实性内容已标记核验", "语气适合目标读者"],
    boundaries: ["不能把未经确认的信息写成事实", "引用与数字需要回到来源检查", "AI 初稿仍需要人工编辑和最终署名判断"],
    next: "核对资料并完成编辑后，可以从这篇母内容生成社交图文或短视频脚本。",
  },
  {
    id: "social",
    icon: "▧",
    title: "社交媒体图文包",
    category: "文案与视觉",
    prompt: "为“周末城市阅读计划”制作一套社交媒体图文内容。交付一个简短标题、正文、行动引导和封面构图说明。整体安静、清晰、留白充足，封面标题必须易读，并为图片保留明确的安全区域。",
    goal: "把同一核心信息组织为文案、行动引导和封面视觉。",
    outcome: "一套包含发布文案、封面构图和规格说明的社交图文内容包。",
    preparation: ["确认平台和目标画幅", "准备核心信息、活动时间和授权素材", "明确品牌语气与禁止出现的视觉元素"],
    tools: "写作 AI + 图片生成或设计排版工具",
    alternatives: "使用现有授权照片，在常规设计工具中人工排版",
    workflow: ["确定单一核心信息", "编写标题与正文", "规划封面阅读顺序", "建立图文一致性", "检查尺寸、文字和素材授权"],
    statuses: ["提取活动主题和行动目标", "生成标题、正文与行动引导", "规划封面构图和文字安全区域", "统一文案与视觉语气", "生成图文内容包预览"],
    acceptance: ["封面重点唯一明确", "标题在缩略图中可读", "正文包含必要信息", "视觉与文案表达一致"],
    boundaries: ["封面预览只是版式示意，不是最终图片", "人物、字体和图片素材要确认授权", "不能用夸张标题掩盖与正文不一致的内容"],
    next: "替换为已授权的真实素材，并按目标平台检查尺寸、压缩质量与发布规则。",
  },
  {
    id: "video",
    icon: "▷",
    title: "短视频创作工作流",
    category: "脚本与分镜",
    prompt: "为“每天十分钟整理数字文件”制作一条四十五秒的竖屏短视频方案。需要前三秒开场、旁白、字幕重点、六个镜头的画面说明和结尾行动引导。不要假装已经生成真实视频，最后用分镜与时间线交付制作方案。",
    goal: "把一个主题转换成可执行的脚本、旁白、字幕和镜头计划。",
    outcome: "一份四十五秒竖屏视频的脚本、六镜分镜表与制作时间线。",
    preparation: ["确认平台、画幅与目标时长", "准备可用图片、视频、音乐和声音素材", "明确是否出镜及声音、肖像授权"],
    tools: "写作 AI + 视频生成或剪辑工具 + 字幕与配音工具",
    alternatives: "使用手机拍摄与普通剪辑软件，AI 只负责脚本和分镜",
    workflow: ["明确前三秒与核心信息", "写旁白和字幕", "拆分镜头与时长", "匹配素材和声音", "检查节奏、授权与导出规格"],
    statuses: ["确定平台、时长和观看目标", "建立开场、正文与结尾结构", "编写旁白和字幕重点", "拆分六个镜头与素材需求", "生成分镜卡片和制作时间线"],
    acceptance: ["前三秒说明观看理由", "旁白与字幕不过度重复", "镜头时长合计合理", "每个镜头都有可执行素材说明"],
    boundaries: ["分镜方案不代表真实视频已经生成", "克隆声音和使用人物肖像前必须获得授权", "音乐、视频片段和生成素材仍需检查许可"],
    next: "准备授权素材并完成粗剪，先检查信息节奏，再决定是否增加动画、配音或生成镜头。",
  },
];

export function ContentCreationLab() {
  const [templateId, setTemplateId] = useState<ContentTemplateId>("article");
  const [runState, setRunState] = useState<RunState>("idle");
  const [activeStatus, setActiveStatus] = useState(-1);
  const [reduceMotion, setReduceMotion] = useState(false);
  const template = contentTemplates.find((item) => item.id === templateId) ?? contentTemplates[0];

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (runState !== "running") return;
    if (activeStatus >= template.statuses.length - 1) {
      const finishTimer = window.setTimeout(() => setRunState("complete"), reduceMotion ? 120 : 650);
      return () => window.clearTimeout(finishTimer);
    }
    const timer = window.setTimeout(() => setActiveStatus((step) => step + 1), reduceMotion ? 80 : 760);
    return () => window.clearTimeout(timer);
  }, [activeStatus, reduceMotion, runState, template.statuses.length]);

  function selectTemplate(id: ContentTemplateId) {
    setTemplateId(id);
    setRunState("idle");
    setActiveStatus(-1);
  }

  function startDemo() {
    setActiveStatus(0);
    setRunState("running");
  }

  const progress = runState === "complete" ? 100 : runState === "idle" ? 0 : Math.round(((activeStatus + 1) / template.statuses.length) * 88);

  return (
    <section className="content-creation-lab" aria-labelledby="content-lab-title">
      <header className="content-lab-heading"><div><span>单次创作演示 · 非实时 AI</span><h3 id="content-lab-title">从创作简报，到一份完整内容成果</h3><p>三个模板分别演示文章、社交图文与短视频方案，只进行一次完整生成。</p></div><b>{progress}%</b></header>

      <div className="content-lab-window">
        <div className="content-lab-toolbar"><span><i aria-hidden="true">✦</i> 内容创作工作台</span><small>预设主题 · 无上传 · 无外部请求</small></div>
        <div className="content-lab-scroll" aria-live="polite">
          {runState === "idle" && <>
            <div className="content-lab-welcome"><span aria-hidden="true">{template.icon}</span><small>先完成内容简报</small><h4>{template.title}</h4><p>{template.goal}</p></div>
            <article className="content-project-brief"><div><section><small>01 · 项目目标</small><p>{template.goal}</p></section><section><small>02 · 最终成果</small><p>{template.outcome}</p></section><section><small>03 · 开始前准备</small><ul>{template.preparation.map((item) => <li key={item}>{item}</li>)}</ul></section><section><small>04 · 推荐工具组合</small><p><strong>主要方案：</strong>{template.tools}</p><p><strong>替代方案：</strong>{template.alternatives}</p></section></div><details><summary><span>05 · 实际创作流程</span><b>查看 {template.workflow.length} 个步骤</b></summary><ol>{template.workflow.map((item) => <li key={item}>{item}</li>)}</ol></details></article>
          </>}

          {runState !== "idle" && <>
            <div className="content-chat-message user"><small>你的创作需求 · 06 起始提示词</small><p>{template.prompt}</p></div>
            <article className="content-process-card"><header><span><i className={runState === "running" ? "running" : ""} />{runState === "complete" ? "创作完成" : "AI 正在组织内容"}</span><b>{progress}%</b></header><ol>{template.statuses.map((status, index) => <li className={index < activeStatus || runState === "complete" ? "done" : index === activeStatus ? "current" : ""} key={status}><span>{index < activeStatus || runState === "complete" ? "✓" : index + 1}</span>{status}</li>)}</ol></article>
          </>}

          {runState === "complete" && <>
            <div className="content-chat-message assistant"><small>创作助手</small><p>{template.id === "article" ? "内容稿已经完成。我先建立了大纲，再生成正文，并把需要补充来源或人工确认的表述单独标记。" : template.id === "social" ? "图文内容包已经完成，标题、正文、行动引导和封面构图围绕同一个核心信息组织。" : "四十五秒视频方案已经完成，下面给出旁白、字幕重点、六镜分镜和制作时间线。"}</p></div>

            {template.id === "article" && <article className="content-article-result"><header><span>内容稿 · 可继续编辑</span><small>约 650 字 · 2 处待核验</small></header><div className="content-article-layout"><aside><strong>内容大纲</strong><ol><li>为什么先从小范围开始</li><li>建立一个固定入口</li><li>每天只处理一种资料</li><li>如何保持习惯</li></ol></aside><section><span className="content-result-tag">生活方式 · 入门</span><h4>整理数字资料，不必从清空一切开始</h4><p>真正让人疲惫的，往往不是文件数量，而是不知道下一份资料应该放在哪里。与其安排一次漫长的大扫除，不如先建立一个每天都能完成的小动作。</p><p>第一周只需要选择一个入口，例如下载文件夹或手机相册。每天花十分钟处理当天新增的内容：留下需要的，删除确认无用的，再把其余内容放进名称清楚的文件夹。</p><blockquote><strong>待核验：</strong>如果需要加入效率提升数据，应补充可靠来源，不能直接生成百分比。</blockquote></section></div><footer>发布摘要：先建立可以坚持的小流程，再逐步整理历史资料。</footer></article>}

            {template.id === "social" && <article className="content-social-result"><section className="content-social-copy"><small>发布文案</small><h4>这个周末，带一本书去城市里坐一会</h4><p>不用完成一整本，也不用制定复杂计划。选一个安静角落，留出四十分钟，把手机放到一边，从十页开始。</p><ul><li>时间：周六下午</li><li>地点：城市公共阅读空间</li><li>行动：保存这份路线，选择离你最近的一站</li></ul><strong>#周末阅读计划 · #城市散步</strong></section><section className="content-cover-canvas" aria-label="社交媒体封面版式预览"><div className="content-cover-orbit" /><span>WEEKEND READING</span><h4>周末<br />阅读计划</h4><p>从十页开始，让城市慢下来</p><footer><b>06 / SAT</b><i>城市阅读路线</i></footer></section><aside><strong>封面构图说明</strong><p>标题位于左侧安全区域；装饰图形保持低对比度，避免影响缩略图阅读；活动日期固定在底部。</p><span>竖版封面</span><span>标题安全区</span><span>低饱和视觉</span></aside></article>}

            {template.id === "video" && <article className="content-video-result"><header><span>45 秒竖屏视频方案</span><small>6 个镜头 · 旁白与字幕</small></header><section className="content-video-hook"><small>00:00–00:03 · 开场</small><strong>“你的下载文件夹，是不是已经找不到昨天的文件？”</strong><p>画面：快速扫过混乱文件列表，字幕只保留“找不到昨天的文件？”</p></section><div className="content-storyboard-grid">{[["01","混乱文件夹","快速浏览散乱文件"],["02","建立入口","创建“今日待整理”"],["03","只做一种","选择图片或文档"],["04","删除与归类","保留、删除、移动"],["05","十分钟结束","计时结束立即停止"],["06","行动引导","今晚从下载文件夹开始"]].map(([number,title,copy]) => <article key={number}><span>{number}</span><div aria-hidden="true"><i /><i /><i /></div><strong>{title}</strong><p>{copy}</p></article>)}</div><section className="content-video-timeline"><header><span>制作时间线</span><small>总时长 45 秒</small></header><div><i className="hook">开场 3s</i><i className="body">步骤演示 34s</i><i className="end">结尾 8s</i></div><p>旁白与字幕保留同一核心信息，但字幕只显示关键词，避免整段重复。</p></section></article>}

            <article className="content-result-review"><section><small>07 · 项目验收清单</small><div>{template.acceptance.map((item) => <span key={item}>{item}</span>)}</div></section><section><small>08 · 常见问题与边界</small><ul>{template.boundaries.map((item) => <li key={item}>{item}</li>)}</ul></section><section><small>09 · 下一步建议</small><p>{template.next}</p></section></article>
          </>}
        </div>

        <footer className="content-lab-composer"><div className="content-template-list" aria-label="选择内容创作模板">{contentTemplates.map((item) => <button className={item.id === templateId ? "active" : ""} disabled={runState === "running"} type="button" key={item.id} onClick={() => selectTemplate(item.id)}><i aria-hidden="true">{item.icon}</i><span><strong>{item.title}</strong><small>{item.category} · 单次生成</small></span></button>)}</div><div className="content-composer-input"><span><small>06 · 起始提示词</small><strong>{template.prompt}</strong></span><button aria-label={runState === "complete" ? "重新演示" : runState === "running" ? "创作中" : "发送并创作"} className={runState === "running" ? "running" : ""} disabled={runState === "running"} title={runState === "complete" ? "重新演示" : "发送并创作"} type="button" onClick={startDemo}><i className="composer-send-arrow" aria-hidden="true" /></button></div><p><strong>说明：</strong>当前内容、封面和分镜均为预设教学演示，不调用真实 AI，也不会生成或上传真实媒体文件。预览用于说明创作工作流，不代表最终发布成果。</p></footer>
      </div>
    </section>
  );
}
