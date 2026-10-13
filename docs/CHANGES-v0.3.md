# v0.3 — ergonomie et apprentissage

- Son : bouton explicite en haut à droite de l’exercice, état muet visible et mémorisé. Couper le son arrête également la note déjà en cours, sans changer de question ni remettre le chrono à zéro.
- Questions : placées sous le manche dans les deux orientations. Retours centrés et réponses en cercle, avec des boutons de 48 px minimum.
- Recherche de position : repères orangés et consigne de toucher directement le manche ; boutons de cases disponibles en alternative.
- Première leçon : comparaison vectorielle du manche réel et du diagramme, adaptée au nombre de cordes choisi. Identification de la grosse corde et définitions brèves de « à vide », « case » et « sillet ».
- Progression : les noms des cordes et l’accordage sont introduits à la deuxième corde apprise. Explications distinctes selon chaque exercice ; suppression de l’étiquette « MICRO-COURS · 30 SECONDES ».
- Résultats : nombre de bonnes réponses dominant, bande graphique des réponses, étoiles discrètes et un seul prochain objectif. Les seuils existants restent cohérents : 90 % signifie 11/12 et non 10/12.
- Couleurs : fond crème, bleu ardoise et accents orange inspirés de la capture fournie. Polices Jost et Open Sans locales conservées.

## Mise en ligne par FileZilla

Décompresser `downloads/adh-pwa-v0.3.zip`, puis copier **son contenu** dans `adh-pwa/v0.3/` sur le même sous-domaine. Ouvrir :

https://media.lecompositeur.com/adh-pwa/v0.3/

Le ZIP contient uniquement l’application statique, ses polices et icônes. Les anciennes versions peuvent rester disponibles. Les progrès sont conservés par origine dans le navigateur : utiliser le même sous-domaine et le même navigateur. Exporter une sauvegarde avant la mise à jour est recommandé.

Pour remplacer une version dans son dossier existant, fermer tous ses onglets puis rouvrir l’application afin d’activer le nouveau service worker. Ne pas effacer les données du site.

## Vérification

Syntaxe JavaScript et tests des règles musicales, progression, micro-leçons, seuils et cache PWA. Tests Chromium : séance complète, déblocage, notation, thème, pause, rotation, reprise, utilisation hors ligne, bouton muet, placement des questions, cibles circulaires sur écrans de 320/375/844 px et toucher du manche avec alternative par boutons.

Ces vérifications automatisées ne remplacent pas un essai sur votre téléphone et votre hébergement.
