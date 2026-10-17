# Collection des succès — proposition et roadmap

**Priorité actualisée au 17 octobre 2026 :** la [roadmap générale V1 / V2 / V3](ROADMAP-GENERALE.md) prévaut. Stabiliser les succès existants en V1, les évaluer avec les utilisateurs après V1, raccorder leur synchronisation aux comptes en V2. Les enrichissements de collection sont réservés à V3.

## Collectionneur ou accomplisseur ?

**Les deux motivations se recoupent.** « Collectionneur » décrit ici le plaisir de réunir une série cohérente et de combler ses cases manquantes. « Accomplisseur » décrit plutôt le plaisir d’atteindre un objectif, de relever un défi et de constater sa compétence. Une même personne peut vouloir collectionner les phrases musicales sans rechercher un record de vitesse, ou rechercher la fluidité sans vouloir tout collectionner.

Dans le modèle historique de [Bartle](https://mud.co.uk/richard/hcds.htm), les Achievers s’intéressent aux objectifs et aux accomplissements du jeu ; il n’existe pas de catégorie « Collectionneur » distincte dans ses quatre profils. Ce modèle vient des MUDs : il éclaire une décision de design, il ne classe pas scientifiquement chaque guitariste.

Le [modèle Hexad](https://hcigames.com/user-types-hexad/) distingue notamment la maîtrise chez l’Achiever et l’intérêt pour les récompenses chez le Player. Cela ne permet pas d’assimiler automatiquement collection et récompense extrinsèque : écouter sa collection peut aussi avoir une valeur musicale propre. Pour ce produit, ce sont des **motivations à servir**, pas des étiquettes à imposer à l’utilisateur. Les travaux de [Ryan, Rigby et Przybylski](https://selfdeterminationtheory.org/SDT/documents/2006_RyanRigbyPrzybylski_MandE.pdf) donnent une raison supplémentaire de soutenir la compétence ressentie et le choix de l’activité. Ces résultats ne prouvent pas qu’un badge, à lui seul, améliore l’apprentissage.

## Solution recommandée : un album de pochettes, avec un mode liste

Une page **Succès** propose trois collections : **Repères**, **Fluidité**, **Musiques**. L’onglet Musiques contient des pochettes de phrases, pas une grille anonyme d’icônes identiques. Les deux autres collections gardent le même composant de carte, avec une illustration de repère ou de défi.

- En haut : un compteur de collection précis, par exemple « 3 phrases sur 8 ». Ce chiffre décrit l’album, pas la maîtrise du manche. Les trois collections ont leurs propres compteurs.
- Filtres persistants : **Tous / Obtenus / À découvrir**. Tri recommandé par parcours ; tri par déblocage disponible. Sur petit écran, deux colonnes ; mode liste avec grandes cibles pour les libellés longs et l’accessibilité.
- Chaque carte affiche le titre, un statut avec symbole, un critère court et une progression vérifiable. Une carte manquante reste lisible, pas noyée sous un flou ; aucune rareté artificielle ni condition secrète nécessaire à l’apprentissage.
- Une pochette obtenue propose **Écouter** et **Rejouer le défi**. L’écoute comporte un bouton d’arrêt, respecte Muet et les préférences de son. La fiche détaille la phrase exacte, le compositeur, l’arrangement, l’instrument utilisé et la date de réussite.
- Une carte non obtenue propose **Essayer** vers l’activité pertinente. Le parcours pédagogique et ses exercices restent accessibles : les succès ne réintroduisent pas des verrous d’apprentissage.
- Une petite section « Vos prochaines pochettes » montre au plus trois objectifs proches. Elle évite de transformer une collection incomplète en longue liste d’échecs.

[Voir la maquette de principe](v0.18/collection-succes.svg). Elle illustre la disposition, pas des succès réellement obtenus par un utilisateur.

### Pour la collection et pour l’accomplissement

| Motivation | Réponse de l’interface |
|---|---|
| Réunir une série | Pochettes ordonnées, emplacements stables, total clair, filtre des éléments manquants |
| Constater sa compétence | Critère exact, trace de la tentative, distinction entre réussite unique et confirmation ultérieure |
| Choisir son défi | Accès direct aux activités, aucun ordre de déblocage imposé |
| Profiter de ce qui a été gagné | Réécoute des phrases et favoris, plutôt qu’un badge qui ne sert plus après son apparition |
| Découvrir de la musique | Titre, auteur, contexte du passage et indication honnête des adaptations |

Le catalogue doit conserver une version. Ajouter de nouvelles pochettes ne retire jamais une réussite acquise ; le total de la collection peut augmenter, avec une mention « 2 nouvelles phrases » plutôt qu’un pourcentage silencieusement dégradé.

## Célébrer sans interrompre le jeu

Pour une phrase réussie d’un seul trait, l’écoute complète avec accompagnement est déjà la récompense sensorielle principale. **Ne pas superposer une fanfare à la musique.** Le futur message « Nouvelle phrase dans votre collection » apparaît sur la fiche de résultat, après la dernière note jouée par l’élève. Il peut rester visible pendant l’écoute, sans masquer les commandes.

Pour un petit succès : un toast bref, non bloquant, avec icône, titre et accès « Voir ». Plusieurs succès simultanés sont regroupés dans une seule notification, puis détaillés sur la fiche de résultat. Pour un jalon important : une célébration discrète en fin de séance, que l’on peut ignorer. Son optionnel, animation réduite si l’appareil le demande, annonce vocale non répétitive pour lecteur d’écran et fermeture au clavier.

Le texte fourni sert de matière de conception, **pas d’instruction exécutable**. J’en retiens la persistance, la hiérarchie et le respect du rythme. Je ne reprends pas les pourcentages de rareté inventés, les flashs d’écran ni la promesse simpliste d’un effet « dopamine ». Les critères seront transparents et déterministes ; pas de succès aléatoires, d’obligation de connexion quotidienne ni de perte d’acquis après une absence.

## Roadmap d’implémentation

| Étape | Travail | Livrable | Critère de passage |
|---|---|---|---|
| **S1 — Catalogue et preuves** | Définir 8 à 12 succès utiles, leurs critères et leur portée ; distinguer nommer, retrouver et jouer une chaîne musicale | Catalogue versionné avec exemples de preuves | Chaque succès correspond à une action vérifiable, sans confondre séance faite et apprentissage démontré |
| **S2 — Moteur déterministe** | Règles pures évaluées à la fin d’une tentative ou d’une chaîne ; identifiants stables et prévention des doublons | `achievement-rules` et évaluateur testable | Deux évaluations de la même preuve ne créent pas deux succès ; changer de notation ne change pas l’obtention |
| **S3 — Persistance et reprise** | Stocker les obtentions par portée, conserver les preuves nécessaires et gérer les migrations du catalogue | Dépôt de succès utilisant le service de stockage existant | Rechargement, import/export et reprise ne perdent ni ne dupliquent les obtentions ; les données d’un autre instrument ne prouvent pas un acquis sur le profil courant |
| **S4 — Album de musiques** | Transformer une chaîne sans erreur en pochette obtenue ; réécoute complète et fiche source/arrangement | Collection Musiques avec lecture/arrêt et lien vers le défi | Une erreur remet bien la chaîne à zéro ; seule une chaîne terminée déclenche l’obtention ; aucune œuvre n’est présentée comme un morceau intégral si seule une phrase est jouée |
| **S5 — Page Succès** | Cartes, mode liste, filtres, détails, compteurs par collection et objectifs proches | Parcours complet « réussir → voir le succès → réécouter → rejouer » | L’utilisateur comprend ce qu’il a gagné et comment obtenir le suivant en quelques secondes, y compris sans distinguer les couleurs |
| **S6 — Célébration et accessibilité** | Notifications regroupées, animations légères, sons respectant Muet, clavier et lecteur d’écran | Composant de notification partagé | Pas de notification par-dessus une question active ou de son couvrant la phrase musicale ; commandes toujours accessibles |
| **S7 — Validation pédagogique** | Observer débutants et joueurs cherchant à compléter l’album ; vérifier compréhension et charge mentale | Retour de test et ajustements des critères | Les succès aident à choisir une pratique utile ; ils ne poussent pas principalement à répéter les tâches les plus faciles |
| **S8 — Compte et synchronisation** | Raccorder la persistance au compte prévu en phase 8 ; fusionner par identifiants et conserver la première date d’obtention | Collection conservée d’un appareil à l’autre | Aucun doublon lors d’une fusion ; les preuves gardent leur instrument et leur zone |

Ces étapes ne nécessitent pas un Singleton pour chaque succès. **Catalogue immuable + évaluateur pur + dépôt partagé** suffisent. Le service de stockage et le moteur audio existants sont réutilisés.

### Catalogue initial suggéré

- **Mes premières cordes** : terminer les deux activités d’accordage à au moins 90 % de premières réponses correctes, sur un profil donné. Ce n’est pas une déclaration de maîtrise durable.
- **La famille E** : réussir les activités E seules et le mélange associé, dans les deux sens. Le nom s’adapte à la famille et à la notation.
- **Mes notes naturelles** : réussir le mélange final des familles naturelles dans les deux sens, avec assez de positions échantillonnées. Indiquer ce qui a effectivement été vérifié.
- **Une phrase d’un trait** : réussir la chaîne entière d’un extrait sans erreur depuis son dernier redémarrage. Les erreurs des tentatives précédentes n’interdisent pas la réussite suivante.
- **Ma première pochette** : première phrase musicale obtenue ; une entrée d’album par phrase, pas une copie par transposition.
- **Plus fluide, ici** : battre son propre temps moyen à précision au moins égale, sur le même exercice et le même profil, sans aide. Aucun classement entre instruments différents.
- **Repères confirmés**, plus tard : réussir des vérifications espacées sur des jours différents, lorsque la révision différée sera réellement implémentée.

### Données minimales

Chaque définition a un `id`, une version de règle, une catégorie, un titre, un critère affichable et une portée. Une obtention mémorise l’identifiant, la date, le profil/zone si le critère l’exige et les identifiants de preuve. Une phrase musicale a en plus son identifiant de passage, sa source, l’étendue jouée et la version d’arrangement.

Les pochettes sont globales par passage pour ne pas multiplier artificiellement les objets à collectionner ; leurs preuves restent rattachées au profil réel. Un changement de langue, de notation, de dièses/bémols ou de timbre ne crée jamais une nouvelle pochette.

## État dans la v0.18

La chaîne qui repart après une erreur et la lecture automatique de la phrase accompagnée sont implémentées. La tentative conserve `motifCompleted` et `melodyId` pour préparer une preuve future. **La page Succès, ses badges et ses déblocages persistants ne sont pas encore implémentés** : ils suivent la présente roadmap. Les exports v0 restent propres à chaque version, comme convenu ; la conservation durable est prévue pour la v1.

## État v0.19

S1 à S6 sont implémentées : catalogue, évaluateur, preuves persistantes, pochettes écoutables, page Succès et notification groupée accessible. Voir [le rapport de livraison](CHANGES-v0.19.md). S7 reste la validation auprès de vrais joueurs ; S8 reste rattachée au compte et à la synchronisation de la phase 8. Les favoris sont une extension ultérieure.
