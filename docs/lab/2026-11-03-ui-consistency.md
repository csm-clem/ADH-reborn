# Cinq axes de cohérence — implémentation locale

1. Composants communs : boutons et icônes, HUD configurable, structure de résultat, transition et manche réels partagés. Les deux contrôleurs utilisent les mêmes points d’entrée, sans retirer récompenses, statistiques, partage, musique ou révision.
2. Espacements : rôles sémantiques dans tokens.css ; groupes d’actions et champs communs ; HUD responsive à priorité explicite dans la cascade. Cibles des commandes de 44 px conservées. Les roues et le stimulus de nommage s’adaptent à la hauteur disponible sur petit écran.
3. Comportements : contrat de dispatch commun, son accessible, relance, pause/reprise, focus, Échap, Tab et distinction clavier/pointeur. Correction de l’absence de réponse à Échap après disparition de l’élément précédemment focalisé.
4. Galerie : component-gallery.html utilise les vrais composants et rendus des contrôleurs, avec données isolées en mémoire. Quatre thèmes, modes, états et tailles sélectionnables ; aucun stockage utilisateur modifié. Galerie et ui-kit exclus de la production et de son cache.
5. Tests : contrats unitaires, contrôles réels des deux modes, 32 références visuelles et comparateur qui détecte une régression injectée. Les deux workflows exécutent ces nouvelles recettes. La régénération des références est une commande séparée et explicite.

Vérification locale finale : syntaxe ; 270 tests Node réussis ; génération puis comparaison des 32 références réussies ; gameplay-ux et round-wheel-v039 réussis ; commandes réelles et launch-integrated réussis. Paquet source : 225 ressources, 67 modules ; production : 220 ressources, 65 modules. Les premières références sont des candidats générés et vérifiés techniquement ; la revue humaine du design et les appareils physiques restent distincts de ces contrôles.

Guide durable : docs/ui-consistency.md. Recettes : tools/qa/ui-consistency.py et tools/qa/game-controls.py. Références : tests/visual/ui-consistency/. Rapports locaux : work/ui-consistency/ et work/consistency-*.log.

Aucun push applicatif ni nouvel essai déployé pour ce lot. Les corrections locales précédentes sont conservées. L’essai publié reste v0.40.7 ; live inchangé.
