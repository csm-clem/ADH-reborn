# Phase 8 — Idées d’extensions à reprendre plus tard

Note du 16 octobre 2026 pour **Daily Fretboard Trainer**.

**Actualisation du 17 octobre :** cette liste est désormais répartie par la [roadmap V1 / V2 / V3](ROADMAP-GENERALE.md), qui fait foi pour les priorités. Les succès sont déjà implémentés en v0.19 et restent sans extension en V1. Arcade initial, Explorer des notes, comptes et synchronisation sont prévus en V2 ; les autres fonctions avancées en V3. Les paragraphes datés ci-dessous conservent leur valeur historique.

Ces idées sont conservées pour une conception ultérieure. Elles ne déclenchent aucune implémentation et ne constituent pas encore un ordre de priorité ni un périmètre validé.

## Mode Arcade

Un mode sans fin, avec **trois vies**, sur **tout le manche**. Les premières questions sont très simples, puis la difficulté augmente progressivement. Une barre représente le temps de réponse restant ; le temps accordé devient de plus en plus court.

Variantes envisagées :

- Notes naturelles et/ou notes d’une gamme choisie : préciser ultérieurement la distinction entre ces deux variantes.
- Chromatique.
- Arpèges : dyades, puis triades, puis tétrades ; d’abord dans une seule gamme, puis avec des gammes mélangées.

## Suivi des progrès et réussites

- Améliorer le suivi des progrès.
- Ajouter des **réussites à déverrouiller**.

## Mode Créatif

Créer ses propres entraînements personnalisés. Les paramètres et les possibilités de composition des exercices restent à définir.

## Mode Explorer

- Atlas des notes.
- Atlas des harmoniques : exploration des harmoniques du manche.

## Étendre le Mode Apprentissage

### Zones et combinaisons à classer par difficulté

- Cases **4 à 8**.
- Cases **7 à 11**.
- Cases **12 à 16**.
- Chaque corde, des cases **0 à 12**.
- Chaque corde, des cases **0 à 24**.
- Les **cinq duos de cordes voisines**, des cases **0 à 12**, pour une guitare six cordes.
- Les **six cordes mélangées**, des cases **0 à 12**, pour une guitare six cordes.

Le classement par difficulté reste à construire à partir des prérequis et de l’instrument. Les nombres de cordes et de duos devront suivre la configuration de l’utilisateur.

Ces nouvelles zones sont conservées telles que proposées. Leur articulation avec le découpage précédemment envisagé (**5–9 et 8–12**) reste à arbitrer ; cette note ne remplace pas silencieusement ce découpage.

### Gammes

Deux approches envisagées : **tonique choisie** ou approche **théorique sans tonique nommée**, dont le fonctionnement reste à préciser.

Parcours possibles :

- Par zone : **vertical scale**.
- Par corde : **horizontal scale**.
- En diagonale : **diagonal scale**.

### Harmoniques

- Harmoniques naturelles.
- Harmoniques artificielles, avec **position de la main gauche** précisée.

## Points à reprendre au moment de la conception

Définir les prérequis, la progression de difficulté, les règles du timer et des vies, les conditions des réussites et les paramètres du Mode Créatif. Préciser également la portée de « tout le manche » selon le nombre réel de cases de l’instrument.

Le classement pédagogique et la priorité de réalisation restent ouverts. Le modèle commercial retenu depuis cette note est un essai gratuit de sept jours donnant accès à tout, puis un accès payant global ; aucun découpage gratuit/payant par mode n’est prévu. Voir [la décision commerciale](MODELE-COMMERCIAL.md).

## Compte et synchronisation entre appareils

Ajout du 17 octobre 2026 : prévoir un système de connexion permettant de retrouver sa progression lorsqu’on change de téléphone, de navigateur ou d’ordinateur.

À concevoir en phase 8 : création et récupération du compte, sauvegarde et restauration côté serveur, synchronisation des tentatives par instrument/accordage/exercice, gestion des conflits après des séances hors ligne et suppression/export des données. Le jeu doit rester utilisable hors connexion, puis se synchroniser au retour du réseau. L’identification et les droits d’accès payants devront être articulés sans confondre connexion et validation pédagogique.

Cette note réserve le sujet pour la phase 8 ; aucun système de compte ni serveur de synchronisation n’est implémenté dans le pilote actuel.

## Collection des succès — précisions v0.18

Voir [la roadmap des succès](ROADMAP-SUCCES.md) : albums Repères, Fluidité et Musiques, critères explicites, pochettes de phrases musicales rejouables et notifications non bloquantes. La connexion prévue en phase 8 devra conserver la collection entre appareils, sans doubler une pochette lors d’un changement de notation ou de transposition. Les preuves de réussite restent attachées à l’instrument et à la zone. La chaîne sans erreur et sa récompense audio automatique sont déjà présentes ; la page de collection et les déblocages persistants restent à implémenter.
