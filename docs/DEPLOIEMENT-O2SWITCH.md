# Déploiement DFT sur o2switch

Destination autorisée : https://media.lecompositeur.com/DFT/ via un compte FTP dédié dont la racine est exclusivement ce dossier. Ne jamais utiliser le compte cPanel principal.

Le workflow `deploy-dft.yml` transfère uniquement l’archive v0.35 vérifiée par SHA-256. Les secrets `DFT_FTP_HOST`, `DFT_FTP_USERNAME` et `DFT_FTP_PASSWORD` restent dans GitHub Actions. Le jeton du workflow a uniquement le droit de lire le dépôt.

## TLS

FTPS explicite sur le port 21, canal de données également chiffré. La vérification du certificat et du nom d’hôte reste obligatoire. Le serveur présentait une chaîne Let’s Encrypt YR1 incomplète. Le client récupère les deux intermédiaires publics officiels documentés sur https://letsencrypt.org/certificates/ :

- https://letsencrypt.org/certs/gen-y/int-yr1.pem
- https://letsencrypt.org/certs/gen-y/root-yr-by-x1.pem

Chaque certificat ajouté doit être vérifié par OpenSSL jusqu’à une racine déjà présente dans le magasin système. Aucune option `partial_chain`, aucun certificat serveur auto-approuvé, aucun `CERT_NONE`, aucune désactivation du contrôle du nom d’hôte. Une erreur de vérification interrompt le transfert avant la connexion du compte.

## Périmètre

Fichiers statiques seulement, `api/` et PHP exclus. Aucun effacement automatique. Chaque transfert passe par un nom temporaire, une vérification de taille puis un renommage. Ressources d’abord, accueil/manifeste de mise à jour/service worker ensuite. Le transfert est atomique par fichier, pas pour l’ensemble d’une version. Le dossier permanent existe déjà : les fichiers remplacés sont publiés sur la même URL, les autres fichiers restent en place.

Le formulaire de signalement ne pourra envoyer ses messages tant que son API PHP n’aura pas été installée et vérifiée séparément. Cela ne bloque pas les exercices.

## Déclenchement

Version autorisée : push sur la branche dédiée `deploy/dft-v0.35`. Déclenchement manuel possible depuis GitHub Actions, workflow « Déployer DFT v0.35 sur o2switch ». Un push ordinaire sur `main` ne déploie pas le site. Le workflow sérialise les déploiements et contrôle ensuite l’accueil HTTPS, la version et le journal.

Ne pas supprimer les données du navigateur pour mettre à jour l’application. Un changement de dossier sur la même origine conserve les clés de stockage, mais l’ancien raccourci installé peut encore viser l’ancienne adresse.
