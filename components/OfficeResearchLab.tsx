"use client";

import { useEffect, useState } from "react";

type OfficeTemplateId = "research" | "meeting" | "spreadsheet";
type RunState = "idle" | "running" | "complete";

type OfficeTemplate = {
  id: OfficeTemplateId;
  icon: string;
  title: string;
  category: string;
  mode: "file" | "inline" | "table";
  prompt: string;
  goal: string;
  outcome: string;
  preparation: string[];
  tools: string;
  alternatives: string;
  sources: { name: string; type: "DOCX" | "PDF" | "TXT" | "XLSX" }[];
  statuses: string[];
  workflow: string[];
  acceptance: string[];
  boundaries: string[];
  upgrade: string;
};

const officeTemplates: OfficeTemplate[] = [
  {
    id: "research",
    icon: "⌕",
    title: "多来源研究简报",
    category: "资料研究",
    mode: "file",
    prompt: "请比较这三份资料，整理共同结论、相互冲突的信息和仍待确认的问题。重要结论必须标明来源，不要补写资料中没有的事实，最后交付一份可以继续编辑的研究简报。",
    goal: "把分散来源整理成可追溯、可复核的简短研究结论。",
    outcome: "一份包含摘要、来源、争议点和待确认事项的研究简报。",
    preparation: ["明确研究问题与阅读对象", "准备来源名称、日期和原始文件", "区分必须核对与仅供参考的信息"],
    tools: "具备长文理解与引用整理能力的 AI + 可编辑文档工具",
    alternatives: "先人工摘录关键段落，再交给通用 AI 整理",
    sources: [{ name: "行业年度报告", type: "PDF" }, { name: "官方数据说明", type: "DOCX" }, { name: "访谈摘要", type: "TXT" }],
    statuses: ["识别文件结构与来源信息", "提取数字、日期和主要观点", "比较共同结论与冲突内容", "标记缺少依据的待确认项", "生成可编辑研究简报"],
    workflow: ["限定研究问题", "登记来源与日期", "提取事实与观点", "比较一致与冲突信息", "生成简报并逐项核对"],
    acceptance: ["结论标明依据", "冲突信息未被强行合并", "待确认事项清楚列出", "文件结构便于继续编辑"],
    boundaries: ["AI 可能生成看似真实但不存在的引用", "二手来源不能自动替代原始资料", "关键数字与日期必须回到原文确认"],
    upgrade: "建立固定研究模板与可信来源清单，再考虑连接搜索、知识库或自动化更新流程。",
  },
  {
    id: "meeting",
    icon: "☷",
    title: "会议记录整理",
    category: "结构化纪要",
    mode: "inline",
    prompt: "请把这段会议记录整理为会议结论、已确认决定、行动项、负责人、截止日期和未解决问题。没有明确负责人或日期时请标记待确认，不要自行补全。",
    goal: "从冗长记录中提取决定、行动项和仍需确认的问题。",
    outcome: "一份可以直接复核和分派任务的结构化会议纪要。",
    preparation: ["保留完整原始记录", "确认参会者称呼与项目背景", "标记不能公开的内部信息"],
    tools: "通用 AI + 文档或团队协作工具",
    alternatives: "先用转写工具得到文本，再人工校正人名和专业词",
    sources: [{ name: "产品周会记录", type: "TXT" }],
    statuses: ["识别人名、议题和时间信息", "区分讨论、决定与行动项", "匹配负责人和截止日期", "标记没有明确归属的问题", "生成结构化会议纪要"],
    workflow: ["校正原始记录", "识别主要议题", "提取决定与行动项", "核对负责人和日期", "由参会者确认后分发"],
    acceptance: ["决定与讨论明确区分", "行动项包含负责人", "缺失日期被标记待确认", "没有添加会议中未出现的结论"],
    boundaries: ["自动转写可能误识别人名和术语", "讨论意见不等于已确认决定", "涉及员工、客户或合同的信息要先脱敏"],
    upgrade: "固定纪要格式，并在人工确认后再连接任务管理或日程系统。",
  },
  {
    id: "spreadsheet",
    icon: "▦",
    title: "表格清理与分析",
    category: "数据处理",
    mode: "table",
    prompt: "请检查这份活动报名表，统一日期和城市格式，标记空值与重复记录，但不要擅自猜测缺失数据。完成后说明做了哪些处理，并给出清理前后的对照与简单统计。",
    goal: "识别重复、空值和格式问题，得到可继续分析的规范数据。",
    outcome: "一份保留处理说明、异常标记和基础统计的清理结果。",
    preparation: ["备份原始表格并确认字段含义", "明确去重规则和缺失值处理方式", "移除不需要处理的个人敏感字段"],
    tools: "支持表格理解的 AI + Excel、表格软件或 Python",
    alternatives: "数据量较小时使用公式和筛选手动复核",
    sources: [{ name: "活动报名表_原始", type: "XLSX" }],
    statuses: ["读取字段与数据类型", "定位重复项、空值和异常格式", "统一日期与城市写法", "保留无法确认的数据标记", "生成清理结果与处理摘要"],
    workflow: ["备份并理解字段", "定义清理规则", "定位异常数据", "生成清理副本", "抽样复核与统计"],
    acceptance: ["原始文件仍然保留", "重复与空值处理可解释", "日期和分类格式一致", "统计结果与清理后数据相符"],
    boundaries: ["字段名称相似不代表含义相同", "缺失数据不能凭空补全", "公式、单位和筛选范围都可能造成错误结论"],
    upgrade: "把确认过的清理规则保存为脚本或工作流，用于下一批同结构数据。",
  },
];

function FileTypeIcon({ type }: { type: OfficeTemplate["sources"][number]["type"] }) {
  return <span className={`office-file-icon ${type.toLowerCase()}`} aria-hidden="true"><svg viewBox="0 0 36 42" role="img"><path d="M5 1.5h17l9 9V40.5H5z" /><path d="M22 1.5v9h9" /><path d="M10 19h16M10 25h16M10 31h11" /></svg><b>{type}</b></span>;
}

export function OfficeResearchLab() {
  const [templateId, setTemplateId] = useState<OfficeTemplateId>("research");
  const [runState, setRunState] = useState<RunState>("idle");
  const [activeStatus, setActiveStatus] = useState(-1);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [tableView, setTableView] = useState<"original" | "cleaned">("cleaned");
  const [reduceMotion, setReduceMotion] = useState(false);
  const template = officeTemplates.find((item) => item.id === templateId) ?? officeTemplates[0];

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
    const timer = window.setTimeout(() => setActiveStatus((step) => step + 1), reduceMotion ? 80 : 780);
    return () => window.clearTimeout(timer);
  }, [activeStatus, reduceMotion, runState, template.statuses.length]);

  function selectTemplate(id: OfficeTemplateId) {
    setTemplateId(id);
    setRunState("idle");
    setActiveStatus(-1);
    setPreviewOpen(false);
    setTableView("cleaned");
  }

  function startDemo() {
    setRunState("running");
    setActiveStatus(0);
    setPreviewOpen(false);
  }

  const progress = runState === "complete" ? 100 : runState === "idle" ? 0 : Math.round(((activeStatus + 1) / template.statuses.length) * 88);
  const fileName = template.id === "research" ? "研究简报_v1.docx" : "活动报名表_清理结果.xlsx";

  return (
    <section className="office-research-lab" aria-labelledby="office-lab-title">
      <header className="office-lab-heading"><div><span>三种办公成果演示 · 非实时 AI</span><h3 id="office-lab-title">整理输入资料，完成可复核的办公成果</h3><p>三个模板分别演示文件交付、对话内纪要和表格前后对照，不读取真实文件。</p></div><b>{progress}%</b></header>

      <div className="office-lab-window">
        <div className="office-lab-toolbar"><span><i aria-hidden="true">✣</i> 办公研究工作台</span><small>预设数据 · 无上传 · 无外部请求</small></div>
        <div className="office-lab-scroll" aria-live="polite">
          {runState === "idle" && <>
            <div className="office-lab-welcome"><span aria-hidden="true">{template.icon}</span><small>先看清任务边界</small><h4>{template.title}</h4><p>{template.goal}</p></div>
            <article className="office-project-brief">
              <div><section><small>01 · 项目目标</small><p>{template.goal}</p></section><section><small>02 · 最终成果</small><p>{template.outcome}</p></section><section><small>03 · 开始前准备</small><ul>{template.preparation.map((item) => <li key={item}>{item}</li>)}</ul></section><section><small>04 · 推荐工具组合</small><p><strong>主要方案：</strong>{template.tools}</p><p><strong>替代方案：</strong>{template.alternatives}</p></section></div>
              <details><summary><span>05 · 实际操作流程</span><b>查看 {template.workflow.length} 个步骤</b></summary><ol>{template.workflow.map((item) => <li key={item}>{item}</li>)}</ol></details>
            </article>
          </>}

          {runState !== "idle" && <>
            <div className="office-source-message"><small>用于本次演示的模拟资料</small><div>{template.sources.map((source) => <article key={source.name}><FileTypeIcon type={source.type} /><span><strong>{source.name}</strong><small>{source.type} · 示例文件</small></span></article>)}</div></div>
            <div className="office-chat-message user"><small>你的任务 · 06 起始提示词</small><p>{template.prompt}</p></div>
            <div className="office-process-card"><header><span><i className={runState === "running" ? "running" : ""} />{runState === "complete" ? "处理完成" : "AI 正在处理资料"}</span><b>{progress}%</b></header><ol>{template.statuses.map((status, index) => <li className={index < activeStatus || runState === "complete" ? "done" : index === activeStatus ? "current" : ""} key={status}><span>{index < activeStatus || runState === "complete" ? "✓" : index + 1}</span>{status}</li>)}</ol></div>
          </>}

          {runState === "complete" && <>
            <div className="office-chat-message assistant"><small>教学助手</small><p>{template.id === "research" ? "已整理三个来源：提取了共同结论，并将两处相互冲突的信息保留为待确认项。完整内容已经放入可编辑简报。" : template.id === "meeting" ? "已将讨论内容分为已确认决定、行动项和未解决问题；没有明确负责人或日期的内容均保留为待确认。" : "已完成格式检查：发现一条重复记录、两处日期格式不一致和一个空值。清理结果保留了异常标记，没有猜测缺失内容。"}</p></div>

            {template.mode === "file" && <article className="office-delivery-card"><div><FileTypeIcon type="DOCX" /><span><small>已完成文件</small><strong>{fileName}</strong><em>3 个来源 · 2 处待确认 · 第一版</em></span></div><button type="button" onClick={() => setPreviewOpen((open) => !open)}>{previewOpen ? "收起预览" : "预览文件"}</button></article>}
            {template.mode === "file" && previewOpen && <article className="office-document-preview"><header><span>研究简报</span><small>标准版</small></header><h4>社区数字服务使用情况研究</h4><p className="lead">三份资料均显示移动端使用持续增加，但不同年龄群体对辅助入口的需求存在明显差异。</p><section><strong>共同结论</strong><ul><li>移动端已经成为主要访问入口。</li><li>首次使用者更依赖清晰的步骤说明。</li></ul></section><section><strong>冲突与待确认</strong><ul><li>年度报告与访谈对高频用户的定义不同。</li><li>部分增长数据尚未在官方说明中得到确认。</li></ul></section><footer>来源：行业年度报告 [1] · 官方数据说明 [2] · 访谈摘要 [3]</footer></article>}

            {template.mode === "inline" && <article className="office-minutes-result"><header><span>会议纪要 · 结构化结果</span><small>标准视图</small></header><section><strong>已确认决定</strong><p>新版帮助中心优先完成搜索与入门路径，视觉更新延后到第二阶段。</p></section><section><strong>行动项</strong><div className="office-action-table"><span>林然</span><p>整理首批问题清单</p><b>9 月 5 日</b><span>周宁</span><p>确认搜索数据字段</p><b>待确认</b><span>待确认</span><p>补充旧页面迁移范围</p><b>9 月 8 日</b></div></section><section><strong>未解决问题</strong><p>旧版收藏记录是否需要迁移，仍需产品与开发共同确认。</p></section></article>}

            {template.mode === "table" && <><article className="office-delivery-card"><div><FileTypeIcon type="XLSX" /><span><small>清理结果</small><strong>{fileName}</strong><em>8 行数据 · 4 处问题 · 保留原始文件</em></span></div><button type="button" onClick={() => setTableView((view) => view === "cleaned" ? "original" : "cleaned")}>{tableView === "cleaned" ? "查看原始" : "查看清理后"}</button></article><article className="office-table-preview"><header><span>{tableView === "cleaned" ? "清理结果" : "原始数据"}</span><small>前后对照</small></header><div className="office-table-grid"><b>姓名</b><b>日期</b><b>城市</b><b>状态</b><span>陈宁</span><span>{tableView === "cleaned" ? "2026-08-30" : "8/30/26"}</span><span>{tableView === "cleaned" ? "上海" : "沪"}</span><em>有效</em><span>林悠</span><span className={tableView === "cleaned" ? "" : "issue"}>{tableView === "cleaned" ? "2026-08-31" : "31-8-26"}</span><span>杭州</span><em>已统一</em><span>周朗</span><span>2026-08-31</span><span className="issue">待补充</span><em>需确认</em></div></article></>}

            <article className="office-result-review"><section><small>07 · 项目验收清单</small><div>{template.acceptance.map((item) => <span key={item}>{item}</span>)}</div></section><section><small>08 · 常见问题与边界</small><ul>{template.boundaries.map((item) => <li key={item}>{item}</li>)}</ul></section><section><small>09 · 下一步升级</small><p>{template.upgrade}</p></section></article>
          </>}
        </div>

        <footer className="office-lab-composer">
          <div className="office-template-list" aria-label="选择办公研究模板">{officeTemplates.map((item) => <button className={item.id === templateId ? "active" : ""} disabled={runState === "running"} type="button" key={item.id} onClick={() => selectTemplate(item.id)}><i aria-hidden="true">{item.icon}</i><span><strong>{item.title}</strong><small>{item.category} · {item.mode === "inline" ? "对话内交付" : item.mode === "table" ? "表格对照" : "文件交付"}</small></span></button>)}</div>
          <div className="office-composer-input"><span><small>06 · 起始提示词</small><strong>{template.prompt}</strong></span><button aria-label={runState === "complete" ? "重新演示" : runState === "running" ? "处理中" : "发送并处理"} className={runState === "running" ? "running" : ""} disabled={runState === "running"} title={runState === "complete" ? "重新演示" : "发送并处理"} type="button" onClick={startDemo}><i className="composer-send-arrow" aria-hidden="true" /></button></div>
          <p><strong>说明：</strong>演示中的资料、处理过程和文件均为预设内容，本站不会读取或上传你的真实文件。文件卡片用于表现办公交付流程，不代表已经调用 AI 生成真实 DOCX 或 XLSX。</p>
        </footer>
      </div>
    </section>
  );
}
