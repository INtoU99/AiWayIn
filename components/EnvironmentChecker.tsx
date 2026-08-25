"use client";

import { useMemo, useState } from "react";

import { BrowserNavigationLink } from "@/components/BrowserNavigationLink";
import { ToolLogo } from "@/components/ToolLogo";
import { catalogTools, toolCategories } from "@/data/tools";
import {
  detectEnvironmentDevice,
  environmentDevices,
  getEnvironmentCommandHint,
  toolSupportsEnvironmentDevice,
  type EnvironmentDeviceId,
} from "@/lib/environmentChecker";

export function EnvironmentChecker() {
  const [toolId, setToolId] = useState("deepseek-harness");
  const [device, setDevice] = useState<EnvironmentDeviceId | "">("");
  const [confirmed, setConfirmed] = useState<string[]>([]);
  const [copied, setCopied] = useState("");
  const [copyError, setCopyError] = useState("");

  const tool = catalogTools.find((item) => item.id === toolId) ?? catalogTools[0];
  const supported = device ? toolSupportsEnvironmentDevice(tool, device) : undefined;
  const complete = supported === true && confirmed.length === tool.requirements.length;

  const groupedTools = useMemo(() => {
    return toolCategories.map((category) => ({
      category,
      tools: catalogTools.filter((item) => item.categoryId === category.id),
    })).filter((group) => group.tools.length > 0);
  }, []);

  function changeTool(nextToolId: string) {
    setToolId(nextToolId);
    setConfirmed([]);
    setCopied("");
    setCopyError("");
  }

  function changeDevice(nextDevice: EnvironmentDeviceId) {
    setDevice(nextDevice);
    setConfirmed([]);
    setCopied("");
    setCopyError("");
  }

  function detectDevice() {
    changeDevice(detectEnvironmentDevice(navigator.userAgent));
  }

  function toggleRequirement(requirement: string) {
    setConfirmed((current) => current.includes(requirement) ? current.filter((item) => item !== requirement) : [...current, requirement]);
  }

  async function copyCommand(command: string) {
    try {
      if (!navigator.clipboard) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(command);
      setCopied(command);
      setCopyError("");
    } catch {
      setCopied("");
      setCopyError(command);
    }
  }

  return (
    <div className="environment-checker" id="environment-check">
      <div className="environment-setup">
        <div className="environment-heading">
          <div><span className="path-step-label">安装前自检</span><h3>这台设备是否已经准备好？</h3></div>
          <p>网站不会读取你的程序或文件，请按清单自行确认。</p>
        </div>

        <label className="environment-tool-select">
          <span>准备安装的工具</span>
          <div><ToolLogo src={tool.logo} alt="" /><select value={toolId} onChange={(event) => changeTool(event.target.value)}>{groupedTools.map((group) => <optgroup label={group.category.title} key={group.category.id}>{group.tools.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</optgroup>)}</select></div>
        </label>

        <fieldset className="environment-device-picker">
          <legend>当前主要设备</legend>
          <div>{environmentDevices.map((option) => <label className={device === option.id ? "selected" : ""} key={option.id}><input type="radio" name="environment-device" value={option.id} checked={device === option.id} onChange={() => changeDevice(option.id)} /><span>{option.label}</span></label>)}</div>
          <button type="button" onClick={detectDevice}>帮我识别当前设备</button>
        </fieldset>
      </div>

      <div className="environment-report" aria-live="polite">
        <div className={`environment-verdict ${supported === false ? "blocked" : complete ? "ready" : "pending"}`}>
          <span aria-hidden="true">{supported === false ? "!" : complete ? "✓" : "⌁"}</span>
          <div><small>准备状态</small><strong>{!device ? "先选择你的设备" : supported === false ? `${tool.shortName} 不支持当前设备` : complete ? "环境准备完成" : `还有 ${tool.requirements.length - confirmed.length} 项需要确认`}</strong><p>{!device ? "可以手动选择，也可以让网页根据浏览器信息进行判断。" : supported === false ? `当前官方平台范围：${tool.platforms.join(" · ")}` : complete ? "这是依据你手动确认的结果，继续安装前仍应阅读官方说明。" : `当前设备在支持范围内，请继续完成 ${tool.shortName} 的准备清单。`}</p></div>
        </div>

        {device && supported !== false && <div className="environment-requirements">
          {tool.requirements.map((requirement, index) => {
            const hint = getEnvironmentCommandHint(tool.id, requirement, device);
            const isConfirmed = confirmed.includes(requirement);
            return <article className={isConfirmed ? "confirmed" : ""} key={requirement}>
              <button className="requirement-check" type="button" aria-pressed={isConfirmed} onClick={() => toggleRequirement(requirement)}><span aria-hidden="true">{isConfirmed ? "✓" : index + 1}</span><span><strong>{requirement}</strong><small>{isConfirmed ? "已由你确认" : hint ? hint.note : "请根据工具详情与官方说明确认"}</small></span></button>
              {hint && <div className="command-hints">{hint.commands.map((command) => <div key={command}><code>{command}</code><button type="button" onClick={() => copyCommand(command)}>{copyError === command ? "复制失败" : copied === command ? "已复制" : "复制"}</button></div>)}{copyError && hint.commands.includes(copyError) && <p className="command-copy-feedback" role="status">未能自动复制，请手动选中上方命令后复制。</p>}{hint.helpHref && <BrowserNavigationLink href={hint.helpHref}>查看环境安装说明 →</BrowserNavigationLink>}</div>}
            </article>;
          })}
        </div>}

        <div className="environment-actions"><BrowserNavigationLink className="path-primary-link" href={`/tools/${tool.id}`}>查看 {tool.shortName} 安装步骤 <span aria-hidden="true">→</span></BrowserNavigationLink><a className="environment-official-link" href={tool.href} target="_blank" rel="noreferrer">前往官方入口 ↗</a></div>
      </div>
    </div>
  );
}
