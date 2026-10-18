import { noteName, pitchLabel } from "./core.js";
import { isNatural, positionKey } from "./pilot.js";

const NATURALS = [0, 2, 4, 5, 7, 9, 11];
const at = (profile, string, fret) => ({
  string,
  fret,
  midi: profile.tuning[string] + fret,
});
const choice = (answer, choices) => ({ kind: "choice", answer, choices });
const option = (value, label) => ({ value, label });

/** Visual, short courses. No course interaction is a timed practice answer. */
export function betaCourses(profile, catalog, notation = "international") {
  const reentrant = profile.tuning.some(
    (m, i) => i > 0 && m < profile.tuning[i - 1],
  );
  const n = profile.tuning.length,
    p = at(profile, 0, 0),
    pressed = at(profile, 0, 2),
    courses = new Map();
  const add = (id, title, goal, pages, scopeId = "z1") =>
    courses.set(id, { id, title, goal, pages, scopeId });
  const features = [
    ["neck", "manche", "Voici le manche."],
    ["string", "corde", "Une corde : une ligne sur le dessin."],
    ["fret", "frette", "Une frette : la barre métallique."],
    ["cell", "case", "Une case : l’espace entre deux frettes."],
    ["nut", "sillet", "Le sillet : la barre verticale épaisse au départ."],
  ];
  const elementPages = features.flatMap(([feature, label, text], i) => [
    {
      id: "element-" + feature,
      title:
        (["corde", "frette", "case"].includes(label) ? "La " : "Le ") + label,
      text,
      visual: "feature",
      feature,
      photo: i === 0,
    },
    {
      id: "check-" + feature,
      title: "Quel élément est en couleur ?",
      text: "Touchez son nom.",
      visual: "feature",
      feature,
      quiz: choice(
        feature,
        features.map(([value, label]) => option(value, label)),
      ),
    },
  ]);
  elementPages.push(
    {
      id: "open",
      title: "À vide : sans appuyer",
      text: "La corde est libre. Le zéro signifie « à vide ».",
      visual: "open-comparison",
      points: [p, pressed],
    },
    {
      id: "open-check",
      title: "Quelle corde est jouée à vide ?",
      text: "Choisissez le bon dessin.",
      visual: "open-choice",
      points: [pressed, p],
      quiz: choice("right", [
        option("left", "À gauche"),
        option("right", "À droite"),
      ]),
    },
    {
      id: "pressed-check",
      title: "Où le doigt appuie-t-il ?",
      text: "Trouvez la note appuyée.",
      visual: "open-choice",
      points: [p, pressed],
      quiz: choice("right", [
        option("left", "À gauche"),
        option("right", "À droite"),
      ]),
    },
  );
  add(
    "gd-01",
    "Votre instrument",
    "Reconnaître le manche, les cordes, les cases, les frettes et le sillet.",
    elementPages,
  );
  const coordinates = [
    at(profile, 0, 0),
    at(profile, n - 1, 2),
    at(profile, Math.min(1, n - 1), 3),
  ];
  add(
    "gd-02",
    "Le diagramme du manche",
    "Lire une corde et une case ; distinguer les repères fixes des notes.",
    [
      {
        id: "link",
        title: "Votre manche, en dessin",
        text: "Une ligne = une corde. La corde 1 reste en haut.",
        visual: "neck",
        photo: true,
        points: [at(profile, n - 1, 0)],
        showNames: false,
      },
      ...(reentrant
        ? [
            {
              id: "reentrant",
              title: "Les numéros suivent les cordes",
              text: "Cet accordage ne va pas toujours du grave vers l’aigu. Gardez les numéros : la corde 1 reste en haut.",
              visual: "neck",
              points: [],
              showNames: false,
            },
          ]
        : []),
      {
        id: "address",
        title: "Une corde + une case = une place",
        text: `Exemple : corde ${n}, case 2.`,
        visual: "neck",
        points: [pressed],
        showNames: false,
      },
      ...coordinates.map((target, i) => ({
        id: "coordinate-" + i,
        title: `Corde ${n - target.string} · ${target.fret ? "case " + target.fret : "à vide"}`,
        text: "Touchez cette place sur le dessin.",
        visual: "neck",
        points: [],
        quiz: { kind: "position", target },
      })),
      {
        id: "markers",
        title: "Un repère n’est pas une note",
        text: "Le repère fixe aide à compter. La pastille est posée sur une corde.",
        visual: "markers",
        points: [pressed],
      },
      {
        id: "markers-check",
        title: "Quel point indique la note ?",
        text: "Le petit repère reste fixe entre les cordes.",
        visual: "markers",
        points: [pressed],
        quiz: choice("note", [
          option("inlay", "Le repère fixe"),
          option("note", "La pastille sur la corde"),
        ]),
      },
      {
        id: "higher",
        title: "Vers les grandes cases : plus aigu",
        text: "Suivez la même corde vers la droite.",
        visual: "direction",
        points: [at(profile, 0, 1), at(profile, 0, 4)],
      },
      {
        id: "higher-check",
        title: "Sur cette corde, vers où est-ce plus aigu ?",
        text: "Regardez les numéros des cases.",
        visual: "neck",
        points: [at(profile, 1, 2)],
        showNames: false,
        quiz: choice("right", [
          option("left", "← Vers le sillet"),
          option("right", "Vers les grandes cases →"),
        ]),
      },
    ],
  );
  const altered = profile.tuning.find((m) => !isNatural(m));
  add(
    "gd-03",
    "Les noms des notes",
    "Reconnaître votre notation et votre accordage.",
    [
      {
        id: "names",
        title: "Sept notes, deux écritures",
        text: "Do et C : deux noms pour la même note.",
        visual: "notation",
      },
      ...NATURALS.map((pc, i) => ({
        id: "name-" + pc,
        title: "Quel nom manque ?",
        text: "Complétez la ronde des sept notes.",
        visual: "note-cycle",
        missing: pc,
        quiz: choice(
          String(pc),
          NATURALS.map((value) =>
            option(String(value), noteName(value, notation)),
          ),
        ),
      })),
      {
        id: "tuning",
        title: "Voici votre accordage",
        text: "Du bas vers le haut : vos cordes réelles. Écoutez si vous le souhaitez.",
        visual: "tuning",
        listen: profile.tuning,
      },
      ...(altered === undefined
        ? []
        : [
            {
              id: "accidental",
              title: "Ce signe fait partie de votre accordage",
              text: `${noteName(altered, notation)} se lit « ${noteName(
                altered,
                {
                  system: "latin",
                  accidentals:
                    typeof notation === "object"
                      ? notation.accidentals
                      : "sharp",
                },
              )
                .replace("♯", " dièse")
                .replace("♭", " bémol")} ».`,
              visual: "tuning",
              highlight: altered % 12,
            },
            {
              id: "accidental-check",
              title: "Quel est le nom complet de cette corde ?",
              text: "Le signe fait partie du nom.",
              visual: "single-note",
              points: [{ midi: altered }],
              quiz: choice("full", [
                option("plain", noteName(altered - 1, notation)),
                option("full", noteName(altered, notation)),
              ]),
            },
          ]),
    ],
  );
  const all = catalog.byScope.get("z1").plan.natural;
  const anchor = all.find((p) => p.fret === 0) || all[0];
  const otherPitch = [1, 2].map((d) => anchor.midi + d).find(isNatural);
  const octave = [anchor, at(profile, anchor.string, anchor.fret + 12)];
  let pair;
  for (const a of all) {
    const b = all.find((b) => b.string !== a.string && b.midi === a.midi);
    if (b) {
      pair = [a, b];
      break;
    }
  }
  add(
    "gd-04",
    "Nom, hauteur et octave",
    "Distinguer le nom, le chiffre d’octave et la position.",
    [
      {
        id: "octave",
        title: "Un nom, plusieurs hauteurs",
        text: `${pitchLabel(anchor.midi, notation)} et ${pitchLabel(anchor.midi + 12, notation)} : même nom, une octave plus haut.`,
        visual: "pitch-cards",
        points: octave,
        listen: octave.map((p) => p.midi),
      },
      {
        id: "same-name",
        title: "Quelles notes ont le même nom ?",
        text: "Regardez les lettres, puis les chiffres.",
        visual: "pitch-cards",
        points: [...octave, { midi: otherPitch }],
        quiz: choice("pair", [
          option(
            "pair",
            `${pitchLabel(anchor.midi, notation)} et ${pitchLabel(anchor.midi + 12, notation)}`,
          ),
          option(
            "other",
            `${pitchLabel(anchor.midi, notation)} et ${pitchLabel(otherPitch, notation)}`,
          ),
        ]),
      },
      {
        id: "higher-pitch",
        title: "Quelle note est la plus aiguë ?",
        text: "Le chiffre repère l’octave.",
        visual: "pitch-cards",
        points: octave,
        quiz: choice("higher", [
          option("lower", pitchLabel(anchor.midi, notation)),
          option("higher", pitchLabel(anchor.midi + 12, notation)),
        ]),
      },
      ...(pair
        ? [
            {
              id: "same-height",
              title: "Une hauteur, deux places",
              text: `Ces deux positions donnent ${pitchLabel(pair[0].midi, notation)}. La consigne précise la corde.`,
              visual: "neck",
              points: pair,
              showNames: true,
            },
            {
              id: "same-height-check",
              title: `Retrouvez ${pitchLabel(pair[1].midi, notation)} · corde ${n - pair[1].string}`,
              text: "Cette fois, choisissez bien la corde demandée.",
              visual: "neck",
              points: [],
              quiz: { kind: "position", target: pair[1] },
            },
          ]
        : []),
    ],
  );
  for (const scope of catalog.scopes) {
    if (scope.id !== "z1") {
      const target = at(profile, scope.strings?.[0] ?? 0, scope.zone.start),
        isString = scope.kind === "string";
      const pages = isString
        ? [
            {
              id: "string",
              title: `Voici la corde ${n - target.string}`,
              text: `À vide : ${pitchLabel(target.midi, notation)}. Nous gardons son numéro sur l’instrument.${reentrant ? " Cet accordage ne suit pas toujours l’ordre des hauteurs." : ""}`,
              visual: "neck",
              points: [target],
              showNames: true,
              zone: { start: 0, end: 4 },
              strings: profile.tuning.map((_, s) => s),
            },
            {
              id: "line",
              title: "Une seule corde, jusqu’à la case 12",
              text: "Le manche reste continu. À l’horizontale, les cases sont plus faciles à toucher.",
              visual: "neck",
              points: [target, at(profile, target.string, 12)],
              showNames: true,
            },
            ...[0, 6, 12].map((fret) => ({
              id: "address-" + fret,
              title: `Corde ${n - target.string} · ${fret ? "case " + fret : "à vide"}`,
              text: "Touchez sa place. Les boutons restent disponibles.",
              visual: "neck",
              points: [],
              quiz: {
                kind: "position",
                target: at(profile, target.string, fret),
              },
            })),
          ]
        : [
            {
              id: "boundary",
              title: `Votre nouvelle zone : ${scope.zone.start} à ${scope.zone.end}`,
              text: `La case ${scope.zone.start} reste la même place dans les deux dessins.`,
              visual: "boundary",
              points: [target],
            },
            {
              id: "start",
              title: "Où commence cette zone ?",
              text: "La première case affichée n’est pas une corde à vide.",
              visual: "neck",
              points: [],
              quiz: choice(String(scope.zone.start), [
                option("0", "À vide"),
                option(String(scope.zone.start), "Case " + scope.zone.start),
              ]),
            },
            ...[target, at(profile, n - 1, scope.zone.end)].map(
              (target, i) => ({
                id: "address-" + i,
                title: `Corde ${n - target.string} · case ${target.fret}`,
                text: "Retrouvez ce croisement.",
                visual: "neck",
                points: [],
                quiz: { kind: "position", target },
              }),
            ),
          ];
      add(
        scope.id + "-entry",
        isString ? scope.title + " : vos repères" : "Votre nouvelle zone",
        "Lire les coordonnées du nouveau périmètre.",
        pages,
        scope.id,
      );
    }
    for (const alteredOnly of [false, true]) {
      if (alteredOnly && !(scope.zone.end === 12 && scope.plan.altered.length))
        continue;
      const pairs = [];
      if (!alteredOnly)
        for (const pc of scope.plan.order.filter(isNatural)) {
          const family = scope.plan.natural
            .filter((p) => p.midi % 12 === pc)
            .sort((a, b) => a.midi - b.midi || a.string - b.string);
          for (let i = 1; i < family.length; i++)
            pairs.push([family[i - 1], family[i]]);
        }
      if (scope.zone.end === 12)
        for (const string of scope.plan.strings) {
          if (isNatural(profile.tuning[string]) === alteredOnly) continue;
          pairs.push([at(profile, string, 0), at(profile, string, 12)]);
        }
      const unique = [
        ...new Map(
          pairs.map((pair) => [pair.map(positionKey).join("~"), pair]),
        ).values(),
      ];
      const id = scope.id + (alteredOnly ? "-altered-octaves" : "-co");
      const explained = new Set();
      const pages = unique.flatMap((pair, i) => {
        const steps = Math.abs(pair[1].midi - pair[0].midi) / 12,
          key = "oct-" + steps,
          answer =
            steps === 0
              ? "Même hauteur"
              : steps === 1
                ? "Une octave"
                : steps + " octaves";
        const choices = [
          option("oct-0", "Même hauteur"),
          option("oct-1", "Une octave"),
          option(
            steps > 1 ? key : "oct-2",
            steps > 1 ? answer : "Deux octaves",
          ),
        ];
        const visual = pair.some((p) => p.fret < scope.zone.start)
          ? "octave-ends"
          : "neck";
        const teach = !explained.has(steps);
        explained.add(steps);
        return [
          ...(teach
            ? [
                {
                  id: "relation-" + i,
                  title: `Les ${noteName(pair[0].midi, notation)} se retrouvent ici`,
                  text:
                    steps === 0
                      ? "Même nom et même chiffre : exactement la même hauteur."
                      : `Même nom, ${steps === 1 ? "une octave" : steps + " octaves"} d’écart. Regardez les chiffres.`,
                  visual,
                  points: pair,
                  showNames: true,
                  listen: pair.map((p) => p.midi),
                },
              ]
            : []),
          {
            id: "check-" + i,
            title: `Comparez ces deux ${noteName(pair[0].midi, notation)}`,
            text: "Même hauteur ou autre octave ?",
            visual,
            points: pair,
            showNames: true,
            quiz: choice(key, choices),
          },
        ];
      });
      if (!pages.length)
        pages.push({
          id: "one-place",
          title: "Une place par nom dans ce cadre",
          text: "Ici, aucune paire naturelle à comparer. Vos repères restent disponibles dans les mélanges.",
          visual: "neck",
          points: scope.plan.natural.slice(0, 1),
          showNames: true,
        });
      add(
        id,
        alteredOnly
          ? "Vos cordes à la douzième case"
          : "Un même nom, plusieurs places",
        "Relier les noms, les hauteurs et les octaves réellement présents.",
        pages,
        scope.id,
      );
    }
  }
  return courses;
}

export function courseCompleted(course, record) {
  return (
    course.pages
      .filter((p) => p.quiz)
      .every((p) => (record?.correct || []).includes(p.id)) &&
    course.pages
      .filter((p) => !p.quiz)
      .every((p) => (record?.visited || []).includes(p.id))
  );
}
