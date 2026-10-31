import {verifyGame} from './game.mjs';
const encoder=new TextEncoder();
const hex=b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
const random=n=>hex(crypto.getRandomValues(new Uint8Array(n)));
const sha=async text=>hex(await crypto.subtle.digest('SHA-256',encoder.encode(text)));
export async function passwordHash(password,salt){const key=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveBits']);return hex(await crypto.subtle.deriveBits({name:'PBKDF2',salt:encoder.encode(salt),iterations:100000,hash:'SHA-256'},key,256))}
const json=(value,status=200,extra={})=>Response.json(value,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...extra}});
const cookie=(token,age=2592000)=>`__Host-jzj=${token}; Path=/; Max-Age=${age}; HttpOnly; Secure; SameSite=Strict`;
const readToken=r=>(r.headers.get('cookie')||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('__Host-jzj='))?.slice(11);
async function userFor(request,db){const token=readToken(request);if(!token||!/^[a-f0-9]{64}$/.test(token))return null;return db.prepare('SELECT users.id, username, nickname FROM sessions JOIN users ON users.id = sessions.user_id WHERE token_hash = ? AND expires_at > ?').bind(await sha(token),Date.now()).first()}
export async function auth(request,env){
 const url=new URL(request.url),path=url.pathname;
 if(!env.DB)return json({error:'账号服务暂时不可用，请稍后重试。'},503);
 if(request.method==='GET'&&path==='/api/account/me')return json({user:await userFor(request,env.DB)});
 if(request.method!=='POST')return json({error:'请求方式不支持'},405);
 if(request.headers.get('origin')!==url.origin)return json({error:'请求来源不匹配，请刷新后重试。'},403);
 if(!request.headers.get('content-type')?.includes('application/json'))return json({error:'请使用 JSON 请求'},415);
 if(path==='/api/account/logout'){const token=readToken(request);if(token)await env.DB.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await sha(token)).run();return json({ok:true},200,{'Set-Cookie':cookie('',0)})}
 if(!['/api/account/login','/api/account/register'].includes(path))return json({error:'接口不存在'},404);
 if(Number(request.headers.get('content-length')||0)>4096)return json({error:'请求过大'},413);
 const bodyText=await request.text();if(bodyText.length>4096)return json({error:'请求过大'},413);
 let body;try{body=JSON.parse(bodyText)}catch{return json({error:'请求格式有误'},400)}
 if(!body||typeof body!=='object')return json({error:'请求格式有误'},400);
 const username=typeof body.username==='string'?body.username.trim().toLowerCase():'',password=typeof body.password==='string'?body.password:'',nickname=typeof body.nickname==='string'?body.nickname.trim():'';
 if(!/^[a-z0-9_]{3,24}$/.test(username)||password.length<10||password.length>128)return json({error:'账号需为 3–24 位字母、数字或下划线；密码需为 10–128 位。'},400);
 if(path.endsWith('register')&&(nickname.length<1||nickname.length>20))return json({error:'请填写 1–20 字的旅人称呼。'},400);
 const now=Date.now(),window=Math.floor(now/900000),key=await sha(`${request.headers.get('CF-Connecting-IP')||'local'}:${window}`);
 const limit=await env.DB.prepare('INSERT INTO auth_limits(key,count,window_end) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count').bind(key,(window+1)*900000).first();
 if(limit.count>12)return json({error:'尝试次数较多，请 15 分钟后重试。'},429,{'Retry-After':'900'});
 let user;
 if(path.endsWith('register')){const id=crypto.randomUUID(),salt=random(16),hash=await passwordHash(password,salt);try{await env.DB.prepare('INSERT INTO users(id,username,nickname,password_hash,salt,created_at) VALUES(?,?,?,?,?,?)').bind(id,username,nickname,hash,salt,now).run()}catch(e){if(String(e).includes('UNIQUE'))return json({error:'这个账号已被使用，请换一个或直接登录。'},409);throw e}user={id,username,nickname};}
 else{const stored=await env.DB.prepare('SELECT * FROM users WHERE username = ?').bind(username).first();const hash=await passwordHash(password,stored?.salt||'missing-user-dummy-salt');let diff=0;const expected=stored?.password_hash||'0'.repeat(64);for(let i=0;i<64;i++)diff|=hash.charCodeAt(i)^expected.charCodeAt(i);if(!stored||diff)return json({error:'账号或密码不正确。'},401);user={id:stored.id,username:stored.username,nickname:stored.nickname};}
 const token=random(32);await env.DB.prepare('INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)').bind(await sha(token),user.id,now+2592000000).run();
 await env.DB.batch([env.DB.prepare('DELETE FROM sessions WHERE expires_at < ?').bind(now),env.DB.prepare('DELETE FROM auth_limits WHERE window_end < ?').bind(now)]);
 return json({user},200,{'Set-Cookie':cookie(token)});
}
export default {async fetch(request,env){try{const u=new URL(request.url);if(u.pathname==='/api/game/verify')return await verifyGame(request,env);if(u.pathname.startsWith('/api/account/'))return await auth(request,env);if(u.pathname.startsWith('/api/'))return json({error:'接口不存在'},404);return await env.ASSETS.fetch(request)}catch{return json({error:'服务暂时繁忙，请稍后重试。'},503)}}};
