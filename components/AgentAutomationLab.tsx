"use client";

import { useEffect, useState } from "react";

type AgentTemplateId = "digest" | "monitor" | "report";
type RunState = "idle" | "running" | "complete";

type AgentTemplate = {
  id: AgentTemplateId;
  icon: string;
  title: string;
  category: string;
  trigger: string;
  permission: string;
  instruction: string;
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

const agentTemplates: AgentTemplate[] = [
  {
    id: "digest",
    icon: "◴",
    title: "定时资料摘要",
    category: "周期任务",
    trigger: "每周一 09:00 · Asia/Shanghai",
    permission: "只读 3 个公开来源；只写入摘要目录",
    instruction: "每周一读取三个固定公开来源，和上次记录比较并去重，只整理新内容。按产品更新、行业信息和待跟进事项分类生成摘要；来源不可访问时记录错误，不要用猜测补全。",
    goal: "把多个固定来源的新内容整理成不重复、可追溯的每周摘要。",
    outcome: "一份分类摘要、来源清单、去重记录和下一次模拟运行时间。",
    preparation: ["确定允许访问的公开来源", "建立已处理内容记录", "约定摘要分类、保存位置和时区"],
    tools: "摘要 Skill + 公开网页或 RSS 读取能力 + 定时触发",
    alternatives: "先手动启动 Agent，每周确认结果稳定后再加入定时",
    workflow: ["到达触发时间", "读取公开来源", "和上次状态比较", "跳过重复内容", "生成分类摘要并记录运行"],
    statuses: ["检查触发时间与任务配置", "读取三个允许访问的公开来源", "载入上次已处理记录", "识别新增内容并跳过重复项", "生成分类摘要与运行日志"],
    acceptance: ["只包含本周新增内容", "每条摘要保留来源", "重复内容没有再次出现", "来源失败被明确记录"],
    boundaries: ["不绕过登录、验证或访问限制", "来源不可用时不编造缺失内容", "定时频率应符合来源规则并控制调用费用"],
    next: "稳定运行数周后，再增加失败通知和人工确认后的摘要分发。",
  },
  {
    id: "monitor",
    icon: "◎",
    title: "公开页面更新监测",
    category: "变化检测",
    trigger: "每天 10:00 手动模拟一次",
    permission: "只读一个公开更新页；只保存文本快照",
    instruction: "读取指定公开更新页，与上次保存的文本快照比较。没有变化时安静结束；有变化时按新增、修改和删除分类，并生成带位置说明的差异摘要。不要自动对外发送或发布。",
    goal: "只在公开页面真正发生变化时生成清楚、可检查的差异摘要。",
    outcome: "一份前后快照对照、变化分类、运行结论和待人工确认项。",
    preparation: ["确认页面允许公开访问", "保存一份初始文本快照", "定义值得通知的变化范围"],
    tools: "页面读取 MCP 或浏览工具 + 差异比较 Skill",
    alternatives: "优先使用官方更新日志、RSS 或变更通知接口",
    workflow: ["读取上次快照", "获取当前公开内容", "清理无意义格式变化", "比较新增、修改和删除", "有变化才生成摘要"],
    statuses: ["读取上次保存的页面快照", "访问允许监测的公开页面", "过滤时间戳与排版等无意义变化", "比较新增、修改和删除内容", "生成差异摘要并等待人工确认"],
    acceptance: ["无变化时不产生多余通知", "变化位置可以追溯", "排版变化未被误报为内容变化", "后续外部操作等待人工确认"],
    boundaries: ["不高频抓取或绕过站点限制", "页面结构变化可能造成误报", "监测结果不能替代官方公告原文"],
    next: "先积累稳定的变化判断规则，再决定是否接入通知工具或扩大监测来源。",
  },
  {
    id: "report",
    icon: "▥",
    title: "周期办公数据分析",
    category: "重复分析",
    trigger: "每周五 17:30 · 首次仅手动运行",
    permission: "只读“本周数据”目录；新建报告，不覆盖原表",
    instruction: "读取本周目录中的三份同结构表格，检查字段后合并数据，标记缺失值和异常值，计算核心指标并生成周报。任何字段不一致时停止合并并说明问题，不覆盖原始文件。",
    goal: "把重复的表格检查、合并和指标计算整理成可复核的周期报告。",
    outcome: "一份指标摘要、异常清单、处理日志和新建的模拟周报文件。",
    preparation: ["确认三份表格字段含义一致", "备份原始文件并限定只读目录", "定义指标公式、异常规则和报告模板"],
    tools: "数据分析 Skill + 表格文件读取能力 + 报告模板",
    alternatives: "先使用固定公式与人工检查，稳定后再交给 Agent 重复运行",
    workflow: ["检查文件与字段", "合并本周数据", "标记缺失和异常", "计算已确认指标", "新建报告并保留日志"],
    statuses: ["扫描允许读取的本周数据目录", "核对三份表格的字段与单位", "合并数据并保留来源标记", "计算指标、识别缺失值与异常值", "新建周报并写入处理日志"],
    acceptance: ["原始文件没有被覆盖", "指标公式与单位一致", "异常值保留说明", "报告能够追溯到来源文件"],
    boundaries: ["字段同名不代表含义完全相同", "异常数据不能在没有依据时自动修正", "报告生成后仍需业务负责人确认"],
    next: "连续手动验证结果后，再加入定时触发、失败通知和已处理文件标记。",
  },
];

export function AgentAutomationLab() {
  const [templateId, setTemplateId] = useState<AgentTemplateId>("digest");
  const [runState, setRunState] = useState<RunState>("idle");
  const [activeStatus, setActiveStatus] = useState(-1);
  const [reduceMotion, setReduceMotion] = useState(false);
  const template = agentTemplates.find((item) => item.id === templateId) ?? agentTemplates[0];

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

  function selectTemplate(id: AgentTemplateId) {
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
    <section className="agent-automation-lab" aria-labelledby="agent-lab-title">
      <header className="agent-lab-heading"><div><span>单次运行演示 · 非真实后台任务</span><h3 id="agent-lab-title">先看懂一次可靠执行，再考虑自动运行</h3><p>这里使用线性步骤、运行日志和结果记录，不使用复杂节点画布。</p></div><b>{progress}%</b></header>

      <div className="agent-lab-window">
        <div className="agent-lab-toolbar"><span><i aria-hidden="true">⌁</i> Agent 运行控制台</span><small>预设任务 · 最小权限 · 无外部操作</small></div>
        <div className="agent-lab-scroll" aria-live="polite">
          {runState === "idle" && <>
            <div className="agent-lab-welcome"><span aria-hidden="true">{template.icon}</span><small>先确认任务、触发与权限</small><h4>{template.title}</h4><p>{template.goal}</p></div>
            <article className="agent-project-brief"><header><section><small>触发方式</small><strong>{template.trigger}</strong></section><section><small>权限范围</small><strong>{template.permission}</strong></section></header><div><section><small>01 · 项目目标</small><p>{template.goal}</p></section><section><small>02 · 最终成果</small><p>{template.outcome}</p></section><section><small>03 · 开始前准备</small><ul>{template.preparation.map((item) => <li key={item}>{item}</li>)}</ul></section><section><small>04 · 推荐工具组合</small><p><strong>主要方案：</strong>{template.tools}</p><p><strong>替代方案：</strong>{template.alternatives}</p></section></div><details><summary><span>05 · 单次运行流程</span><b>查看 {template.workflow.length} 个步骤</b></summary><ol>{template.workflow.map((item) => <li key={item}>{item}</li>)}</ol></details></article>
          </>}

          {runState !== "idle" && <>
            <article className="agent-task-summary"><header><span><i aria-hidden="true">{template.icon}</i><strong>{template.title}</strong></span><b>{runState === "complete" ? "本次运行完成" : "正在运行"}</b></header><div><span><small>触发</small>{template.trigger}</span><span><small>权限</small>{template.permission}</span></div></article>
            <div className="agent-instruction-message"><small>Agent 任务说明 · 06 执行指令</small><p>{template.instruction}</p></div>
            <article className="agent-run-console"><header><span><i className={runState === "running" ? "running" : ""} />运行日志</span><b>{progress}%</b></header><ol>{template.statuses.map((status, index) => <li className={index < activeStatus || runState === "complete" ? "done" : index === activeStatus ? "current" : ""} key={status}><span>{index < activeStatus || runState === "complete" ? "✓" : index + 1}</span><p>{status}<small>{index < activeStatus || runState === "complete" ? "已完成并写入本次记录" : index === activeStatus ? "正在执行…" : "等待上一步"}</small></p></li>)}</ol></article>
          </>}

          {runState === "complete" && <>
            {template.id === "digest" && <article className="agent-digest-result"><header><span>本周资料摘要</span><small>模拟运行 · 2026-08-31 09:00</small></header><div className="agent-run-metrics"><span><b>3</b><small>成功来源</small></span><span><b>5</b><small>新增内容</small></span><span><b>2</b><small>重复跳过</small></span><span><b>0</b><small>运行错误</small></span></div><section><article><small>产品更新</small><strong>帮助中心新增批量导出说明</strong><p>来源：官方更新日志 · 本周新增</p></article><article><small>行业信息</small><strong>公开报告补充最新使用趋势</strong><p>来源：行业公开报告 · 已核对日期</p></article><article><small>待跟进</small><strong>一项公告仍缺少完整实施日期</strong><p>保留待确认，不使用推断补全</p></article></section><footer><span>运行记录已保存</span><b>下次模拟运行：下周一 09:00</b></footer></article>}

            {template.id === "monitor" && <article className="agent-monitor-result"><header><span>公开更新页 · 前后差异</span><small>检测到 3 处内容变化</small></header><div className="agent-snapshot-compare"><section><small>上次快照</small><strong>版本 2.4 更新说明</strong><p>新增导入功能，具体发布时间待定。</p><em>保存于 8 月 30 日</em></section><span aria-hidden="true">→</span><section><small>当前页面</small><strong>版本 2.4 更新说明</strong><p>新增批量导入功能，计划于 9 月 6 日逐步开放。</p><em>读取于本次模拟运行</em></section></div><ul><li className="added"><span>新增</span>补充了计划开放日期“9 月 6 日”</li><li className="changed"><span>修改</span>“导入功能”更新为“批量导入功能”</li><li className="removed"><span>删除</span>移除了“发布时间待定”</li></ul><footer>尚未发送外部通知，等待人工确认变化是否重要。</footer></article>}

            {template.id === "report" && <article className="agent-report-result"><header><span>本周办公数据分析</span><small>3 个来源文件 · 未覆盖原表</small></header><div className="agent-report-metrics"><section><small>有效记录</small><strong>248</strong><em>较上周 +18</em></section><section><small>完成率</small><strong>86%</strong><em>公式已记录</em></section><section><small>缺失值</small><strong>7</strong><em>等待人工确认</em></section><section><small>异常项</small><strong>3</strong><em>未自动修正</em></section></div><div className="agent-report-file"><i aria-hidden="true">▤</i><span><small>新建模拟文件</small><strong>本周数据分析_2026-W35.docx</strong><em>包含指标说明、异常清单和来源记录</em></span><b>报告已生成</b></div><footer>原始表格保持只读；字段、单位和公式已写入处理日志。</footer></article>}

            <article className="agent-result-review"><section><small>07 · 项目验收清单</small><div>{template.acceptance.map((item) => <span key={item}>{item}</span>)}</div></section><section><small>08 · 常见问题与边界</small><ul>{template.boundaries.map((item) => <li key={item}>{item}</li>)}</ul></section><section><small>09 · 下一步升级</small><p>{template.next}</p></section></article>
          </>}
        </div>

        <footer className="agent-lab-composer"><div className="agent-template-list" aria-label="选择 Agent 自动化模板">{agentTemplates.map((item) => <button className={item.id === templateId ? "active" : ""} disabled={runState === "running"} type="button" key={item.id} onClick={() => selectTemplate(item.id)}><i aria-hidden="true">{item.icon}</i><span><strong>{item.title}</strong><small>{item.category} · 单次运行</small></span></button>)}</div><div className="agent-composer-input"><span><small>06 · Agent 执行指令</small><strong>{template.instruction}</strong></span><button aria-label={runState === "complete" ? "重新运行" : runState === "running" ? "运行中" : "运行一次演示"} className={runState === "running" ? "running" : ""} disabled={runState === "running"} title={runState === "complete" ? "重新运行" : "运行一次演示"} type="button" onClick={startDemo}><i className="composer-send-arrow" aria-hidden="true" /></button></div><p><strong>说明：</strong>本站只模拟一次 Agent 执行过程，不会创建真实定时任务、访问外部来源或在网页关闭后继续运行。真实自动化需要本地 Agent、桌面程序、服务器或云端调度环境。</p></footer>
      </div>
    </section>
  );
}
