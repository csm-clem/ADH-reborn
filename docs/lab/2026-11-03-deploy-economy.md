# Publication FTPS plus économe

Le lab courant réutilise les fichiers dont le SHA-256 correspond au manifeste du dernier transfert réussi et dont la taille distante est correcte. Le manifeste doit correspondre au build publié ; il est invalidé avant toute écriture et validé après publication de build.json. Un transfert interrompu, un manifeste absent/invalide ou un build incohérent déclenchent un transfert complet du lab. Un fichier manquant ou tronqué est renvoyé.

La copie archivée reste complète et indépendante, avec son ZIP complet. Les fichiers annonçant la mise à jour sont envoyés après les ressources. TLS, racine FTP limitée, règles de promotion live et absence de suppression restent conservés.

Les envois successifs dans le même dossier réutilisent le dossier courant. Chaque fichier conserve son écriture temporaire, contrôle de taille et renommage. Des compteurs de fichiers, octets et durée sont affichés pendant la publication.

## Vérification

- 15 tests d’environnement existants et sept tests ciblés : réutilisation, intégrité des archives, fichier absent/tronqué, manifeste invalide, interruption/reprise, vérification sans écriture, navigation de dossiers et réparation forcée.
- Simulation sur le paquet réel de 230 fichiers : 14 671 704 octets pour initialiser le lab ; après modification de app.js, un seul fichier de 29 895 octets est envoyé, 229 fichiers réutilisés. Économie de 99,8 % pour la copie du lab courant uniquement. L’archive et son ZIP restent transférés intégralement.
- Cent fichiers dans un même dossier demandent quatre commandes de navigation, au lieu de répéter la navigation pour chaque fichier.
- Le workflow initialise le transfert puis exécute `--verify-reuse` : contrôle en lecture seule des 230 ressources, avec zéro envoi de ressource attendu. La vérification HTTPS des deux copies reste effectuée ensuite.

Le premier essai initialise le manifeste et effectue donc encore un envoi complet. La mesure de simulation ne constitue pas une promesse de durée réseau. Le manifeste présume que les fichiers publiés ne sont pas édités en dehors du déployeur ; une modification extérieure de même taille se répare avec `--full`, testé explicitement. Ce mode conserve l’archive immuable et reconstruit le lab courant.
