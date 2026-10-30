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

## Dynamic map revision (2026-10-30)

- 首页默认为地图，替换地图页原来的 AI 微缩城市静态插画。
- 用户明确选择浅色地形底图、墨绿水域、朱红探索线；中国→北京市（直辖市）→颐和园→园内景点必须在同一 MapLibre 实例连续缩放。
- 通过真实矢量数据与 WebGL 原生镜头实现，不使用整屏静态图、图片替换、伪造街道或跳页过渡。
- 定位需走浏览器权限；已授权时可自动定位。位置不计作打卡，不存储到项目服务器。
- 本轮只改地图，保留原西海故事与其他四个页面。颐和园目前是地图探索示例，不冒充已完成新的颐和园剧情。
- 线索关联虚线不作为步行路径。保留数据版权和公开坐标来源；3D 缺失高度为示意。

## Map realism revision (2026-10-30)

- 用户选择写实地图：自然水面、地形起伏、可信建筑高度；没有付费服务账号，先使用公开数据。
- 降低积木/塑料感；用真实 DEM、建筑数据高度、贴合水域的细波材质。禁止随机建筑高度冒充测绘，不用 AI 图片替代真实地图。
- 佛香阁资料以颐和园官网为准：阁身高 36.44 米、八面三层四重檐。体量补模须标明解释性建模，不声称精细实景重建。
