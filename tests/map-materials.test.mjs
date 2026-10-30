import test from 'node:test';
import assert from 'node:assert/strict';
import {waterMaterial,surfaceMaterial,installMaterials} from '../src/map/materials.mjs';
import {towerMassing,TOWER_HEIGHT} from '../src/map/landmarks.mjs';
test('water evolves deterministically while retaining opaque water coverage',()=>{
 const a=waterMaterial(0,32),b=waterMaterial(2,32);
 assert.deepEqual(a,waterMaterial(0,32));assert.notDeepEqual(a.data,b.data);
 assert.equal(a.data.length,32*32*4);
 for(let i=3;i<a.data.length;i+=4)assert.equal(a.data[i],255);
});
test('procedural materials register before layers reference them',()=>{
 const names=new Set();installMaterials({addImage:(id,img)=>{assert.equal(img.data.length,img.width*img.height*4);names.add(id)},setPaintProperty:(_,__,id)=>assert.ok(names.has(id))});
 assert.notDeepEqual(surfaceMaterial('wood'),surfaceMaterial('stone'));
});
test('tower massing respects published height and closed octagonal footprints',()=>{
 const {features}=towerMassing();assert.equal(Math.max(...features.map(f=>f.properties.height)),TOWER_HEIGHT);
 for(const f of features){const r=f.geometry.coordinates[0];assert.equal(r.length,9);assert.deepEqual(r[0],r[8]);assert.ok(f.properties.base<f.properties.height);assert.ok(f.properties.height<=36.44);}
});

test('interpreted roofs preserve the source footprint at their base and never alter wall height',async()=>{
 const {roofGeometry}=await import('../src/map/roofs.mjs');
 const ring=[[116.27,40],[116.2704,40],[116.2704,40.0001],[116.27,40.0001]];
 const {features}=roofGeometry([{ring,height:5}]);
 assert.deepEqual(features[0].geometry.coordinates[0].slice(0,-1),ring);
 assert.equal(features[0].properties.base,5);
 assert.ok(features.at(-1).properties.height<=8);
 assert.ok(features.at(-1).geometry.coordinates[0][0][1]>ring[0][1]);
});
