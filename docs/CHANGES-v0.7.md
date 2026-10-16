# v0.7 — Choix d’accordage et éditeur sonore

## Configuration initiale

L’accueil comporte désormais deux étapes : choisir l’instrument et les noms de notes, puis choisir son accordage. Les champs de saisie manuelle des notes et octaves sont remplacés par une bibliothèque et un éditeur visuel.

**32 préréglages** sont répartis entre les six configurations d’instrument :

| Instrument | Accordages proposés |
| --- | --- |
| Guitare 6 cordes | Standard Mi, Drop D, Mi♭ standard, Ré standard, Drop C, DADGAD, Open G, Open D |
| Guitare 7 cordes | Standard Si, Drop A, La standard, Drop G, Drop B |
| Guitare 8 cordes | Standard Fa♯, Drop E, Fa standard, Mi standard, Drop D |
| Basse 4 cordes | Standard Mi, Drop D, Mi♭ standard, Ré standard, BEAD |
| Basse 5 cordes | Standard Si, Drop A, Si♭ standard, La standard, ténor Mi–La–Ré–Sol–Do |
| Basse 6 cordes | Standard Si–Mi–La–Ré–Sol–Do, Drop A, Si♭ standard, La standard |

Les hauteurs et registres sont explicites. Le Drop B sept cordes est **B1–F♯2–B2–E3–A3–C♯4–F♯4**, conformément à l’accordage utilisé dans le projet. Les presets Mi♭/Si♭ conservent leurs noms en bémols dans l’éditeur.

## Accordage personnalisé

Choisir **« Personnalisé… »** ouvre une vue consacrée au réglage, initialisée depuis le préréglage sélectionné.

- Représentation visuelle du manche et de ses cordes, adaptée au nombre de cordes ; corde 1 en haut.
- Une flèche vers le grave et une vers l’aigu sur chaque corde. Un appui déplace la note d’exactement un demi-ton et joue le nouveau son.
- Le bouton portant le nom de la note permet de la réécouter.
- Une paire de flèches transpose **toutes les cordes** d’un demi-ton et fait entendre l’accordage obtenu. Les intervalles entre les cordes restent identiques.
- Écoute de l’accordage entier et bouton muet. Couper le son annule aussi les notes déjà programmées.
- Les chiffres indiquent les octaves ; les noms suivent le choix CDE ou Do–Ré–Mi.
- Le bouton « Accordages » revient à la bibliothèque sans perdre le réglage. Les brouillons restent distincts entre instruments pendant la configuration.
- Un réglage à la limite de la plage de notes est refusé en entier et sa flèche est désactivée. La transposition générale ne bloque pas certaines cordes en modifiant seulement les autres.

L’accordage est enregistré seulement au moment de « C’est parti ». La correction du choix initial depuis les paramètres reprend les notes déjà configurées, tant qu’aucun exercice n’a été terminé.

## Une hauteur d’écran, sans scroll

L’onboarding est contenu dans la hauteur visible du navigateur. Les choix et l’éditeur occupent des vues successives, sans long formulaire à faire défiler.

Quand toutes les cordes ne tiennent pas avec des cibles tactiles de **44 px**, elles sont réparties sur plusieurs vues, parcourues avec les flèches « cordes précédentes/suivantes ». Les réglages déjà faits sont conservés. Le nombre de cordes par vue s’ajuste à la hauteur et à l’orientation.

Sur les fenêtres portrait exceptionnellement courtes, une seule corde est affichée à la fois ; la dernière vue contient les deux flèches de transposition générale. Les commandes restent accessibles sans scroll ni réduction des boutons sous 44 px.

## Aperçus

[Choix de l’instrument](onboarding-v0.7/instrument.png) · [Bibliothèque d’accordages](onboarding-v0.7/accordages.png) · [Éditeur sonore](onboarding-v0.7/editeur.png) · [Huit cordes en portrait](onboarding-v0.7/huit-cordes-portrait.png) · [Huit cordes en paysage](onboarding-v0.7/huit-cordes-paysage.png).

## Compatibilité avec le pilote

Le choix d’un accordage ne change pas les limites pédagogiques actuelles. Le pilote naturel ne prend pas encore en charge une tonique altérée. Pour ces configurations, l’onboarding annonce que seules les cordes à vide sont disponibles ; la page du parcours conserve son explication. Aucun accordage n’est modifié en silence pour contourner cette limite.

L’historique, les sauvegardes et le parcours v0.6 restent compatibles. La v0.7 n’ajoute ni paiement, ni nouveau chapitre pédagogique, ni microphone.

## Vérifications

- **35 tests unitaires**, dont huit sur la bibliothèque, les hauteurs, la transposition, les limites, les bémols et la couverture des cordes par la pagination.
- Chromium : les six instruments, les deux étapes et toutes les vues de l’éditeur sur **huit tailles**, de 240 × 320 à 1280 × 720, dont 568 × 320 en paysage. Contrôle de l’absence de défilement, des boutons accessibles et de leur hauteur minimale.
- Audio : source Web Audio active et non silencieuse après réglage, écoute de la transposition générale, annulation des sons par le mode muet.
- Conservation des notes en changeant de vue, notation ou instrument ; enregistrement exact des hauteurs et octaves ; correction du choix initial.
- Recette du jeu : séances, import/export, progression antérieure et redémarrage hors ligne.

Les essais techniques ne remplacent pas l’écoute sur un vrai téléphone pour juger le timbre.

## Tester et déposer avec FileZilla

1. Exporter les progrès de la version actuellement utilisée.
2. Télécharger [adh-pwa-v0.7.zip](../downloads/adh-pwa-v0.7.zip) et le décompresser.
3. Copier **son contenu** dans `adh-pwa/v0.7/` sur `media.lecompositeur.com`.
4. Ouvrir **https://media.lecompositeur.com/adh-pwa/v0.7/**.

**Si ton instrument est déjà configuré, ouvre cette adresse dans une fenêtre privée pour tester l’onboarding sans toucher à tes progrès.** Il reste possible de corriger le choix depuis les paramètres avant le premier exercice terminé. Ne pas effacer les données du site pour voir l’accueil.

Cette livraison ne dépose aucun fichier sur le serveur o2switch.
