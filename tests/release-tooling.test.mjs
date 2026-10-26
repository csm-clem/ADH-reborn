import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,dirname} from 'node:path';
import {collectJavaScriptFiles,checkJavaScriptFiles} from '../tools/check-syntax.mjs';
import {verifyRelease} from '../tools/release-validation.mjs';

const version='1.2.3';
async function fixture(t){
 const root=await mkdtemp(join(tmpdir(),'dft-release-'));
 t.after(()=>rm(root,{recursive:true,force:true}));
 const files={
  'package.json':JSON.stringify({type:'module',version}),
  'release.js':`export const RELEASE='${version}';`,
  'update.json':JSON.stringify({version,url:'./'}),
  'index.html':'<link rel="stylesheet" href="./ui.css"><link rel="manifest" href="./manifest.webmanifest"><link rel="icon" href="./icons/icon.svg"><a href="https://example.com/course">Cours</a><script type="module" src="./app.js"></script>',
  'app.js':"import {value} from './services/notes.js?revision=1#cached';\nimport './side.js';\nexport {value as other} from './services/notes.js';\nexport const later=()=>import('./lazy.js');\nexport const button=`<button data-action=\"import\">Importer une sauvegarde</button><input type=\"file\">`;",
  'pilot-ui.js':'export {};',
  'services/notes.js':'export const value=1;',
  'side.js':"throw new Error('A syntax check must not execute browser modules');",
  'lazy.js':'export default 1;',
  'ui.css':"@import url('./theme.css');",
  'theme.css':"@font-face{font-family:Test;src:url('./fonts/ma%20police.woff2?v=1#font')} body{background-image:url(data:image/png;base64,AA==)}",
  'fonts/ma police.woff2':'font',
  'icons/icon.svg':'<svg xmlns="http://www.w3.org/2000/svg"/>',
  'manifest.webmanifest':JSON.stringify({start_url:'./?launch=pwa#home',icons:[{src:'./icons/icon.svg'}]})
 };
 async function put(path,content){await mkdir(dirname(join(root,path)),{recursive:true});await writeFile(join(root,path),content);}
 for(const [path,content]of Object.entries(files))await put(path,content);
 const assets=['./',...Object.keys(files).filter(path=>!['package.json','update.json'].includes(path)).map(path=>'./'+path)];
 const setAssets=next=>put('sw.js',`const WORKER_RELEASE='${version}';\nconst ASSETS=${JSON.stringify(next)};`);
 await setAssets(assets);
 return {root,assets,put,setAssets,verify:options=>verifyRelease({root,version,...options})};
}

test('Release validation follows CSS, fonts, HTML, icons and literal module imports without executing them',async t=>{
 const f=await fixture(t);await f.verify();await f.verify({production:true});
 await f.put('ui.css',"@import './theme.css';");await f.verify();
});

test('An existing font omitted from the offline cache prevents release',async t=>{
 const f=await fixture(t);await f.setAssets(f.assets.filter(path=>!path.endsWith('.woff2')));
 await assert.rejects(f.verify(),/absente du précache depuis theme\.css.*police/);
});

test('A stylesheet missing from the FTP package prevents release even when the JavaScript is complete',async t=>{
 const f=await fixture(t);await f.put('ui.css',"@import './missing.css';");
 await assert.rejects(f.verify(),/introuvable depuis ui\.css.*missing\.css/);
});

test('HTML resources, dynamic imports and install icons must be available offline',async t=>{
 for(const path of ['./ui.css','./lazy.js','./icons/icon.svg'])await t.test(path,async t=>{
  const f=await fixture(t);await f.setAssets(f.assets.filter(asset=>asset!==path));
  await assert.rejects(f.verify(),/absente du précache/);
 });
});

test('Syntax errors in transformed production files fail before the release is accepted',async t=>{
 const f=await fixture(t);await f.put('pilot-ui.js','export function broken( {');
 await assert.rejects(f.verify({production:true}),/JavaScript invalide dans le paquet.*pilot-ui\.js/s);
});

test('Release metadata disagreement is rejected without rewriting the files',async t=>{
 for(const [path,content]of [['package.json',JSON.stringify({version:'9.0.0'})],['release.js',"export const RELEASE='9.0.0';"],['update.json',JSON.stringify({version:'9.0.0'})]])await t.test(path,async t=>{
  const f=await fixture(t);await f.put(path,content);
  await assert.rejects(f.verify(),/incohérente/);
  assert.equal(await readFile(join(f.root,path),'utf8'),content);
 });
});

test('Invalid cache entries cannot silently escape the package or duplicate requests',async t=>{
 for(const [entry,message]of [['../../outside.js',/hors du paquet/],['https://example.com/runtime.js',/distante/],['./index.html',/répétée/]])await t.test(entry,async t=>{
  const f=await fixture(t);await f.setAssets([...f.assets,entry]);await assert.rejects(f.verify(),message);
 });
});

test('Production rejects internal pages and debug code even when they are not in the cache',async t=>{
 for(const path of ['debug-mode.js','ui-kit.html'])await t.test(path,async t=>{
  const f=await fixture(t);await f.put(path,path.endsWith('.js')?'export {};':'<h1>Internal</h1>');
  await assert.rejects(f.verify({production:true}),/Outil interne livré en production/);
 });
 await t.test('simulation hook',async t=>{
  const f=await fixture(t);await f.put('pilot-ui.js','export const simulatedBetaCompletion=()=>({});');
  await assert.rejects(f.verify({production:true}),/Outils de simulation présents/);
 });
});

test('Syntax discovery includes a new nested module and tooling, without relying on a filename registry',async t=>{
 const f=await fixture(t);
 for(const path of ['new-module/nested/fresh.js','tools/fresh.mjs','tests/fresh.test.mjs'])await f.put(path,'export {};');
 for(const path of ['docs/historical.js','downloads/old.js','dist/built.js','work/fixture.js','node_modules/vendor/index.js'])await f.put(path,'deliberately invalid (');
 const files=await collectJavaScriptFiles(f.root);
 for(const path of ['new-module/nested/fresh.js','tools/fresh.mjs','tests/fresh.test.mjs'])assert.ok(files.includes(path));
 assert.ok(files.every(path=>! /^(?:docs|downloads|dist|work|node_modules)\//.test(path)));
 assert.deepEqual(checkJavaScriptFiles(files,f.root),[]);
 await f.put('new-module/nested/fresh.js','export function broken( {');
 const errors=checkJavaScriptFiles(await collectJavaScriptFiles(f.root),f.root);
 assert.equal(errors.length,1);assert.equal(errors[0].file,'new-module/nested/fresh.js');
});

test('Release validation rejects versions that old installed PWAs cannot discover',async t=>{
 const f=await fixture(t);
 await assert.rejects(f.verify({version:'0.36'}),/trois nombres/);
});
