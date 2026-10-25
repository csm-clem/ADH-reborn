import {readFile,access} from 'node:fs/promises';
import {resolve} from 'node:path';
import {RELEASE} from '../release.js';
const root=resolve(import.meta.dirname,'..',process.argv.includes('--dist')?'dist':'.');
const read=f=>readFile(resolve(root,f),'utf8');
if(JSON.parse(await readFile(resolve(import.meta.dirname,'../package.json'),'utf8')).version!==RELEASE)throw Error('Version package.json incohérente.');
const sw=await read('sw.js'),release=await read('release.js'),manifest=JSON.parse(await read('update.json'));
if(!release.includes(`RELEASE='${RELEASE}'`)||!sw.includes(`WORKER_RELEASE='${RELEASE}'`)||manifest.version!==RELEASE)throw Error('Versions incohérentes : livraison interrompue.');
const assets=[...sw.match(/const ASSETS=\[(.*?)\];/s)[1].matchAll(/'([^']+)'/g)].map(m=>m[1]);
for(const asset of assets)await access(resolve(root,asset==='./'?'index.html':asset));
for(const file of assets.filter(a=>a.endsWith('.js'))){const source=await read(file);for(const [,path]of source.matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g)){const target=resolve(root,file,'..',path);await access(target);if(path.endsWith('.js')&&!assets.some(a=>resolve(root,a)===target))throw Error('Import absent du cache : '+path);}}
if(process.argv.includes('--production')){for(const file of ['app.js','pilot-ui.js','sw.js'])if(/debug-mode\.js|simulatedBetaCompletion|data-action="debug"/.test(await read(file)))throw Error('Outils de simulation présents en production.');try{await access(resolve(root,'debug-mode.js'));throw Error('Module débug livré.');}catch(e){if(e.code!=='ENOENT')throw e;}}
console.log(`Version ${RELEASE} : ${assets.length} ressources et imports vérifiés.`);
