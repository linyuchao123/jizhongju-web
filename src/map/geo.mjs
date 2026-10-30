export const CHINA = {center:[104.2,35.8],zoom:3.35,bearing:0};
export const BEIJING = {center:[116.39,40.08],zoom:9.1,bearing:-5};
export const PALACE = {center:[116.2715,39.9944],zoom:15.15,bearing:-24};
export const POIS = [
 {id:'tower',name:'佛香阁',number:'01',coord:[116.2739583,39.9989556],tag:'山色 · 建筑',title:'抬头，寻找万寿山的中心。',description:'观察建筑与山、水的关系。换一个视角，看看它如何成为园林中的视觉中心。',source:'https://www.wikidata.org/wiki/Q10886840'},
 {id:'corridor',name:'长廊',number:'02',coord:[116.2708333,39.9971111],tag:'廊影 · 观察',title:'慢下来，让长廊讲故事。',description:'沿着长廊观察彩绘与湖岸的变化。从一处画面出发，留下你注意到的细节。',source:'https://www.wikidata.org/wiki/Q3378518'},
 {id:'boat',name:'石舫',number:'03',coord:[116.2635833,39.9967778],tag:'水岸 · 寻迹',title:'找到一艘，不会驶离的船。',description:'观察这座水岸建筑的形态，再看看它与周围湖面、岸线的关系。',source:'https://www.wikidata.org/wiki/Q2636083'},
 {id:'bridge',name:'十七孔桥',number:'04',coord:[116.2717699,39.9892053],tag:'桥影 · 发现',title:'让目光，沿着桥的弧线走。',description:'从可以公开到达的岸边观察桥与岛的连接。试着找到让桥身和倒影同时入画的角度。',source:'https://www.wikidata.org/wiki/Q61857626'},
];
export function clamp(value,min,max){return Math.min(max,Math.max(min,value))}
export function pitchForZoom(zoom){const t=clamp((zoom-10)/6,0,1);return clamp(57*t*t*(3-2*t),0,57)}
export function stageForZoom(zoom){return zoom<7?'china':zoom<13?'beijing':'palace'}
export function distanceKm(a,b){const rad=Math.PI/180,lat=(b[1]-a[1])*rad,lng=(b[0]-a[0])*rad;const h=Math.sin(lat/2)**2+Math.cos(a[1]*rad)*Math.cos(b[1]*rad)*Math.sin(lng/2)**2;return 6371*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h))}
export function nearestPoi(coord){return POIS.map(p=>({...p,distance:distanceKm(coord,p.coord)})).sort((a,b)=>a.distance-b.distance)[0]}
export function accuracyPolygon(center,meters){const radius=clamp(meters,1,1000000),R=6371000,rad=Math.PI/180;const lat=center[1]*rad,lng=center[0]*rad,delta=radius/R;const points=[];for(let i=0;i<=64;i++){const angle=i/64*Math.PI*2;const lat2=Math.asin(Math.sin(lat)*Math.cos(delta)+Math.cos(lat)*Math.sin(delta)*Math.cos(angle));const lng2=lng+Math.atan2(Math.sin(angle)*Math.sin(delta)*Math.cos(lat),Math.cos(delta)-Math.sin(lat)*Math.sin(lat2));points.push([lng2/rad,lat2/rad])}return {type:'Feature',properties:{},geometry:{type:'Polygon',coordinates:[points]}}}
export const collection=features=>({type:'FeatureCollection',features});
export const point=(coord,properties={})=>({type:'Feature',properties,geometry:{type:'Point',coordinates:coord}});
