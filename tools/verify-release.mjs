import {fileURLToPath} from 'node:url';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {RELEASE} from '../release.js';
import {verifyRelease} from './release-validation.mjs';

const projectRoot=fileURLToPath(new URL('../',import.meta.url));
try{
 const sandbox=process.argv.includes('--sandbox'),folder=sandbox?'dist-sandbox':process.argv.includes('--dist')?'dist':'.';
 const updateVersion=sandbox?JSON.parse(await readFile(resolve(projectRoot,folder,'update.json'),'utf8')).version:RELEASE;
 const {assetCount,scriptCount}=await verifyRelease({
  root:resolve(projectRoot,folder),
  updateVersion,
  version:RELEASE,
  packagePath:resolve(projectRoot,'package.json'),
  production:process.argv.includes('--production')
 });
 console.log(`Version ${RELEASE} : ${assetCount} ressources, ${scriptCount} modules et dépendances HTML/CSS vérifiés.`);
}catch(error){console.error(error.message);process.exitCode=1;}
