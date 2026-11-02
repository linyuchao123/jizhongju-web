import React from 'react';
import {ArrowLeft,ArrowRight} from '@phosphor-icons/react';
import './prologue.css';

export default function StoryPrologue({continuing,onEnter}){
 return <main className="story-prologue" aria-labelledby="prologue-title">
  <img className="prologue-landscape" src="/assets/expedition/tower.webp" alt="颐和园佛香阁实景"/>
  <header><button onClick={()=>location.hash='archive'}><ArrowLeft size={18}/>返回故事档案</button><span>迹中局 / 颐和谜境（2）</span></header>
  <div className="prologue-layout">
   <section className="prologue-hook"><small>样式雷手札 · 入卷前言</small><div className="prologue-sunset">日落之前<span>一封密折，一房人的命运</span></div><h1 id="prologue-title">人去，<br/>园中有信。</h1><p>他没有留下去向。<br/>却把整座园林，留成了谜面。</p><img src="/assets/palace/item-journal.webp" alt="半本工作手札，剧情道具"/></section>
   <article className="prologue-paper"><div className="prologue-paper-top"><span>故事背景 / STORY PROLOGUE</span><b>密</b></div><h2>大典将至，<br/>总掌案却不见了。</h2><p>颐和园竣工大典在即，你的师父——出身皇家建筑世家“样式雷”、主持样式房图样的总掌案，突然失踪。与他一同消失的，还有那封必须呈交的《竣工密折》。</p><p>日落前若密折仍未归案，你与整个样式房，都将面临“误工欺君”的追责。众人四处寻人，唯独你收到师父留下的<strong>半本工作手札</strong>：页角画着鹿、鹤与瓶，最后一行字却被匆匆划去。</p><blockquote>“莫问人往何处。<br/>先看园中，何物未改。”</blockquote><p>从北如意门入园，与同门阿衡会合，再前往乐寿堂。沿途的陈设、彩画与楼阁，都可能藏着他留下的暗语。亲眼观察、解开谜题，把发现与照片收进手札——你要找回的，究竟是一封密折，还是一个被改写的真相？</p><div className="prologue-mission"><span>你的身份<b>样式房弟子</b></span><span>此行目标<b>循迹寻师 · 找回密折</b></span></div><button className="prologue-enter" onClick={onEnter}>{continuing?'翻开手札，继续寻迹':'接过半本手札，入园寻师'}<ArrowRight size={22}/></button><footer>基于真实园林的虚构悬疑故事。失踪、大典危机与密折均为剧情设定；“日落”是叙事期限，体验不设倒计时。演示无需定位或上传照片。</footer></article>
  </div>
 </main>
}
