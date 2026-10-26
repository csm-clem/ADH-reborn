import {readFile,stat} from 'node:fs/promises';
import {resolve,relative,sep,isAbsolute,extname} from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {runInNewContext} from 'node:vm';
import {checkJavaScriptFiles} from './check-syntax.mjs';

/** Verify source or the actual package, including transformed production modules. */
export async function verifyRelease({root,version,packagePath=resolve(root,'package.json'),production=false}){
 if(!/^\d+\.\d+\.\d+$/.test(version||''))throw Error('Format de version invalide : trois nombres sont requis pour les mises à jour.');
 root=resolve(root);
 const read=file=>readFile(resolve(root,file),'utf8');
 const display=file=>relative(root,file).split(sep).join('/');
 const sw=await read('sw.js'),release=await read('release.js'),update=JSON.parse(await read('update.json'));
 if(JSON.parse(await readFile(packagePath,'utf8')).version!==version)throw Error('Version package.json incohérente.');
 if(release.match(/\bexport\s+const\s+RELEASE\s*=\s*['"]([^'"]+)['"]/)?.[1]!==version||sw.match(/\bconst\s+WORKER_RELEASE\s*=\s*['"]([^'"]+)['"]/)?.[1]!==version||update.version!==version)throw Error('Versions incohérentes : livraison interrompue.');
 const literal=sw.match(/\bconst\s+ASSETS\s*=\s*(\[[\s\S]*?\]);/)?.[1];
 if(!literal)throw Error('Liste de précache ASSETS introuvable.');
 // Evaluate only the checked-in array expression, never the worker or browser modules.
 const assets=runInNewContext(literal,Object.create(null),{timeout:100});
 if(!Array.isArray(assets)||!assets.length||assets.some(a=>typeof a!=='string'))throw Error('ASSETS doit contenir des chemins de ressources.');
 if(new Set(assets).size!==assets.length)throw Error('Ressource répétée dans ASSETS.');
 function target(owner,reference){
  if(/^(?:data:|blob:|#)/i.test(reference))return null;
  let url;
  try{url=new URL(reference,new URL(owner,pathToFileURL(root+sep)));}catch{throw Error(`URL invalide depuis ${owner} : ${reference}`);}
  if(url.protocol!=='file:')throw Error(`Ressource distante non disponible hors ligne depuis ${owner} : ${reference}`);
  if(url.pathname.endsWith('/'))url.pathname+='index.html';
  const file=fileURLToPath(url),path=relative(root,file);
  if(path==='..'||path.startsWith('..'+sep)||isAbsolute(path))throw Error(`Ressource hors du paquet depuis ${owner} : ${reference}`);
  return file;
 }
 const cached=new Set();
 for(const asset of assets){
  const file=target('sw.js',asset);
  if(!file)throw Error(`Ressource de précache invalide : ${asset}`);
  cached.add(file);
  try{if(!(await stat(file)).isFile())throw Error();}catch{throw Error(`Ressource absente du paquet : ${asset}`);}
 }
 async function requireCached(owner,reference){
  const file=target(owner,reference);
  if(!file)return;
  try{if(!(await stat(file)).isFile())throw Error();}catch{throw Error(`Ressource introuvable depuis ${owner} : ${reference}`);}
  if(!cached.has(file))throw Error(`Ressource absente du précache depuis ${owner} : ${reference}`);
 }
 const scripts=[...cached].filter(file=>/\.(?:js|mjs|cjs)$/.test(file)).map(display);
 const errors=checkJavaScriptFiles(scripts,root);
 if(errors.length)throw Error(`JavaScript invalide dans le paquet : ${errors.map(e=>`${e.file}\n${e.message}`).join('\n')}`);
 for(const file of cached){
  const extension=extname(file),owner=display(file);
  if(!['.js','.mjs','.cjs','.css','.html','.webmanifest'].includes(extension))continue;
  const source=await readFile(file,'utf8');
  if(['.js','.mjs','.cjs'].includes(extension)){
   // Literal module references used by this app, including import('...').
   for(const [, ,path]of source.matchAll(/\b(?:from\s*|import\s*(?:\(\s*)?)(['"])((?:\.{1,2}\/|\/|https?:\/\/)[^'"]+)\1/g))await requireCached(owner,path);
  }else if(extension==='.css'){
   for(const [,quoted,bare]of source.matchAll(/url\(\s*(?:['"]([^'"]+)['"]|([^\s)]+))\s*\)/g))await requireCached(owner,quoted||bare);
   for(const [, ,path]of source.matchAll(/@import\s+(['"])([^'"]+)\1/g))await requireCached(owner,path);
  }else if(extension==='.html'){
   const attribute=(tag,name)=>tag.match(new RegExp(`\\b${name}\\s*=\\s*['"]([^'"]+)['"]`,'i'))?.[1];
   for(const [tag,name]of source.matchAll(/<(script|link|img|source)\b[^>]*>/gi)){
    const reference=attribute(tag,name.toLowerCase()==='link'?'href':'src');
    if(!reference)continue;
    if(name.toLowerCase()==='link'&&!/\b(?:stylesheet|manifest|icon|apple-touch-icon|preload|modulepreload)\b/i.test(attribute(tag,'rel')||''))continue;
    await requireCached(owner,reference);
   }
  }else{
   const manifest=JSON.parse(source);
   for(const icon of manifest.icons||[])await requireCached(owner,icon.src);
   if(manifest.start_url)await requireCached(owner,manifest.start_url);
  }
 }
 if(production){
  for(const file of ['debug-mode.js','ui-kit.html']){
   try{await stat(resolve(root,file));}catch(error){if(error.code==='ENOENT')continue;throw error;}
   throw Error(`Outil interne livré en production : ${file}`);
  }
  for(const file of ['app.js','pilot-ui.js','sw.js'])if(/debug-mode\.js|simulatedBetaCompletion|data-action="debug"/.test(await read(file)))throw Error(`Outils de simulation présents en production : ${file}`);
 }
 return {assetCount:assets.length,scriptCount:scripts.length};
}
