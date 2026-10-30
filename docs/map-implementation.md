# 连续城市探索地图

## 已实现

- 默认首页为地图；一个 MapLibre WebGL 画布，国家、北京市、景区与景点共用实例。
- 真正的滚轮缩放、拖动、右键旋转与双指地图手势；原生地图键盘操作。
- 中国视野 → 北京市区域 → 颐和园 → 4 个园内点位。层级根据连续 zoom 自动更新，未通过换图或重新挂载地图实现。
- 一镜入园、园内逐点巡游、自动环绕、正北复位、2D/3D 平滑切换、浏览器全屏。
- 自动镜头倾角从 zoom 10 的 0° 平滑增加至 zoom 16 的 57°；用户也可选择俯视或自由旋转。
- 浅色地理底图、墨绿水系、朱红探索标记与关联线；地图建筑轮廓立体挤出。
- 移动端扩大全国视野、默认收起探索面板、标签边缘避让与更大的景点点击区域。

## 定位

用户点击“定位到我附近”后调用浏览器 Geolocation API；浏览器已有该站位置授权时，地图就绪后可自动定位。手动移动/飞行期间不自动打断用户。

- 使用 WGS84 经、纬度，与 OSM 底图一致。
- 显示当前位置与精度范围，镜头连续飞向该位置；精度不足时不会强行缩到建筑级别。
- 根据实际球面距离判断附近的园内点，人在北京以外时不会冒充颐和园现场。
- 定位被拒绝、超时、不支持或非安全环境时给出提示，手动探索仍可使用。
- 不保存实际定位结果，不提交到本项目服务器，不把它当作打卡验证。
- 外部地图服务仍会收到正常的地图切片请求。正式站点应使用 HTTPS；手机访问电脑的普通局域网 HTTP 地址通常无法使用定位。

浏览器测试没有代替用户授予位置权限，也没有获取用户的真实精确位置。真实设备定位仍需用户在页面中允许后验证。

## 数据与技术来源

- 渲染引擎：[MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/)，固定 5.6.2，BSD-3-Clause。
- 底图：[OpenFreeMap Liberty](https://openfreemap.org/quick_start/)，基于 OpenMapTiles / OpenStreetMap。原始样式存于 `src/map/liberty-base.json`，主题定制在 `src/map/style.mjs`。
- 地理数据：[OpenStreetMap contributors](https://www.openstreetmap.org/copyright)，ODbL。版权始终保留在地图控件与说明中。
- 灵感参考：[团队项目 hackathon-2610](https://github.com/lankerr/hackathon-2610)。查看了其 MapLibre、矢量底图与地点镜头实现；未复制其代码、图标、照片或离线切片。
- 公开 WGS84 坐标，来源为 Wikidata（CC0）：[佛香阁 Q10886840](https://www.wikidata.org/wiki/Q10886840)、[长廊 Q3378518](https://www.wikidata.org/wiki/Q3378518)、[石舫 Q2636083](https://www.wikidata.org/wiki/Q2636083)、[十七孔桥 Q61857626](https://www.wikidata.org/wiki/Q61857626)。坐标也在 Wikimedia Commons 对应分类页面核对。公开条目坐标不等于现场精密测绘。

## 实际边界

- 地图需要联网读取矢量切片、地形阴影图片、字形与样式图标。当前并非离线地图。
- 3D 为真实建筑轮廓的挤出效果；数据缺失的建筑高度用示意值，不是精细建筑模型或实景扫描。
- 全国视野使用地理投影与低级别地形晕渲；没有接入实测 DEM 地形网格或卫星影像。
- 朱红虚线表示少量线索之间的关联，不是步行路径。没有实现路线规划、开放状态、园区票务或人流实时数据。
- 北京市是直辖市，界面使用“北京市 / 直辖市”，未错误标为省。
- 颐和园目前有地图探索和观察提示；已有西海故事仍保留在故事档案中，未伪造新的颐和园完整剧本。

## 修改位置

- `src/map/MapExplorer.jsx`：引擎生命周期、镜头、定位、控件与交互。
- `src/map/style.mjs`：地图配色与图层。
- `src/map/geo.mjs`：位置、距离、精度范围、镜头倾角计算。
- `src/map/map.css`：地图 UI 与手机适配。
- `tests/map-geo.test.mjs`：镜头连续性、距离、坐标和定位范围测试。

运行验证：

```sh
node --test tests/map-geo.test.mjs
npm run build
```

## 写实材质迭代

- 地形：接入 AWS Open Data 的 Mapzen Terrarium DEM（256 px、最高 z12），地形比例 1，单独 DEM 源用于 hillshade。范围限定北京附近。地形在镜头飞行结束后启用，避免 MapLibre 5.6 在飞行中新增 terrain 导致未初始化 elevationTarget 的错误；后续入园、POI 飞行继续使用该地形。
- 水面：原生 fill-pattern 裁切到 OSM water 面；程序生成周期性波浪法线亮度，模拟漫反射与小面积高光。不是实拍影像、屏幕空间反射或物理水体。8 Hz 上限（120 ms 节流），后台与减弱动画时暂停更新；波形空间基底缓存。Node 本机 30 次平均生成约 1.36 ms，不代表手机 GPU 帧率。
- 建筑：保留 render_height / render_min_height，石材颗粒与单独屋顶色盖层、固定地理方位受光。OpenMapTiles 的 render_height 可能由 height、levels 或默认值产生，不能称实测高度。抽查 14/13483/6202，存在按 5 米合并的大量建筑。
- 佛香阁：OSM 最近轮廓中心约 116.2740961,39.9989509，补充八边体量。官网记载阁身 36.44 米、八面三层四重檐；外径、各层高度与屋檐比例为解释性建模，不是扫描或测绘。未把官网的 20 米台基再加到 DEM 上，避免重复叠高。
- 所有建筑的摄影级细节无法从当前公共矢量瓦片自动恢复；本轮并未接入建筑实景模型、航拍纹理或精细屋顶数据。

来源：
- https://registry.opendata.aws/terrain-tiles/
- https://github.com/tilezen/joerd/blob/master/docs/attribution.md
- https://maplibre.org/maplibre-gl-js/docs/examples/3d-terrain/
- https://maplibre.org/maplibre-gl-js/docs/examples/add-a-hillshade-layer/
- https://github.com/openmaptiles/openmaptiles/blob/master/layers/building/building.yaml
- https://summerpalace.net.cn/longevity/detailqianshan/382.html
- 园内坡屋顶：`public/data/palace-roof-footprints.json` 保存公开矢量瓦片中的 185 个单环四角轮廓与原 render_height；保留 OSM / OpenMapTiles / OpenFreeMap 标注。只在核心园区范围补充 1.8–3 米的简化庑殿式坡顶解释，避免复杂内院或超大轮廓错误收拢。该屋顶形态与尺寸不是 OSM 提供的实测信息，不涵盖所有建筑，不称“全部高精模型”。
- 投影兼容：景区地形启用时明确切到 Mercator；低于 z10 时先移除 terrain，再恢复 globe。此缩放级别地球视图已经贴近平面，仍为同一个 MapLibre 场景与连续镜头；避免 globe transform 的 terrain fog matrix 不支持警告。
