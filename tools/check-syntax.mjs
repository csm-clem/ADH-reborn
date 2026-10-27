import {readdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {resolve,relative,sep} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const projectRoot=fileURLToPath(new URL('../',import.meta.url));
const excluded=new Set(['.git','node_modules','dist','dist-sandbox','work','downloads','docs']);

/** Include new modules, services, tests and tools without a manual file list. */
export async function collectJavaScriptFiles(root=projectRoot){
 const files=[];
 async function visit(directory){
  for(const entry of await readdir(directory,{withFileTypes:true})){
   const path=resolve(directory,entry.name);
   if(entry.isDirectory()&&!excluded.has(entry.name))await visit(path);
   else if(entry.isFile()&&/\.(?:js|mjs|cjs)$/.test(entry.name))files.push(relative(root,path).split(sep).join('/'));
  }
 }
 await visit(root);
 return files.sort();
}

/** Parse only: browser modules are never executed by the checker. */
export function checkJavaScriptFiles(files,root=projectRoot){
 const errors=[];
 for(const file of files){
  const result=spawnSync(process.execPath,['--check',resolve(root,file)],{encoding:'utf8',timeout:30000});
  if(result.status!==0)errors.push({file,message:result.error?.message||result.stderr||`Vérification interrompue (${result.signal||result.status}).`});
 }
 return errors;
}

if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url){
 try{
  const files=await collectJavaScriptFiles(),errors=checkJavaScriptFiles(files);
  if(errors.length){for(const error of errors)console.error(`${error.file}\n${error.message}`);process.exitCode=1;}
  else console.log(`Syntaxe vérifiée : ${files.length} fichiers JavaScript, sans exécuter les modules.`);
 }catch(error){console.error(error.message);process.exitCode=1;}
}
