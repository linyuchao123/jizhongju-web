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

## Palace story and map refinement (2026-10-31)

- 用户要求修复全球大气染色造成的左右色差，强化自然植被色，减弱蜡状地形与过度倾斜。
- 地图增加 55 个主要景点与出入口，支持搜索、分类；公开几何点和参考观察点必须区分，不承诺穷尽园内每件小景或已校测步行路径。
- 新主线《颐和谜境·样式雷手札》依据团队两版 PDF 改编，突出悬疑探索与反转，六幕分镜、NPC、玉澜堂/仁寿殿支线、三个归档结尾。
- 平台仍保持通用明亮导航；独立故事使用矿物青绿与纸本武侠视觉。场景、角色及信物用匹配的插画资产，不替代真实地图几何。
- 图鉴支持六件信物、对应照片和体验卷宗。当前本机存储；NPC 为预设分支，实时 AI 与云同步尚未接入。

## Launch and dual modes (2026-10-31)
- 用户授权部署 Cloudflare 并绑定 jizhongju.xiaolinyx.me。保持已部署版本可体验，比赛展示优先移动端。
- 首页集中解释文化体验游戏与两种入口；其他城市、北京未开放景点明确为敬请期待。
- 线上增加悬疑对白；线下有本站目的、观察、路线引导，GPS 在参考范围且精度 ≤100m、照片、至少四字记录齐备后推进。GPS 仅本机计算，不上传原始坐标；不声称照片真实性核验。
- 账号使用真实 Cloudflare D1 会话；当前游玩进度和相册仍为本机数据，不声称云同步。语音目前使用设备提供的中文声线，可关闭、重播、切换；不声称专业录音。

## Offline rewrite accepted (2026-10-31, supersedes dual modes)
- Only offline exploration. No role selection or initial location/photo gate. One start button.
- Content follows docs/source-extracts/game-workbook.json. Real photographs retain author/license links; mobile uses uncropped image reference.
- Submit fresh GPS plus answers and required photographs together. Photos/audio are sent to Cloudflare AI only on submission; raw coordinates are processed for validation and not persisted. Do not claim untested recognition accuracy.
- Current story/photo progress remains on this device; real accounts do not imply cloud synchronization.
- Finder preserves mounted task and unsent evidence, centres destination even if GPS is denied. Fictional conspiracy and hypothetical reconstructions must be labelled.

## Cinematic restoration (latest user decision, supersedes offline-only rewrite)
- Use the supplied previous-version screenshots as visual source: full-bleed cinematic scene, mineral green tint, ivory dialogue panel, Aheng portrait, illustrated collectible reward modals and illustrated collection cards.
- Restore the complete former six-act story and its existing dialogue, clues, memory naming, branches, three endings, chat, sources and collection; do not replace this with a long form.
- Both online immersion and offline play exist. Demonstration is enabled by default for either entry, with no required photos, uploads or GPS. Demo memories must never be represented as verified visits.
- Keep one fixed NPC Aheng with prior portrait/voice controls. No confusing role-selection gate. Scene art and item art from existing assets are explicitly approved for restoration.

## Leshoutang review checkpoint
- Preserve snapshot/cinematic-demo-20261031 at 8981e25. Work only in feature/leshoutang-story-preview for the new workbook-based story.
- User currently requests only the Leshoutang scene for visual/interaction review before continuing remaining chapters. Do not develop subsequent chapters or deploy until the user asks.
- Dedicated /#leshoutang route and separate local save. Existing /#archive six-act demo remains available.
- Spreadsheet row 2 is authoritative for this scene, except mandatory GPS/photos are relaxed for demonstration by latest user instruction. Full-screen green/ivory cinematic style and Aheng portrait remain.
