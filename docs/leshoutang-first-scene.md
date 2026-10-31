# 乐寿堂单幕试片

仅本地预览，不上传部署。入口 `/#leshoutang`。旧六幕版本仍可从 `/#archive` 打开。

## 分支保留
- 当前旧版快照分支：`snapshot/cinematic-demo-20261031`，提交 `8981e25`。
- 新剧情独立分支：`feature/leshoutang-story-preview`。
- 新试片单独使用 `jzj-leshoutang-scene-v1` 存档，不覆盖旧六幕剧情存档；重新开始只影响这一幕。

## 表格第二行对应
- 第一页手札：鹿、鹤、瓶三个模糊图案；使用表格 F2 开场与观察提醒。
- 点击三个器物残影进入专属调查页，阿衡逐物回应，记录后逐一解锁。
- 三件齐全才开放寓意解谜；选项按表格顺序：福禄寿喜、六合太平、富贵吉祥、风调雨顺。
- 答错保持进度，给出“六合”提示；答对展开鹿/六、鹤/合、瓶/平的释义。
- 获得带如意纹、鹿鹤瓶组合的圆形“六合太平印”，收入专属行囊。
- 按 F2 转场暗语展开 A/B 后续路线预告，明确后续尚未制作。
- 遵照最新演示要求，不进行 GPS 强制触发或图像真实性识别；线下引导可选上传照片，但不以照片作为推进门槛。

## 视觉与来源
- 延续已认可的全屏场景、矿物绿、纸本对话框、固定阿衡立绘与信物弹窗。
- 背景原图：Kallgan，public domain，https://commons.wikimedia.org/wiki/File:Beijing_Summer_Palace_Leshoutang.jpg 。`courtyard-cinematic` 基于该实拍图做光影演绎，非未修改纪实照片。
- 铜鹿、铜鹤、铜瓶和圆印为新生成解释性剧情美术，非历史实物测绘重建。PNG 保存原稿，WebP 为压缩运行资源。
- 建筑沿革对照 https://www.summerpalace.net.cn/court_life/detail/350.html 。虚构的师父手札、人物、推理对白不当作历史档案。

## 验证
- 新版单幕三项逻辑检查通过：器物去重/三件齐备、正确选项及奖励门槛、损坏存档恢复、两种演示无需定位或照片。
- Chrome 操作验证：开场→三件调查→答错提示→答对释义→奖励→分叉收尾→重开。
- 390×844 手机开场视觉检查；无控制台错误。内置预览连接失效后按技能允许的回退使用 Chrome。
- 证据：qa/leshoutang-opening.png、qa/leshoutang-inspect.png、qa/leshoutang-reward.png、qa/leshoutang-mobile.png。
