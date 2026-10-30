// Hipped roof interpretation over actual OSM rectangular footprints. The roof
// form and 1.8–3 m rise are visual approximations, not observed roof metadata.
export function roofGeometry(footprints){
 const features=[];
 for(const {ring,height} of footprints){
  const c=ring.reduce((a,p)=>[a[0]+p[0]/4,a[1]+p[1]/4],[0,0]);
  const metres=p=>[(p[0]-c[0])*85300,(p[1]-c[1])*111320];
  const points=ring.map(metres);
  const axes=[0,1].map(i=>{const p=points[i],q=points[i+1];const len=Math.hypot(q[0]-p[0],q[1]-p[1]);return {x:(q[0]-p[0])/len,y:(q[1]-p[1])/len,len}});
  const minor=Math.min(...axes.map(a=>a.len)),rise=Math.min(3,Math.max(1.8,minor*.2));
  for(let step=0;step<10;step++){
   const t=step/10;
   const coords=points.map(p=>{
    // Keep the long ridge; taper both ends to create hips instead of a pyramid.
    const inset=axes.map(a=>(p[0]*a.x+p[1]*a.y)*t*.94*minor/a.len);
    return [c[0]+(p[0]-inset[0]*axes[0].x-inset[1]*axes[1].x)/85300,c[1]+(p[1]-inset[0]*axes[0].y-inset[1]*axes[1].y)/111320];
   });coords.push([...coords[0]]);
   features.push({type:'Feature',properties:{base:height+rise*step/10,height:height+rise*(step+1)/10},geometry:{type:'Polygon',coordinates:[coords]}});
  }
 }
 return {type:'FeatureCollection',features};
}
export async function addPalaceRoofs(map,signal){
 const response=await fetch('/data/palace-roof-footprints.json',{signal});if(!response.ok)throw new Error('Roof footprints unavailable');
 const {footprints}=await response.json();if(signal.aborted)return;
 map.addSource('jzj-roofs',{type:'geojson',data:roofGeometry(footprints)});
 map.addLayer({id:'jzj-hipped-roofs',type:'fill-extrusion',source:'jzj-roofs',minzoom:15,paint:{'fill-extrusion-base':['get','base'],'fill-extrusion-height':['get','height'],'fill-extrusion-color':'#777c68','fill-extrusion-opacity':1,'fill-extrusion-vertical-gradient':true}},'jzj-tower-massing');
}
