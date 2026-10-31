export const CHINA = {center:[104.2,35.8],zoom:3.35,bearing:0};
export const BEIJING = {center:[116.39,40.08],zoom:9.1,bearing:-5};
export const PALACE = {center:[116.2678,39.9938],zoom:15.15,bearing:-24};
export { PALACE_POIS as POIS } from './palace-pois.mjs';
import { PALACE_POIS as POIS } from './palace-pois.mjs';
export function clamp(value,min,max){return Math.min(max,Math.max(min,value))}
export function pitchForZoom(zoom){const t=clamp((zoom-11)/7,0,1);return clamp(52*t*t*(3-2*t),0,52)}
export function stageForZoom(zoom){return zoom<7?'china':zoom<13?'beijing':'palace'}
export function distanceKm(a,b){const rad=Math.PI/180,lat=(b[1]-a[1])*rad,lng=(b[0]-a[0])*rad;const h=Math.sin(lat/2)**2+Math.cos(a[1]*rad)*Math.cos(b[1]*rad)*Math.sin(lng/2)**2;return 6371*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h))}
export function nearestPoi(coord){return POIS.map(p=>({...p,distance:distanceKm(coord,p.coord)})).sort((a,b)=>a.distance-b.distance)[0]}
export function accuracyPolygon(center,meters){const radius=clamp(meters,1,1000000),R=6371000,rad=Math.PI/180;const lat=center[1]*rad,lng=center[0]*rad,delta=radius/R;const points=[];for(let i=0;i<=64;i++){const angle=i/64*Math.PI*2;const lat2=Math.asin(Math.sin(lat)*Math.cos(delta)+Math.cos(lat)*Math.sin(delta)*Math.cos(angle));const lng2=lng+Math.atan2(Math.sin(angle)*Math.sin(delta)*Math.cos(lat),Math.cos(delta)-Math.sin(lat)*Math.sin(lat2));points.push([lng2/rad,lat2/rad])}return {type:'Feature',properties:{},geometry:{type:'Polygon',coordinates:[points]}}}
export const collection=features=>({type:'FeatureCollection',features});
export const point=(coord,properties={})=>({type:'Feature',properties,geometry:{type:'Point',coordinates:coord}});
