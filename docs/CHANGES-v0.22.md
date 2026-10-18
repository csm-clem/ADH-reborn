# v0.22 — Signalement privé, récompenses musicales et lisibilité

Livraison du 18 octobre 2026. Le périmètre du parcours reste la zone 0–4 ; les chapitres futurs ne sont pas créés dans cette livraison.

## Signaler un bug dans l’application

Dans les Paramètres, **Signaler un bug** est maintenant un bouton ouvrant un formulaire intégré : message, e-mail de réponse facultatif et aperçu de la configuration jointe. Il n’ouvre plus GitHub ni une application de messagerie.

L’envoi passe par `api/bug-report.php`, prévu pour le PHP de l’hébergement o2switch. Le destinataire fourni par le porteur du projet est fixé côté serveur et n’apparaît ni dans les fichiers JavaScript, ni dans le formulaire, ni dans les requêtes du navigateur. L’objet décodé du courriel est exactement **« DFT : bug signalé »**. Les informations de version, d’instrument, d’accordage, de thème et de taille d’écran sont jointes ; aucun historique ni aucune sauvegarde de progression ne l’est.

Le serveur valide les champs, le jeton de session, l’origine et le format. Le destinataire et l’objet ne sont pas modifiables par un visiteur. Le formulaire comprend un champ piège et une limite de trois essais par adresse réseau en quinze minutes. Les compteurs résident hors du dossier public, sans enregistrer les messages ni les adresses IP en clair.

En cas de problème de connexion ou d’envoi, le texte reste dans le formulaire pour réessayer. L’interface confirme uniquement que le serveur d’envoi a accepté le message ; elle ne prétend pas connaître sa livraison finale dans la boîte. Les requêtes du formulaire ne sont jamais mises en cache par la PWA.

**Déploiement :** déposer aussi le dossier `api/`. L’envoi exige PHP 8.1+ et la fonction d’envoi de l’hébergement. Le jeu reste utilisable sans PHP et hors ligne ; le formulaire explique alors que l’envoi est indisponible. Le serveur Node de développement refuse de servir le code PHP en texte brut.

Le test réel de réception sur o2switch reste à effectuer après le transfert FTP. Les essais effectués ici capturent les courriels localement : aucun courriel réel n’a été envoyé.

## Musique : conserver les vraies hauteurs de l’exercice

La première correction est systémique : **suppression de la remontée automatique de la récompense dans un registre aigu**. Le début de la phrase accompagnée reprend maintenant les hauteurs exactes jouées dans l’exercice. L’ensemble de la phrase et de son accompagnement garde la tonalité de cet exercice. Exemple : le motif de My Sharona appris sur E2 est récompensé depuis E2, et non depuis E4.

Les petits extraits auparavant dupliqués tirent leurs notes et durées de la même source que leur récompense. Les préécoutes préparent les sons avant de commencer le rythme. Les notes tenues ne sont plus limitées par un buffer sonore de 1,8 seconde. L’accompagnement garde ses notes lors des changements de registre.

Les références externes ont été reprises, avec corrections de plusieurs tempos, de la fin du motif d’Around the World, des durées de la cellule d’Immigrant Song et de la source du thème traditionnel Ah ! vous dirai-je, maman.

**[Audit musical détaillé, références et limites](v0.22/audit-musical.md).** Deux passages conservent une limite de relecture rythmique externe explicitée dans cet audit ; ils ne sont pas présentés comme intégralement retranscrits de nouveau. Les sept morceaux déjà suspendus restent suspendus.

## Succès et contraste

- La preuve datée des cartes obtenues se trouve sur la même ligne que **Rejouer le défi**. L’écoute, lorsqu’elle est disponible, garde sa propre ligne.
- En Inclusif-Contrasté, les coches des exercices terminés ont un fond **#fdfbf7**, une coche **#333638** et un contour contrasté.
- Le **Mode débug**, déjà livré en v0.21, est conservé et revérifié : tous les exercices et tous les succès disponibles sont simulés sans remplacer les vrais résultats. Il se trouve dans les Paramètres. Les nouvelles preuves musicales restent compatibles avec son fonctionnement.

## Installation et vérification

[Archive FTP v0.22](../downloads/daily-fretboard-trainer-v0.22.zip). Décompresser et déposer son contenu dans `adh-pwa/v0.22/`, **dossier `api/` compris**, puis ouvrir `https://media.lecompositeur.com/adh-pwa/v0.22/`.

Les progressions repartent à zéro à chaque nouvelle v0, conformément au choix du projet. Instrument et préférences restent conservés. La V1 conservera durablement les progrès.

[Résultats de validation et captures](v0.22/validation.md).
