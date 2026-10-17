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
  for(const required of ['./achievement-rules.js','./achievement-data.js','./achievements-ui.js','./achievements.css','./themes.js','./curriculum-rules.js','./interaction.css','./services/audio-service.js','./services/storage-service.js','./services/app-store.js','./services/platform-service.js','./index.html','./ui.css','./neck-view.js','./neck.css','./answer-wheel.css','./discovery-feedback.js','./tokens.css','./components.css','./progress.css','./progress.js','./app.js','./release.js','./state.js','./instrument-art.js','./learning-help.js','./tuning.js','./onboarding.js','./onboarding.css','./pilot.js','./pilot-ui.js','./pilot.css','./core.js','./results.js','./result-ui.js','./octave-music.js','./melodies.js','./result.css','./style.css','./manifest.webmanifest'])assert.ok(assets.includes(required));
});
test('Browser and installed app consistently use the product name',async()=>{
 const {APP_NAME,RELEASE}=await import('../release.js'),html=await readFile(resolve(root,'index.html'),'utf8'),manifest=JSON.parse(await readFile(resolve(root,'manifest.webmanifest'),'utf8'));
 assert.ok((await readFile(resolve(root,'sw.js'),'utf8')).includes(`fretboard-trainer-v${RELEASE}:`));assert.equal(JSON.parse(await readFile(resolve(root,'package.json'),'utf8')).version,RELEASE);assert.equal(APP_NAME,'Daily Fretboard Trainer');assert.equal(manifest.name,APP_NAME);assert.ok(html.includes(`<title>${APP_NAME}`));assert.equal(manifest.background_color,'#ffffff');
});
