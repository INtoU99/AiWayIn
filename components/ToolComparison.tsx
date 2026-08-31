"use client";

import { useMemo, useState } from "react";

import { BrowserNavigationLink } from "@/components/BrowserNavigationLink";
import { ToolLogo } from "@/components/ToolLogo";
import { catalogTools, getToolCategory, type ToolCatalogItem } from "@/data/tools";
import {
  comparisonPresets,
  comparisonToolIds,
  getComparisonProfile,
  supportLevelLabels,
  type ComparisonValue,
  type ToolComparisonProfile,
} from "@/data/toolComparisons";

type ComparedTool = { tool: ToolCatalogItem; profile: ToolComparisonProfile };
type CompareRow = { label: string; value: (item: ComparedTool) => ComparisonValue };

const comparisonToolIdSet = new Set<string>(comparisonToolIds);
const comparisonTools = catalogTools.filter((tool) => comparisonToolIdSet.has(tool.id));

const compareRows: CompareRow[] = [
  { label: "一句话定位", value: ({ profile }) => ({ title: profile.positioning, detail: "" }) },
  { label: "适合谁", value: ({ profile }) => ({ title: profile.bestFor, detail: "" }) },
  { label: "入门与配置", value: ({ profile }) => profile.onboarding },
  { label: "图片与视觉", value: ({ profile }) => profile.visual },
  { label: "文件与数据", value: ({ profile }) => profile.files },
  { label: "本地与自动化", value: ({ profile }) => profile.automation },
  { label: "平台与入口", value: ({ tool }) => ({ title: tool.system, detail: tool.platforms.join(" · ") }) },
  { label: "能力边界", value: ({ profile }) => ({ title: profile.boundary, detail: "" }) },
];

function ComparisonCell({ value }: { value: ComparisonValue }) {
  return <div className="comparison-value">{value.level && <span className={`support-level ${value.level}`}>{supportLevelLabels[value.level]}</span>}<strong>{value.title}</strong>{value.detail && <p>{value.detail}</p>}</div>;
}

export function ToolComparison({ initialToolIds = [] }: { initialToolIds?: string[] }) {
  const [slots, setSlots] = useState(() => initialToolIds.length >= 2 ? [initialToolIds[0] ?? "", initialToolIds[1] ?? "", initialToolIds[2] ?? ""] : ["chatgpt-desktop", "claude-desktop", ""]);

  const comparedTools = useMemo(() => slots.flatMap((toolId) => {
    const tool = catalogTools.find((item) => item.id === toolId);
    const profile = getComparisonProfile(toolId);
    return tool && profile ? [{ tool, profile }] : [];
  }), [slots]);

  function updateSlot(index: number, toolId: string) {
    setSlots((current) => current.map((value, slotIndex) => slotIndex === index ? toolId : value));
  }

  function applyPreset(toolIds: string[]) {
    setSlots([toolIds[0] ?? "", toolIds[1] ?? "", toolIds[2] ?? ""]);
  }

  return (
    <>
      <section className="compare-picker" aria-labelledby="compare-picker-title">
        <div className="compare-picker-heading">
          <div><h2 id="compare-picker-title">选择 2-3 个工具</h2></div>
          <p>仅列出 AI 助手与 Agent 类产品；第三个工具可以留空。</p>
        </div>

        <div className="compare-selectors">
          {slots.map((toolId, index) => {
            const selectedTool = catalogTools.find((tool) => tool.id === toolId);
            return <label className={selectedTool ? "filled" : ""} key={index}>
              <span>{index < 2 ? `工具 ${index + 1}` : "可选第三个"}</span>
              <div className="compare-select-control">
                {selectedTool && <ToolLogo src={selectedTool.logo} alt="" />}
                <select aria-label={index < 2 ? `选择工具 ${index + 1}` : "选择可选的第三个工具"} value={toolId} onChange={(event) => updateSlot(index, event.target.value)}>
                  <option value="">{index < 2 ? "请选择工具" : "不添加第三个工具"}</option>
                  {comparisonTools.map((tool) => <option value={tool.id} disabled={slots.some((value, slotIndex) => slotIndex !== index && value === tool.id)} key={tool.id}>{tool.name} · {getToolCategory(tool.categoryId)?.title}</option>)}
                </select>
              </div>
            </label>;
          })}
        </div>

        <div className="compare-presets" aria-label="常见比较组合">
          <span>常见比较</span>
          {comparisonPresets.map((preset) => <button type="button" key={preset.label} onClick={() => applyPreset(preset.toolIds)}>{preset.label}</button>)}
          <button className="clear-comparison" type="button" onClick={() => setSlots(["", "", ""])}>清空选择</button>
        </div>
      </section>

      {comparedTools.length >= 2 ? <section className="comparison-section" aria-live="polite">
        <div className="comparison-intro"><div><h2>只看真正影响选择的差异</h2></div><div className="comparison-legend" aria-label="能力状态说明">{Object.entries(supportLevelLabels).map(([level, label]) => <span key={level}><i className={level} aria-hidden="true" />{label}</span>)}</div></div>

        <div className="comparison-desktop">
          <table>
            <thead><tr><th scope="col">比较项目</th>{comparedTools.map(({ tool }) => <th scope="col" key={tool.id}><div className="compare-tool-heading"><ToolLogo src={tool.logo} alt={tool.logoAlt} /><span><strong>{tool.name}</strong><small>{tool.badge} · {tool.level}</small></span></div></th>)}</tr></thead>
            <tbody>{compareRows.map((row) => <tr key={row.label}><th scope="row">{row.label}</th>{comparedTools.map((item) => <td key={`${row.label}-${item.tool.id}`}><ComparisonCell value={row.value(item)} /></td>)}</tr>)}</tbody>
          </table>
        </div>

        <div className="comparison-mobile">
          {compareRows.map((row) => <section key={row.label}><h3>{row.label}</h3><div>{comparedTools.map((item) => <article key={`${row.label}-${item.tool.id}`}><div className="mobile-tool-name"><ToolLogo src={item.tool.logo} alt="" /><strong>{item.tool.shortName}</strong></div><ComparisonCell value={row.value(item)} /></article>)}</div></section>)}
        </div>

        <div className="decision-section">
          <div className="decision-heading"><h2>没有统一冠军，只有更合适的场景</h2><p>以下结论只针对当前选择，不代表工具的绝对能力排名。</p></div>
          <div className="decision-grid">{comparedTools.map(({ tool, profile }) => <article className={tool.tone} key={tool.id}><ToolLogo src={tool.logo} alt={tool.logoAlt} /><span>如果你希望</span><h3>{profile.chooseWhen}</h3><BrowserNavigationLink href={`/tools/${tool.id}`}>查看 {tool.shortName} 详情 <span aria-hidden="true">→</span></BrowserNavigationLink></article>)}</div>
        </div>
      </section> : <section className="compare-empty" aria-live="polite"><span aria-hidden="true">↔</span><h2>至少选择两个工具才能开始比较</h2><p>你可以手动选择，也可以直接使用上方的常见组合。</p></section>}
    </>
  );
}
