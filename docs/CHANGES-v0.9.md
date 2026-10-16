# Daily Fretboard Trainer — v0.9

## Images de l’onboarding

Les six images WebP du ZIP fourni remplacent les dessins vectoriels des instruments. Elles sont conservées sans modification, chargées localement et incluses dans le mode hors ligne ainsi que dans le ZIP FTP. Leur affichage respecte leurs proportions.

## Réponses vertes et démonstration

Le nom seul ne suffit plus pour colorer plusieurs positions en vert : **E2 et E4 sont des hauteurs différentes**. Après une question de dénomination, seules les positions de même hauteur présentes dans le groupe de l’exercice sont vertes. Pour une recherche sur le manche, les contraintes de hauteur, de corde et de cases autorisées continuent à déterminer tous les emplacements valides. Un unisson admissible peut donc avoir plusieurs emplacements verts ; une autre octave ne convient pas.

Dans l’exploration des cordes à vide, la hauteur qui vient d’être jouée est verte ; les autres départs déjà explorés restent des repères distincts, sans devenir des réponses correctes à cette hauteur.

« Voir la démonstration » fonctionne avant le premier essai. Le bouton ouvre un exemple graphique avec la note, son registre et sa position, et fait entendre l’exemple si le son est actif. Un second appui masque la démonstration. Elle ne marque aucune corde comme explorée, ne valide pas l’activité et ne modifie aucun score. Pour essayer sans les noms, il faut toujours explorer soi-même les départs.

## Première rencontre d’un format

Une introduction courte, illustrée et persistée par configuration, précède la première rencontre de chaque format :

- exploration des cordes à vide et préambule d’accordage altéré ;
- découverte d’un repère et transfert entre cordes de même nom ;
- position → nom, avec exemple de roue ;
- nom et hauteur → emplacement ;
- bilans sans son cible ni indice avant réponse ;
- suite mélodique et comparaison du même motif sur plusieurs cordes ;
- recherche de toutes les occurrences d’un nom dans les familles du diagnostic.

L’exemple est une explication, sans réponse notée. Son temps ne compte pas dans la vitesse de réponse. Les introductions déjà parcourues ne se réaffichent pas à chaque question ou à chaque reprise de la même activité. Un écran interrompu peut être repris. Les contrôles de démarrage restent visibles sur les petits écrans ; le texte dispose de son propre défilement si nécessaire.

## Première écoute d’un intervalle

Chaque nouvel intervalle a une micro-leçon présentant sa sensation sonore, deux hauteurs réelles de l’accordage, un diagramme et une écoute successive. Les mots « ouvert », « resserré », « tendu », « ample » ou les couleurs mineure/majeure servent de repères d’écoute dépendant du contexte, sans imposer une émotion universelle.

Le cas des six demi-tons distingue correctement le nom de **quarte augmentée** de celui de **quinte diminuée** ; leur description sonore commune est celle du triton. Les termes de registre et de demi-ton sont brièvement expliqués.

## Résultats

La phrase « Une correction ne change pas le premier résultat. Ces repères ont été travaillés aujourd’hui ; ils restent à confirmer plus tard. » est retirée de la carte de résultats. Les premières réponses restent conservées dans les calculs.

Les actions secondaires « Refaire cette activité », « Retour au parcours » et, selon le contexte, « Voir mes progrès » sont des boutons plus petits à fond gris clair et bordure discrète. Le bouton principal reste identifiable.

## Accès libre et modèle commercial

Toutes les activités compatibles déjà développées sont accessibles dès le début. Réussir une activité n’est plus nécessaire pour ouvrir la suivante. Le seuil de 90 % reste un objectif et sert aux recommandations : après un résultat insuffisant, refaire est proposé en priorité, mais la suite reste accessible. L’ordre du parcours guide sans verrouiller.

Le changement d’instrument ou d’accordage est possible depuis les paramètres même après avoir joué. Les résultats et les introductions déjà parcourues restent associés à leur configuration.

Le nouveau modèle commercial est **sept jours d’essai gratuit, complet et illimité, puis accès payant global**. Il remplace les zones gratuites et les achats séparés de configurations. Voir [la décision commerciale](MODELE-COMMERCIAL.md).

**Le prototype n’active ni paiement ni expiration à sept jours.** Prix, type d’achat, début effectif de l’essai et gestion des droits restent à définir et intégrer avant la commercialisation. Les copies d’interface annonçant une zone ou un premier instrument gratuit ont été retirées.

## Vérifications

- **44 tests unitaires** : musique, accordages, ressources, images WebP, instructions, hauteurs exactes, démonstration sans validation et libre accès.
- Chromium : onze activités standard terminées avec leurs introductions, reprises, résultats et motifs.
- Six instruments sur huit formats d’onboarding ; images locales, ordre des cordes, réglages, écoute et enregistrement des configurations.
- Manche, roue, pause et commandes vérifiés sur les formats portrait/paysage ; introductions vérifiées jusqu’à 240 × 320, avec action principale visible.
- Vérification des corrections E2/E4, des unissons admissibles, des démonstrations et des boutons secondaires neutres.
- Vérification des variantes d’accordage, du diagnostic complet, de l’audio, de l’import/export et du redémarrage hors ligne.

Les essais techniques ne remplacent pas les retours sur un téléphone réel. Les limites du contenu pilote restent présentes : carte naturelle complète à poursuivre, tonique altérée limitée aux cordes à vide, extensions et ateliers d’altérations à venir. L’ouverture des accès ne crée pas ces contenus manquants.

## Aperçus

[Images fournies dans l’onboarding](v0.9/onboarding.png) · [Première écoute d’une quinte](v0.9/intervalle.png) · [Résultats](v0.9/resultats.png).

## Dépôt FTP

Télécharger [daily-fretboard-trainer-v0.9.zip](../downloads/daily-fretboard-trainer-v0.9.zip), le décompresser et copier **son contenu** dans `adh-pwa/v0.9/` sur le serveur.

Adresse de test après ce dépôt : **https://media.lecompositeur.com/adh-pwa/v0.9/**.

Aucun fichier n’a été envoyé automatiquement au serveur o2switch. Comme pour les autres versions v0, l’ancienne progression est supprimée au premier chargement de cette nouvelle version ; la configuration favorite et les préférences sont conservées.
