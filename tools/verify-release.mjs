import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {RELEASE} from '../release.js';
import {verifyRelease} from './release-validation.mjs';

const projectRoot=fileURLToPath(new URL('../',import.meta.url));
try{
 const {assetCount,scriptCount}=await verifyRelease({
  root:resolve(projectRoot,process.argv.includes('--dist')?'dist':'.'),
  version:RELEASE,
  packagePath:resolve(projectRoot,'package.json'),
  production:process.argv.includes('--production')
 });
 console.log(`Version ${RELEASE} : ${assetCount} ressources, ${scriptCount} modules et dépendances HTML/CSS vérifiés.`);
}catch(error){console.error(error.message);process.exitCode=1;}
