export const ASSETS='/assets/leshoutang/';
export const OBJECTS=[
 {id:'deer',name:'铜鹿',image:'deer.webp',number:'壹',detail:'修长的鹿角、温润的铜锈。师父画的第一个轮廓，终于有了来处。',reply:'找到了！这应该是铜鹿。先把这个轮廓记下来。别急着把“鹿”当成答案，它也许只是半句暗语。',word:'鹿',echo:'六'},
 {id:'crane',name:'铜鹤',image:'crane.webp',number:'贰',detail:'引颈的铜鹤，像在等一声尚未说出口的回应。它与铜鹿遥遥相对。',reply:'第二个图案是鹤。鹿、鹤……师父把它们画在同一页，应该不只是因为它们好看。',word:'鹤',echo:'合'},
 {id:'vase',name:'铜花瓶',image:'vase.webp',number:'叁',detail:'这不是被随手摆下的器皿。瓶身安静，瓶中的祝愿却可能传得很远。',reply:'最后一件，是铜花瓶。鹿、鹤、瓶都找齐了！它们放在一起，究竟表达什么？',word:'瓶',echo:'平'}
];
export const OPENING=[
 '师兄/师姐，终于到乐寿堂了！师父在手札里留下了三个图案：鹿、鹤，还有一只瓶子。奇怪的是，他没有写地点，只说“庭院里藏着一个太平愿望”。',
 '我们先别急着猜答案。你负责在现场寻找，我来帮你查档案。记住，只在允许游览的区域观察，不要触碰任何陈设。'
];
export const CHOICES=['福禄寿喜','六合太平','富贵吉祥','风调雨顺'];
export const KEY='jzj-leshoutang-scene-v1';
export const fresh=()=>({phase:'opening',beat:0,found:[],choice:null,collected:false,mode:'online',route:null,photos:{}});
export function restore(raw){try{const s=typeof raw==='string'?JSON.parse(raw):raw;if(!s||!['opening','investigate','riddle','reveal','reward','fork'].includes(s.phase))return fresh();const n={...fresh(),...s,found:[...new Set((Array.isArray(s.found)?s.found:[]).filter(id=>OBJECTS.some(o=>o.id===id)))],photos:s.photos&&typeof s.photos==='object'?s.photos:{}};n.beat=Math.max(0,Math.min(1,Number.isInteger(s.beat)?s.beat:0));n.mode=s.mode==='field'?'field':'online';if(['riddle','reveal','reward','fork'].includes(n.phase)&&n.found.length!==3)n.phase='investigate';if(['reveal','reward','fork'].includes(n.phase)&&n.choice!=='六合太平')n.phase='riddle';n.collected=!!s.collected&&n.choice==='六合太平'&&n.found.length===3;return n}catch{return fresh()}}
export function recordObject(s,id){if(s.phase!=='investigate'||!OBJECTS.some(o=>o.id===id))return s;return {...s,found:[...new Set([...s.found,id])]}}
export function solve(s,choice){if(s.phase!=='riddle'||s.found.length!==3)return s;return {...s,choice,phase:choice==='六合太平'?'reveal':'riddle'}}
export function collect(s){return s.phase==='reward'&&s.choice==='六合太平'&&s.found.length===3?{...s,collected:true,phase:'fork'}:s}

export const NPC_LINES={
  "investigate": "三种轮廓，藏在同一页手札里。轻触器物，凑齐师父留下的暗语。",
  "riddle": "师兄/师姐，师父为什么偏偏让我们找这三件东西？它们放在一起，究竟代表什么？",
  "wrong": "方向接近了，但我们再想想。古人常把器物和动物组合起来表达吉祥愿望。提示里有“六合”两个字。",
  "reveal": "答对了！这组陈设寓意“六合太平”。原来师父留下的不是随手画的三个图案，而是一组有文化含义的线索。",
  "reward": "第一枚记忆印章到手！手札背面还有一句：“万卷故事藏画中，三人桃园结义情。”下一站，我们去长廊找画！",
  "fork": "你读懂的不是一串暗号，而是一座庭院寄托的愿望。把这枚印章收好，师父留下的地图，才刚刚展开。"
};
export const ALL_VOICE_LINES=[...OPENING,...OBJECTS.map(o=>o.reply),...Object.values(NPC_LINES)];
export function narrationFor(s,{object,reply=NPC_LINES.investigate,wrong=false}={}){
 if(object)return object.reply;
 if(s.phase==='opening')return OPENING[s.beat];
 if(s.phase==='investigate')return reply;
 if(s.phase==='riddle')return wrong?NPC_LINES.wrong:NPC_LINES.riddle;
 return NPC_LINES[s.phase]||NPC_LINES.fork;
}
