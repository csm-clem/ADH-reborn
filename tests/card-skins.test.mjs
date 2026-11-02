import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {achievementArtwork} from '../achievement-art.js';
import {artworkRaster} from '../achievement-raster.js';
import {ACHIEVEMENTS} from '../achievement-rules.js';
import {melodyById} from '../melodies.js';
import {rewardFor} from '../reward-music.js';

test('Approved skins and all 59 raster artworks are intact, packaged and available offline',async()=>{
 const manifest=JSON.parse(await readFile(new URL('../card-assets-manifest.json',import.meta.url),'utf8'));
 assert.equal(manifest.backgrounds.length,5);assert.equal(manifest.artworks.length,59);
 const sw=await readFile(new URL('../sw.js',import.meta.url),'utf8');
 for(const item of [...manifest.backgrounds,...manifest.artworks]){
  const file=new URL('../'+item.path,import.meta.url),bytes=await readFile(file);
  assert.equal(createHash('sha256').update(bytes).digest('hex'),item.sha256,item.path);
  assert.ok(sw.includes('./'+item.path),item.path+' missing from offline cache');
 }
 for(const definition of ACHIEVEMENTS)assert.ok(artworkRaster(definition),definition.id);
 for(const asset of manifest.artworks){
  const def={id:asset.id};assert.ok(artworkRaster(def));
  if(!asset.id.startsWith('music-'))assert.match(achievementArtwork(def),/raster\/.*\.webp/);
 }
 const pack=await readFile(new URL('../tools/package.mjs',import.meta.url),'utf8');
 for(const module of ['achievement-raster.js','achievement-skins.css']){assert.ok(pack.includes(module));assert.ok(sw.includes('./'+module));}
});

test('Raster illustrations preserve musical event pitches and timing, including multiple namespaces',()=>{
 for(const id of ['higher-ground','immigrant-song','around-world','seven-nation','feel-good-inc']){
  const music=melodyById(id),reward=rewardFor(music);assert.ok(reward);
  for(const namespace of ['','album-','expanded-']){
   const html=achievementArtwork({id:'music-'+id,music},namespace);
   assert.match(html,/raster\/music-.*\.webp/);
   const events=[...html.matchAll(/data-midi="(\d+)" data-event-index="(\d+)" data-start="([\d.]+)" data-beats="([\d.]+)"/g)].map(m=>({midi:+m[1],start:+m[3],beats:+m[4]}));
   assert.deepEqual(events,reward.events.map(({midi,start,beats})=>({midi,start,beats})));
  }
 }
});
