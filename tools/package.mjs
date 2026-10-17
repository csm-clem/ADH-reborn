import {APP_NAME,RELEASE} from '../release.js';
import {mkdir,copyFile,cp,rm,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..'),dest=resolve(root,'dist');
await rm(dest,{recursive:true,force:true});await mkdir(dest,{recursive:true});
for(const file of ['index.html','achievement-rules.js','achievement-data.js','achievements-ui.js','achievements.css','themes.js','curriculum-rules.js','interaction.css','app.js','release.js','state.js','instrument-art.js','learning-help.js','tuning.js','onboarding.js','onboarding.css','pilot.js','pilot-ui.js','pilot.css','neck-view.js','neck.css','answer-wheel.css','discovery-feedback.js','dom-view.js','demo-rules.js','reward-music.js','position-buttons.css','refinement.css','core.js','clock.js','sound.js','octave-music.js','melodies.js','result.css','results.js','result-ui.js','ui-kit.html','ui.css','tokens.css','components.css','progress.css','progress.js','style.css','brand.css','sw.js','manifest.webmanifest'])await copyFile(resolve(root,file),resolve(dest,file));
for(const folder of ['icons','fonts','instruments','services'])await cp(resolve(root,folder),resolve(dest,folder),{recursive:true});
await writeFile(resolve(dest,'LISEZ-MOI.txt'),`${APP_NAME} — ${RELEASE}

Copiez le contenu de ce dossier par FTP dans adh-pwa/v0.19/.
Ouvrez https://media.lecompositeur.com/adh-pwa/v0.19/

Cette version de test supprime les anciennes progressions de cette application,
mais conserve l’instrument et les préférences. Une réouverture de la même version
conserve la séance. Les sauvegardes sont propres à cette version v0.

Après le premier chargement complet en HTTPS, le jeu fonctionne hors ligne.
`);
console.log('Fichiers prêts pour FTP : '+dest);
