import {CHAPTERS,ITEMS,ROLES} from './story.mjs';
import {fieldReceiptValid} from './modes.mjs';
export const STORAGE_KEY='jzj-palace-journey-v2';
export const emptyJourney=()=>({version:2,runId:null,startedAt:null,updatedAt:null,completedAt:null,mode:'preview',demo:false,role:'observer',chapter:0,beat:0,phase:'dialogue',branch:'yulan',observed:[],collected:[],inventory:[],choices:[],memoryTitle:'',ending:null,history:[],bookmarked:false,fieldChecks:{},fieldNotes:{}});
export function restoreJourney(raw){
 try{const value=typeof raw==='string'?JSON.parse(raw):raw;if(!value||value.version!==2)return emptyJourney();
 const s={...emptyJourney(),...value};
 s.chapter=Math.max(0,Math.min(CHAPTERS.length-1,Number.isInteger(s.chapter)?s.chapter:0));s.beat=Math.max(0,Math.min(s.mode==='field'?1:3,Number.isInteger(s.beat)?s.beat:0));
 s.phase=['dialogue','task','reward','ending'].includes(s.phase)?s.phase:'dialogue';s.role=ROLES.some(r=>r.id===s.role)?s.role:'observer';s.mode=s.mode==='field'?'field':'preview';s.branch=s.branch==='renshou'?'renshou':'yulan';
 for(const key of ['observed','collected'])s[key]=Array.isArray(s[key])?s[key].filter(x=>typeof x==='string'):[];
 s.inventory=Array.isArray(s.inventory)?s.inventory.filter(x=>x&&ITEMS.some(i=>i.id===x.id)):[];s.choices=Array.isArray(s.choices)?s.choices.slice(-100):[];s.history=Array.isArray(s.history)?s.history.filter(h=>h&&typeof h.runId==='string'&&['guardian','seeker','storyteller'].includes(h.ending)).slice(-30):[];
 s.fieldChecks=s.fieldChecks&&typeof s.fieldChecks==='object'&&!Array.isArray(s.fieldChecks)?s.fieldChecks:{};s.fieldNotes=s.fieldNotes&&typeof s.fieldNotes==='object'&&!Array.isArray(s.fieldNotes)?s.fieldNotes:{};
 s.ending=['guardian','seeker','storyteller'].includes(s.ending)?s.ending:null;
 s.memoryTitle=typeof s.memoryTitle==='string'?s.memoryTitle.slice(0,40):'';
 if(s.phase==='ending'&&!s.completedAt)s.phase='dialogue';return s;
 }catch{return emptyJourney()}
}
export function beginJourney(previous,mode='preview',now=new Date().toISOString(),demo=false){
 return {...emptyJourney(),inventory:previous.inventory,history:previous.history,bookmarked:previous.bookmarked,runId:`palace-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,startedAt:now,updatedAt:now,mode,demo};
}
export function collectChapter(s,now=new Date().toISOString()){
 if(s.mode==='field'&&!s.demo&&!fieldReceiptValid(s))return s;
 const item=CHAPTERS[s.chapter].item;
 return {...s,phase:'reward',updatedAt:now,collected:[...new Set([...s.collected,item])],inventory:[...s.inventory.filter(x=>x.id!==item),{id:item,earnedAt:now,runId:s.runId,mode:s.mode,place:CHAPTERS[s.chapter].place,demo:!!s.demo,verifiedVisit:s.mode==='field'&&!s.demo&&fieldReceiptValid(s)}]};
}
export function advanceChapter(s){
 if(!s.collected.includes(CHAPTERS[s.chapter].item))return s;
 if(s.chapter===CHAPTERS.length-1){
  const completedAt=s.completedAt||new Date().toISOString();
  const record={runId:s.runId,startedAt:s.startedAt,completedAt,ending:s.ending||'guardian',role:s.role,mode:s.mode,demo:!!s.demo,branch:s.branch,memoryTitle:s.memoryTitle,collected:[...s.collected]};
  return {...s,phase:'ending',completedAt,updatedAt:completedAt,history:[...s.history.filter(h=>h.runId!==s.runId),record].slice(-30)};
 }
 return {...s,chapter:s.chapter+1,beat:0,phase:'dialogue',observed:[],updatedAt:new Date().toISOString()};
}
export function addChoice(s,choice,extra={}){return {...s,...extra,choices:[...s.choices,{chapter:s.chapter,choice,at:new Date().toISOString()}].slice(-100)}};
