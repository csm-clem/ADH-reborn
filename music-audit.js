/** Fail closed: compatibility with a neck does not establish musical accuracy.
 * Pending passages are retained for correction but never assigned or played as rewards.
 * Current findings and limitations: docs/CHANGES-v0.27.md; earlier audit: docs/v0.20/audit-musical.md.
 */
export const MUSIC_ARRANGEMENT_VERSION=7;
const checked=Object.freeze(['immigrant-song','feel-good-inc','cantaloupe-island','higher-ground','my-sharona','singing-rain','christmas-song','around-world','smoke-water','iron-man','seven-nation','come-as-you-are','billie-jean','bites-dust','bride','entertainer','rainbow','trek']);
export const MUSIC_AUDIT=Object.freeze({
 checked,
 pending:Object.freeze({
  'made-for-loving':'La transcription consultée est simplifiée ; fin de la phrase et rythme à corroborer.',
  superstition:'Les hauteurs sont documentées, mais le rythme synthétisé simplifiait les syncopes du clavinet.',
  'get-lucky':'Le rythme simplifié et les attaques de fin de mesure ne concordent pas assez avec la partition.',
  'blue-monday-orgy':'Les octaves étaient regroupées au lieu d’alterner ; vérifier la version et le rythme contre une partition rythmique.',
  'sweet-dreams':'Rythme déduit d’une tablature non rythmique, qui se présente elle-même comme incertaine.',
  'bad-guy':'La boucle synthétisée était plus courte que le passage publié ; la fin de phrase reste à transcrire.',
  'thunderstruck':'Réservé au futur travail par corde entière, hors de la zone 0–4.'
 })
});
export const musicChecked=id=>checked.includes(id);
