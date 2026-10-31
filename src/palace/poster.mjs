import {ART,ITEMS,CHAPTERS,ROLES} from './story.mjs';
const load=src=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=src});
export async function createMemoryPoster(state,photos){
 const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=1900;const ctx=canvas.getContext('2d');
 ctx.fillStyle='#f0eadc';ctx.fillRect(0,0,1200,1900);
 const personal=photos.filter(p=>p.runId===state.runId),cover=await load(personal[0]?.src||ART+'bridge.webp');
 const scale=Math.max(1200/cover.width,700/cover.height);ctx.save();ctx.beginPath();ctx.rect(0,0,1200,700);ctx.clip();ctx.drawImage(cover,(1200-cover.width*scale)/2,(700-cover.height*scale)/2,cover.width*scale,cover.height*scale);ctx.restore();
 ctx.fillStyle='#183e33';ctx.font='24px sans-serif';ctx.fillText('迹中局 / 颐和园 · 个人游园手札',76,770);ctx.font='bold 70px serif';ctx.fillText('颐和谜境',76,878);ctx.font='34px serif';ctx.fillText('样式雷手札 · '+({guardian:'审慎守护者',seeker:'继续追寻者',storyteller:'故事传递者'}[state.ending]||'探索仍在继续'),76,940);
 ctx.font='28px sans-serif';ctx.fillStyle='#6c755f';ctx.fillText(state.memoryTitle||'一园湖山，一程自己的目光。',76,1020);
 const itemImages=await Promise.all(ITEMS.map(i=>load(ART+i.image)));
 itemImages.forEach((im,i)=>{const x=76+i*176;const r=Math.min(148/im.width,170/im.height);ctx.drawImage(im,x+(148-im.width*r)/2,1100+(170-im.height*r)/2,im.width*r,im.height*r);ctx.fillStyle='#294638';ctx.font='22px serif';ctx.fillText(ITEMS[i].name,x+8,1310)});
 ctx.strokeStyle='#c8c8b3';ctx.beginPath();ctx.moveTo(76,1360);ctx.lineTo(1124,1360);ctx.stroke();
 ctx.fillStyle='#254737';ctx.font='26px sans-serif';ctx.fillText(`${ROLES.find(r=>r.id===state.role)?.name||'寻迹者'} · ${state.collected.length} 件信物 · ${personal.length} 张个人照片`,76,1430);ctx.font='24px sans-serif';ctx.fillText('北如意门 → 画中游 → 长廊 → '+(state.branch==='renshou'?'仁寿殿':'玉澜堂'),76,1500);ctx.fillText('文昌阁 → 十七孔桥',76,1550);ctx.fillText(new Date(state.completedAt||Date.now()).toLocaleDateString('zh-CN'),76,1650);
 ctx.fillStyle='#7a8173';ctx.font='21px sans-serif';ctx.fillText('虚构剧情体验纪念 · '+(state.mode==='field'?'实地探索记录，未核验到访':'剧情预览，不代表实地到访'),76,1750);ctx.fillText(personal.length?'封面：个人上传照片':'封面：剧情插画，非现场实拍',76,1790);ctx.fillText('一座城市，不止一种打开方式。',76,1840);return canvas.toDataURL('image/png');
}
