/** Shared concentric wheel geometry for learning and Arcade. */
const NATURAL = [0, 2, 4, 5, 7, 9, 11];
export function wheelChoices(rings, { dual = false, exact = false } = {}) {
  return rings.flatMap((notes, ring) => notes.map((n, i) => {
    const order = ring ? NATURAL.indexOf(n - 1) + .5 : i;
    const angle = -Math.PI / 2 + order * 2 * Math.PI / (exact ? notes.length : 7);
    const radius = dual ? (ring ? 25 : 40) : 38;
    return { n, x: 50 + radius * Math.cos(angle), y: 50 + radius * Math.sin(angle) };
  }));
}
