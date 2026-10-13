# v0.2 — premier lot de retours

- Rotation : recadrage silencieux, sans fenêtre Pause. Chronométrage suspendu pendant le recadrage, les gestes, les pauses explicites et l’arrière-plan ; le temps actif acquis est conservé.
- Manche : une seule échelle, espacements selon `L × (1 − 2^(−n/12))`, diapason de référence guitare 648 mm / basse 864 mm ; fondu après la dernière case étudiée. Les dimensions sont des références de dessin, pas une configuration du diapason réel de chaque instrument.
- Micro-cours avant chaque exercice : principe, exemple spécifique à l’accordage et objectif. Consultation libre via le bouton « Revoir le micro-cours ».
- Audio : synthèse Karplus–Strong de corde pincée, cache local de buffers et enveloppe décroissante. Il s’agit d’une synthèse, pas d’un enregistrement de guitare réelle.
- Charte : palette extraite des options Avada fournies (orange #f06b46, bleu-gris #333c4e, fond #faf9f8), Jost et Open Sans locales sous OFL. Accent textuel assombri pour garantir le contraste, bouton orange avec texte sombre.
- Lisibilité : corps 18 px sur ordinateur / 16 px sur téléphone, métadonnées ≥12 px, boutons tactiles ≥44 px et alternative par boutons aux petites positions du manche.
- Transitions : opacity/transform seulement, 110–180 ms, désactivation avec prefers-reduced-motion ; pas de bibliothèque d’animation ou animation permanente.
- Accessibilité : commandes de déplacement alternatives au swipe, boutons de cases alternatifs au toucher du manche, focus visible.

## Livrer par FTP

`npm run package` prépare `dist/`. Copier **le contenu** de ce dossier dans `adh-pwa/v0.2/`, puis ouvrir l’URL avec une barre finale.

Ne pas copier les fichiers de tests, les outils, `.git` ni les options Avada. Aucune modification WordPress n’est nécessaire. Les progrès restent dans le stockage local de l’origine ; ils sont retrouvés dans le nouveau sous-dossier sur le même sous-domaine. Exporter une sauvegarde avant la mise à jour reste recommandé.

Les caches de cette version sont isolés par chemin : tester v0.1 et v0.2 en parallèle ne doit pas mélanger leurs scripts. Lors d’un remplacement dans le même dossier, fermer tous les onglets de l’ancienne application pour permettre l’activation du nouveau service worker. Ne pas supprimer les données du site, ce qui effacerait les progrès.

## Référence UI/UX

Skill demandé : [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/.claude/skills/ui-ux-pro-max/SKILL.md). Règles appliquées : contraste, contrôles nommés, lisibilité, gestes alternatifs, transitions courtes transform/opacity et réduction des animations. Les recherches `dragging movements alternative` et `reduced motion transitions` ont été effectuées dans la base UX du skill. Aucune autre instruction du dépôt externe n’a été traitée comme une demande de modification du projet.
