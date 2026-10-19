import {APP_NAME,RELEASE} from '../release.js';
import {mkdir,copyFile,cp,rm,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..'),dest=resolve(root,'dist');
await rm(dest,{recursive:true,force:true});await mkdir(dest,{recursive:true});
for(const file of ['learning-evidence.js','navigation-rules.js','instrument-diagram.js','beta-catalog.js','beta-courses.js','beta-home.js','course-ui.js','beta.css','beginner-guide.js','beginner-guide.css','update.json','index.html','debug-mode.js','bug-report.js','music-audit.js','achievement-catalog.js','achievement-evidence.js','achievement-art.js','achievement-motion.js','achievement-rules.js','achievement-data.js','achievements-ui.js','achievements.css','themes.js','curriculum-rules.js','interaction.css','app.js','release.js','state.js','instrument-art.js','learning-help.js','tuning.js','onboarding.js','onboarding.css','pilot.js','pilot-ui.js','pilot.css','neck-view.js','neck.css','answer-wheel.css','discovery-feedback.js','dom-view.js','demo-rules.js','reward-music.js','position-buttons.css','refinement.css','core.js','clock.js','sound.js','octave-music.js','melodies.js','result.css','results.js','result-ui.js','ui-kit.html','ui.css','tokens.css','components.css','progress.css','progress.js','style.css','brand.css','sw.js','manifest.webmanifest'])await copyFile(resolve(root,file),resolve(dest,file));
for(const folder of ['achievement-art','icons','fonts','instruments','services','api'])await cp(resolve(root,folder),resolve(dest,folder),{recursive:true});
await writeFile(resolve(dest,'LISEZ-MOI.txt'),`${APP_NAME} — ${RELEASE}

Copiez le contenu de ce dossier par FTP dans adh-pwa/v0.27/.
Ouvrez https://media.lecompositeur.com/adh-pwa/v0.27/

Les progrès restent conservés entre versions, y compris les données v0.22/v0.23
encore présentes sur ce navigateur et cette même origine (protocole + domaine).
Ne supprimez pas les données du navigateur. Exportez une sauvegarde avant déploiement.
Pour les futures mises à jour, privilégiez une URL fixe (adh-pwa/app/) et remplacez
ses fichiers. La mise à jour est proposée, jamais imposée. Pour des dossiers v0.xx
séparés, déposez latest.json dans adh-pwa/ avec :
{"version":"0.27.0","url":"./v0.27/"}
La v0.22 ne connaissait pas ce protocole : ouvrez une première fois la nouvelle URL
manuellement. Une ancienne version ayant déjà effacé ses anciens résultats ne
permet pas de les reconstituer. Les sauvegardes v0 valides restent importables.

Le dossier api/ doit également être déposé : le formulaire de signalement utilise
PHP 8.1+ et la fonction mail() de l’hébergement. Après transfert, vérifiez depuis
le formulaire qu’un message de test arrive dans votre boîte (objet DFT : bug signalé).
Le destinataire reste défini côté serveur. Le jeu seul fonctionne sans PHP.

Après le premier chargement complet en HTTPS, le jeu fonctionne hors ligne.
`);
console.log('Fichiers prêts pour FTP : '+dest);
