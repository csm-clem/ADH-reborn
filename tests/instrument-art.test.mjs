import test from 'node:test';
import assert from 'node:assert/strict';
import {instrumentPicture} from '../instrument-art.js';
import {INSTRUMENTS} from '../core.js';
test('Each instrument has the intended family and its actual number of drawn strings',()=>{
 const families=['strat','soloist','headless','fender-bass','ibanez-bass','ibanez-bass'];
 INSTRUMENTS.forEach((instrument,i)=>{const svg=instrumentPicture(instrument);assert.match(svg,new RegExp(`data-model="${families[i]}"`));assert.equal([...svg.matchAll(/data-art-string=/g)].length,instrument.strings);assert.match(svg,/aria-label=/);assert.doesNotMatch(svg,/<image|https?:/);});
});
