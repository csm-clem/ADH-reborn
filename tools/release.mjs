import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';
import {RELEASE} from '../release.js';
const root=resolve(import.meta.dirname,'..'),production=process.argv.includes('--production');
function run(cmd,args){const r=spawnSync(cmd,args,{cwd:root,stdio:'inherit'});if(r.status!==0)throw Error(`${cmd} interrompu (${r.status}).`);}
const pkg=JSON.parse(await readFile(resolve(root,'package.json')));pkg.version=RELEASE;await writeFile(resolve(root,'package.json'),JSON.stringify(pkg,null,2)+'\n');
const sw=await readFile(resolve(root,'sw.js'),'utf8');await writeFile(resolve(root,'sw.js'),sw.replace(/const WORKER_RELEASE='[^']+'/,`const WORKER_RELEASE='${RELEASE}'`));
await writeFile(resolve(root,'update.json'),JSON.stringify({version:RELEASE,url:'./'})+'\n');
run('npm',['run','check']);run('npm',['test']);run('node',['tools/write-changelog.mjs']);run('node',['tools/verify-release.mjs']);run('node',['tools/package.mjs',...(production?['--production']:[])]);run('node',['tools/verify-release.mjs','--dist',...(production?['--production']:[])]);
await mkdir(resolve(root,'downloads'),{recursive:true});
const suffix=production?'-production':'',name=`daily-fretboard-trainer-v${RELEASE.split('.').slice(0,2).join('.')}${suffix}.zip`;
run('python3',['-c',`from pathlib import Path\nimport zipfile,hashlib,json\np=Path('downloads')/'${name}'\nwith zipfile.ZipFile(p,'w',zipfile.ZIP_DEFLATED) as z:\n for f in sorted(Path('dist').rglob('*')):\n  if f.is_file():z.write(f,f.relative_to('dist'))\nwith zipfile.ZipFile(p) as z:\n assert z.testzip() is None\nmeta={'version':'${RELEASE}','production':${production?'True':'False'},'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'bytes':p.stat().st_size}\np.with_suffix('.json').write_text(json.dumps(meta,indent=2))\nprint(p)`]);
