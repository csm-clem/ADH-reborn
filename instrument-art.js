/** Original image files supplied by the project owner; no remote image dependency. */
export const INSTRUMENT_IMAGES={guitar6:'guitar6strings.webp',guitar7:'guitar7strings.webp',guitar8:'guitar8strings.webp',bass4:'bass4strings.webp',bass5:'bass5strings.webp',bass6:'bass6strings.webp'};
export function instrumentPicture(instrument){
 const file=INSTRUMENT_IMAGES[instrument.id];if(!file)throw new Error('Illustration d’instrument inconnue.');
 return `<img class="setup-instrument-picture" src="./instruments/${file}" alt="${instrument.name} ${instrument.strings} cordes" decoding="async" fetchpriority="high">`;
}
