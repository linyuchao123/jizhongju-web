# Mobile polish

Implemented locally, not deployed:
- Remove unused low-zoom natural-earth raster and sprite-icon dependency. First vector content render dismisses blocking loader; compact loading notice retains slow/error states. Roof details fetched only on scenic zoom. Public vector/DEM service latency remains outside app control; no measured device speedup claimed.
- 81 cached Xiaoxiao neural voice clips, 3.6MB combined, loaded only for the current line. Discovery +4% rate/+3Hz, mystery -7%/-3Hz, companion -2%/0Hz. This is prosody direction, not professional full emotional acting. Missing dynamic lines use device Chinese voice. Mute preference persists; browser autoplay policy may need first tap.
- Source direction: docs/source-extracts/aheng-voice.txt. Raw docx remains unchanged. Generated with installed edge-tts; does not clone a real person's voice.
- New authenticated profile endpoint and user_profiles table. Nickname/city/bio/avatar validation, JPEG-only avatar max200KB. UI crops/resizes256px, strips metadata, saves only after explicit Save. Schema change is additive. Apply cloudflare/schema.sql to D1 before deploying this version; remote DB not changed in this round.
- Shared header/footer brand uses 70KB local Ma Shan Zheng subset. OFL license included. Sans-serif reading text and brush display titles retain original green/ivory palette.

Validation:
- Production build passes, 41 tests pass. Account SQLite integration covers profile update, read-back, rejected SVG payload, logout and re-login.
- Browser inspection blocked: localhost:8787 automatic origin approval timed out twice; no denial of safety, but no screenshot/visual acceptance claimed. Need phone check for avatar form, voice playback and first map render before publishing.

## Published after user approval
- D1 additive schema applied successfully; 5 queries, existing account data retained.
- Cloudflare deployment version: 8ab98a03-7af9-4af1-b41c-6e254c0e8fce.
- Build and 41 automated checks passed. Latest main resources: index-e93oHsgw.js / index-c61UrnNo.css.
- Browser access recovered: local mobile personal centre visually inspected and captured at375×812; no missing images, document width375. Also checked320 viewport/document width320. Screenshot qa/mobile-profile-polish.png.
- Mobile form inputs16px to avoid iOS focus zoom, minimum44px actions, flexible biography/name wrapping. Authenticated editor persistence verified by SQLite tests; real phone audio/permissions may differ by browser.


## 账号恢复与字体第二轮
- 根因：资料 POST 已写 D1，GET me 也返回完整资料，但 login 响应只有基础账号字段。统一 login/me profile 合并，避免重新登录后空白表单覆盖已保存资料。
- 回归检查验证保存头像、城市、简介后退出登录，再检查 login 响应本身包含原资料。全量 43 项测试通过。
- 字体扩展至 148KB 本地字库；档案标题、图鉴信物、冒险邀请和个人名片形成手写/印刷/正文层次，保留统一品牌。375px 档案页和 320px 图鉴、个人页检查无横向溢出；图鉴窄屏标题与统计改成上下排列。
- 新语音选择豆包 TTS 2.0，候选 Vivi 2.0，预渲染脚本及 SSE 完整性测试已就绪。尚无账号密钥，未生成或替换新声音，不声称已完成真人配音。详见 aheng-emotional-voice.md。
- 首轮修复部署版本 8fef1e02-2701-45ae-a596-f0007ad4801d；最终窄屏补丁已部署，版本 bcdefd55-7e65-4c1d-b299-a94e96b0f08a。
