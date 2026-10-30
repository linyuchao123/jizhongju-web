// Architectural massing, not a survey model. Centre derived from the nearest
// OSM footprint (OpenFreeMap 20261025 tile 14/13483/6202); footprint proportions
// and eaves are interpreted. Tower height / eight sides / four eaves:
// https://summerpalace.net.cn/longevity/detailqianshan/382.html
export const TOWER_SOURCE='https://summerpalace.net.cn/longevity/detailqianshan/382.html';
export const TOWER_HEIGHT=36.44;
const center=[116.27409607172012,39.99895090785603];
function octagon(radius){
 const ring=Array.from({length:8},(_,i)=>{const a=(i*45+22.5-7)*Math.PI/180;return [center[0]+Math.cos(a)*radius/(111320*Math.cos(center[1]*Math.PI/180)),center[1]+Math.sin(a)*radius/111320]});ring.push([...ring[0]]);return {type:'Polygon',coordinates:[ring]};
}
export function towerMassing(){
 const features=[];
 const add=(radius,base,height,color,material='wall')=>features.push({type:'Feature',properties:{base,height,color,material},geometry:octagon(radius)});
 add(12.5,0,1.3,'#b4a78b','stone');
 add(8.7,1.3,10,'#845647');add(7.9,10,20,'#845647');add(7.1,20,29,'#80523f');
 // Fine stepped bands approximate a taper, without inventing a photogrammetry model.
 for(const [base,radius,top] of [[7.2,11.8,10.2],[16.6,10.9,19.6],[25.3,10,28.3],[29.3,9.3,TOWER_HEIGHT]]){
  const steps=12;
  for(let i=0;i<steps;i++){const t=i/steps;add(radius*(1-t*.66),base+(top-base)*t,base+(top-base)*(i+1)/steps,i===0?'#596c50':'#b59b54','roof');}
 }
 // Dark openings between timber floor bands remain subordinate at map scale.
 for(const [radius,base,height] of [[8.72,3,5.8],[7.92,12,14.8],[7.12,22,24]])add(radius,base,height,'#493e30','window');
 // Pale stone sill and dark cornice create a readable floor rhythm.
 for(const h of [11,20.5])add(h===11?8.9:8.1,h,h+.55,'#c7b89a','stone');
 return {type:'FeatureCollection',features};
}
