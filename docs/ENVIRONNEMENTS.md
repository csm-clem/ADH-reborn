# Bac à sable, essais et live

Décision de Clément — 27 octobre 2026. Le développement est expérimental ; aucun essai ne devient une publication live sans validation explicite d’un essai précis.

| Adresse | Rôle |
|---|---|
| `https://media.lecompositeur.com/DFT/` | Live, conservé tant qu’aucune promotion n’est autorisée. |
| `https://media.lecompositeur.com/DFT/lab/` | Copie complète courante pour expérimenter, avec tous les parcours implémentés. |
| `https://media.lecompositeur.com/DFT/lab/builds/<identifiant>/` | Copie immuable d’un essai précis ; consulter une ancienne itération sans modifier le live. |

Les copies sont disponibles via leurs URL, avec `noindex,nofollow` pour le bac à sable. L’accès FTP existant reste limité à DFT : aucune permission plus large n’est nécessaire.

## Développer un essai

1. Modifier le code et ajouter les changements dans `pending-changes.json`, chacun avec un identifiant inédit et un type : `feature`, `improvement`, `bug`, `event`.
2. Vérifier les tests. Pousser le commit testé sur `sandbox/dft`, qui déclenche uniquement le déploiement sandbox. Une mise à jour de `main` est indépendante et n’est pas nécessaire pour tester ou promouvoir un essai.
3. Le workflow génère un identifiant comme `b000001-0123456789ab`, prépare l’archive déterministe et sa SHA-256, puis vérifie les données, le journal, les filtres et le fonctionnement hors ligne dans Chromium.
4. Il publie l’essai sous `lab/builds/<identifiant>/` puis la copie courante sous `lab/`. Aucun fichier à la racine du live n’est écrit. Le manifeste live est comparé avant et après le transfert.
5. Le workflow vérifie en HTTPS les deux copies et le live inchangé. Les archives sont aussi conservées comme artefacts GitHub Actions et sont téléchargeables via `lab/builds/<identifiant>/application.zip`.

Dans les Paramètres du bac à sable, **Historique des essais** ouvre la liste des copies conservées.

Les releases sont nommées **v0.x** et les essais qui préparent la suivante **v0.x.y**. Exemple : live v0.45, essais v0.46.1 à v0.46.10, puis publication v0.46. Le compteur y avance à chaque nouvel essai et repart à 1 pour la release suivante. Le numéro global du workflow et l’identifiant technique de l’archive ne déterminent pas ce compteur. Une relance du même build conserve sa version.

Le mécanisme PWA conserve trois nombres pour la comparaison et les caches : une release affichée v0.46 utilise 0.46.0 ; un essai v0.46.10 utilise 0.46.10. Ces canaux restent séparés. La migration du premier essai au format interne 0.0.1 est prise en charge sans modifier son archive ; la liste lui attribue le libellé v0.38.1. Recharger une ancienne copie archivée permet de l’examiner ; sa progression partage volontairement le compartiment sandbox. Pour une comparaison avec des données anciennes, utiliser les sauvegardes exportées ou un profil de navigateur distinct.

## Isoler les données et les mises à jour

- Le live utilise `fretboard-trainer:settings` et `fretboard-trainer:pilot:stable`.
- Le bac à sable utilise `fretboard-trainer:sandbox:settings` et `fretboard-trainer:sandbox:pilot:stable`.
- Le bac à sable ne migre jamais les anciennes clés du live ni `adh-reborn:state:v1`. Un import manuel reste possible, après la confirmation déjà prévue dans l’application.
- Les caches des workers sont distincts par environnement et par portée d’URL. Les manifestes d’installation nomment explicitement le bac à sable.
- Le sandbox ne recherche pas de manifeste de mise à jour parent et refuse un manifeste live. Le live refuse un manifeste sandbox.
- Les API PHP restent exclues des transferts automatiques. Lors de l’ajout futur des comptes, du paiement et du stockage serveur, leurs environnements et données de test devront également être séparés avant activation dans le bac à sable.

## Publier un essai approuvé

L’assistant attend une instruction explicite désignant l’essai à publier. Il ne déclenche pas de promotion à la suite d’un simple « continue ».

Le workflow **Publier un essai DFT en live** est manuel uniquement : il reçoit l’identifiant, le numéro final à deux composantes (par exemple `0.38`), le titre et la chaîne `PUBLIER <identifiant>`. Cette chaîne est un garde-fou d’exécution ; lorsque Clément a déjà autorisé la publication de cet essai, elle ne justifie pas de lui redemander son autorisation.

La promotion :

1. Télécharge l’archive immuable de l’essai et vérifie sa SHA-256.
2. Vérifie que le registre live n’a pas changé depuis la préparation de l’essai. Un candidat devenu obsolète est refusé plutôt que d’écraser une publication plus récente.
3. Reprend le **code de cette archive**, sans reconstruire depuis le code courant. Les seules transformations portent sur la configuration d’environnement, les identifiants de version et de cache, le manifeste, le registre et le journal de publication.
4. Regroupe tous les changements en attente capturés dans cet essai dans **une seule entrée** du journal live. Les versions intermédiaires ne sont jamais ajoutées au journal public.
5. Transfère via le compte FTPS restreint, sans suppression, puis vérifie en HTTPS la version, le registre et le reçu de promotion.

Le reçu publié est `promotion-receipt.json`. Le registre `release-ledger.json` conserve les identifiants de changements déjà publiés. Les prochains builds les filtrent automatiquement : aucun doublon de publication. Après une promotion réussie, synchroniser ce registre dans le dépôt, retirer les identifiants publiés de `pending-changes.json` et préparer le prochain numéro candidat. Cela ne nécessite aucune permission GitHub en écriture dans les workflows.

## Journal des modifications

`release-history.js` contient uniquement les versions live et est alimenté depuis le registre. `pending-changes.json` décrit le travail non publié. Le sandbox affiche le même historique public, avec la mention de son environnement ; les changements en cours sont capturés dans `candidate.json` pour sa future promotion.

Dans l’application : bouton **Filtrer les changements**, types Nouveautés / Améliorations / Corrections / Événements, retour à Tout, et commandes **Tout déplier / Tout replier**. Le repli conserve les éléments natifs `<details>`, utilisables au clavier.

## Limites de déploiement

Le serveur propose un transfert atomique par fichier, pas un remplacement atomique de toute l’application. Les ressources passent avant l’accueil et le worker ; l’activation de la mise à jour reste soumise au choix du joueur. L’essai immuable est conservé pour comparaison et préparation d’une reprise. Aucun retour arrière de live n’est déclenché automatiquement.

## Vocabulaire

- **Commit** : enregistrement d’un ensemble de modifications du code.
- **Branche** : ligne de travail dans Git (`main`, `sandbox/dft`, etc.).
- **Merge** : fusion des changements de deux branches.
- **Build** : application construite depuis un commit précis ; un essai du lab est un build de préversion.
- **Release** : version officiellement publiée après validation d’un essai.
- **Déploiement** : transfert d’un build vers le bac à sable ou vers le live.

La convention choisie distingue les releases et leurs itérations de préparation. Elle ne correspond pas au sens strict de Semantic Versioning, où le troisième nombre désigne une correction publiée.
