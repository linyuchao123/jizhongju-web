# 阿衡情绪配音接入

已选定火山引擎豆包语音合成 2.0 Vivi 2.0。2026-11-01 用户试听自然陪伴、低声调查、惊喜发现三段后认可，并授权替换全篇。密钥仅在本机 .env.voice.local；新配音为情绪语音合成，不是真人录音。

先在火山引擎开通语音合成 2.0，确认费用与音色权限，在本机环境设置 `VOLC_TTS_API_KEY`。密钥不得写入 Vite 环境变量、Git 或聊天。

执行 `node --env-file=.env.voice.local scripts/aheng-tts.mjs --sample`，生成陪伴、悬疑、发现三段试听到 qa/aheng-audition，保持线上旧音频不变。试听通过后执行 `node --env-file=.env.voice.local scripts/aheng-tts.mjs --all`，按每段对白和情绪预渲染，再构建发布。请求失败不更新清单；已完成的文件可复用，避免重复计费。切换声线可用 `VOLC_TTS_SPEAKER`。

采用预渲染音频：游客播放无需等待语音生成，也不会每次访问产生合成费用。默认声音开启，用户关闭偏好和移动端首次触摸播放规则保留。外接 TTS 仍为合成配音；真正的真人配音需录音演员交付音频，可直接替换清单中的音频地址。

官方参考：
- https://docs.volcengine.com/docs/doubao-voice/tone-list-3?lang=zh
- https://docs.volcengine.com/docs/doubao-voice/http-chunked-sse-unidirectional-streaming-v3?lang=zh

已使用真实服务完成三段试听，并获得用户认可。全量包含原六幕、线上/线下引导、A/B 路线对白和奖励旁白；生成工具按文本覆盖检查补齐遗漏，音频可复用。

## 全量验收（2026-11-01）
- 134 段已切换为 Doubao TTS 2.0 Vivi 2.0，覆盖原六幕、线上/线下任务、对话侧栏及新增双线故事。
- 全部 MP3 通过系统音频解码检查，总时长约 1016 秒；未发现缺失或无效文件。
- npm run build 通过，node --test tests/*.test.mjs 共 47 项通过。
- 本轮按用户要求同步当前分支 GitHub，不部署新故事至生产。
