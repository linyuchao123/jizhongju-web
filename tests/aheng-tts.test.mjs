import {ALL_VOICE_LINES,narrationFor,fresh as newStart} from '../src/leshoutang/story.mjs';
import fs from 'node:fs';
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

test('Leshoutang normal riddle and feedback always have the approved recording',()=>{
 const generated=completeVoiceLines({}),clips=JSON.parse(fs.readFileSync('src/palace/voice-clips.json'));
 for(const text of ALL_VOICE_LINES){assert.ok(generated[text]);assert.equal(clips[text]?.provider,'doubao-tts-2.0');assert.ok(fs.existsSync('public'+clips[text].src))}
 const riddle=narrationFor({...newStart(),phase:'riddle'});
 assert.match(riddle,/师父为什么偏偏/);assert.ok(clips[riddle]?.src);
 assert.notEqual(riddle,narrationFor({...newStart(),phase:'riddle'},{wrong:true}));
});
