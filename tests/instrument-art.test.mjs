import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {instrumentPicture,INSTRUMENT_IMAGES} from '../instrument-art.js';
import {INSTRUMENTS} from '../core.js';
test('Every supplied WebP instrument is used locally and is a valid image file',async()=>{
 for(const instrument of INSTRUMENTS){const html=instrumentPicture(instrument),file=INSTRUMENT_IMAGES[instrument.id],bytes=await readFile(new URL('../instruments/'+file,import.meta.url));assert.match(html,/<img/);assert.ok(html.includes(`src="./instruments/${file}"`));assert.ok(html.includes(`${instrument.strings} cordes`));assert.equal(bytes.subarray(0,4).toString(),'RIFF');assert.equal(bytes.subarray(8,12).toString(),'WEBP');assert.doesNotMatch(html,/https?:/);}
});
