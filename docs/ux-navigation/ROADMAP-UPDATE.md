# Mise à jour du tableau de bord après v0.38.8

Le lot autorisé couvre 12, 13, 17, 19, 20 et 21. Les points 08 et 18 sont rejetés ; les filtres du catalogue (09) sont annulés à la demande de Clément. Les trois branches restent présentes.

## État de la synchronisation

La lecture D1 par le connecteur Sites fonctionne (table `revisions`, aucune révision au moment de la consultation). L’accès HTTP à `/api/project` échoue dans l’environnement ; aucune écriture distante n’est revendiquée. Ne pas modifier le baseline ni republier une ancienne copie pour simuler une synchronisation.

## Comment mettre à jour manuellement

1. Ouvrir https://daily-fretboard-roadmap.quirkybison9.chatgpt.site/ avec le compte propriétaire.
2. Rechercher la carte par identifiant, puis ouvrir son édition.
3. Ajouter la note ci-dessous aux preuves/commentaires déjà présents, sans les remplacer. Enregistrer. Ne pas marquer toute une tâche V1 « validée » sur la seule base de ce lot.
4. Exporter le tableau après enregistrement pour conserver une copie datée.

### V1-13 — interface et accessibilité

Lot suivant v0.38.8 : consigne placée avant la surface tactile, explications avant lancement, repères graphiques de première utilisation, conditions visibles des boutons désactivés, aide clavier, pause/reprise par Échap, focus et navigation de Progrès au clavier. Les manches courts et longs partagent les proportions de traits/inlays et un cadrage commun ; texture miel/nuit légèrement renforcée, bois nuit plus naturel. Catalogue complet simultané, états de chapitre ＋ / ▶ / ✓, navigation mobile active sur toute la hauteur. Validation humaine sur appareils réels encore attendue.

### V1-12 — vérifications

Vérifications automatisées et captures : `tools/qa/gameplay-ux.py`, `tools/qa/navigation-ux.py`, `tools/qa/scroll-neck.py`, `tools/qa/lab-refinements.py`, tests Node et vérifications de mise à jour/hors ligne/production du workflow. Les journaux GitHub Actions du commit livré donnent le résultat définitif. Les anciennes preuves de géométrie inchangée décrivent le lot précédent, pas celui-ci.

### V1-11 — navigation des parcours

Droite = revenir à la page précédente ; gauche = aller à une page déjà visitée dans l’historique, sans lancer automatiquement une activité nouvelle. Les interactions du manche, des cartes et des zones défilables gardent la priorité. Retour et avance conservent la navigation contextualisée.

### OPS-06 — bac à sable

Publication de développement dans `/DFT/lab/` uniquement, avec essai immuable et numéro `v0.38.y` attribués par le workflow. Live v0.37 inchangé. Reporter le numéro, l’identifiant immuable et les URL exacts du résultat de déploiement ; ne pas inventer un compteur avant son attribution.

## Mise à jour par API lorsque l’accès réseau sera disponible

Lire `GET /api/project`, reprendre les révisions **actuelles**, puis utiliser `POST /api/project` pour chaque carte avec `id`, `revision`, `patch` et `note`. Les modifications concurrentes renvoient 409 et imposent une nouvelle lecture. Aucune clé ou adresse privée supplémentaire n’est nécessaire dans le navigateur propriétaire ; ne pas mettre de secret dans le frontend.
