import {mkdir,copyFile,cp,rm} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..'),dest=resolve(root,'dist');
await rm(dest,{recursive:true,force:true});await mkdir(dest,{recursive:true});
for(const file of ['index.html','app.js','pilot.js','pilot-ui.js','pilot.css','core.js','clock.js','sound.js','style.css','brand.css','sw.js','manifest.webmanifest'])await copyFile(resolve(root,file),resolve(dest,file));
for(const folder of ['icons','fonts'])await cp(resolve(root,folder),resolve(dest,folder),{recursive:true});
console.log('Fichiers prêts pour FTP : '+dest);
