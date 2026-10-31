// Pre-render approved story lines: no API credential or paid synthesis in visitors' browsers.
import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {CHAPTERS as expeditionChapters} from '../src/expedition/story.mjs';
import {CHAPTERS as palaceChapters} from '../src/palace/story.mjs';
import {ALL_VOICE_LINES} from '../src/leshoutang/story.mjs';
import {FIELD_TASKS,chapterForMode} from '../src/palace/modes.mjs';

export function completeVoiceLines(manifest){
 const lines={...manifest};
 for(const text of ALL_VOICE_LINES)if(!lines[text])lines[text]={mood:/疑|为什么|究竟|暗语/.test(text)?'mystery':'companion'};
 for(const [index,chapter] of palaceChapters.entries()){
  const expected=[chapter.reward,chapter.objective,chapter.hints[0],FIELD_TASKS[index].observe];
  for(const mode of ['preview','field'])expected.push(...chapterForMode({...chapter,index},mode).lines.map(line=>line[1]));
  for(const place of index===3?['仁寿殿','玉澜堂']:[chapter.place])expected.push(`在${place}，找一个安全可停留的角度。你可以拍照，也可以只记下今天看到的光。那些照片会陪这件信物一起留在图鉴里。`);
  for(const text of expected)if(text&&!lines[text])lines[text]={mood:'companion'};
 }
 for(const chapter of Object.values(expeditionChapters)){
  for(const text of [...chapter.lines,chapter.after,chapter.purpose]){
   if(!text||lines[text])continue;
   const mood=/找到了|终于|明白|答案|惊喜/.test(text)?'discovery':/疑|失踪|秘密|密折|争执|篡改|凶手/.test(text)?'mystery':'companion';
   lines[text]={mood};
  }
 }
 return lines;
}

export function direction(text,mood){
 const base='清亮自然的年轻女性，聪明亲近的园林调查搭档阿衡。像在和身边的人交流，不要播音腔、撒娇或刻意卖萌。';
 const acting=/调侃|别笑|开玩笑|逗你|哈哈/.test(text)?'轻轻带笑，克制的冷幽默，句尾俏皮一点。':mood==='discovery'?'发现重要线索，带压不住的惊喜，语气鲜活，重音落在发现上。':mood==='mystery'?'遇到疑点，轻声贴近，疑问前稍作停顿，低沉但清晰，像分享秘密。':'自然从容，有陪伴感；根据句意起伏，避免逐字平读。';
 return base+acting;
}
export function requestBody(text,mood,speaker='zh_female_vv_uranus_bigtts'){
 return {user:{uid:'jizhongju-aheng'},req_params:{text,speaker,audio_params:{format:'mp3',sample_rate:24000},additions:JSON.stringify({context_texts:[direction(text,mood)]})}};
}
export function decodeSpeech(sse){
 const chunks=[];let complete=false;
 for(const line of sse.split(/\r?\n/)){
  if(!line.startsWith('data:'))continue;
  const data=JSON.parse(line.slice(5).trim());
  if(data.code!==0&&data.code!==20000000)throw Error(`语音服务错误 ${data.code}`);
  if(data.data)chunks.push(Buffer.from(data.data,'base64'));
  if(data.code===20000000)complete=true;
 }
 if(!complete||!chunks.length)throw Error('语音流不完整，保留原配音');
 return Buffer.concat(chunks);
}
async function main(){
 const all=process.argv.includes('--all'),sample=process.argv.includes('--sample');
 if(!all&&!sample){console.log('预渲染阿衡配音：--sample 生成三段试听；--all 生成全量，成功后更新播放清单。需要环境变量 VOLC_TTS_API_KEY。');return}
 const key=process.env.VOLC_TTS_API_KEY;if(!key)throw Error('请在本机设置 VOLC_TTS_API_KEY；不要在聊天或代码中填写密钥。');
 const root=new URL('../',import.meta.url),manifestURL=new URL('src/palace/voice-clips.json',root);
 const manifest=completeVoiceLines(JSON.parse(await readFile(manifestURL,'utf8')));
 let lines=Object.entries(manifest);
 if(sample)lines=['companion','mystery','discovery'].map(m=>lines.find(([,v])=>v.mood===m)).filter(Boolean);
 const output=new URL(sample?'qa/aheng-audition/':'public/assets/voice/doubao/',root);await mkdir(output,{recursive:true});
 const speaker=process.env.VOLC_TTS_SPEAKER||'zh_female_vv_uranus_bigtts';
 const updated={...manifest};
 for(const [text,clip] of lines){
  const payload=requestBody(text,clip.mood,speaker);
  const hash=createHash('sha256').update(JSON.stringify(payload)).digest('hex').slice(0,16);
  const name=`${hash}.mp3`,destination=new URL(name,output);
  let cached=false;try{cached=(await readFile(destination)).length>0}catch{}
  if(!cached){
   const response=await fetch('https://openspeech.bytedance.com/api/v3/tts/unidirectional/sse',{method:'POST',headers:{'Content-Type':'application/json','X-Api-Key':key,'X-Api-Resource-Id':'seed-tts-2.0'},body:JSON.stringify(payload),signal:AbortSignal.timeout(60000)});
   if(!response.ok)throw Error(`语音请求失败 HTTP ${response.status}；未切换播放清单。`);
   await writeFile(destination,decodeSpeech(await response.text()));
  }
  updated[text]={...clip,src:`/assets/voice/doubao/${name}`,provider:'doubao-tts-2.0',speaker};
  console.log(`${clip.mood}: ${fileURLToPath(destination)}`);
 }
 if(all){const temporary=new URL('src/palace/voice-clips.json.tmp',root);await writeFile(temporary,JSON.stringify(updated,null,2)+'\n');await rename(temporary,manifestURL);console.log('全量成功，已切换播放清单；请试听验收后构建部署。')}
 else console.log('试听已生成，现有故事配音未改变。');
}
if(process.argv[1]===fileURLToPath(import.meta.url))main().catch(e=>{console.error(e.message);process.exitCode=1});
