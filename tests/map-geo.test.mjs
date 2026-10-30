import test from 'node:test';
import assert from 'node:assert/strict';
import {pitchForZoom,stageForZoom,distanceKm,nearestPoi,accuracyPolygon,POIS} from '../src/map/geo.mjs';
test('camera pitch is continuous, bounded and increases toward scenic detail',()=>{
 assert.equal(pitchForZoom(3),0);assert.equal(pitchForZoom(10),0);assert.equal(pitchForZoom(16),57);assert.equal(pitchForZoom(19),57);
 let previous=0;for(let z=3;z<19;z+=.01){const pitch=pitchForZoom(z);assert.ok(pitch>=previous);assert.ok(pitch-previous<.15);previous=pitch}
});
test('continuous camera thresholds change detail without requiring a new map',()=>{
 assert.equal(stageForZoom(6.99),'china');assert.equal(stageForZoom(7),'beijing');assert.equal(stageForZoom(12.99),'beijing');assert.equal(stageForZoom(13),'palace');
});
test('nearest location uses geographic distance and does not mistake distant users for Beijing',()=>{
 const tower=POIS[0];assert.equal(nearestPoi(tower.coord).id,tower.id);assert.ok(nearestPoi([121.47,31.23]).distance>900);assert.ok(distanceKm([116.4,39.9],[116.4,39.9])<.001);
});
test('accuracy polygon is closed and expressed in meters around a WGS84 coordinate',()=>{
 const center=[116.27,39.99],polygon=accuracyPolygon(center,120),ring=polygon.geometry.coordinates[0];assert.equal(ring.length,65);assert.deepEqual(ring[0],ring.at(-1));
 for(const p of ring)assert.ok(Math.abs(distanceKm(center,p)-.120)<.0001);
});
test('public scenic coordinates remain within the Summer Palace demonstration extent',()=>{
 for(const p of POIS){assert.ok(p.coord[0]>116.25&&p.coord[0]<116.29);assert.ok(p.coord[1]>39.98&&p.coord[1]<40.01);assert.ok(p.source.startsWith('https://www.wikidata.org/'))}
});
