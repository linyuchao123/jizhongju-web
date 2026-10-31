import {CHAPTERS} from './story.mjs';
import {POIS,distanceKm} from '../map/geo.mjs';
export const FIELD_TASKS=[
 {purpose:'确立调查起点，留下今天的第一份见证。',observe:'站在北如意门外安全区域，观察门额或入口环境。',record:'写下你进入园林时最先注意到的一处细节。',photo:'拍一张入口环境，不必拍摄其他游客正脸。',guide:'从入口核对现场导览牌，沿开放游路向画中游方向前行；不要穿越水岸或封闭区域。'},
 {purpose:'用自己的视角理解借景，不再只记一个数字。',observe:'寻找安全观景点，依次观察近处栏檐、中间林木、远处湖山。',record:'记录换一个站位后，画面发生了怎样的变化。',photo:'用一张照片同时收进至少两个景物层次。',guide:'完成观察后，沿现场下山游路走向湖岸长廊。以下地图连线仅表示剧情关联，不是步行路线。'},
 {purpose:'把被动观看变成一次主动构图，留下属于自己的画笺。',observe:'在长廊开放段挑一个可停留的位置，用柱框或窗景组织画面。',record:'为你的照片写一句理由：为什么愿意记住这一眼？',photo:'拍下你选中的廊间风景；不要攀爬、触摸彩画或堵住通行。',guide:'沿开放长廊向东，按现场指引选择玉澜堂或仁寿殿支线；闭园或施工时请停止实地流程。'},
 {purpose:'区分眼前所见和故事推断，建立一份可追溯的证词。',observe:'选择玉澜堂或仁寿殿，在允许拍照的公共区域观察构件或殿前陈设。',record:'写下一个你亲眼看见的事实，再补一句尚不能证明的推断。',photo:'只拍可公开参观、允许拍照的外部细节。',guide:'完成支线后，参考现场导览前往文昌阁附近公共湖岸；不要求进入收费展厅。'},
 {purpose:'通过核对来源，让一条看似合理的密码接受检验。',observe:'在文昌阁附近安全停留，打开佛香阁官方建筑资料，核对“层”和“檐”。',record:'用自己的话写下：手札的说法错在什么地方？',photo:'拍一张所在公共湖岸的环境，作为这次校勘的现场记录。',guide:'继续沿东岸开放道路前往十七孔桥东侧公共区域，勿沿水边翻越护栏。'},
 {purpose:'把沿途的证据重新归位，完成你自己的游园记忆。',observe:'在十七孔桥东岸允许停留处回看湖面、桥影和已收集的信物。',record:'写下这次游玩改变了你对园林的哪一种印象。',photo:'拍下桥影或湖光，为旅程留一个结尾。',guide:'终章完成后可在图鉴保存信物与照片。离园路线请以实际开放出口与现场导览为准。'}
];
const ONLINE=[
 ['阿衡','你看，纸页的毛边已经泛黄，署名处却太干净了。像有人特意把“谁写的”留给了后来者。'],
 ['阿衡','我原以为这句话是一张藏身图。直到你换了一个角度，才发现它也可以是一种观看的方法。'],
 ['阿衡','前一页让我们找他，这一页却问你看见了什么。若这些字出自不同的人，那半本空白，会不会正在等待另一个写作者？'],
 ['阿衡','两面宫墙，像两份不同的证词。相同的构件能被讲成不同的故事——这一次，我想听你说：哪些是你看见的，哪些只是我们想相信的。'],
 ['阿衡','如果是熟悉这座建筑的匠人，会把三层写成四层吗？也许是后来的人抄错了，也许这本手札从一开始，就不是我们以为的那种档案。'],
 ['阿衡','我曾把缺失的名字当作一场失踪的证明。可是，空白本身并不是证据。你一路留下的照片与文字，才是今天真正发生过的故事。']
];
export function chapterForMode(base,mode){if(mode==='field'){return {...base,lines:[base.lines[0],['阿衡',FIELD_TASKS[base.index].observe+' '+FIELD_TASKS[base.index].record]]}}return {...base,lines:[...base.lines.slice(0,2),ONLINE[base.index],base.lines[2]]}}
export function targetFor(s){return POIS.find(p=>p.id===(s.chapter===3?s.branch:CHAPTERS[s.chapter].mapId))}
export function evaluateFix(coords,target,now=Date.now(),timestamp=now){if(!target)return {ok:false,message:'当前点位未配置，请先选择支线。'};if(!Number.isFinite(coords.accuracy)||coords.accuracy>100)return {ok:false,message:'定位精度不足（需 ≤100 米）。请到开阔、安全的位置重试。'};if(now-timestamp>60000||timestamp-now>10000)return {ok:false,message:'定位已过期，请重新获取。'};const distance=Math.round(distanceKm([coords.longitude,coords.latitude],target.coord)*1000),radius=target.coordinateNote?.includes('参考')?220:180;return {ok:distance<=radius,distance,accuracy:Math.round(coords.accuracy),radius,message:distance<=radius?`已在本站范围 · 距参考点约 ${distance} 米 · 精度约 ${Math.round(coords.accuracy)} 米`:`距本站约 ${distance} 米，需进入 ${radius} 米范围。请按现场开放游路前往。`}}
export function fieldReceiptValid(s,now=Date.now()){const p=s.fieldChecks?.[s.chapter];return !!(p&&p.mapId===(s.chapter===3?s.branch:CHAPTERS[s.chapter].mapId)&&p.photoId&&p.distance<=p.radius&&p.accuracy<=100&&now-p.at<=600000&&now>=p.at&&(s.fieldNotes?.[s.chapter]||'').trim().length>=4)}
