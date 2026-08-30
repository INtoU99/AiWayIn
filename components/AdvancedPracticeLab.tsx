"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type TemplateId = "portfolio" | "todo" | "taskboard" | "pomodoro" | "hero";
type RunState = "idle" | "running" | "paused" | "complete";
type RevisionState = "idle" | "running" | "paused" | "complete";
type PreviewSize = "desktop" | "mobile";

type DemoStep = {
  actor: "user" | "assistant";
  label: string;
  text: string;
  previewStage: number;
  activity: string;
};

type DemoTemplate = {
  id: TemplateId;
  icon: string;
  title: string;
  level: "入门" | "进阶";
  category: string;
  summary: string;
  focus: string;
  skills: string[];
  steps: DemoStep[];
  revisions: {
    id: string;
    label: string;
    prompt: string;
    response: string;
  }[];
  takeaways: string[];
};

type ProjectGuide = {
  goal: string;
  outcome: string;
  preparation: string[];
  tools: {
    recommended: string;
    alternatives: string;
  };
  workflow: string[];
  acceptance: string[];
  boundaries: string[];
  upgrade: string;
};

const demoTemplates: DemoTemplate[] = [
  {
    id: "portfolio",
    icon: "✦",
    title: "个人作品主页",
    level: "入门",
    category: "页面布局",
    summary: "低饱和简约风格，生成 Hero、项目卡片与联系入口。",
    focus: "适合观察留白、柔和层级和响应式布局",
    skills: ["Hero 首屏", "卡片布局", "响应式"],
    steps: [
      { actor: "user", label: "你的需求", text: "帮我做一个个人作品主页。希望以白色为主，只搭配一种接近中性的浅灰绿色，整体低饱和、简约且留白充足，并展示三个代表项目。", previewStage: 0, activity: "正在发送你的想法" },
      { actor: "assistant", label: "教学助手", text: "我先把目标拆成三个区域：首页介绍、代表项目和联系入口。移动端会改为单列，避免文字和卡片拥挤。", previewStage: 1, activity: "正在建立页面骨架" },
      { actor: "assistant", label: "教学助手", text: "页面结构已经建立。现在加入明确的标题、个人定位和三条 Mock 项目数据，让内容层级先变得可读。", previewStage: 2, activity: "正在填充内容与模拟数据" },
      { actor: "assistant", label: "教学助手", text: "接下来以白色为主，只用接近中性的浅灰绿色辅助分区，通过留白、细边框与清晰字号层级保持简约。", previewStage: 3, activity: "正在应用低饱和视觉语言" },
      { actor: "assistant", label: "教学助手", text: "最后补上项目按钮的点击反馈与手机端适配。先确保流程可用，再考虑动画和更复杂的视觉表现。", previewStage: 4, activity: "正在添加交互与响应式规则" },
      { actor: "assistant", label: "教学助手", text: "第一版已经完成。你可以切换桌面与手机视图，并点击项目卡片检查反馈。", previewStage: 4, activity: "生成完成" },
    ],
    revisions: [
      { id: "portfolio-copy", label: "重排项目展示", prompt: "三个项目挤在一行里不容易阅读，请重新组织项目区域，让每个案例的说明更清楚，但不要增加新的颜色。", response: "我会把三列小卡片改为纵向案例列表，放大标题与说明，并加强卡片之间的留白。布局变化会更明显，同时继续沿用现有低饱和配色。" },
      { id: "portfolio-compact", label: "重构首屏比例", prompt: "首屏留白稍多，请明显收紧介绍区域，并让项目内容更早进入视野，同时保持标题一行显示。", response: "我会重构首屏与项目区的高度比例：缩短介绍区域、收紧标题间距并上移项目列表；手机端仍保留自然换行。" },
    ],
    takeaways: ["先拆清页面区域，再要求 AI 写代码", "Mock 数据可以提前验证真实内容的排版", "响应式要求需要在提示词中明确提出"],
  },
  {
    id: "todo",
    icon: "✓",
    title: "待办事项清单",
    level: "入门",
    category: "状态交互",
    summary: "轻量纸张式工作台，观察状态、按钮和即时反馈如何连接。",
    focus: "适合理解状态、交互反馈和功能验收",
    skills: ["页面状态", "增删操作", "交互反馈"],
    steps: [
      { actor: "user", label: "你的需求", text: "做一个适合新手的待办清单。以白色为主，只搭配一种接近中性的浅灰蓝色，整体安静简洁，不使用高饱和颜色，同时清楚区分任务状态。", previewStage: 0, activity: "正在发送你的想法" },
      { actor: "assistant", label: "教学助手", text: "我会先建立任务概览、输入区域和任务列表三个部分，并把主要操作集中在一个按钮上。", previewStage: 1, activity: "正在建立页面骨架" },
      { actor: "assistant", label: "教学助手", text: "现在放入四条 Mock 任务，并让每条数据包含名称、分类和完成状态，方便后续测试。", previewStage: 2, activity: "正在填充任务数据" },
      { actor: "assistant", label: "教学助手", text: "视觉上以白色为主，只用接近中性的浅灰蓝标记状态区域，通过轻微明度变化、描边和文字状态完成区分。", previewStage: 3, activity: "正在应用低饱和状态视觉" },
      { actor: "assistant", label: "教学助手", text: "最后让复选框可以改变任务状态，并同步更新顶部统计数字，这就是最基础的状态驱动界面。", previewStage: 4, activity: "正在连接状态与界面" },
      { actor: "assistant", label: "教学助手", text: "待办清单已经可以操作。尝试勾选任务，观察数字与列表如何同时变化。", previewStage: 4, activity: "生成完成" },
    ],
    revisions: [
      { id: "todo-focus", label: "聚焦今日任务", prompt: "任务较多时不容易找到重点，请建立清晰的今日任务焦点，并弱化稍后处理的内容。", response: "我会把今天的任务提升为醒目的重点区域，同时降低明日与周末任务的视觉权重。这样不需要新增颜色，也能快速看出优先级变化。" },
      { id: "todo-simple", label: "切换极简清单", prompt: "任务卡片的信息稍多，请改成更精简的清单模式，让我能更快完成勾选。", response: "我会移除重复状态标签和次要分类文字，缩短每行高度，只保留复选框、任务名称与必要时间，形成明显不同的极简清单。" },
    ],
    takeaways: ["功能需求要说明数据会怎样变化", "状态变化应该立即给用户反馈", "验收标准应包含点击后页面发生什么"],
  },
  {
    id: "taskboard",
    icon: "▤",
    title: "任务管理面板",
    level: "入门",
    category: "状态管理",
    summary: "从输入到分组、切换与统计，完整演示一条状态驱动交互。",
    focus: "适合理解需求怎样转化为数据结构与可验证的状态变化",
    skills: ["分组列表", "状态切换", "本地数据"],
    steps: [
      { actor: "user", label: "你的需求", text: "用 React 和 TypeScript 做一个极简任务面板。顶部输入框通过回车添加任务；列表按未完成和已完成分组，每条任务可用复选框切换状态，底部显示未完成数量。数据在本地管理，不连接后端。页面以白色为主，完成项使用删除线并降低文字对比度。", previewStage: 0, activity: "正在发送结构化需求" },
      { actor: "assistant", label: "教学助手", text: "我先把需求拆成输入、任务数据、分组列表和底部统计四个部分，并约定每条任务包含编号、名称与完成状态。", previewStage: 1, activity: "正在拆解状态与组件" },
      { actor: "assistant", label: "教学助手", text: "现在加入本地模拟任务，并分别计算未完成与已完成列表，先让数据结构和界面分组对应起来。", previewStage: 2, activity: "正在建立分组数据" },
      { actor: "assistant", label: "教学助手", text: "接下来连接输入框与回车事件，让新增任务进入未完成分组，同时更新底部数量。", previewStage: 3, activity: "正在连接新增流程" },
      { actor: "assistant", label: "教学助手", text: "最后连接复选框状态切换。任务完成后会移动到已完成分组，并同步出现删除线和较弱的文字层级。", previewStage: 4, activity: "正在完成状态流转" },
      { actor: "assistant", label: "教学助手", text: "任务面板已经可以操作。尝试添加任务并切换状态，检查分组与统计是否同步变化。", previewStage: 4, activity: "生成完成" },
    ],
    revisions: [
      { id: "taskboard-focus", label: "聚焦未完成任务", prompt: "未完成任务应该更加突出，请弱化已完成区域并扩大当前任务的操作空间。", response: "我会扩大未完成分组并提高任务行的可读性，同时压缩和弱化已完成区域，让下一步行动更明确。" },
      { id: "taskboard-dense", label: "切换紧凑模式", prompt: "任务数量增加后页面会变长，请改成更紧凑的列表模式。", response: "我会减少任务行高度和分组间距，并把底部统计固定成更清楚的横向信息条，功能逻辑保持不变。" },
    ],
    takeaways: ["交互路径可以直接转化为组件和状态", "每次状态变化都应同步更新界面与统计", "不接后端时也要明确数据只在当前页面保存"],
  },
  {
    id: "pomodoro",
    icon: "◷",
    title: "番茄钟计时器",
    level: "入门",
    category: "计时交互",
    summary: "通过开始、暂停、归零与重置，理解一个完整的时间状态流程。",
    focus: "适合理解原生页面、计时状态、条件反馈和单文件交付",
    skills: ["倒计时", "状态按钮", "条件反馈"],
    steps: [
      { actor: "user", label: "你的需求", text: "用原生 HTML、CSS 和 JavaScript 做一个番茄钟。中央显示分钟与秒数，初始为二十五分钟；下方提供开始、暂停和重置。倒计时归零时播放简单提示音并自动重置，最后五秒使用明确的文字与动画反馈。交付一个可以直接运行的完整 HTML 文件。", previewStage: 0, activity: "正在发送结构化需求" },
      { actor: "assistant", label: "教学助手", text: "我先定义空闲、运行和暂停三种状态，并把计时显示与操作按钮放在一个聚焦区域中。", previewStage: 1, activity: "正在规划计时状态" },
      { actor: "assistant", label: "教学助手", text: "页面骨架已经完成。现在加入二十五分钟的初始时间、开始暂停按钮与重置按钮。", previewStage: 2, activity: "正在建立计时界面" },
      { actor: "assistant", label: "教学助手", text: "接下来连接每秒递减逻辑，并保证重复点击开始不会创建多个计时器。", previewStage: 3, activity: "正在连接倒计时" },
      { actor: "assistant", label: "教学助手", text: "最后加入归零提示音、自动重置和最后五秒反馈，同时为减少动态效果偏好提供静态显示。", previewStage: 4, activity: "正在处理边界状态" },
      { actor: "assistant", label: "教学助手", text: "番茄钟已经可以运行。尝试开始、暂停和重置，观察按钮文字与计时状态是否一致。", previewStage: 4, activity: "生成完成" },
    ],
    revisions: [
      { id: "pomodoro-presets", label: "加入快捷时长", prompt: "增加几个常用时长入口，让我可以快速切换专注和休息时间。", response: "我会加入专注、短休息和长休息三个快捷入口；切换时先停止当前计时，再更新显示，避免多个状态冲突。" },
      { id: "pomodoro-focus", label: "切换专注模式", prompt: "计时过程中希望减少其他信息，请把运行状态改成更聚焦的显示。", response: "我会在运行时弱化说明和次要按钮，扩大时间数字并减少装饰，让注意力集中在剩余时间。" },
    ],
    takeaways: ["先列清状态再编写计时逻辑", "重复启动和归零都是需要处理的边界情况", "单文件交付也应说明声音、动画与兼容性要求"],
  },
  {
    id: "hero",
    icon: "↗",
    title: "动态落地页 Hero",
    level: "进阶",
    category: "动态首屏",
    summary: "用更完整的技术约束生成带入场动画、悬浮导航与无缝滚动标识的首屏。",
    focus: "适合学习如何把技术栈、动画边界和性能要求写进提示词",
    skills: ["React 架构", "动态 Hero", "性能与动效"],
    steps: [
      { actor: "user", label: "你的需求", text: "请用 React、TypeScript、Tailwind CSS 和 Motion 构建一个现代落地页 Hero。页面以白色为主，加入一种低饱和辅助色；包含背景图像式视觉、文案层、主要行动按钮、浮动底部导航和 Logo 无缝滚动条。动画要克制、流畅，并兼顾手机端与减少动态效果设置。", previewStage: 0, activity: "正在发送进阶构建需求" },
      { actor: "assistant", label: "教学助手", text: "我先把需求拆成背景视觉、内容层、浮动导航和品牌滚动条四个组件，并为每个组件限定职责，避免所有逻辑堆在一起。", previewStage: 1, activity: "正在规划组件结构" },
      { actor: "assistant", label: "教学助手", text: "页面骨架已经建立。现在补充清晰的标题、说明和行动入口，并使用语义化结构保证阅读顺序与移动端体验。", previewStage: 2, activity: "正在填充首屏内容" },
      { actor: "assistant", label: "教学助手", text: "接下来建立以白色为主的低饱和视觉系统。背景只承担空间感，不与文案争夺注意力，阴影和透明效果也保持克制。", previewStage: 3, activity: "正在应用简约视觉语言" },
      { actor: "assistant", label: "教学助手", text: "现在加入分层入场动画和浮动导航。动画只改变透明度与位移，并避免绑定页面滚动，减少卡顿和画面抽动。", previewStage: 4, activity: "正在连接动态效果" },
      { actor: "assistant", label: "教学助手", text: "最后加入可循环的品牌标识轨道，并为小屏幕和偏好减少动画的用户准备降级规则。", previewStage: 5, activity: "正在完成滚动条与性能适配" },
      { actor: "assistant", label: "教学助手", text: "动态 Hero 已完成。你可以切换桌面与手机视图，观察内容入场、悬浮导航和连续滚动效果。", previewStage: 5, activity: "生成完成" },
    ],
    revisions: [
      { id: "hero-motion", label: "切换安静展示", prompt: "持续运动容易分散注意力，请把页面切换为更安静的展示模式，并让内容成为视觉中心。", response: "我会停止背景和品牌轨道的循环动画，弱化背景图形并固定浮动导航，只保留首次进入时的内容动画。前后效果会形成明确区别。" },
      { id: "hero-cta", label: "重做行动区域", prompt: "主要行动入口不够明确，请重新组织按钮区域并加强主次关系，但不要提高整体色彩饱和度。", response: "我会将行动区扩展成更清晰的横向操作条：主按钮使用深色中性填充，次按钮保持白色，同时增加简短的项目说明，仍不引入高饱和色。" },
    ],
    takeaways: ["专业提示词应同时说明结构、技术栈和体验边界", "动态效果要服务信息层级，而不是单纯增加运动", "性能、移动端和减少动态效果规则应在生成前提出"],
  },
];

const projectGuides: Record<TemplateId, ProjectGuide> = {
  portfolio: {
    goal: "把个人介绍和代表项目整理成层级清楚、可以继续扩展的作品主页。",
    outcome: "一个包含介绍、项目展示、联系入口和基础交互的响应式页面原型。",
    preparation: ["个人定位与简短介绍", "三个代表项目的标题与说明", "可选头像、项目图片或占位素材"],
    tools: { recommended: "React + CSS，适合后续继续拆分组件", alternatives: "原生 HTML/CSS/JS 或 Vue，同样可以完成" },
    workflow: ["整理内容与页面目标", "划分介绍、项目和联系区域", "用 Mock 内容检查排版", "建立视觉层级与交互", "在目标设备检查并继续修改"],
    acceptance: ["核心介绍容易找到", "项目标题与说明层级清楚", "项目入口可以操作", "目标设备上内容不溢出"],
    boundaries: ["不要把真实电话、住址等隐私直接放入演示", "没有授权时不要使用他人的作品或图片", "视觉效果不能代替真实、准确的项目内容"],
    upgrade: "补充真实案例、独立项目详情与表单后，再考虑接入内容管理或部署服务。",
  },
  todo: {
    goal: "用一个小型清单理解数据、状态变化和界面反馈之间的关系。",
    outcome: "一个可以勾选任务并同步更新统计信息的交互清单。",
    preparation: ["准备几条用于测试的模拟任务", "确定任务需要哪些字段", "决定数据只保存在页面还是需要持久化"],
    tools: { recommended: "React + JavaScript，便于观察状态更新", alternatives: "原生 HTML/CSS/JS 可用于更轻量的单文件版本" },
    workflow: ["定义任务数据结构", "建立输入与列表区域", "渲染模拟任务", "连接勾选和统计", "测试空列表与重复操作"],
    acceptance: ["任务状态可以切换", "统计数字同步更新", "已完成状态容易辨认", "空数据时仍有明确提示"],
    boundaries: ["当前演示刷新后不会保留数据", "真实待办可能需要删除、编辑和撤销", "不要在公开演示中填写敏感工作内容"],
    upgrade: "增加新增、删除和本地保存，再根据使用场景决定是否需要账号与云端同步。",
  },
  taskboard: {
    goal: "把新增、分组、状态切换和数量统计组织成一条完整任务流程。",
    outcome: "一个可新增任务、切换完成状态并按状态分组的本地任务面板。",
    preparation: ["明确任务字段和初始模拟数据", "列出新增与完成的状态变化", "确认首版不连接后端"],
    tools: { recommended: "React + TypeScript，用类型约束任务结构", alternatives: "Vue + TypeScript 或 React + JavaScript" },
    workflow: ["把交互路径转成数据结构", "建立输入和两个任务分组", "连接回车新增", "连接复选框与统计", "测试空输入和连续操作"],
    acceptance: ["回车可以新增有效任务", "任务按状态正确分组", "复选框会移动任务", "剩余数量始终准确"],
    boundaries: ["useState 数据只存在于当前页面会话", "真实协作面板还要处理并发与权限", "新增后端前先定义数据保存和失败恢复方式"],
    upgrade: "先加入编辑、删除和本地持久化，再评估是否需要数据库、登录和多人协作。",
  },
  pomodoro: {
    goal: "通过计时器理解状态、时间逻辑、重复触发和归零处理。",
    outcome: "一个可开始、暂停、重置并在归零时提示的单文件计时工具。",
    preparation: ["确认目标运行在现代浏览器", "确定默认专注时长", "允许用户主动触发提示音"],
    tools: { recommended: "原生 HTML/CSS/JS，交付为单个文件", alternatives: "React 适合继续扩展任务列表与设置面板" },
    workflow: ["列出空闲、运行和暂停状态", "建立时间显示与按钮", "连接单一计时器", "处理归零与重置", "测试重复点击和后台切换"],
    acceptance: ["开始、暂停和重置均有效", "重复点击不会加速计时", "归零后正确提示并重置", "按钮文字与当前状态一致"],
    boundaries: ["浏览器后台计时可能受到节流影响", "声音通常需要用户先与页面交互", "它不是医疗或精确计时设备"],
    upgrade: "增加可配置时长、循环次数和本地记录，再考虑通知权限或桌面封装。",
  },
  hero: {
    goal: "练习用完整约束构建具有清晰信息层级和克制动效的产品首屏。",
    outcome: "一个包含主文案、行动入口、浮动导航和品牌轨道的动态 Hero 原型。",
    preparation: ["确定产品定位与主要行动", "准备可授权使用的背景素材和 Logo", "明确性能、响应式和减少动态效果要求"],
    tools: { recommended: "React + TypeScript + Tailwind CSS + Motion", alternatives: "React + CSS 动画，或不依赖动画库的静态版本" },
    workflow: ["确定唯一首屏目标", "划分内容、视觉和导航组件", "先完成静态信息层级", "加入克制的入场与循环动效", "检查性能和降级规则"],
    acceptance: ["首屏重点唯一明确", "主要行动入口容易识别", "动画不妨碍阅读和操作", "减少动态效果时仍可使用"],
    boundaries: ["不要为了展示堆叠无意义动画", "外部图片和字体要确认授权与加载策略", "第三方动画依赖会增加体积和维护成本"],
    upgrade: "接入真实品牌素材与页面路由，并通过性能检测后再扩展成完整落地页。",
  },
};

function createWaitingDocument(template: DemoTemplate) {
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'"><style>*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;background:#f7f8f8;color:#5f6a6b;font-family:system-ui,sans-serif}.wait{max-width:380px;padding:31px;text-align:center;background:#fff;border:1px solid #e0e6e6;border-radius:18px;box-shadow:0 16px 40px rgba(49,59,60,.06)}span{width:48px;height:48px;margin:0 auto 15px;display:grid;place-items:center;color:#526162;background:#e9eeee;border-radius:13px;font-size:21px;font-weight:800}strong{display:block;color:#293333;font-size:18px}p{margin:9px 0 0;font-size:13px;line-height:1.7}</style></head><body><div class="wait"><span>${template.icon}</span><strong>${template.title}</strong><p>点击“开始动态演示”，观察对话和页面如何同步生成。</p></div></body></html>`;
}

function createPortfolioDocument(stage: number) {
  const status = ["等待开始", "建立页面骨架", "填充页面内容", "应用视觉规范", "交互已就绪"][stage] ?? "交互已就绪";
  const script = stage >= 4 ? `<script>document.querySelectorAll('.project').forEach((card)=>card.addEventListener('click',()=>{document.querySelectorAll('.project').forEach((item)=>item.classList.remove('selected'));card.classList.add('selected');const note=document.querySelector('#note');note.textContent='正在查看：'+card.dataset.title;note.classList.add('show');setTimeout(()=>note.classList.remove('show'),1600)}));</script>` : "";

  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'"><style>*{box-sizing:border-box}body{margin:0;background:#f5f6f8;color:#20283b;font-family:system-ui,-apple-system,sans-serif}.page{min-height:100vh;padding:22px;transition:.35s ease}.build-state{margin:0 auto 12px;max-width:920px;padding:8px 11px;display:flex;align-items:center;gap:8px;color:#65728a;background:#fff;border:1px solid #dce3ee;border-radius:10px;font-size:10px}.build-state i{width:7px;height:7px;background:#5573e6;border-radius:50%;box-shadow:0 0 0 4px #e8edff}.shell{max-width:920px;margin:auto;overflow:hidden;background:#fff;border:1px solid #dfe4eb;border-radius:${stage >= 3 ? "24px" : "12px"};box-shadow:${stage >= 3 ? "0 22px 60px rgba(43,52,78,.1)" : "none"};transition:.35s ease}.nav{height:58px;padding:0 24px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #e8ebf0}.brand{font-weight:850;letter-spacing:-.03em}.nav small{color:#748096}.hero{padding:48px 34px 36px;display:grid;grid-template-columns:1.35fr .65fr;gap:28px;background:${stage >= 3 ? "linear-gradient(135deg,#fff3ec,#f2f0ff)" : "#fff"};transition:.35s ease}.eyebrow{color:${stage >= 3 ? "#b45f45" : "#7b8495"};font-size:10px;font-weight:800;letter-spacing:.08em}.hero h1{margin:9px 0 10px;font-size:clamp(29px,6vw,48px);line-height:1.03;letter-spacing:-.05em}.hero p{margin:0;color:#697387;font-size:12px;line-height:1.75}.portrait{min-height:170px;display:grid;place-items:center;color:${stage >= 3 ? "#734e93" : "#81899a"};background:${stage >= 3 ? "linear-gradient(145deg,#ffd7c9,#ddd5ff)" : "#edf0f4"};border-radius:${stage >= 3 ? "40% 60% 54% 46%" : "12px"};font-size:38px}.projects{padding:25px 34px 36px}.projects header{display:flex;align-items:end;justify-content:space-between}.projects h2{margin:0;font-size:19px}.projects header span{color:#8790a0;font-size:10px}.grid{margin-top:15px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.project{padding:15px;display:grid;gap:7px;color:inherit;background:${stage >= 3 ? "#fbfaf9" : "#f5f6f8"};border:1px solid ${stage >= 3 ? "#eadfd9" : "#e1e5eb"};border-radius:${stage >= 3 ? "15px" : "8px"};text-align:left;cursor:${stage >= 4 ? "pointer" : "default"};transition:.18s ease}.project strong{font-size:13px}.project small{color:#8c6b62;font-size:9px}.project span{color:#737c8e;font-size:10px;line-height:1.55}.project.selected{border-color:#9c83e1;box-shadow:0 9px 24px rgba(69,52,107,.12);transform:translateY(-2px)}.skeleton{display:${stage === 1 ? "grid" : "none"};gap:10px}.skeleton i{height:13px;background:#e8ebef;border-radius:7px}.skeleton i:nth-child(1){width:48%}.skeleton i:nth-child(2){width:82%;height:35px}.skeleton i:nth-child(3){width:68%}.content{display:${stage >= 2 ? "block" : "none"};animation:reveal .38s ease}.project-content{display:${stage >= 2 ? "grid" : "none"}}.placeholder-grid{display:${stage === 1 ? "grid" : "none"};grid-template-columns:repeat(3,1fr);gap:10px}.placeholder-grid i{height:105px;background:#eef0f3;border-radius:8px}.note{position:fixed;left:50%;bottom:18px;padding:9px 13px;color:#fff;background:#29344c;border-radius:9px;font-size:11px;opacity:0;transform:translate(-50%,10px);transition:.18s}.note.show{opacity:1;transform:translate(-50%,0)}@keyframes reveal{from{opacity:0;transform:translateY(7px)}}@media(max-width:620px){.page{padding:12px}.hero{padding:29px 20px 23px;grid-template-columns:1fr}.portrait{min-height:110px}.projects{padding:20px}.grid,.placeholder-grid{grid-template-columns:1fr}.nav{padding:0 19px}}@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}</style></head><body><main class="page"><div class="build-state"><i></i>${status}</div><div class="shell"><nav class="nav"><span class="brand">LIN / DESIGN</span><small>作品 · 关于 · 联系</small></nav><section class="hero"><div><div class="skeleton"><i></i><i></i><i></i></div><div class="content"><span class="eyebrow">独立视觉设计师</span><h1>把复杂想法，变成清晰体验。</h1><p>关注品牌、数字产品与内容表达，用克制的设计帮助信息被准确理解。</p></div></div><div class="portrait">✦</div></section><section class="projects"><header><h2>代表项目</h2><span>SELECTED WORK</span></header><div class="placeholder-grid"><i></i><i></i><i></i></div><div class="grid project-content"><button class="project" data-title="城市文化视觉" type="button"><small>品牌设计</small><strong>城市文化视觉</strong><span>为公共文化项目建立统一而友好的视觉语言。</span></button><button class="project" data-title="独立杂志改版" type="button"><small>编辑设计</small><strong>独立杂志改版</strong><span>重整文章层级，让长内容更容易阅读和探索。</span></button><button class="project" data-title="生活方式应用" type="button"><small>产品设计</small><strong>生活方式应用</strong><span>用轻量记录帮助用户建立可持续的生活习惯。</span></button></div></section></div></main><div class="note" id="note" role="status"></div>${script}</body></html>`;
}

function createTodoDocument(stage: number) {
  const status = ["等待开始", "建立页面骨架", "填充任务数据", "应用状态颜色", "交互已就绪"][stage] ?? "交互已就绪";
  const script = stage >= 4 ? `<script>const checks=[...document.querySelectorAll('input')];const update=()=>{const done=checks.filter((item)=>item.checked).length;document.querySelector('#done').textContent=done;document.querySelector('#left').textContent=checks.length-done;checks.forEach((item)=>item.closest('label').classList.toggle('done',item.checked))};checks.forEach((item)=>item.addEventListener('change',update));update();</script>` : "";

  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'"><style>*{box-sizing:border-box}body{margin:0;background:#f1f4f9;color:#27324a;font-family:system-ui,-apple-system,sans-serif}.page{max-width:760px;min-height:100vh;margin:auto;padding:24px}.build-state{margin-bottom:12px;padding:8px 11px;display:flex;align-items:center;gap:8px;color:#65728a;background:#fff;border:1px solid #dce3ee;border-radius:10px;font-size:10px}.build-state i{width:7px;height:7px;background:#5573e6;border-radius:50%;box-shadow:0 0 0 4px #e8edff}.app{overflow:hidden;background:#fff;border:1px solid #dce3ec;border-radius:${stage >= 3 ? "22px" : "11px"};box-shadow:${stage >= 3 ? "0 22px 60px rgba(43,52,78,.11)" : "none"};transition:.35s}.head{padding:27px;background:${stage >= 3 ? "linear-gradient(135deg,#eaf0ff,#f3efff)" : "#f6f7f9"};border-bottom:1px solid #e2e7ef}.head small{color:#6d7ca0;font-size:10px;font-weight:800}.head h1{margin:6px 0 5px;font-size:28px;letter-spacing:-.04em}.head p{margin:0;color:#748096;font-size:11px}.stats{margin-top:18px;display:grid;grid-template-columns:repeat(2,1fr);gap:8px}.stat{padding:12px;background:rgba(255,255,255,.75);border:1px solid #dce3ef;border-radius:11px}.stat strong{display:block;color:${stage >= 3 ? "#315bea" : "#657083"};font-size:19px}.stat span{color:#7b8597;font-size:9px}.body{padding:22px}.composer{display:${stage >= 2 ? "flex" : "none"};gap:8px}.composer span{flex:1;padding:11px;color:#9098a7;background:#f7f8fa;border:1px solid #e0e5ed;border-radius:10px;font-size:10px}.composer button{padding:0 16px;color:#fff;background:${stage >= 3 ? "#315bea" : "#68758b"};border:0;border-radius:10px;font-size:10px;font-weight:750}.tasks{margin-top:15px;display:${stage >= 2 ? "grid" : "none"};gap:8px}.task{padding:12px;display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center;background:#fff;border:1px solid #e0e5ed;border-radius:11px;transition:.18s}.task input{width:17px;height:17px;accent-color:#3b9b7f}.task strong{display:block;font-size:11px}.task small{color:#8791a3;font-size:9px}.task em{padding:5px 7px;color:${stage >= 3 ? "#356d5d" : "#6f7888"};background:${stage >= 3 ? "#e9f7f2" : "#eef0f3"};border-radius:7px;font-size:8px;font-style:normal}.task.done strong{text-decoration:line-through;color:#949cab}.skeleton{display:${stage === 1 ? "grid" : "none"};gap:9px}.skeleton i{height:49px;background:#eceff3;border-radius:9px}.empty{display:${stage === 0 ? "grid" : "none"};min-height:260px;place-items:center;color:#8a94a6;font-size:12px}@keyframes reveal{from{opacity:0;transform:translateY(7px)}}.tasks,.composer,.stats{animation:reveal .38s ease}@media(max-width:560px){.page{padding:12px}.head,.body{padding:19px}.task{grid-template-columns:auto 1fr}.task em{grid-column:2;justify-self:start}.composer button{padding:0 12px}}@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}</style></head><body><main class="page"><div class="build-state"><i></i>${status}</div><section class="app"><header class="head"><small>今天 · 专注小目标</small><h1>我的待办</h1><p>完成一件，再开始下一件。</p><div class="stats"><div class="stat"><strong id="left">3</strong><span>待完成</span></div><div class="stat"><strong id="done">1</strong><span>已完成</span></div></div></header><div class="body"><div class="empty">等待生成任务界面</div><div class="skeleton"><i></i><i></i><i></i><i></i></div><div class="composer"><span>输入一件准备完成的事…</span><button type="button">添加任务</button></div><div class="tasks"><label class="task"><input type="checkbox"><span><strong>整理本周会议记录</strong><small>办公 · 今天</small></span><em>进行中</em></label><label class="task done"><input type="checkbox" checked><span><strong>完成主页内容草稿</strong><small>创作 · 今天</small></span><em>已完成</em></label><label class="task"><input type="checkbox"><span><strong>收集三个设计参考</strong><small>研究 · 明天</small></span><em>待开始</em></label><label class="task"><input type="checkbox"><span><strong>规划下周学习目标</strong><small>学习 · 周末</small></span><em>待开始</em></label></div></div></section></main>${script}</body></html>`;
}

function createTaskboardDocument(stage: number) {
  const status = ["等待开始", "规划状态与组件", "建立分组数据", "连接新增流程", "完成状态流转"][stage] ?? "生成完成";
  const script = stage >= 2 ? `<script>
    const input=document.querySelector('#task-input');const active=document.querySelector('#active-list');const done=document.querySelector('#done-list');const count=document.querySelector('#remaining');
    let tasks=[{id:1,title:'整理需求与验收标准',done:false},{id:2,title:'完成任务面板第一版',done:false},{id:3,title:'检查本地运行结果',done:true}];
    const escapeText=(value)=>value.replace(/[&<>"']/g,(char)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
    function render(){active.innerHTML='';done.innerHTML='';tasks.forEach((task)=>{const label=document.createElement('label');label.className='task'+(task.done?' done':'');label.innerHTML='<input type="checkbox" '+(task.done?'checked ':'')+${stage >= 4 ? "''" : "'disabled '"}+'data-id="'+task.id+'"><span>'+escapeText(task.title)+'</span>';label.querySelector('input').addEventListener('change',()=>{task.done=!task.done;render()});(task.done?done:active).appendChild(label)});count.textContent=tasks.filter((task)=>!task.done).length}
    ${stage >= 3 ? "input.addEventListener('keydown',(event)=>{if(event.key==='Enter'&&input.value.trim()){tasks.unshift({id:Date.now(),title:input.value.trim(),done:false});input.value='';render()}});" : "input.disabled=true;"}
    render();
  </script>` : "";
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'"><style>*{box-sizing:border-box}body{margin:0;background:#f5f6f6;color:#303839;font-family:system-ui,-apple-system,sans-serif}.page{min-height:100vh;padding:20px}.state{max-width:820px;margin:0 auto 10px;padding:8px 11px;color:#677274;background:#fff;border:1px solid #e0e5e5;border-radius:10px;font-size:10px;font-weight:700}.board{max-width:820px;margin:auto;overflow:hidden;background:#fff;border:1px solid #dfe4e4;border-radius:${stage >= 3 ? "18px" : "11px"};box-shadow:${stage >= 3 ? "0 15px 38px rgba(49,57,58,.06)" : "none"}}.head{padding:23px 25px;background:#f1f4f4;border-bottom:1px solid #e0e5e5}.head small{color:#748082;font-size:10px;font-weight:750}.head h1{margin:5px 0 15px;font-size:25px;letter-spacing:-.04em}.head input{display:${stage >= 2 ? "block" : "none"};width:100%;padding:12px 13px;color:#3e4849;background:#fff;border:1px solid #d9e0e0;border-radius:10px;font:inherit;font-size:11px;outline:none}.head input:focus{border-color:#aebbbc;box-shadow:0 0 0 3px rgba(174,187,188,.14)}.groups{display:${stage >= 2 ? "grid" : "none"};grid-template-columns:1.08fr .92fr;gap:1px;background:#e4e8e8}.group{min-height:250px;padding:20px;background:#fff}.group.done-group{background:#fafbfb}.group h2{margin:0 0 12px;color:#596466;font-size:11px}.list{display:grid;gap:7px}.task{min-height:48px;padding:11px 12px;display:flex;align-items:center;gap:10px;background:#fff;border:1px solid #e0e5e5;border-radius:10px;font-size:11px;transition:.18s}.task input{width:17px;height:17px;accent-color:#8c9b9d}.task.done{color:#92999a;background:#f4f6f6}.task.done span{text-decoration:line-through}.foot{display:${stage >= 2 ? "flex" : "none"};padding:13px 22px;align-items:center;justify-content:space-between;color:#697476;background:#f1f4f4;border-top:1px solid #e0e5e5;font-size:10px}.foot strong{color:#3f4a4b;font-size:17px}.skeleton{display:${stage === 1 ? "grid" : "none"};padding:28px;gap:10px}.skeleton i{height:48px;background:#eef1f1;border-radius:10px}.skeleton i:first-child{height:72px}@media(max-width:620px){.page{padding:10px}.groups{grid-template-columns:1fr}.group{min-height:auto}.done-group{border-top:1px solid #e4e8e8}}@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}</style></head><body><main class="page"><div class="state">${status}</div><section class="board"><header class="head"><small>本地任务 · 不连接后端</small><h1>任务管理面板</h1><input id="task-input" aria-label="新增任务" placeholder="输入任务后按回车添加"></header><div class="skeleton"><i></i><i></i><i></i></div><div class="groups"><section class="group"><h2>未完成</h2><div class="list" id="active-list"></div></section><section class="group done-group"><h2>已完成</h2><div class="list" id="done-list"></div></section></div><footer class="foot"><span>还需要完成</span><strong><span id="remaining">2</span> 项</strong></footer></section></main>${script}</body></html>`;
}

function createPomodoroDocument(stage: number) {
  const status = ["等待开始", "规划计时状态", "建立计时界面", "连接倒计时", "处理边界状态"][stage] ?? "生成完成";
  const script = stage >= 3 ? `<script>
    let remaining=1500;let timer=null;let running=false;const display=document.querySelector('#time');const toggle=document.querySelector('#toggle');const reset=document.querySelector('#reset');const app=document.querySelector('.timer');const label=document.querySelector('#mode');
    function render(){const min=String(Math.floor(remaining/60)).padStart(2,'0');const sec=String(remaining%60).padStart(2,'0');display.textContent=min+':'+sec;app.classList.toggle('ending',remaining<=5);app.classList.toggle('running',running);toggle.textContent=running?'暂停':'开始'}
    function stop(){if(timer)clearInterval(timer);timer=null;running=false;render()}
    function beep(){${stage >= 4 ? "try{const Audio=window.AudioContext||window.webkitAudioContext;const context=new Audio();const oscillator=context.createOscillator();const gain=context.createGain();oscillator.connect(gain);gain.connect(context.destination);gain.gain.value=.04;oscillator.start();oscillator.stop(context.currentTime+.18)}catch{}" : ""}}
    toggle.addEventListener('click',()=>{if(running){stop();return}running=true;render();timer=setInterval(()=>{remaining-=1;if(remaining<=0){beep();stop();remaining=1500;label.textContent='下一轮已准备';render()}else render()},1000)});
    reset.addEventListener('click',()=>{stop();remaining=1500;label.textContent='准备专注';render()});
    document.querySelectorAll('[data-minutes]').forEach((button)=>button.addEventListener('click',()=>{stop();remaining=Number(button.dataset.minutes)*60;label.textContent=button.textContent;render()}));render();
  </script>` : "";
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'"><style>*{box-sizing:border-box}body{margin:0;background:#f5f6f6;color:#272d2e;font-family:system-ui,-apple-system,sans-serif}.page{min-height:100vh;padding:20px;display:grid;place-items:center}.wrap{width:min(620px,100%)}.state{margin-bottom:10px;padding:8px 11px;color:#687274;background:#fff;border:1px solid #e0e4e4;border-radius:10px;font-size:10px;font-weight:700}.timer{position:relative;min-height:430px;padding:48px 30px 30px;display:${stage >= 2 ? "grid" : "none"};place-items:center;align-content:center;text-align:center;background:#fff;border:1px solid #dfe4e4;border-radius:${stage >= 3 ? "24px" : "13px"};box-shadow:${stage >= 3 ? "0 16px 42px rgba(48,57,58,.065)" : "none"}}.timer:before{content:'';position:absolute;inset:18px;border:1px solid #edf0f0;border-radius:17px;pointer-events:none}.label{position:relative;color:#778183;font-size:10px;font-weight:800;letter-spacing:.1em}.time{position:relative;margin:13px 0 22px;font-size:clamp(62px,13vw,100px);font-weight:780;line-height:1;letter-spacing:-.07em;font-variant-numeric:tabular-nums}.buttons{position:relative;display:flex;gap:8px}.buttons button,.presets button{min-width:92px;min-height:42px;color:#3e4849;background:#f0f3f3;border:1px solid #dbe2e2;border-radius:10px;font-size:11px;font-weight:750;cursor:pointer}.buttons button:first-child{color:#fff;background:#434c4d;border-color:#434c4d}.presets{position:relative;margin-bottom:18px;display:none;gap:6px}.presets button{min-width:0;min-height:31px;padding:0 10px;background:#fff;font-size:9px}.tip{position:relative;margin:23px 0 0;color:#7a8485;font-size:10px}.timer.ending .time{color:#a05252;animation:pulse .65s ease-in-out infinite}.skeleton{min-height:430px;padding:40px;display:${stage === 1 ? "grid" : "none"};place-items:center;background:#fff;border:1px solid #dfe4e4;border-radius:13px}.skeleton i{width:62%;height:86px;background:#eef1f1;border-radius:18px}@keyframes pulse{50%{transform:scale(1.035)}}@media(max-width:520px){.page{padding:10px}.timer{min-height:390px;padding-inline:18px}.time{font-size:68px}}@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}</style></head><body><main class="page"><div class="wrap"><div class="state">${status}</div><div class="skeleton"><i></i></div><section class="timer"><span class="label" id="mode">准备专注</span><div class="time" id="time">25:00</div><div class="presets"><button data-minutes="25">专注 25 分钟</button><button data-minutes="5">短休息</button><button data-minutes="15">长休息</button></div><div class="buttons"><button id="toggle" type="button">开始</button><button id="reset" type="button">重置</button></div><p class="tip">一次只做一件事，完成后再开始下一轮。</p></section></div></main>${script}</body></html>`;
}

function createHeroDocument(stage: number) {
  const status = ["等待开始", "规划组件结构", "填充首屏内容", "应用视觉系统", "连接动态效果", "完成性能适配"][stage] ?? "生成完成";
  const showContent = stage >= 2;
  const showNavigation = stage >= 4;
  const showMarquee = stage >= 5;

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'">
  <style>
    *{box-sizing:border-box}
    body{margin:0;min-width:280px;background:#f7f8f8;color:#202626;font-family:Inter,ui-sans-serif,system-ui,-apple-system,sans-serif}
    .page{min-height:100vh;padding:18px}
    .build-state{width:min(1040px,100%);margin:0 auto 10px;padding:8px 11px;display:flex;align-items:center;gap:8px;color:#647071;background:#fff;border:1px solid #e5e9e9;border-radius:10px;font-size:10px;font-weight:700}
    .build-state i{width:7px;height:7px;background:#9aaeb0;border-radius:50%;box-shadow:0 0 0 4px rgba(154,174,176,.12)}
    .hero{position:relative;width:min(1040px,100%);min-height:520px;margin:auto;overflow:hidden;background:#fff;border:1px solid #e2e7e7;border-radius:${stage >= 3 ? "22px" : "12px"};box-shadow:${stage >= 3 ? "0 18px 48px rgba(40,52,53,.07)" : "none"};isolation:isolate}
    .scene{position:absolute;inset:0;width:100%;height:100%;z-index:-2}
    .scene .mist{transform-origin:center;animation:${stage >= 4 ? "breathe 12s ease-in-out infinite alternate" : "none"}}
    .veil{position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,rgba(255,255,255,.99),rgba(255,255,255,.92) 47%,rgba(255,255,255,.46) 80%,rgba(255,255,255,.76))}
    .top{height:66px;padding:0 30px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(221,228,228,.78)}
    .brand{display:flex;align-items:center;gap:9px;font-size:12px;font-weight:850;letter-spacing:.08em}
    .brand i{width:27px;height:27px;display:grid;place-items:center;background:#e8eeee;border-radius:8px;font-style:normal}
    .top small{color:#748080;font-size:9px;font-weight:700;letter-spacing:.08em}
    .content{width:100%;padding:70px 30px 150px 54px}
    .eyebrow{display:${showContent ? "inline-flex" : "none"};padding:7px 10px;color:#536264;background:#edf2f2;border:1px solid #dce5e5;border-radius:999px;font-size:9px;font-weight:800;letter-spacing:.08em;animation:${stage >= 4 ? "rise .7s both" : "none"}}
    .content h1{display:${showContent ? "block" : "none"};max-width:820px;margin:17px 0 16px;font-size:clamp(30px,4.7vw,36px);line-height:1.06;letter-spacing:-.055em;white-space:nowrap;animation:${stage >= 4 ? "rise .8s .08s both" : "none"}}
    .content p{display:${showContent ? "block" : "none"};max-width:500px;margin:0;color:#657071;font-size:13px;line-height:1.78;animation:${stage >= 4 ? "rise .8s .16s both" : "none"}}
    .actions{display:${showContent ? "flex" : "none"};margin-top:26px;gap:9px;animation:${stage >= 4 ? "rise .8s .24s both" : "none"}}
    .actions a{padding:11px 15px;color:#243031;background:#e8eeee;border:1px solid #d5e0e0;border-radius:10px;font-size:10px;font-weight:800;text-decoration:none}
    .actions a.secondary{color:#596465;background:#fff;border-color:#e0e5e5}
    .skeleton{display:${stage === 1 ? "grid" : "none"};width:min(560px,80%);padding:88px 0 0 54px;gap:13px}
    .skeleton i{height:14px;background:#edf0f0;border-radius:8px}
    .skeleton i:first-child{width:30%}.skeleton i:nth-child(2){width:92%;height:54px}.skeleton i:last-child{width:68%}
    .float-nav{position:absolute;left:50%;bottom:${showMarquee ? "62px" : "24px"};display:${showNavigation ? "flex" : "none"};align-items:center;gap:5px;padding:6px;color:#566263;background:rgba(255,255,255,.92);border:1px solid rgba(214,223,223,.95);border-radius:14px;box-shadow:0 10px 28px rgba(42,55,56,.08);transform:translateX(-50%);animation:navIn .65s .35s both;backdrop-filter:blur(12px)}
    .float-nav span{padding:8px 11px;border-radius:9px;font-size:9px;font-weight:750;white-space:nowrap}.float-nav span:first-child{background:#e8eeee;color:#344344}
    .marquee{position:absolute;inset:auto 0 0;display:${showMarquee ? "flex" : "none"};overflow:hidden;background:rgba(255,255,255,.9);border-top:1px solid #e3e8e8}
    .track{flex:0 0 100%;min-width:100%;padding:15px 16px;display:flex;align-items:center;justify-content:space-around;gap:18px;animation:marquee 18s linear infinite}
    .track span{color:#7a8585;font-size:9px;font-weight:850;letter-spacing:.14em}.track span:before{content:'◇';margin-right:8px;color:#a8b7b8}
    .placeholder{display:${stage === 0 ? "grid" : "none"};position:absolute;inset:66px 0 0;place-items:center;color:#7b8787;font-size:11px}
    @keyframes rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
    @keyframes navIn{from{opacity:0;transform:translate(-50%,14px)}to{opacity:1;transform:translate(-50%,0)}}
    @keyframes breathe{from{transform:scale(1) translate3d(0,0,0)}to{transform:scale(1.035) translate3d(-.5%,.3%,0)}}
    @keyframes marquee{to{transform:translateX(-100%)}}
    @media(max-width:620px){.page{padding:10px}.hero{min-height:500px}.top{height:58px;padding:0 18px}.top small{display:none}.content{width:100%;padding:66px 22px 160px}.content h1{font-size:34px;white-space:normal}.content p{font-size:12px}.skeleton{width:86%;padding:72px 0 0 22px}.float-nav{bottom:${showMarquee ? "58px" : "18px"};width:max-content;max-width:calc(100% - 24px)}.float-nav span{padding:7px 8px}.track{gap:12px;padding-inline:8px}.track span{font-size:8px}}
    @media(prefers-reduced-motion:reduce){*{animation:none!important;scroll-behavior:auto!important}}
  </style>
</head>
<body>
  <main class="page">
    <div class="build-state"><i></i>${status}</div>
    <section class="hero">
      <svg class="scene" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="1200" height="700" fill="#fbfcfc"/>
        <g class="mist"><path d="M420 730C610 450 810 215 1240 72V730Z" fill="#edf2f2"/><path d="M580 730C770 500 966 330 1240 248V730Z" fill="#e4ebeb" opacity=".82"/><circle cx="1000" cy="115" r="190" fill="#f2f5f5"/><path d="M760 730C905 580 1060 500 1240 470V730Z" fill="#dfe8e8" opacity=".72"/></g>
      </svg>
      <div class="veil"></div>
      <header class="top"><span class="brand"><i>O</i> ORBIT STUDIO</span><small>DIGITAL EXPERIENCES · 2026</small></header>
      <div class="placeholder">等待生成首屏结构</div>
      <div class="skeleton"><i></i><i></i><i></i></div>
      <div class="content"><span class="eyebrow">独立数字体验工作室</span><h1>让有价值的想法，被更清楚地看见。</h1><p>从品牌表达、产品界面到动态体验，我们用简洁的系统帮助团队构建更有辨识度的数字产品。</p><div class="actions"><a href="#work">浏览案例</a><a class="secondary" href="#contact">开始交流</a></div></div>
      <nav class="float-nav" aria-label="示例导航"><span>首页</span><span>案例</span><span>方法</span><span>联系</span></nav>
      <div class="marquee" aria-label="合作品牌"><div class="track"><span>NORTH</span><span>FORM</span><span>STILL</span><span>FIELD</span><span>ATLAS</span></div><div class="track" aria-hidden="true"><span>NORTH</span><span>FORM</span><span>STILL</span><span>FIELD</span><span>ATLAS</span></div></div>
    </section>
  </main>
</body>
</html>`;
}

function createRevisionStyle(revisionId: string) {
  const revisionStyles: Record<string, string> = {
    "portfolio-copy": ".grid{grid-template-columns:1fr;gap:9px}.project{min-height:82px;padding:17px 20px;grid-template-columns:120px 1fr;grid-template-rows:auto auto;column-gap:18px}.project small{grid-row:1 / 3;align-self:center;padding-right:16px;border-right:1px solid #dfe4e0}.project strong{font-size:15px}.project span{font-size:12px;line-height:1.72}@media(max-width:620px){.project{grid-template-columns:1fr}.project small{grid-row:auto;padding:0;border:0}}",
    "portfolio-compact": ".hero{padding-top:25px;padding-bottom:20px}.hero h1{margin-top:6px;margin-bottom:7px;font-size:32px}.projects{padding-top:17px}.grid{margin-top:10px}.project{padding-top:12px;padding-bottom:12px}",
    "todo-focus": ".task:nth-child(-n+2){padding:16px;background:#edf1f2;border-color:#c9d4d6;box-shadow:inset 4px 0 0 #98aaad}.task:nth-child(-n+2) strong{font-size:13px}.task:nth-child(n+3){opacity:.46;transform:scale(.975)}",
    "todo-simple": ".head{padding-bottom:19px}.stats{margin-top:12px}.task{min-height:44px;padding:10px 13px;grid-template-columns:auto 1fr}.task em,.task small{display:none}.tasks{gap:5px}.body{padding-top:15px}",
    "taskboard-focus": ".groups{grid-template-columns:1.45fr .55fr}.group:first-child{padding:25px}.group:first-child .task{min-height:58px;font-size:13px}.done-group{opacity:.58}.done-group .task{min-height:40px;padding-block:8px}@media(max-width:620px){.groups{grid-template-columns:1fr}.done-group{opacity:.65}}",
    "taskboard-dense": ".group{padding:14px}.list{gap:4px}.task{min-height:38px;padding:8px 10px;border-radius:7px}.foot{position:sticky;bottom:0;padding-block:10px}.head{padding-block:17px}",
    "pomodoro-presets": ".presets{display:flex}.timer{padding-top:35px}.time{margin-bottom:15px}",
    "pomodoro-focus": ".timer.running .label,.timer.running .tip,.timer.running #reset{opacity:.2}.timer.running .time{font-size:clamp(86px,17vw,132px)}.timer.running{background:#fafbfb}.timer.running .buttons button:first-child{min-width:125px}",
    "hero-motion": ".scene .mist,.track{animation:none}.scene{opacity:.42}.veil{background:rgba(255,255,255,.9)}.float-nav{box-shadow:none;border-color:#d9dfdf}",
    "hero-cta": ".actions{width:min(690px,100%);padding:12px;align-items:center;background:rgba(255,255,255,.9);border:1px solid #dce2e2;border-radius:14px;box-shadow:0 12px 30px rgba(42,55,56,.08)}.actions:after{content:'预计两周完成首版';margin-left:auto;color:#687475;font-size:10px;font-weight:700}.actions a:first-child{padding:13px 20px;color:#fff;background:#3f494a;border-color:#3f494a;font-size:11px}.actions a.secondary{padding:13px 16px}@media(max-width:620px){.actions{align-items:stretch;flex-direction:column}.actions:after{margin:2px 0 0}.actions a{text-align:center}}",
  };
  return revisionStyles[revisionId] ? `<style>${revisionStyles[revisionId]}</style>` : "";
}

function createPreviewDocument(template: DemoTemplate, stage: number, revisionId = "") {
  if (stage === 0) return createWaitingDocument(template);
  const document = template.id === "hero"
    ? createHeroDocument(stage)
    : template.id === "portfolio"
      ? createPortfolioDocument(stage).replace('<div class="portrait">✦</div>', "")
      : template.id === "todo"
        ? createTodoDocument(stage)
        : template.id === "taskboard"
          ? createTaskboardDocument(stage)
          : createPomodoroDocument(stage);
  const visualLanguage = template.id === "hero" || template.id === "taskboard" || template.id === "pomodoro"
    ? ""
    : template.id === "portfolio"
    ? `<style>body{background:#f6f7f6;color:#4a514e;font-family:Arial,Helvetica,sans-serif}.page{background:#f6f7f6}.build-state{color:#5d6661;background:#f1f3f1;border:1px solid #e1e5e1;border-radius:10px;box-shadow:none;font-weight:700}.build-state i{background:#abb4ae;box-shadow:0 0 0 4px rgba(171,180,174,.12)}.shell{background:#fff;border:1px solid #e1e4e1;border-radius:${stage >= 3 ? "18px" : "12px"};box-shadow:${stage >= 3 ? "0 14px 32px rgba(76,82,77,.055)" : "none"}}.nav{color:#505854;background:#f3f5f3;border-bottom:1px solid #e2e6e2}.nav small{color:#78807c;font-size:11px}.hero{grid-template-columns:1fr;color:#484f4b;background:#fff;border-bottom:1px solid #e5e7e5}.hero h1{font-size:clamp(28px,4.6vw,38px);white-space:nowrap}.eyebrow{color:#757e79;font-size:11px}.hero p{max-width:620px;color:#6e7571}.projects{background:#fff}.projects header span{color:#7f8682;font-size:11px;font-weight:700}.project,.project:nth-child(2),.project:nth-child(3){color:#4a514d;background:#f3f5f3;border:1px solid #e2e6e2;border-radius:13px;box-shadow:${stage >= 3 ? "0 6px 15px rgba(75,84,77,.04)" : "none"}}.project small{color:#747d78;font-size:10px}.project span{color:#6d7571;font-size:11px}.project.selected{border-color:#c3cbc5;box-shadow:0 7px 18px rgba(72,88,77,.065)}.placeholder-grid i,.skeleton i{background:#f0f2f0;border:1px solid #e4e7e4;border-radius:9px}.note{color:#505854;background:#f1f3f1;border:1px solid #dde2dd;border-radius:10px;font-weight:700}@media(max-width:620px){.hero h1{font-size:30px;white-space:normal}}</style>`
    : `<style>body{background:#f6f7f7;color:#4d5456;font-family:"Trebuchet MS",Arial,sans-serif}.page{background:#f6f7f7}.build-state{color:#5e686a;background:#f0f3f4;border:1px solid #e0e5e6;border-radius:10px;box-shadow:none;font-weight:700}.build-state i{background:#aab5b7;box-shadow:0 0 0 4px rgba(170,181,183,.12)}.app{background:#fff;border:1px solid #e0e4e5;border-radius:${stage >= 3 ? "17px" : "11px"};box-shadow:${stage >= 3 ? "0 14px 32px rgba(73,82,84,.055)" : "none"}}.head{color:#4b5355;background:#f0f3f4;border-bottom:1px solid #dfe5e6}.head small,.head p{color:#6f787a}.stat{background:#fff;border:1px solid #e0e4e5;border-radius:10px;box-shadow:none}.stat strong{color:#657173}.body{background:#fff}.composer span{color:#777f81;background:#fff;border:1px solid #e0e4e5;border-radius:9px}.composer button{color:#505b5d;background:#eef2f3;border:1px solid #dce3e4;border-radius:9px}.task{background:#fff;border:1px solid #e0e4e5;border-radius:10px;box-shadow:${stage >= 3 ? "0 4px 11px rgba(75,83,84,.035)" : "none"}}.task:nth-child(even),.task.done{background:#f2f4f4}.task input{accent-color:#a0adaf}.task small,.task em{color:#6f787a}.task em{background:#f0f3f4;border:1px solid #dfe5e6;border-radius:999px}.skeleton i{background:#f0f2f2;border:1px solid #e4e7e7;border-radius:8px}</style>`;
  return document.replace("</head>", `${visualLanguage}${createRevisionStyle(revisionId)}</head>`);
}

export function AdvancedPracticeLab() {
  const [templateId, setTemplateId] = useState<TemplateId>("portfolio");
  const [runState, setRunState] = useState<RunState>("idle");
  const [activeStep, setActiveStep] = useState(-1);
  const [typedText, setTypedText] = useState("");
  const [revisionId, setRevisionId] = useState("");
  const [revisionState, setRevisionState] = useState<RevisionState>("idle");
  const [revisionTypedText, setRevisionTypedText] = useState("");
  const [previewSize, setPreviewSize] = useState<PreviewSize>("desktop");
  const [reduceMotion, setReduceMotion] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const template = demoTemplates.find((item) => item.id === templateId) ?? demoTemplates[0];
  const guide = projectGuides[template.id];
  const currentStep = activeStep >= 0 ? template.steps[activeStep] : undefined;
  const selectedRevision = template.revisions.find((item) => item.id === revisionId);
  const previewStage = currentStep?.previewStage ?? 0;
  const progress = activeStep < 0 ? 0 : Math.round(((activeStep + (runState === "complete" ? 1 : 0.5)) / template.steps.length) * 100);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduceMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (runState !== "running" || !currentStep) return;
    if (typedText.length < currentStep.text.length) {
      const amount = reduceMotion ? currentStep.text.length : 2;
      const timer = window.setTimeout(() => setTypedText(currentStep.text.slice(0, typedText.length + amount)), reduceMotion ? 0 : 24);
      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => {
      if (activeStep === template.steps.length - 1) {
        setRunState("complete");
        return;
      }
      setActiveStep((step) => step + 1);
      setTypedText("");
    }, reduceMotion ? 350 : 900);
    return () => window.clearTimeout(timer);
  }, [activeStep, currentStep, reduceMotion, runState, template.steps.length, typedText]);

  useEffect(() => {
    if (revisionState !== "running" || !selectedRevision) return;
    if (revisionTypedText.length < selectedRevision.response.length) {
      const amount = reduceMotion ? selectedRevision.response.length : 2;
      const timer = window.setTimeout(() => setRevisionTypedText(selectedRevision.response.slice(0, revisionTypedText.length + amount)), reduceMotion ? 0 : 24);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => setRevisionState("complete"), reduceMotion ? 250 : 700);
    return () => window.clearTimeout(timer);
  }, [reduceMotion, revisionState, revisionTypedText, selectedRevision]);

  useEffect(() => {
    const scrollArea = chatScrollRef.current;
    if (!scrollArea) return;
    if (runState === "complete" || revisionState !== "idle") {
      scrollArea.scrollTop = scrollArea.scrollHeight;
      return;
    }
    const currentMessage = scrollArea.querySelector<HTMLElement>(".practice-message.is-current");
    currentMessage?.scrollIntoView({ block: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
  }, [activeStep, reduceMotion, revisionState, revisionTypedText, runState]);

  const appliedRevisionId = revisionState === "complete" ? revisionId : "";
  const previewDocument = useMemo(() => createPreviewDocument(template, previewStage, appliedRevisionId), [appliedRevisionId, previewStage, template]);

  function selectTemplate(id: TemplateId) {
    setTemplateId(id);
    setRunState("idle");
    setActiveStep(-1);
    setTypedText("");
    setRevisionId("");
    setRevisionState("idle");
    setRevisionTypedText("");
  }

  function startDemo() {
    setRunState("running");
    setActiveStep(0);
    setTypedText("");
    setRevisionId("");
    setRevisionState("idle");
    setRevisionTypedText("");
  }

  function togglePlayback() {
    if (runState === "complete") {
      if (!selectedRevision) return;
      if (revisionState === "running" || revisionState === "paused") {
        setRevisionState((state) => state === "running" ? "paused" : "running");
      } else {
        setRevisionTypedText("");
        setRevisionState("running");
      }
      return;
    }
    if (runState === "idle") startDemo();
    else setRunState((state) => state === "running" ? "paused" : "running");
  }

  function selectRevision(id: string) {
    setRevisionId(id);
    setRevisionState("idle");
    setRevisionTypedText("");
  }

  const visibleSteps = activeStep < 0 ? [] : template.steps.slice(0, activeStep + 1);
  const showDelivery = previewStage > 0;
  const revisionBusy = revisionState === "running" || revisionState === "paused";
  const composerPrompt = runState === "complete"
    ? selectedRevision?.prompt ?? "选择一个小改动，体验如何继续向 AI 提出修改要求。"
    : template.steps[0].text;
  const actionLabel = runState !== "complete"
    ? runState === "running" ? "暂停" : runState === "paused" ? "继续生成" : "发送并生成"
    : revisionState === "running" ? "暂停" : revisionState === "paused" ? "继续修改" : revisionState === "complete" ? "再次修改" : "发送修改";

  return (
    <section className="advanced-practice-lab" aria-labelledby="practice-lab-title">
      <header className="practice-lab-heading">
        <div><span className="practice-lab-badge">动态教学演示 · 非实时 AI</span><h3 id="practice-lab-title">看一次 AI 如何把需求逐步变成交付结果</h3><p>选择一个小项目，先看清目标、准备与工具，再观察实现、修改和验收如何在同一流程中完成。</p></div>
        <span className="practice-lab-progress">{Math.min(progress, 100)}%</span>
      </header>

      <section className="practice-conversation-window" aria-label="模拟 AI 对话与页面交付">
        <div className="practice-panel-toolbar"><span><i aria-hidden="true">✣</i> 应用构建对话</span><small><b className={runState === "running" || revisionState === "running" ? "running" : ""} />预设演示 · 无外部请求</small></div>
        <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">{runState === "running" ? `正在生成：${currentStep?.activity ?? "处理中"}` : runState === "paused" ? "生成已暂停" : revisionState === "running" ? "正在生成修改结果" : revisionState === "paused" ? "修改已暂停" : revisionState === "complete" ? "修改结果已完成" : runState === "complete" ? "生成结果已完成" : "等待发送演示需求"}</span>

        <div className="practice-unified-scroll" ref={chatScrollRef}>
          {runState === "idle" && <>
            <div className="practice-conversation-welcome"><span aria-hidden="true">✦</span><small>新手实践工作台</small><h4>选择一个模板，先读懂项目再发送需求</h4><p>同一个窗口会展示项目说明、起始提示词、分步实现、可操作结果、验收边界与下一步升级。</p></div>
            <article className="practice-project-brief" aria-label={`${template.title}项目说明`}>
              <header><span><small>项目说明</small><strong>{template.title}</strong></span><em>{template.level} · {template.category}</em></header>
              <div className="practice-project-brief-grid">
                <section><small>01 · 项目目标</small><p>{guide.goal}</p></section>
                <section><small>02 · 最终成果</small><p>{guide.outcome}</p></section>
                <section><small>03 · 开始前准备</small><ul>{guide.preparation.map((item) => <li key={item}>{item}</li>)}</ul></section>
                <section><small>04 · 推荐工具组合</small><p><strong>主要方案：</strong>{guide.tools.recommended}</p><p><strong>替代方案：</strong>{guide.tools.alternatives}</p></section>
              </div>
              <details className="practice-project-flow"><summary><span>05 · 实际操作流程</span><b>查看 {guide.workflow.length} 个步骤</b></summary><ol>{guide.workflow.map((item) => <li key={item}>{item}</li>)}</ol></details>
            </article>
          </>}

          {visibleSteps.map((step, index) => {
            const isCurrent = index === activeStep;
            const message = isCurrent ? typedText : step.text;
            return <div className={`practice-message ${step.actor} ${isCurrent ? "is-current" : ""}`} key={`${template.id}-${index}`}><div className="practice-message-meta"><small>{step.label}</small>{isCurrent && runState !== "complete" && <span>{step.activity}</span>}</div><p>{message}{isCurrent && runState === "running" && typedText.length < step.text.length && <i className="practice-typing-caret" aria-hidden="true" />}</p></div>;
          })}

          {runState === "complete" && revisionState !== "idle" && selectedRevision && <>
            <div className="practice-message user"><div className="practice-message-meta"><small>你的修改要求</small><span>第二轮迭代</span></div><p>{selectedRevision.prompt}</p></div>
            <div className={`practice-message assistant ${revisionState !== "complete" ? "is-current" : ""}`}><div className="practice-message-meta"><small>教学助手</small>{revisionState !== "complete" && <span>正在修改原有预览</span>}</div><p>{revisionTypedText}{revisionState === "running" && revisionTypedText.length < selectedRevision.response.length && <i className="practice-typing-caret" aria-hidden="true" />}</p></div>
          </>}

          {showDelivery && <article className="practice-inline-delivery" aria-label={`${template.title}实时交付结果`}>
            <header><span><i aria-hidden="true">◫</i><strong>{template.title}</strong><small>{revisionState === "complete" ? "第二轮修改已应用" : runState === "complete" ? "第一版已交付，可继续修改" : currentStep?.activity}</small></span><div><button className={previewSize === "desktop" ? "active" : ""} type="button" onClick={() => setPreviewSize("desktop")}>桌面</button><button className={previewSize === "mobile" ? "active" : ""} type="button" onClick={() => setPreviewSize("mobile")}>手机</button></div></header>
            <div className="practice-generation-track" aria-label={`生成进度 ${Math.min(progress, 100)}%`}><i style={{ width: `${Math.min(progress, 100)}%` }} /></div>
            <div className={`practice-inline-preview ${previewSize}`}><iframe srcDoc={previewDocument} sandbox="allow-scripts" title={`${template.title}动态生成效果`} /></div>
            <footer><span>{revisionState === "complete" ? `修改完成：已应用“${selectedRevision?.label}”，可与第一版对照。` : runState === "complete" ? "第一版完成：选择下方要求，继续一次结构更明确的修改。" : "页面正在跟随对话逐步构建…"}</span><small>隔离运行 · 不读取本站数据</small></footer>
          </article>}

          {runState === "complete" && <div className="practice-complete-card"><strong>{revisionState === "complete" ? "第二轮修改完成，做一次最终验收" : "第一版完成，先检查再继续修改"}</strong><ul>{template.takeaways.map((item) => <li key={item}>{item}</li>)}</ul><div className="practice-result-section"><small>07 · 项目验收清单</small><div className="practice-acceptance-list" aria-label="项目验收清单">{guide.acceptance.map((item) => <span key={item}>{item}</span>)}</div></div><div className="practice-result-guidance"><section><small>08 · 常见问题与边界</small><ul>{guide.boundaries.map((item) => <li key={item}>{item}</li>)}</ul></section><section><small>09 · 下一步升级</small><p>{guide.upgrade}</p></section></div><p className="practice-demo-boundary">当前结果是隔离的效果预演。进入真实项目后，还需要确认依赖、素材、数据、密钥与启动命令，不要把隐私信息直接写入公开代码。</p></div>}
        </div>

        <footer className="practice-chat-composer">
          <div className="practice-composer-templates" aria-label="选择发送模板">{demoTemplates.map((item) => <button className={item.id === templateId ? "active" : ""} disabled={runState === "running" || runState === "paused" || revisionBusy} type="button" aria-pressed={item.id === templateId} key={item.id} onClick={() => selectTemplate(item.id)}><span className="practice-composer-template-icon" aria-hidden="true">{item.icon}</span><span className="practice-composer-template-copy"><b>{item.title}</b><small><em>{item.level}</em>{item.category}</small></span></button>)}</div>
          {runState === "complete" && <div className="practice-composer-revisions" aria-label="选择第二轮修改"><small>继续修改</small>{template.revisions.map((revision) => <button className={revision.id === revisionId ? "active" : ""} disabled={revisionBusy} type="button" aria-pressed={revision.id === revisionId} key={revision.id} onClick={() => selectRevision(revision.id)}>{revision.label}</button>)}</div>}
          <div className="practice-composer-input"><span><small>{runState === "complete" ? "第二轮修改要求" : "06 · 起始提示词"}</small><strong>{composerPrompt}</strong></span><button aria-label={actionLabel} className={runState === "running" || revisionState === "running" ? "running" : ""} disabled={runState === "complete" && !selectedRevision} title={actionLabel} type="button" onClick={togglePlayback}><i className="composer-send-arrow" aria-hidden="true" /></button></div>
          <p><strong>提示：</strong>当前窗口仅以简单页面演示 AI 构建流程，不代表实际项目的最终需求。若希望设计主题与风格更鲜明的个人网站，可以搭配设计类 Skill，或参考成熟的视觉案例；其他类型的项目也可以采用同样方式补充专业背景与参考。</p>
        </footer>
      </section>
    </section>
  );
}
