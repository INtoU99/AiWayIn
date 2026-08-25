# AiWayIn

AiWayIn 是一个面向中文零基础用户的 AI 工具与资源导航站，集中整理可信的官方入口、安装指南、入门路线、工具对比、网络环境检测与常见问题。

## 主要功能

- 按目标、设备与参与方式生成 AI 入门路线
- AI 助手与 Agent 横向对比
- 工具目录、安装准备、环境自检与官方快捷下载
- AI 对话、API 平台、网络环境检测及精选网站导航
- GitHub 开源项目分类、难度与基础工具关联
- 面向新手的六类常见问题说明
- PC、平板与手机响应式布局

## 服务边界

本站只整理公开的官方信息与入口，不托管第三方安装包，也不提供、销售或推荐任何网络代理、节点、订阅、线路、账号、代充值、共享 API Key 或 IP 服务。外部产品的价格、开放地区、能力与使用规则可能发生变化，请以对应官方页面为准。

## 本地开发

需要 Node.js `22.23.2` 或兼容的 Node.js 22 版本。

```bash
npm ci
npm run dev
```

默认开发地址由 Vinext 输出，也可以显式指定主机与端口：

```bash
npm run dev -- --host 127.0.0.1 --port 3000
```

## 质量检查

```bash
npm test
npm run lint
npm run build
```

## Cloudflare Workers

项目使用 Vinext 与 Cloudflare Vite 插件生成 Worker 服务端代码和静态资源。

```bash
npm run preview
npm run deploy
```

通过 Cloudflare Workers Builds 连接 GitHub 时使用：

- 生产分支：`main`
- 根目录：`/`
- 构建命令：`npm run build`
- 部署命令：`npx wrangler deploy --config dist/server/wrangler.json`
- 非生产分支部署：`npx wrangler versions upload --config dist/server/wrangler.json`
- Node.js：`22.23.2`

当前版本不需要 D1、R2 或运行时密钥。`.env*`、`.dev.vars*`、构建产物与本地 Wrangler 状态均不会提交到 Git。

## 素材说明

页面中的第三方产品名称和 Logo 只用于识别对应官方入口，权利归各自所有者，收录不代表 AiWayIn 与其存在赞助或合作关系。具体来源记录见 `public/logos/SOURCES.md`、`public/resource-logos/SOURCES.md` 与 `public/github-project-logos/SOURCES.md`。
