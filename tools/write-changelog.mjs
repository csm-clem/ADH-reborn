import {RELEASE_HISTORY,CHANGE_TYPES} from '../changelog.js';
import {writeFile} from 'node:fs/promises';
const legend=Object.values(CHANGE_TYPES).map(([icon,label])=>`${icon} ${label}`).join(' · ');
const body=RELEASE_HISTORY.map(e=>`## v${e.version} — ${e.title}\n\n${e.items.map(([type,text])=>`- ${CHANGE_TYPES[type][0]} ${text}`).join('\n')}`).join('\n\n');
await writeFile(new URL('../docs/JOURNAL-DFT.md',import.meta.url),`# Daily Fretboard Trainer — Journal des modifications\n\n${legend}\n\nLes entrées décrivent chaque version à sa livraison. Historique rédigé depuis les rapports du dépôt ; aucune date non corroborée n’est ajoutée.\n\n${body}\n`);
