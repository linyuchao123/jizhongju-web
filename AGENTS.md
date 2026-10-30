# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Accepted product direction (2026-10-30)

- 通用平台有五个导航：地图、故事档案、冒险、图鉴、我的。Web 优先，小程序后续。
- 平台为明亮城市档案馆；不同故事的独立视觉在数字档案与沉浸模式中呈现。
- 用户认可三种概念风格，并要求把它们作为平台内部故事而非全站唯一主题；无需把初始概念稿逐像素复刻为平台首页。
- 完整原型聚焦北京一条路线、悬疑故事三幕和碎片地图；另外两种题材只能清楚标示为预告。
- 预览进度不能声称实地到访。AI、定位核验、地图 SDK 未接入时保持准确说明。
