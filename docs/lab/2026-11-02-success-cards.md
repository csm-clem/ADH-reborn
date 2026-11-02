# Cartes Succès — fonds de collection et illustrations raster

Les cinq fonds WebP fournis sont utilisés sans recompression ni retouche : Tranche terracotta, Argent guilloché, Cristal glacier, Nacre boréale et Laque volcanique. Les 59 artworks approuvés remplacent les dessins simplifiés. Leurs versions d’affichage WebP sont limitées à 1024 px de large ; les PNG originaux restent conservés dans la collection graphique.

La carte reste un composant HTML : titre, rareté et étoiles, coche de réussite, progression chiffrée, boutons Essayer/Rejouer, Écouter, Critères, date et numéro restent actifs et accessibles. Les critères au verso restent une liste à puces. Les notes MIDI animées conservent exactement les hauteurs et durées du moteur audio.

Les reflets réagissent à la souris et au glissement tactile sur toute la carte. Le relâchement remet à plat ; le défilement vertical reste natif. L’intensité dépend de la rareté. Les cartes non acquises sont désaturées, à l’exception de leur action principale. Le thème accessible masque les reflets et renforce la lisibilité des informations. La réduction des animations est respectée.

## Vérifications

- Fonds : cinq fichiers WebP 1024 × 1536, conservés octet pour octet ; total 643 974 octets.
- Illustrations : 59 fichiers, environ 11,6 Mo ; provenance et empreintes dans `card-assets-manifest.json`.
- Cache hors ligne : les 64 images et les nouveaux modules sont déclarés au service worker et intégrés au paquet.
- Recette Chromium : largeurs 320, 390, 844 et 1440 px ; cinq raretés, chargement des images, commandes dans la carte, absence de débordement horizontal.
- Contrôles réels : progression/critères, retour, écoute/arrêt, inclinaison souris/remise à plat, glissement tactile horizontal, défilement vertical et Album mobile.
- Scripts reproductibles : `tools/qa/card-skins.py`, `card-skins-touch.py`, `card-skins-offline.py` ; tests d’intégrité et de fidélité des événements musicaux dans `tests/card-skins.test.mjs`.

Les tests tactiles sont émulés dans Chromium ; une validation sur téléphone physique, notamment Safari iOS, reste à faire. Aucun seuil de succès ni donnée d’apprentissage n’est modifié. Aucun déploiement live n’est autorisé par ce lot.

Revue complémentaire des quatre thèmes : correction des commandes de cartes obsidiennes dans le thème accessible (panneau clair, texte sombre, contraste mesuré ≥ 7:1), hauteur minimale augmentée pour conserver le numéro et les commandes à l’intérieur du cadre. Recette reproductible : `tools/qa/card-skins-themes.py`.
