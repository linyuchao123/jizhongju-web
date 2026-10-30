// Original style: OpenFreeMap Liberty. Cartographic data: OpenMapTiles / OSM.
// Only cartographic styling is adapted; this file does not copy the team reference implementation.
import baseStyle from './liberty-base.json';
import { towerMassing } from './landmarks.mjs';
import { POIS, collection, point } from './geo.mjs';
export function createExplorerStyle(){
 const s=structuredClone(baseStyle);
 s.name='迹中局 · 山河探索';
 s.projection={type:'globe'};
 s.light={anchor:'map',color:'#fff4dc',intensity:0.57,position:[1.5,225,45]};
 s.sky={'sky-color':'#c6d9db','horizon-color':'#eef0e6','fog-color':'#eef0e6','fog-ground-blend':.12,'horizon-fog-blend':.5,'sky-horizon-blend':.7};
 const dem={type:'raster-dem',tiles:['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],encoding:'terrarium',tileSize:256,maxzoom:12,bounds:[115,39,118,42],attribution:'Terrain © <a href="https://github.com/tilezen/joerd/blob/master/docs/attribution.md" target="_blank" rel="noopener">Mapzen / USGS / NOAA</a>'};
 s.sources['jzj-dem']={...dem};
 s.sources['jzj-hillshade']={...dem};
 s.sources.openmaptiles.attribution='<a href="https://openfreemap.org/" target="_blank" rel="noopener">OpenFreeMap</a> © <a href="https://www.openmaptiles.org/" target="_blank" rel="noopener">OpenMapTiles</a> © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>';
 s.layers=s.layers.filter(l=>!l.id.startsWith('poi_')&&!l.id.includes('shield')&&!l.id.includes('one_way'));
 for(const l of s.layers){
  l.paint={...l.paint};l.layout={...l.layout};
  const id=l.id;
  if(l.type==='background')l.paint['background-color']='#ebece1';
  if(id==='natural_earth')l.paint['raster-opacity']=['interpolate',['linear'],['zoom'],0,.2,5,.15,7,0];
  if(id==='water')l.paint['fill-color']=['interpolate',['linear'],['zoom'],3,'#91b4a8',10,'#538b7c',15,'#316f60'];
  if(id.startsWith('waterway')&&l.type==='line')l.paint['line-color']='#6c9d8a';
  if(id==='park')l.paint['fill-color']='#b9c79e';
  if(id==='park_outline')l.paint['line-color']='#aac097';
  if(id==='landcover_wood')l.paint['fill-color']='#859c6d';
  if(id==='landcover_grass')l.paint['fill-color']='#bacb9d';
  if(id.startsWith('landuse_')||id==='aeroway_fill')l.paint['fill-color']=id.includes('residential')?'#e9e9de':id.includes('cemetery')?'#c9d7b7':'#e4e7d5';
  if(id==='landcover_sand')l.paint['fill-color']='#e9dfc6';
  if(l.type==='line'&&(id.startsWith('road')||id.startsWith('bridge')||id.startsWith('tunnel'))){if(id.includes('casing'))l.paint['line-color']='#c7cdbb';else if(id.includes('rail'))l.paint['line-color']='#a9b5a0';else l.paint['line-color']=id.includes('motorway')||id.includes('trunk')?'#efdfbf':id.includes('path')?'#b7c4a8':'#faf9ed';}
  if(id==='building')l.paint={'fill-color':'#bfb7a2','fill-outline-color':'#9d9988','fill-opacity':.9};
  if(id==='building-3d'){l.minzoom=14;l.paint={'fill-extrusion-base':['coalesce',['get','render_min_height'],0],'fill-extrusion-color':['coalesce',['get','colour'],'#b8ae99'],'fill-extrusion-height':['interpolate',['linear'],['zoom'],14,0,15,['coalesce',['get','render_height'],8]],'fill-extrusion-opacity':1,'fill-extrusion-vertical-gradient':true};}
  if(id.startsWith('boundary')){l.paint['line-color']=id==='boundary_2'?'#7c8b73':'#b3bca5';l.paint['line-opacity']=.7;}
  if(l.type==='symbol'){
   if(l.layout['text-field'])l.layout['text-field']=['coalesce',['get','name:zh'],['get','name:zh-Hans'],['get','name']];
   l.layout['text-font']=['Noto Sans Regular'];
   l.paint['text-color']=id.includes('water')?'#416c5b':id.startsWith('label_country')?'#42604a':'#68775f';
   l.paint['text-halo-color']='#f4f5e8';l.paint['text-halo-width']=1.4;l.paint['text-halo-blur']=.5;
   if(id==='label_city'){l.minzoom=6;l.layout['text-size']=['interpolate',['linear'],['zoom'],6,11,10,15,14,18];}
   if(id==='label_city_capital')l.paint['text-color']='#31523f';
   if(id==='label_state'){l.minzoom=3.8;l.maxzoom=9;l.layout['text-size']=['interpolate',['linear'],['zoom'],4,11,8,15];l.layout['text-letter-spacing']=.12;}
   if(id==='label_other'||id==='label_village')l.minzoom=13;
  }
 }
 const waterIndex=s.layers.findIndex(l=>l.id==='water');
 const waterLayer=s.layers[waterIndex];
 s.layers.splice(waterIndex+1,0,{id:'jzj-water-surface',type:'fill',source:waterLayer.source,'source-layer':waterLayer['source-layer'],filter:waterLayer.filter,minzoom:11,paint:{'fill-opacity':['interpolate',['linear'],['zoom'],11,0,13,.85,15,1]}});
 s.layers.splice(s.layers.findIndex(l=>l.id==='building'),0,{id:'jzj-relief',type:'hillshade',source:'jzj-hillshade',minzoom:8,paint:{'hillshade-exaggeration':.55,'hillshade-shadow-color':'#424d37','hillshade-highlight-color':'#fff4d8','hillshade-accent-color':'#73815c','hillshade-illumination-anchor':'map','hillshade-illumination-direction':315}});
 const building=s.layers.find(l=>l.id==='building-3d');
 s.layers.splice(s.layers.indexOf(building)+1,0,{...structuredClone(building),id:'jzj-roof-caps',paint:{'fill-extrusion-base':['interpolate',['linear'],['zoom'],14,0,15,['max',0,['-', ['coalesce',['get','render_height'],8],.45]]],'fill-extrusion-height':['interpolate',['linear'],['zoom'],14,0,15,['coalesce',['get','render_height'],8]],'fill-extrusion-color':['case',['has','colour'],['get','colour'],['within',{type:'Polygon',coordinates:[[[116.256,39.987],[116.282,39.987],[116.282,40.003],[116.256,40.003],[116.256,39.987]]]}],'#5b6255','#b1aca0'],'fill-extrusion-opacity':1,'fill-extrusion-vertical-gradient':false}});
 s.sources['jzj-tower']={type:'geojson',data:towerMassing()};
 s.layers.push({id:'jzj-tower-massing',type:'fill-extrusion',source:'jzj-tower',minzoom:14,paint:{'fill-extrusion-base':['interpolate',['linear'],['zoom'],14,0,15,['get','base']],'fill-extrusion-height':['interpolate',['linear'],['zoom'],14,0,15,['get','height']],'fill-extrusion-color':['get','color'],'fill-extrusion-opacity':1,'fill-extrusion-vertical-gradient':true}});
 s.sources['jzj-pois']={type:'geojson',data:collection(POIS.map(p=>point(p.coord,{id:p.id,name:p.name,label:`${p.number}  ${p.name}`})))};
 s.sources['jzj-links']={type:'geojson',data:collection([{type:'Feature',properties:{},geometry:{type:'LineString',coordinates:[POIS[2].coord,POIS[1].coord,POIS[0].coord]}}])};
 s.sources['jzj-location']={type:'geojson',data:collection([])};
 s.sources['jzj-accuracy']={type:'geojson',data:collection([])};
 const width=['interpolate',['linear'],['zoom'],12,1,16,3,19,5];
 s.layers.push(
  {id:'jzj-link-glow',type:'line',source:'jzj-links',minzoom:13,paint:{'line-color':'#b94b36','line-width':9,'line-opacity':.1,'line-blur':4}},
  {id:'jzj-link',type:'line',source:'jzj-links',minzoom:13,layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':'#bb5039','line-width':width,'line-opacity':.85,'line-dasharray':[1.5,2]}},
  {id:'jzj-poi-halo',type:'circle',source:'jzj-pois',minzoom:13.3,paint:{'circle-radius':18,'circle-color':'#b44e38','circle-opacity':.1}},
  {id:'jzj-poi-hit',type:'circle',source:'jzj-pois',minzoom:13.3,paint:{'circle-radius':22,'circle-opacity':0}},
  {id:'jzj-poi-core',type:'circle',source:'jzj-pois',minzoom:13.3,paint:{'circle-radius':7,'circle-color':'#b44e38','circle-stroke-color':'#fff9e5','circle-stroke-width':2.5}},
  {id:'jzj-poi-label',type:'symbol',source:'jzj-pois',minzoom:13.3,layout:{'text-field':['get','label'],'text-font':['Noto Sans Regular'],'text-size':13,'text-anchor':'top','text-offset':[0,1.3],'text-allow-overlap':false},paint:{'text-color':'#2c503e','text-halo-color':'#fffcee','text-halo-width':2.4}},
  {id:'jzj-accuracy-fill',type:'fill',source:'jzj-accuracy',paint:{'fill-color':'#387a66','fill-opacity':.12}},
  {id:'jzj-accuracy-line',type:'line',source:'jzj-accuracy',paint:{'line-color':'#387a66','line-width':1,'line-opacity':.5}},
  {id:'jzj-location-halo',type:'circle',source:'jzj-location',paint:{'circle-radius':15,'circle-color':'#236a55','circle-opacity':.16}},
  {id:'jzj-location-dot',type:'circle',source:'jzj-location',paint:{'circle-radius':6,'circle-color':'#236a55','circle-stroke-color':'#ffffff','circle-stroke-width':3}},
 );
 return s;
}
