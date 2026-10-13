import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
test('Offline shell includes every runtime file and valid install icons',async()=>{
  const manifest=JSON.parse(await readFile(resolve(root,'manifest.webmanifest'),'utf8'));
  assert.equal(manifest.display,'standalone');
  assert.equal(manifest.start_url,'./');
  for(const icon of manifest.icons){
    const bytes=await readFile(resolve(root,icon.src));
    assert.equal(bytes.subarray(1,4).toString(),'PNG');
    assert.equal(bytes.readUInt32BE(16),Number(icon.sizes.split('x')[0]));
  }
  const sw=await readFile(resolve(root,'sw.js'),'utf8');
  const assets=sw.match(/const ASSETS=\[(.*?)\];/s)[1].match(/'([^']+)'/g).map(s=>s.slice(1,-1));
  for(const a of assets)await access(resolve(root,a==='./'?'index.html':a));
  for(const required of ['./index.html','./app.js','./core.js','./style.css','./manifest.webmanifest'])assert.ok(assets.includes(required));
});
