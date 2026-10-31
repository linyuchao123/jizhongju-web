import React, { useCallback, useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import workerURL from 'maplibre-gl/dist/maplibre-gl-csp-worker.js?url';
import 'maplibre-gl/dist/maplibre-gl.css';
import { ArrowRight, ArrowUpRight, MapPin, GlobeHemisphereEast, NavigationArrow, Compass, Crosshair, Plus, Minus, CornersOut, Play, Pause, X, CaretRight, ArrowCounterClockwise, Info, Mountains, Path, Tree, Stack, Check, WarningCircle, CircleNotch, Eye, BookOpen, MagnifyingGlass } from '@phosphor-icons/react';
import { addPalaceRoofs } from './roofs.mjs';
import { installMaterials, waterMaterial } from './materials.mjs';
import { createExplorerStyle } from './style.mjs';
import { CHINA, BEIJING, PALACE, POIS, pitchForZoom, stageForZoom, nearestPoi, distanceKm, accuracyPolygon, collection, point, clamp } from './geo.mjs';
import './map.css';
maplibregl.setWorkerUrl(workerURL);
const LEVELS = [
 {id:'china',title:'中国',subtitle:'全国视野',camera:CHINA},
 {id:'beijing',title:'北京市',subtitle:'直辖市',camera:BEIJING},
 {id:'palace',title:'颐和园',subtitle:'景区探索',camera:PALACE},
];
const COPY={
 china:{en:'EVERY JOURNEY BEGINS WITH CURIOSITY',kicker:'从山河，走进故事。',title:<>好故事，<br/>从下一次出发。</>,body:'这是一款文化体验游戏。选一座城市，打开一个故事；在线入局，或走到现场，用线索、照片与观察收集你的旅行记忆。首发北京颐和园。',action:'飞往北京',next:'beijing'},
 beijing:{en:'BEIJING · A CITY TO DISCOVER',kicker:'北京，有另一种打开方式。',title:<>把一座城，<br/>慢慢看清。</>,body:'沿着真实的道路与水系，接近这座城市。今天，从万寿山与昆明湖之间开始。',action:'进入颐和园',next:'palace'},
 palace:{en:'THE SUMMER PALACE · EXPLORATION',kicker:'颐和园 · 山水之间',title:<>一园山水，<br/>一卷谜境待启。</>,body:'沿真实水系，走近全园建筑、桥亭与园中园。打开《颐和谜境》，让这一程从看风景，变成发现故事。',action:'开启园内巡游',next:'tour'},
 nearby:{en:'REGIONAL VIEW · KEEP EXPLORING',kicker:'地图之外，探索仍在继续。',title:<>你正在看的，<br/>是另一片山河。</>,body:'当前区域暂未开放故事。你仍可浏览真实地图，或飞往北京颐和园，开始本次探索。',action:'飞往颐和园',next:'palace'},
};
export default function MapExplorer({onArchive,onStory,initialPoiId,notify,minimal=false,finderTarget=null}){
 const container=useRef(null),shell=useRef(null),mapRef=useRef(null),actions=useRef({}),pinRefs=useRef([]),zoomEl=useRef(null),pitchEl=useRef(null),coordEl=useRef(null),compassEl=useRef(null),levelRef=useRef('china'),selectedRef=useRef(null),viewRef=useRef('auto'),orbitRef=useRef(false),tourRef=useRef(false),flightRef=useRef(false),lastCamera=useRef(null),pitchTween=useRef(false),autoLocated=useRef(false),requestId=useRef(0);
 const [level,setLevel]=useState('china'),[status,setStatus]=useState('loading'),[fatal,setFatal]=useState(''),[selected,setSelected]=useState(null),[view,setView]=useState('auto'),[orbit,setOrbit]=useState(false),[tour,setTour]=useState(false),[flying,setFlying]=useState(false),[geoStatus,setGeoStatus]=useState('idle'),[geoMessage,setGeoMessage]=useState(''),[help,setHelp]=useState(false),[panelCollapsed,setPanelCollapsed]=useState(()=>window.innerWidth<760),[info,setInfo]=useState(false),[retry,setRetry]=useState(0),[reducedMotion,setReducedMotion]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 const [upcoming,setUpcoming]=useState(null);
 const [poiFilter,setPoiFilter]=useState('全部'),[poiSearch,setPoiSearch]=useState('');
 const visiblePois=POIS.filter(p=>(poiFilter==='全部'||poiFilter==='剧情'&&p.story||p.category===poiFilter)&&p.name.includes(poiSearch.trim()));
 const infoRef=useRef(null),panelRef=useRef(null),panelCollapsedRef=useRef(panelCollapsed);

 const callbacks=useRef({notify,onArchive,onStory});callbacks.current={notify,onArchive,onStory};
 useEffect(()=>{const map=mapRef.current;if(!map||!map.getSource('jzj-pois'))return;map.getSource('jzj-pois').setData(collection(visiblePois.map(p=>point(p.coord,{id:p.id,name:p.name,label:p.name,category:p.category,story:p.story}))))},[poiFilter,poiSearch,status]);
 useEffect(()=>{const p=POIS.find(p=>p.id===initialPoiId);if(p&&mapRef.current?.isStyleLoaded())actions.current.select?.(p)},[initialPoiId]);
 const copy=COPY[level]||COPY.china;
 useEffect(()=>{panelRef.current?.scrollTo(0,0)},[selected?.id,level]);
 useEffect(()=>{if(!info)return;const prior=document.activeElement;infoRef.current?.querySelector('button')?.focus();const onKey=e=>{if(e.key==='Escape'){e.preventDefault();setInfo(false)}if(e.key==='Tab'){const controls=[...infoRef.current.querySelectorAll('button,a')];const first=controls[0],last=controls.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}};document.addEventListener('keydown',onKey);return()=>{document.removeEventListener('keydown',onKey);prior?.focus?.()}},[info]);
 useEffect(()=>{const mq=window.matchMedia('(prefers-reduced-motion: reduce)');const fn=()=>setReducedMotion(mq.matches);mq.addEventListener('change',fn);return()=>mq.removeEventListener('change',fn)},[]);
 const stopMotion=useCallback(()=>{tourRef.current=false;orbitRef.current=false;setTour(false);setOrbit(false);mapRef.current?.stop()},[]);
 const flyTo=useCallback((target,options={})=>actions.current.fly?.(target,options),[]);
 const selectPoint=useCallback(p=>actions.current.select?.(p),[]);
 const locate=useCallback(()=>actions.current.locate?.(),[]);
 const startTour=useCallback(()=>actions.current.tour?.(),[]);
 useEffect(()=>{
  const roofAbort=new AbortController();
  let alive=true,frame=0,tourTimer=0,slowTimer=0,rafTime=0,lastPaint=0;let errors=0,userTouched=false,materialsReady=false,terrainActive=false,lastWater=0;let map;
  setStatus('loading');setFatal('');levelRef.current='china';setLevel('china');selectedRef.current=null;setSelected(null);viewRef.current='auto';setView('auto');orbitRef.current=false;tourRef.current=false;flightRef.current=false;setFlying(false);setOrbit(false);setTour(false);
  const isMobile=()=>container.current?.clientWidth<760;
  const padding=()=>finderTarget?{top:100,bottom:90,left:35,right:35}:isMobile()?{top:110,bottom:panelCollapsedRef.current?110:330,left:20,right:50}:{top:85,bottom:70,left:370,right:105};
  try{map=new maplibregl.Map({container:container.current,style:createExplorerStyle(),center:CHINA.center,zoom:isMobile()?2.55:CHINA.zoom,pitch:0,bearing:0,padding:padding(),minZoom:2,maxZoom:19,maxPitch:65,renderWorldCopies:false,attributionControl:false,localIdeographFontFamily:'PingFang SC, Microsoft YaHei, sans-serif',fadeDuration:450,canvasContextAttributes:{antialias:true},transformCameraUpdate:next=>pitchTween.current?{}:viewRef.current==='auto'?{pitch:pitchForZoom(next.zoom)}:viewRef.current==='flat'?{pitch:0}:{},locale:{'Map.Title':'迹中局连续探索地图','AttributionControl.ToggleAttribution':'地图数据来源'}})}catch(e){setFatal('地图渲染无法启动。请启用浏览器硬件加速后重试。');setStatus('error');return}
  mapRef.current=map;
  map.addControl(new maplibregl.AttributionControl({compact:true}),'bottom-right');
  map.addControl(new maplibregl.ScaleControl({maxWidth:110,unit:'metric'}),'bottom-left');
  map.touchZoomRotate.enable();map.touchPitch.enable();
  const endTour=()=>{tourRef.current=false;setTour(false);clearTimeout(tourTimer)};
  const stopOrbit=()=>{orbitRef.current=false;setOrbit(false)};
  const interrupt=()=>{userTouched=true;endTour();stopOrbit();flightRef.current=false;setFlying(false)};
  map.on('dragstart',interrupt);map.on('rotatestart',e=>{if(e.originalEvent){interrupt();viewRef.current='free';setView('free')}});map.on('pitchstart',e=>{if(e.originalEvent){viewRef.current='free';setView('free');interrupt()}});map.on('wheel',interrupt);map.on('touchstart',interrupt);
  function move(target,{duration=2400,continuous=false}={}){
   if(!alive)return;
   if(!continuous){endTour();stopOrbit()}
   selectedRef.current=null;setSelected(null);
   if(map.getLayer('jzj-poi-core'))map.setPaintProperty('jzj-poi-core','circle-color','#b44e38');
   const rawCamera=typeof target==='string'?LEVELS.find(l=>l.id===target)?.camera:target;
   const camera=rawCamera?{...rawCamera,center:isMobile()&&target==='palace'?[rawCamera.center[0]-.0015,rawCamera.center[1]+.0003]:rawCamera.center,zoom:rawCamera.zoom-(isMobile()&&typeof target==='string'?(target==='china'?.8:target==='palace'?.8:.3):0)}:null;
   if(!camera)return;
   flightRef.current=true;setFlying(true);
   map.flyTo({...camera,pitch:viewRef.current==='flat'?0:pitchForZoom(camera.zoom),padding:padding(),duration:reducedMotion?0:duration,curve:1.28,essential:false});
  }
  actions.current.fly=move;
  function choose(p,{duration=1900,keepTour=false}={}){
   if(!alive)return;if(!keepTour){endTour();stopOrbit()}
   selectedRef.current=p;setSelected(p);panelCollapsedRef.current=false;setPanelCollapsed(false);
   if(map.getLayer('jzj-poi-core'))map.setPaintProperty('jzj-poi-core','circle-color',['case',['==',['get','id'],p.id],'#183f30','#b44e38']);
   flightRef.current=true;setFlying(true);
   map.flyTo({center:p.coord,zoom:17.15,bearing:-26,pitch:viewRef.current==='flat'?0:57,padding:padding(),duration:reducedMotion?0:duration,essential:false});
  }
  actions.current.select=choose;
  actions.current.tour=()=>{
   if(tourRef.current){endTour();map.stop();return}
   stopOrbit();tourRef.current=true;setTour(true);viewRef.current='auto';setView('auto');let n=0;const stops=['north-ruyi','huazhongyou','corridor','yulan','wenchang','bridge'].map(id=>POIS.find(p=>p.id===id));
   const visit=()=>{if(!alive||!tourRef.current)return;choose(stops[n],{duration:reducedMotion?0:2800,keepTour:true});tourTimer=setTimeout(()=>{if(!alive||!tourRef.current)return;if(n===stops.length-1){endTour();callbacks.current.notify('巡游结束。可以拖动地图，继续寻找感兴趣的细节。');return}n++;visit()},reducedMotion?3500:6500)};
   visit();
  };
  actions.current.locate=()=>{
   if(!alive)return;
   if(!navigator.geolocation){setGeoStatus('error');setGeoMessage('此浏览器不支持定位。你仍可手动探索北京。');return}
   if(!window.isSecureContext){setGeoStatus('error');setGeoMessage('定位需要 HTTPS 或 localhost 安全环境。当前仍可手动探索。');return}
   endTour();stopOrbit();setGeoStatus('loading');setGeoMessage('正在获取设备位置…');const id=++requestId.current;
   navigator.geolocation.getCurrentPosition(position=>{
    if(!alive||id!==requestId.current)return;
    const {longitude,latitude,accuracy}=position.coords;const coord=[longitude,latitude];
    map.getSource('jzj-location')?.setData(collection([point(coord)]));map.getSource('jzj-accuracy')?.setData(collection([accuracyPolygon(coord,accuracy)]));
    const nearby=nearestPoi(coord);setGeoStatus('success');
    const nearestText=nearby.distance<15?`距${nearby.name}约 ${nearby.distance<1?Math.round(nearby.distance*1000)+' 米':nearby.distance.toFixed(1)+' 公里'}。`:'已打开你附近的地图。北京颐和园可手动进入。';
    setGeoMessage(`定位成功，精度约 ${Math.round(accuracy)} 米。${nearestText}`);
    const z=accuracy<150?16:accuracy<1500?14:accuracy<15000?11:8;
    if(finderTarget){const target=({start:[116.2724,39.99742],a1:[116.2703,39.997],a2:[116.268,39.9959],a3:[116.274,39.9918],a4:[116.26368,39.99674],b1:[116.2739,39.99645],b2:[116.27395,39.99522],bridge:[116.2697,39.9897],ox:[116.2744,39.9903]})[finderTarget.id];map.fitBounds([[Math.min(coord[0],target[0]),Math.min(coord[1],target[1])],[Math.max(coord[0],target[0]),Math.max(coord[1],target[1])]],{padding:80,maxZoom:16,duration:1800})}else move({center:coord,zoom:z,bearing:0},{duration:3200});
   },err=>{if(!alive||id!==requestId.current)return;setGeoStatus('error');setGeoMessage(err.code===1?'定位权限未开启。请在浏览器设置中允许位置访问，或手动进入北京。':err.code===3?'定位超时。请检查定位服务与网络后重试。':'暂时无法获取位置。请检查设备定位服务，或手动进入北京。')},{enableHighAccuracy:true,timeout:12000,maximumAge:60000});
  };
  function makePin(label,sub,className,coord,click){const el=document.createElement('button');el.className=`atlas-marker ${className}`;el.type='button';el.setAttribute('aria-label',label);const dot=document.createElement('span');dot.className='atlas-marker-dot';const inner=document.createElement('span');inner.className='atlas-marker-copy';const strong=document.createElement('strong');strong.textContent=label;const small=document.createElement('small');small.textContent=sub;inner.append(strong,small);el.append(dot,inner);el.addEventListener('click',e=>{e.stopPropagation();click()});const marker=new maplibregl.Marker({element:el,anchor:'center'}).setLngLat(coord).addTo(map);return {marker,el}}
  const beijingPin=makePin('北京','首发城市 · 点击进入','is-beijing',BEIJING.center,()=>move('beijing'));
  const palacePin=makePin('颐和园',`全园 ${POIS.length} 处点位 · 进入探索`,'is-palace',PALACE.center,()=>move('palace',{duration:3200}));const futurePins=[
 {name:'上海',coord:[121.4737,31.2304],scope:'city',desc:'沿着街巷与江岸，寻找海派城市的另一面。'},
 {name:'西安',coord:[108.9398,34.3416],scope:'city',desc:'城墙、坊市与古都记忆，新的文化故事正在筹备。'},
 {name:'成都',coord:[104.0665,30.5723],scope:'city',desc:'从茶馆到巷陌，把一座城的生活写进故事。'},
 {name:'杭州',coord:[120.1551,30.2741],scope:'city',desc:'湖山与诗意，将成为下一份待开启的档案。'},
 {name:'故宫',coord:[116.397,39.918],scope:'district',desc:'宫墙之内的新篇章正在筹备，本次尚未开放。'},
 {name:'天坛',coord:[116.4108,39.881],scope:'district',desc:'坛墙与古树之间的线索，敬请期待。'},
 {name:'南锣鼓巷',coord:[116.4035,39.937],scope:'district',desc:'胡同生活的另一种打开方式，故事筹备中。'}
 ].map(p=>({...p,...makePin(p.name+' · 敬请期待','文化故事筹备中','is-upcoming',p.coord,()=>setUpcoming(p))}));
 pinRefs.current=[beijingPin,palacePin,...futurePins];
  function update(){
   if(!alive)return;const z=map.getZoom(),c=map.getCenter();
   let next=stageForZoom(z);if(z>=7&&distanceKm([c.lng,c.lat],BEIJING.center)>180)next='nearby';
   if(next!==levelRef.current){levelRef.current=next;setLevel(next)}
   if(zoomEl.current)zoomEl.current.textContent=z.toFixed(1);
   if(pitchEl.current)pitchEl.current.textContent=Math.round(map.getPitch())+'°';
   if(coordEl.current)coordEl.current.textContent=`${Math.abs(c.lng).toFixed(3)}°${c.lng>=0?'E':'W'}  /  ${Math.abs(c.lat).toFixed(3)}°${c.lat>=0?'N':'S'}`;
   if(compassEl.current)compassEl.current.style.transform=`rotate(${-map.getBearing()}deg)`;
   if(shell.current){shell.current.dataset.level=next;shell.current.dataset.zoom=z.toFixed(2);shell.current.dataset.pitch=map.getPitch().toFixed(1)}
   beijingPin.el.style.display=z<7.2?'flex':'none';palacePin.el.style.display=z>=8.2&&z<13.3?'flex':'none';
   for(const p of futurePins){p.el.style.display=(p.scope==='city'?z<7.2:z>=7.2&&z<13.3)?'flex':'none';p.el.classList.toggle('compact-future',p.name==='杭州'&&z<4.3)}
   for(const pin of [beijingPin,palacePin,...futurePins])pin.el.classList.toggle('label-left',map.project(pin.marker.getLngLat()).x>map.getContainer().clientWidth-185);
   if(finderTarget)for(const pin of [beijingPin,palacePin,...futurePins])pin.el.style.display='none';
   lastCamera.current={center:[c.lng,c.lat],zoom:z,pitch:map.getPitch(),bearing:map.getBearing()};
  }
  map.on('move',update);
  // Removing terrain is safe during a flight; adding it must wait until the
  // flight's elevation target has been initialised by MapLibre.
  map.on('zoom',()=>{if(terrainActive&&map.getZoom()<14.5){terrainActive=false;map.setTerrain(null);map.setProjection({type:'globe'})}});
  map.on('zoomend',()=>{if(!materialsReady)return;const enable=map.getZoom()>=14.5;if(enable!==terrainActive){terrainActive=enable;map.setProjection({type:enable?'mercator':'globe'});map.setTerrain(enable?{source:'jzj-dem',exaggeration:1}:null)}});map.on('moveend',()=>{flightRef.current=false;setFlying(false);update()});
  map.on('click','jzj-poi-hit',e=>{const id=e.features?.[0]?.properties?.id;const p=POIS.find(p=>p.id===id);if(p)choose(p)});
  map.on('mouseenter','jzj-poi-hit',()=>{map.getCanvas().style.cursor='pointer'});map.on('mouseleave','jzj-poi-hit',()=>{map.getCanvas().style.cursor=''});
  let roofsStarted=false;const detail=()=>{if(!materialsReady)return;if(!roofsStarted&&map.getZoom()>=13.2){roofsStarted=true;addPalaceRoofs(map,roofAbort.signal).catch(()=>{})}};map.on('zoomend',detail);map.on('sourcedata',e=>{if(alive&&e.sourceId==='openmaptiles'&&e.sourceDataType==='content')map.once('render',()=>{if(alive)setStatus('ready')})});
  map.on('load',()=>{
   if(!alive)return;installMaterials(map);materialsReady=true;detail();setStatus('ready');update();
   if(finderTarget){map.jumpTo({center:({start:[116.2724,39.99742],a1:[116.2703,39.997],a2:[116.268,39.9959],a3:[116.274,39.9918],a4:[116.26368,39.99674],b1:[116.2739,39.99645],b2:[116.27395,39.99522],bridge:[116.2697,39.9897],ox:[116.2744,39.9903]})[finderTarget.id],zoom:16,pitch:0});for(const l of map.getStyle().layers)if(l.id.startsWith('jzj-poi')||l.id.includes('story-route'))map.setLayoutProperty(l.id,'visibility','none');makePin('目的地：'+finderTarget.place,'本站观察区域','is-palace',({start:[116.2724,39.99742],a1:[116.2703,39.997],a2:[116.268,39.9959],a3:[116.274,39.9918],a4:[116.26368,39.99674],b1:[116.2739,39.99645],b2:[116.27395,39.99522],bridge:[116.2697,39.9897],ox:[116.2744,39.9903]})[finderTarget.id],()=>{});actions.current.locate?.()}
   const initial=POIS.find(p=>p.id===initialPoiId);if(initial&&!finderTarget)choose(initial,{duration:2800});
   if(!finderTarget&&!initial&&!reducedMotion&&!userTouched&&!flightRef.current&&levelRef.current==='china')map.easeTo({zoom:isMobile()?2.7:3.65,bearing:0,duration:2100,essential:false});
   if(!autoLocated.current&&navigator.permissions){autoLocated.current=true;navigator.permissions.query({name:'geolocation'}).then(p=>{if(alive&&!userTouched&&!flightRef.current&&p.state==='granted')actions.current.locate?.()}).catch(()=>{})}
  });
  map.on('idle',()=>{if(alive){clearTimeout(slowTimer);setStatus('ready')}});
  map.on('error',event=>{if(!alive)return;errors++;if(errors>=2)setStatus('partial');if(event.error?.message?.includes('WebGL')){setFatal('WebGL 渲染暂时中断，请重试或检查硬件加速。');setStatus('error')}});
  slowTimer=setTimeout(()=>{if(alive&&!map.isStyleLoaded())setStatus('slow')},16000);
  let lastMobile=isMobile();const resize=new ResizeObserver(()=>{if(alive){const mobile=isMobile();map.resize();map.setPadding(padding());if(mobile!==lastMobile){lastMobile=mobile;panelCollapsedRef.current=mobile;setPanelCollapsed(mobile);map.setPadding(padding());if(levelRef.current==='china')map.easeTo({zoom:mobile?2.7:3.65,duration:500})}}});resize.observe(container.current);
  function animate(t){
   if(!alive)return;
   const delta=rafTime?Math.min(t-rafTime,100):0;rafTime=t;
   if(!document.hidden){
    if(materialsReady&&!reducedMotion&&map.getZoom()>11&&t-lastWater>120){lastWater=t;map.updateImage('jzj-water',waterMaterial(t/1000));}
    if(orbitRef.current&&!flightRef.current&&!reducedMotion)map.jumpTo({bearing:map.getBearing()+delta*.0045});
    if(!reducedMotion&&map.getZoom()>13.3&&map.isStyleLoaded()&&t-lastPaint>90&&map.getLayer('jzj-poi-halo')){lastPaint=t;const phase=(t%2600)/2600;map.setPaintProperty('jzj-poi-halo','circle-radius',10+phase*20);map.setPaintProperty('jzj-poi-halo','circle-opacity',.17*(1-phase));}
   }
   frame=requestAnimationFrame(animate);
  }
  frame=requestAnimationFrame(animate);
  return()=>{alive=false;roofAbort.abort();requestId.current++;clearTimeout(tourTimer);clearTimeout(slowTimer);cancelAnimationFrame(frame);resize.disconnect();pinRefs.current.forEach(p=>p.marker.remove());map.remove();mapRef.current=null;actions.current={};pinRefs.current=[]};
 },[retry,reducedMotion]);
 function togglePanel(){const next=!panelCollapsed;panelCollapsedRef.current=next;setPanelCollapsed(next);if(container.current?.clientWidth<760)mapRef.current?.easeTo({padding:{top:110,bottom:next?110:330,left:20,right:50},duration:reducedMotion?0:450})}
 function changeView(){const map=mapRef.current;if(!map)return;const v=viewRef.current==='flat'?'auto':'flat';stopMotion();pitchTween.current=true;viewRef.current='free';setView(v);map.once('moveend',()=>{pitchTween.current=false;viewRef.current=v;setView(v)});map.easeTo({pitch:v==='flat'?0:pitchForZoom(map.getZoom()),duration:reducedMotion?0:1400});}
 function toggleOrbit(){if(reducedMotion){callbacks.current.notify('系统已开启减弱动画，自动环绕已停用。');return}if(orbitRef.current){orbitRef.current=false;setOrbit(false)}else{stopMotion();orbitRef.current=true;setOrbit(true);viewRef.current='free';setView('free');mapRef.current?.easeTo({pitch:Math.max(35,pitchForZoom(mapRef.current.getZoom())),duration:1200});}}
 const goNext=()=>copy.next==='tour'?startTour():flyTo(copy.next,{duration:level==='china'?4200:3400});
 const oneShot=()=>{const map=mapRef.current;if(!map)return;viewRef.current='auto';setView('auto');if(map.getZoom()>7){flyTo('china',{duration:3200});map.once('moveend',()=>{if(Math.abs(map.getZoom()-(CHINA.zoom-(container.current?.clientWidth<760?.8:0)))<.15)flyTo('palace',{duration:9500})})}else flyTo('palace',{duration:9500})};
 const cancelGeo=()=>{requestId.current++;setGeoStatus('idle');setGeoMessage('')};
 const busy=status==='loading'||status==='slow';
 return <section className={`atlas-explorer ${minimal?'atlas-minimal':''} ${finderTarget?'atlas-finder':''}`} ref={shell} data-map-status={status} data-level={level} aria-label="城市动态探索地图">
  {minimal&&<button className="atlas-start-story" onClick={()=>callbacks.current.onStory?.()}>颐和谜境 · 开始实地故事<ArrowRight size={18}/></button>}
  <div ref={container} className="atlas-canvas" role="region" aria-label="可拖动、缩放和旋转的真实地图"/>
  <div className="atlas-topbar"><div className="atlas-breadcrumb" aria-label="地图层级">{LEVELS.map((l,i)=><React.Fragment key={l.id}>{i>0&&<CaretRight size={12}/>}<button className={level===l.id?'current':''} onClick={()=>flyTo(l.id,{duration:i===2?3700:2500})}>{i===0&&<GlobeHemisphereEast size={16}/>}<span>{l.title}</span>{l.id==='beijing'&&<small>直辖市</small>}</button></React.Fragment>)}</div><div className={`atlas-status ${status}`}><span/>{status==='ready'?'探索地图已就绪':status==='partial'?'部分地图连接较慢':status==='error'?'渲染异常':'正在展开山河'}{status==='partial'&&<button onClick={()=>setRetry(r=>r+1)} aria-label="重新加载底图"><ArrowCounterClockwise size={12}/></button>}</div></div>
  {(level==='china'||level==='beijing')&&!selected&&<section className="atlas-mobile-intro"><span>文化体验游戏 / CITY AS A STORY</span><h1>把一座城，玩成一个故事。</h1><p>选城市 · 解线索 · 留下你的旅行记忆<br/>首发北京颐和园，更多城市筹备中。</p><div><button onClick={()=>callbacks.current.onStory?.('preview')}><BookOpen size={16}/>线上沉浸入局</button><button onClick={()=>callbacks.current.onStory?.('field')}><MapPin size={16}/>线下实地探索</button></div></section>}
  <div ref={panelRef} className={`atlas-panel ${panelCollapsed?'collapsed':''}`}>
   <button className="atlas-panel-toggle" onClick={togglePanel} aria-label={panelCollapsed?'展开探索面板':'收起探索面板'}><span>{panelCollapsed?'探索这片山河':'探索指南'}</span><Minus size={15} style={panelCollapsed?{transform:'rotate(90deg)'}:{}}/></button>
   <div className="atlas-panel-inner">
    <div className="atlas-kicker"><span/>{selected?selected.tag:copy.kicker}</div>
    <div className="atlas-panel-copy" key={selected?.id||level}><h1>{selected?selected.name:copy.title}</h1><span className="atlas-copy-en">{selected?`DISCOVERY ${selected.number} / SUMMER PALACE`:copy.en}</span><p>{selected?selected.description:copy.body}</p>{selected&&<small className="atlas-coordinate-note">{selected.coordinateNote}</small>}</div>
    {!selected&&(level==='china'||level==='beijing')&&<div className="atlas-home-modes"><button onClick={()=>callbacks.current.onStory?.('preview')}>线上沉浸 · 在故事里探索<ArrowRight size={15}/></button><button onClick={()=>callbacks.current.onStory?.('field')}>线下实地 · 在旅途中发现<ArrowRight size={15}/></button></div>}
    {selected?<><div className="atlas-observation"><Eye size={18}/><p>{selected.title}</p></div><button className="atlas-primary" onClick={()=>{setSelected(null);selectedRef.current=null;flyTo('palace')}}>返回景区全貌<ArrowRight size={18}/></button></>:<button className="atlas-primary" onClick={goNext} disabled={!!fatal}>{copy.action}<ArrowRight size={18}/></button>}
    {level==='palace'&&<><button className="atlas-story-entry" onClick={()=>callbacks.current.onStory?.()}><BookOpen size={18}/><div><strong>颐和谜境 · 样式雷手札</strong><small>走进六幕剧情，拾得你的游园信物</small></div><ArrowUpRight size={17}/></button>{selected?.art&&<div className="atlas-place-art"><img src={'/assets/palace/'+selected.art} alt={`${selected.name}剧情插画`}/><span>剧情插画 · 非导航影像</span></div>}<div className="atlas-directory"><div className="atlas-small-heading">全园景点索引 <small>{POIS.length} LOCATIONS</small></div><label className="atlas-poi-search"><MagnifyingGlass size={15}/><input value={poiSearch} onChange={e=>setPoiSearch(e.target.value)} placeholder="找一处景，或一条线索" aria-label="搜索颐和园景点"/>{poiSearch&&<button onClick={()=>setPoiSearch('')} aria-label="清空景点搜索"><X size={13}/></button>}</label><div className="atlas-poi-filters" aria-label="景点类别">{['全部','剧情','古建','山水','桥亭','园中园','出入口'].map(t=><button key={t} className={poiFilter===t?'active':''} onClick={()=>setPoiFilter(t)}>{t}</button>)}</div><div className="atlas-pois">{visiblePois.map(p=><button key={p.id} className={selected?.id===p.id?'selected':''} onClick={()=>selectPoint(p)}><span>{p.number}</span><strong>{p.name}</strong><small>{p.story?'剧情':p.category}</small><ArrowUpRight size={15}/></button>)}{visiblePois.length===0&&<p className="atlas-no-pois">没有找到这处景点，换个名字试试。</p>}</div><p className="atlas-directory-note">已收录主要景点与出入口；部分位置为参考观察点。放大后显示更多地名。</p></div></>}
    {(level==='china'||level==='beijing')&&<div className="atlas-featured"><span className="atlas-featured-icon"><Tree size={25} weight="thin"/></span><div><small>本次探索目的地</small><strong>颐和园 <span>北京 · 海淀</span></strong></div><button onClick={()=>flyTo('palace',{duration:6000})} aria-label="飞往颐和园"><ArrowUpRight size={20}/></button></div>}
    <div className="atlas-panel-bottom"><span><MapPin size={13}/>{level==='nearby'?'当前区域':'首发探索 · 北京'}</span><button onClick={()=>callbacks.current.onArchive()}>故事档案<BookOpen size={14}/></button></div>
   </div>
  </div>
  <div className="atlas-actions"><button className="atlas-journey" onClick={flying?()=>{stopMotion();setFlying(false)}:oneShot} disabled={!!fatal}>{flying?<Pause size={15}/>:<Play size={15} weight="fill"/>}<span>{flying?'暂停飞行':'一镜入园'}</span></button><button className={`atlas-location ${geoStatus==='loading'?'is-locating':''}`} onClick={locate} aria-label="定位到我附近" disabled={geoStatus==='loading'||!!fatal}>{geoStatus==='loading'?<CircleNotch size={20}/>:<Crosshair size={21}/>}<span>{geoStatus==='loading'?'正在定位':'定位到我附近'}</span></button></div>
  <div className="atlas-map-tools"><div className="atlas-zoom-controls"><button aria-label="放大地图" onClick={()=>mapRef.current?.zoomIn({duration:650})} disabled={!!fatal}><Plus size={20}/></button><button aria-label="缩小地图" onClick={()=>mapRef.current?.zoomOut({duration:650})} disabled={!!fatal}><Minus size={20}/></button></div><button className="atlas-north" aria-label="恢复正北方向" onClick={()=>mapRef.current?.easeTo({bearing:0,duration:1200})}><span>N</span><Compass size={24} ref={compassEl} weight="thin"/></button><button className={view==='flat'?'active':''} aria-label="切换俯视与立体视角" onClick={changeView}><Stack size={21}/><small>{view==='flat'?'2D':'3D'}</small></button><button className={orbit?'active':''} aria-label={orbit?'停止自动环绕':'开启自动环绕'} onClick={toggleOrbit}>{orbit?<Pause size={19}/>:<ArrowCounterClockwise size={21}/>}</button><button aria-label="全屏地图" onClick={()=>{if(document.fullscreenElement)document.exitFullscreen?.();else shell.current?.requestFullscreen?.().catch(()=>callbacks.current.notify('当前浏览器暂不支持全屏。'))}}><CornersOut size={20}/></button></div>
  <div className="atlas-horizon"><span className="atlas-horizon-label">{level==='china'?'CHINA / 全国':level==='beijing'?'BEIJING / 北京':level==='nearby'?'REGION / 当前区域':'SUMMER PALACE / 颐和园'}{level==='palace'&&<small>线索关联 · 非步行导航</small>}</span><div className="atlas-camera-data"><span>ZOOM <b ref={zoomEl}>3.4</b></span><i/><span>视角 <b ref={pitchEl}>0°</b></span></div><div className="atlas-stage-line">{LEVELS.map((l,i)=><button key={l.id} className={level===l.id?'active':''} onClick={()=>flyTo(l.id,{duration:3000})}><i/>{l.subtitle}{i===1?' · 北京':''}</button>)}</div></div>
  <div className="atlas-bottom-note"><span ref={coordEl}>104.200°E / 35.800°N</span><button onClick={()=>setInfo(true)}><Info size={14}/>地图说明</button><button onClick={()=>setHelp(!help)}>{help?'收起操作说明':'地图怎么玩'}<CaretRight size={12}/></button></div>
  {upcoming&&<div className="atlas-coming-backdrop" onClick={()=>setUpcoming(null)}><section role="dialog" aria-modal="true" aria-label={upcoming.name+'故事预告'} className="atlas-coming" onClick={e=>e.stopPropagation()}><button aria-label="关闭城市预告" onClick={()=>setUpcoming(null)}><X size={20}/></button><span>THE NEXT STORY / 下一份城市档案</span><h2>{upcoming.name}</h2><strong>敬请期待</strong><p>{upcoming.desc}</p><small>当前未开放游玩，首发完整故事在北京颐和园。</small><button className="atlas-primary" onClick={()=>{setUpcoming(null);flyTo('palace',{duration:5000})}}>先去颐和园探索<ArrowRight size={17}/></button></section></div>}
  {help&&<div className="atlas-help"><button onClick={()=>setHelp(false)} aria-label="关闭操作说明"><X size={16}/></button><strong>让好奇心，带你移动。</strong><p>滚轮 / 双指捏合：连续缩放<br/>拖动：移动地图<br/>右键拖动 / 双指转动：改变视角<br/>点击地名或探索点：平滑飞近<br/>“一镜入园”：从当前位置连续进入颐和园</p><small>你可以随时操作地图，中断自动巡游。</small></div>}
  {geoMessage&&<div className={`atlas-geo-message ${geoStatus}`} role="status"><div>{geoStatus==='success'?<Check size={18}/>:geoStatus==='error'?<WarningCircle size={18}/>:<Crosshair size={18}/>}<p>{geoMessage}<small>位置仅用于本次地图展示，不上传到项目服务器，也不作为打卡凭证。</small></p></div><button onClick={cancelGeo} aria-label="关闭定位提示"><X size={16}/></button></div>}
  {tour&&<div className="atlas-tour-banner"><span/><p>正在巡游 {selected?.name||'颐和园'}</p><button onClick={()=>{stopMotion();}}>结束巡游<X size={14}/></button></div>}
  {busy&&<div className={`atlas-loading ${status==='slow'?'slow':''}`} role="status"><GlobeHemisphereEast size={26} weight="thin"/><div><strong>{status==='slow'?'地图正在连接中':'正在铺开真实的山河'}</strong><p>{status==='slow'?'地图服务响应较慢，你可以重试。':'加载道路、水系与建筑数据…'}</p></div>{status==='slow'&&<button onClick={()=>setRetry(r=>r+1)}>重试</button>}</div>}
  {fatal&&<div className="atlas-fatal"><Mountains size={35} weight="thin"/><h2>地图暂时无法展开</h2><p>{fatal}</p><button className="atlas-primary" onClick={()=>setRetry(r=>r+1)}>重新加载地图<ArrowCounterClockwise size={17}/></button></div>}
  {info&&<div className="atlas-info-backdrop" onClick={()=>setInfo(false)}><section role="dialog" aria-modal="true" aria-label="地图说明" ref={infoRef} onClick={e=>e.stopPropagation()} className="atlas-info"><button className="close-button" onClick={()=>setInfo(false)} aria-label="关闭地图说明"><X size={21}/></button><span>ABOUT THIS MAP</span><h2>真实地理，新的探索方式。</h2><p>道路、水系与建筑来自 OpenStreetMap，矢量底图由 OpenFreeMap / OpenMapTiles 提供。地图使用同一个 WebGL 场景，连续缩放、转向和改变视角。</p><p>全园索引包含公开地图要素与根据园区资料补充的参考观察点；参考点在详情中单独标明。建筑位置采用 WGS84 底图坐标，建筑轮廓及渲染高度来自底图，高度可能由楼层估算或使用数据默认值。材质、水面光泽与部分园内坡屋顶是视觉近似，坡屋顶依附公开建筑轮廓，佛香阁按官网公布的八面、三层、四重檐与阁身高 36.44 米补充体量示意，屋檐比例为解释性建模，尚非测绘模型。</p><p>北京地区加入 Mapzen / USGS 公开高程，按 1 倍比例呈现地形。高程分辨率无法表达所有台阶和堤岸；水面使用贴合真实水域轮廓的动态材质，不是实拍反射。</p><p>朱红虚线表示线索关联，不是可直接行走的路径。请使用现场指引或正规导航规划步行路线。</p><p>授权后可定位到你附近；不同设备的定位精度会有差异。当前位置不会计为已完成的实地任务。</p><div className="atlas-sources"><a href="https://summerpalace.net.cn/longevity/detailqianshan/382.html" target="_blank" rel="noreferrer">佛香阁建筑资料<ArrowUpRight size={13}/></a>{POIS.map(p=><a key={p.id} href={p.source} target="_blank" rel="noreferrer">{p.name}坐标来源<ArrowUpRight size={13}/></a>)}</div></section></div>}
 </section>;
}
