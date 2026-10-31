import test from 'node:test';
import assert from 'node:assert/strict';
import {decodeSpeech,requestBody,completeVoiceLines} from '../scripts/aheng-tts.mjs';
import {CHAPTERS} from '../src/expedition/story.mjs';
test('full voice generation includes both new workbook story paths',()=>{
 const lines=completeVoiceLines({});
 for(const chapter of Object.values(CHAPTERS))for(const text of [...chapter.lines,chapter.after,chapter.purpose])assert.ok(lines[text]?.mood);
});
test('emotional instructions are separate from spoken text',()=>{
 const body=requestBody('找到了！','discovery');
 assert.equal(body.req_params.text,'找到了！');
 assert.match(JSON.parse(body.req_params.additions).context_texts[0],/惊喜/);
 assert.equal(body.req_params.speaker,'zh_female_vv_uranus_bigtts');
});
test('SSE chunks assemble only after successful completion',()=>{
 const chunk='data: '+JSON.stringify({code:0,data:Buffer.from('audio').toString('base64')})+'\n';
 assert.throws(()=>decodeSpeech(chunk),/不完整/);
 assert.equal(decodeSpeech(chunk+'data: {"code":20000000}\n').toString(),'audio');
 assert.throws(()=>decodeSpeech(chunk+'data: {"code":45000000}\n'),/45000000/);
});
