# v0.33 — Fusion des finitions et corrections de collection

## Changements

- Import sélectif des cinq finitions du ZIP v0.32 et de ses trois textures SVG locales, disponibles hors ligne.
- Finitions communes aux couvertures de l’Album et aux cartes détaillées, recto et verso. Petites mentions de matière mises à jour pour correspondre au rendu.
- Album : trois cartes par ligne ; toucher ouvre la vraie carte en plein écran sur mobile. Critères, écoute et défi restent actifs ; Échap et fermeture rendent le focus à la couverture.
- Gestes horizontaux pour les reflets, défilement vertical natif. Correction de la perte de capture tactile qui annulait l’inclinaison.
- Filtres À faire (0 %, non acquis), En cours (progression positive, non acquis), Acquis et Tous.
- Navigation Parcours : reprise de la page visitée puis retour aux branches au second appui.
- Doubles coches resserrées par une variable partagée.
- Corrections musicales et remplacement par Feel Good Inc. : détails et limites dans [le rapport des corrections](TRAVAUX-COLLECTION-APRES-v031.md). La ligne complète d’Around the World et le chant d’Immigrant Song restent à vérifier ; aucune fidélité complète de ces passages n’est annoncée.

## Conservation des données

Clés de sauvegarde, preuves d’acquisition, numéros de cartes et règles pédagogiques conservés. Les anciennes cartes musicales acquises restent conservées. Les changements applicatifs régressifs issus de la base v0.29 du ZIP n’ont pas été importés.

## Vérification

32 fichiers de tests Node réussis et vérification de syntaxe passée. Gestes tactiles Chromium et vues Album à 320, 390, 844 et 1440 px. Contrôle complémentaire des cinq raretés dans les quatre thèmes à 320, 390, 768, 844 et 1440 px, des critères et des trois textures dans la livraison et le cache hors ligne. Les captures et résultats sont dans [v0.33](v0.33/verification.json).

Cette version est préparée pour transfert. La publication sur o2switch est distincte ; le flux de déploiement v0.31 n’a pas été déclenché.
