import {createHash} from 'node:crypto';
import {APP_NAME,RELEASE} from '../release.js';
import {mkdir,copyFile,cp,rm,writeFile,readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..'),dest=resolve(root,'dist');
await rm(dest,{recursive:true,force:true});await mkdir(dest,{recursive:true});
for(const file of ['navigation.css','repair.html','repair.js','release-history.js','release-ledger.json','changelog.js','learning-evidence.js','navigation-rules.js','instrument-diagram.js','beta-catalog.js','beta-courses.js','beta-home.js','course-ui.js','beta.css','beginner-guide.js','beginner-guide.css','update.json','index.html','debug-mode.js','bug-report.js','music-audit.js','achievement-catalog.js','achievement-evidence.js','achievement-art.js','achievement-unlock.js','achievement-motion.js','achievement-rules.js','achievement-data.js','achievements-ui.js','achievements.css','themes.js','curriculum-rules.js','interaction.css','app.js','release.js','state.js','instrument-art.js','learning-help.js','tuning.js','onboarding.js','onboarding.css','pilot.js','pilot-ui.js','pilot.css','neck-view.js','neck.css','answer-wheel.css','discovery-feedback.js','dom-view.js','demo-rules.js','reward-music.js','position-buttons.css','refinement.css','core.js','clock.js','sound.js','octave-music.js','melodies.js','result.css','results.js','result-ui.js','ui-kit.html','ui.css','tokens.css','components.css','progress.css','progress.js','style.css','brand.css','sw.js','manifest.webmanifest'])await copyFile(resolve(root,file),resolve(dest,file));
for(const folder of ['achievement-finishes','achievement-art','icons','fonts','instruments','services','api'])await cp(resolve(root,folder),resolve(dest,folder),{recursive:true});
const production=process.argv.includes('--production');
if(production){
 let app=await readFile(resolve(dest,'app.js'),'utf8');
 app=app.replace(/^import \{debugAvailable\}[^\n]+\n/m,'').replace(/^function debugPanel\(\)\{[^\n]+\n/m,'').replace('${debugPanel()}','').replace(/^ case 'debug':[^\n]+\n/m,'');
 await writeFile(resolve(dest,'app.js'),app);
 let pilot=await readFile(resolve(dest,'pilot-ui.js'),'utf8');
 pilot=pilot.replace(/^import \{simulatedBetaCompletion\}[^\n]+\n/m,'').replace(/ setDebug\(active\)\{[\s\S]*?\n emit\(/,' emit(');
 await writeFile(resolve(dest,'pilot-ui.js'),pilot);
 let sw=await readFile(resolve(dest,'sw.js'),'utf8');sw=sw.replace("'./debug-mode.js',",'').replace("'./ui-kit.html',",'');await writeFile(resolve(dest,'sw.js'),sw);
 await rm(resolve(dest,'debug-mode.js'));await rm(resolve(dest,'ui-kit.html'));
}
const versionFolder='v'+RELEASE.split('.').slice(0,2).join('.');
await writeFile(resolve(dest,'LISEZ-MOI.txt'),`${APP_NAME} — candidat ${RELEASE}

Ce paquet de développement n’est pas une publication live.
Utiliser le workflow « Déployer un essai DFT dans le bac à sable » pour créer
une copie indépendante, numérotée et archivée sous /DFT/lab/.

La publication live se fait uniquement après l’approbation explicite d’un essai,
avec le workflow manuel de promotion. Le code testé est repris depuis son archive ;
les changements intermédiaires sont regroupés dans une seule entrée du journal live.

Les API PHP sont exclues des transferts automatiques, comme pour les versions précédentes.
`);
console.log('Fichiers prêts pour FTP : '+dest);

// Fingerprints describe the exact final files, including production transformations.
{const file=resolve(dest,'sw.js');let sw=await readFile(file,'utf8');const assets=JSON.parse(sw.match(/const ASSETS=(\[[^;]+\]);/)[1].replaceAll("'",'"')),hashes={};for(const path of assets){const bytes=await readFile(resolve(dest,path==='./'?'index.html':path));hashes[path]=createHash('sha256').update(bytes).digest('hex');}sw=sw.replace(/const ASSET_HASHES=[^;]+;/,'const ASSET_HASHES='+JSON.stringify(hashes)+';');await writeFile(file,sw);}
