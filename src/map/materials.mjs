// Procedural map materials, not imagery: tile-periodic waves stay clipped to the
// actual vector water polygons and inherit the map's perspective and terrain.
const TAU = Math.PI * 2;
const waveCaches=new Map();
function waveBasis(size){
 if(waveCaches.has(size))return waveCaches.get(size);
 const basis=new Float32Array(size*size*8);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const u=x/size*TAU,v=y/size*TAU,i=(y*size+x)*8;
  const angles=[u*3+v*37,u*7+v*53,u*13+v*71,u+v*2+Math.sin(u*2-v)*.4];
  angles.forEach((a,j)=>{basis[i+j*2]=Math.cos(a);basis[i+j*2+1]=Math.sin(a)});
 }
 waveCaches.set(size,basis);return basis;
}
export function waterMaterial(time=0,size=256){
 const basis=waveBasis(size),data=new Uint8Array(size*size*4);
 const phases=[.65,.47,.31,.08].map(speed=>[Math.cos(time*speed),Math.sin(time*speed)]);
 for(let p=0;p<size*size;p++){
  const b=p*8,i=p*4;
  const a=basis[b]*phases[0][0]+basis[b+1]*phases[0][1];
  const c=basis[b+2]*phases[1][0]+basis[b+3]*phases[1][1];
  const d=basis[b+4]*phases[2][0]+basis[b+5]*phases[2][1];
  const swell=.5+.5*(basis[b+7]*phases[3][0]-basis[b+6]*phases[3][1]);
  const slope=.48*a+.30*c+.16*d;
  const sparkle=Math.pow(Math.max(0,(slope+.15)/1.09),12)*42;
  const diffuse=slope*7+swell*8;
  data[i]=37+diffuse+sparkle;data[i+1]=91+diffuse+sparkle;data[i+2]=80+diffuse+sparkle*.9;data[i+3]=255;
 }
 return {width:size,height:size,data};
}
export function surfaceMaterial(kind, size=128) {
 const data=new Uint8Array(size*size*4);
 const base=kind==='wood'?[117,141,96]:[184,174,153];
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const u=x/size*TAU,v=y/size*TAU;
  const grain=Math.sin(u*21+Math.sin(v*13))*Math.sin(v*27+u*8)*3;
  const mottling=Math.sin(u*3+Math.sin(v*2))*Math.cos(v*5-u)*5;
  const i=(y*size+x)*4;for(let j=0;j<3;j++)data[i+j]=base[j]+grain+mottling;data[i+3]=255;
 }
 return {width:size,height:size,data};
}
export function installMaterials(map) {
 map.addImage('jzj-water',waterMaterial(),{pixelRatio:1});
 map.addImage('jzj-wood',surfaceMaterial('wood'),{pixelRatio:2});
 map.addImage('jzj-stone',surfaceMaterial('stone'),{pixelRatio:2});
 map.setPaintProperty('jzj-water-surface','fill-pattern','jzj-water');
 map.setPaintProperty('landcover_wood','fill-pattern','jzj-wood');
 map.setPaintProperty('building-3d','fill-extrusion-pattern','jzj-stone');
}
