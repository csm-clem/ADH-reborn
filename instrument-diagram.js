/** Teaching overview aligned with the neck: head/nut on the left, body on the right. */
export function instrumentDiagram(
  profile,
  { feature = "neck", activeString = null, variant = 0 } = {},
) {
  const n = profile.tuning.length,
    top = 55,
    bottom = 99,
    ys = Array.from(
      { length: n },
      (_, s) => top + ((n - 1 - s) * (bottom - top)) / (n - 1),
    );
  const f = variant % 2 ? 218 : 172;
  const highlight =
    feature === "neck"
      ? '<rect x="80" y="48" width="340" height="58" rx="4"/>'
      : feature === "string"
        ? `<path d="M42 ${ys[activeString ?? (variant % 2 ? n - 1 : 0)]} H477"/>`
        : feature === "cell"
          ? `<rect x="${f}" y="48" width="46" height="58"/>`
          : `<path d="M${feature === "nut" ? 80 : f} 48V106"/>`;
  return `<svg class="instrument-overview" viewBox="0 0 580 150" role="img" aria-label="Instrument vu comme le diagramme : sillet à gauche, corps à droite"><path class="instrument-body" d="M438 44C458 4 474 13 484 36C530 8 569 27 557 68C576 108 547 140 510 122C481 144 451 123 439 108L405 107V47Z"/><path class="instrument-head" d="M80 48L20 38L10 102L80 106Z"/><rect class="neck-board" x="80" y="48" width="340" height="58" rx="2"/>${[126, 172, 218, 264, 310, 356, 402].map((x) => `<path class="neck-fret" d="M${x} 48V106"/>`).join("")}<path class="neck-nut" d="M80 48V106" stroke-width="4"/>${ys.map((y, s) => `<path class="neck-string ${s === activeString ? "is-requested-string" : ""}" d="M42 ${y}H477" stroke-width="${0.6 + (n - 1 - s) * 0.12}"/>`).join("")}<g class="course-highlight ${["neck", "cell"].includes(feature) ? "is-area" : ""}">${highlight}</g></svg>`;
}
