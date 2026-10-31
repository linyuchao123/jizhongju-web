# Cloudflare 上线验收

正式域名：https://jizhongju.xiaolinyx.me/

最终部署版本：a1d45027-e25f-4ec9-9c39-831299d087b6。Workers 静态资源 + D1 账号数据库；部署配置在 wrangler.jsonc。主要功能（移动首页、双模式、语音、注册登录）已随此版本发布。页面直达 hash 路由与中文 lang 标记也已随最终补丁成功上线。

验证：生产构建通过；29 项自动测试通过，其中 SQLite 真表测试覆盖注册、会话、退出、错误密码与重新登录。生产 HTTPS 首页与匿名 me 接口返回 200，生产注册及 Secure/HttpOnly 会话签发成功。Chrome 原生页面观察确认正式域名显示真实地图与新双模式入口。后续 HTTP 完整登录流程因当前网络连接重置未完成；不声称全网或所有手机已通过验收。

本地浏览器已检查 390×844 首页、线下三项关卡条件和账号弹窗。截图：qa/account-mobile-final.png。账号视觉保持纸本、墨绿和湖山插画；正文、表单、提交及游客入口在手机可达。线上四段分镜对话，线下两段行动导向对话。定位精度差、过期、距离远、支线切换、缺照片和记录的门槛有自动测试。

限制：未在颐和园现场实测 GPS 和路线；参考观察点容差 220m、公开几何点 180m，不能视作防作弊系统。照片只检查上传存在，不做视觉地点识别。中文语音使用系统 speechSynthesis，音色随设备变化，未验收所有手机的实际音质；外部配音生成服务本次连接失败，未使用付费录制资产。无密码找回，无照片/剧情云同步。账号测试仅使用合成测试身份。

## Offline rewrite final deployment
- Cloudflare version: `b26efeb5-1f45-4941-9b1b-daf9b428eb97`.
- Wrangler confirmed worker upload, assets and custom-domain triggers successful. DB, AI, ASSETS bindings present.
- New production bundle: `index-CRbVWKzN.js`, `index-EeinIsBv.css`.
- Build passed; total suite 35 passed. Final targeted 6 new offline tests rechecked after changes.
- Earlier real visual requests returned 422 with Chinese guidance, revealing OR-condition misinterpretation, corrected in final version. Subsequent live retests had connection/read timeouts (25 seconds, 0 bytes); positive real-image acceptance has NOT been confirmed. Formal-domain browser navigation also timed out. Do not call this a full online or field acceptance.
- Screenshot local browser: qa/trail-mobile-final.png. Gameplay and GPS/photo processing limitations in docs/offline-rewrite-2026-10-31.md.
