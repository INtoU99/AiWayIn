"use client";

import { useMemo, useRef, useState } from "react";

import { BrowserNavigationLink } from "@/components/BrowserNavigationLink";
import { ToolLogo } from "@/components/ToolLogo";
import { comparisonToolIds } from "@/data/toolComparisons";
import { catalogTools } from "@/data/tools";
import {
  capabilityOptions,
  deviceOptions,
  participationOptions,
  privacyOptions,
  recommendTools,
  setupOptions,
  type CapabilityId,
  type DeviceId,
  type ParticipationId,
  type PrivacyId,
  type SetupId,
} from "@/lib/pathFinder";

const stepLabels = ["选择需求", "参与程度", "设备与偏好"];

export function PathFinder() {
  const [step, setStep] = useState(1);
  const [capabilities, setCapabilities] = useState<CapabilityId[]>([]);
  const [participation, setParticipation] = useState<ParticipationId | "">("");
  const [device, setDevice] = useState<DeviceId | "">("");
  const [setup, setSetup] = useState<SetupId | "">("");
  const [privacy, setPrivacy] = useState<PrivacyId>("balanced");
  const [complete, setComplete] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const recommendations = useMemo(() => {
    if (!complete || !participation || !device || !setup) return [];
    return recommendTools({ capabilities, participation, device, setup, privacy });
  }, [capabilities, complete, device, participation, privacy, setup]);

  const primary = recommendations[0];
  const primaryTool = primary ? catalogTools.find((tool) => tool.id === primary.profile.toolId) : undefined;
  const comparableRecommendations = recommendations.filter(({ profile }) => comparisonToolIds.some((toolId) => toolId === profile.toolId));
  const comparisonHref = `/compare?tools=${comparableRecommendations.map(({ profile }) => profile.toolId).join(",")}`;

  function moveTo(nextStep: number) {
    setStep(nextStep);
    setComplete(false);
    window.requestAnimationFrame(() => headingRef.current?.focus());
  }

  function toggleCapability(capability: CapabilityId) {
    setCapabilities((current) => current.includes(capability) ? current.filter((item) => item !== capability) : [...current, capability]);
  }

  function finish() {
    if (!device || !setup || !participation || capabilities.length === 0) return;
    setComplete(true);
  }

  function reset() {
    setCapabilities([]);
    setParticipation("");
    setDevice("");
    setSetup("");
    setPrivacy("balanced");
    setComplete(false);
    moveTo(1);
  }

  return (
    <div className="path-finder" id="path-finder">
      <div className="path-progress" aria-label="路线判断进度">
        {stepLabels.map((label, index) => {
          const number = index + 1;
          const available = number <= step || complete;
          return <button className={number === step && !complete ? "active" : number < step || complete ? "done" : ""} type="button" key={label} disabled={!available} onClick={() => moveTo(number)}><span>{number < step || complete ? "✓" : number}</span>{label}</button>;
        })}
      </div>

      <div className="path-finder-body">
        <div className="path-question-panel">
          {!complete && step === 1 && <fieldset>
            <legend className="sr-only">选择希望 AI 参与的事情</legend>
            <span className="path-step-label">第 1 步 · 可多选</span>
            <h3 ref={headingRef} tabIndex={-1}>你希望 AI 参与哪些事情？</h3>
            <p>不用先判断工具类型，只选择你真正想完成的事情。</p>
            <div className="capability-grid">
              {capabilityOptions.map((option) => <button className={capabilities.includes(option.id) ? "selected" : ""} type="button" aria-pressed={capabilities.includes(option.id)} key={option.id} onClick={() => toggleCapability(option.id)}><span className="option-check" aria-hidden="true">{capabilities.includes(option.id) ? "✓" : "+"}</span><strong>{option.label}</strong><small>{option.hint}</small></button>)}
            </div>
          </fieldset>}

          {!complete && step === 2 && <fieldset>
            <legend className="sr-only">选择希望 AI 参与到什么程度</legend>
            <span className="path-step-label">第 2 步 · 单选</span>
            <h3 ref={headingRef} tabIndex={-1}>你希望 AI 参与到什么程度？</h3>
            <p>参与越深入，通常需要开放的文件、应用或终端权限越多。</p>
            <div className="participation-list">
              {participationOptions.map((option) => <label aria-label={option.label} className={participation === option.id ? "selected" : ""} htmlFor={`participation-${option.id}`} key={option.id}><input id={`participation-${option.id}`} type="radio" name="participation" value={option.id} checked={participation === option.id} onChange={() => setParticipation(option.id)} /><span className="radio-mark" aria-hidden="true" /><span><strong>{option.label}</strong><small>{option.hint}</small></span></label>)}
            </div>
          </fieldset>}

          {!complete && step === 3 && <div>
            <span className="path-step-label">第 3 步 · 环境条件</span>
            <h3 ref={headingRef} tabIndex={-1}>你的设备和使用偏好是什么？</h3>
            <p>这些条件用于排除无法安装或明显不适合的路线。</p>
            <fieldset className="preference-group"><legend>当前主要设备</legend><div className="choice-row">{deviceOptions.map((option) => <label className={device === option.id ? "selected" : ""} htmlFor={`device-${option.id}`} key={option.id}><input id={`device-${option.id}`} type="radio" name="device" value={option.id} checked={device === option.id} onChange={() => setDevice(option.id)} /><span>{option.label}</span></label>)}</div></fieldset>
            <fieldset className="preference-group"><legend>可以接受的配置程度</legend><div className="choice-row">{setupOptions.map((option) => <label className={setup === option.id ? "selected" : ""} htmlFor={`setup-${option.id}`} key={option.id}><input id={`setup-${option.id}`} type="radio" name="setup" value={option.id} checked={setup === option.id} onChange={() => setSetup(option.id)} /><span>{option.label}</span></label>)}</div></fieldset>
            <fieldset className="preference-group"><legend>数据与本地运行倾向</legend><div className="choice-row">{privacyOptions.map((option) => <label className={privacy === option.id ? "selected" : ""} htmlFor={`privacy-${option.id}`} key={option.id}><input id={`privacy-${option.id}`} type="radio" name="privacy" value={option.id} checked={privacy === option.id} onChange={() => setPrivacy(option.id)} /><span>{option.label}</span></label>)}</div></fieldset>
          </div>}

          {complete && primary && primaryTool && <div className="path-result" aria-live="polite">
            <span className="path-step-label">判断完成 · 推荐组合</span>
            <div className="result-tool-heading"><ToolLogo src={primaryTool.logo} alt={primaryTool.logoAlt} /><div><small>首选工具</small><h3 ref={headingRef} tabIndex={-1}>{primaryTool.name}</h3></div></div>
            <p className="result-summary">{primary.profile.coreSummary}</p>
            <div className="result-section"><strong>主要能力</strong><div className="strength-tags">{primary.profile.strengths.map((strength) => <span key={strength}>{strength}</span>)}</div></div>
            <div className="result-section"><strong>扩展能力</strong><p>{primary.profile.extendedSummary}</p></div>
            <div className="boundary-note"><strong>能力边界</strong><p>{primary.profile.boundary}</p></div>
          </div>}

          <div className="path-controls">
            {!complete && step > 1 && <button className="path-back" type="button" onClick={() => moveTo(step - 1)}>← 上一步</button>}
            {!complete && step === 1 && <button className="path-next" type="button" disabled={capabilities.length === 0} onClick={() => moveTo(2)}>下一步 <span aria-hidden="true">→</span></button>}
            {!complete && step === 2 && <button className="path-next" type="button" disabled={!participation} onClick={() => moveTo(3)}>下一步 <span aria-hidden="true">→</span></button>}
            {!complete && step === 3 && <button className="path-next" type="button" disabled={!device || !setup} onClick={finish}>生成我的路线 <span aria-hidden="true">→</span></button>}
            {complete && primaryTool && <><BrowserNavigationLink className="path-primary-link" href={`/tools/${primaryTool.id}`}>查看 {primaryTool.shortName} 详情 <span aria-hidden="true">→</span></BrowserNavigationLink>{comparableRecommendations.length >= 2 && <BrowserNavigationLink className="path-compare-link" href={comparisonHref}>对比推荐工具</BrowserNavigationLink>}<button className="path-reset" type="button" onClick={reset}>重新选择</button></>}
          </div>
        </div>

        <aside className="path-side-panel" aria-label="当前选择和补充推荐">
          {!complete ? <>
            <span className="path-side-kicker">你的选择</span>
            <h4>{capabilities.length > 0 ? `已选择 ${capabilities.length} 项需求` : "路线会随着选择逐步清晰"}</h4>
            <div className="selection-summary">
              {capabilities.length > 0 ? capabilityOptions.filter((option) => capabilities.includes(option.id)).map((option) => <span key={option.id}>{option.shortLabel}</span>) : <p>先选择任务，不会把任何综合型工具限制成单一用途。</p>}
            </div>
            <div className="path-principles"><span><b>1</b>综合比较能力覆盖</span><span><b>2</b>区分核心与扩展能力</span><span><b>3</b>说明版本、平台和权限边界</span></div>
          </> : <>
            <span className="path-side-kicker">补充选择</span>
            <h4>没有唯一正确答案</h4>
            <p className="path-side-copy">下列工具也覆盖你的部分需求，可结合详情页继续比较。</p>
            <div className="alternative-list">{recommendations.slice(1).map(({ profile }) => {
              const tool = catalogTools.find((item) => item.id === profile.toolId);
              if (!tool) return null;
              return <BrowserNavigationLink href={`/tools/${tool.id}`} key={tool.id}><ToolLogo src={tool.logo} alt={tool.logoAlt} /><span><strong>{tool.name}</strong><small>{profile.strengths.slice(0, 2).join(" · ")}</small></span><span aria-hidden="true">→</span></BrowserNavigationLink>;
            })}</div>
            <p className="comparison-note">更完整的能力、平台、费用与权限差异将在“工具对比”功能中提供。</p>
          </>}
        </aside>
      </div>
    </div>
  );
}
