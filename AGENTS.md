# Description du Projet : FlashAndQuizz

Ce projet, nommé "FlashAndQuizz", est une application web développée avec Vue.js et Vite. Il semble être conçu comme une plateforme interactive pour l'apprentissage et l'évaluation des connaissances à travers des flashcards (cartes mémoire) et des quiz.

## Fonctionnalités Clés (Déduites) :

- **Jeu de Flashcards :** Permet aux utilisateurs d'interagir avec des cartes mémoire pour la mémorisation et l'apprentissage. (Suggéré par `FlashcardGame.vue`, `FlashcardResult.vue`, `flashcards.json`)
- **Quiz Interactif :** Fournit une interface de quiz pour tester les connaissances, afficher des questions et présenter les résultats. (Suggéré par `QuizQuestion.vue`, `QuizResult.vue`, `quiz.json`, `quiz.ts`)
- **Interface à base de Composants :** Utilise les composants Vue.js pour une interface utilisateur modulaire et réactive.
- **Contenu piloté par les données :** Les flashcards et les questions de quiz sont chargées à partir de fichiers JSON, ce qui simplifie la gestion du contenu.

## Technologies Utilisées (Déduites) :

- **Vue.js :** Le framework JavaScript progressif pour la construction d'interfaces utilisateur.
- **Vite :** Un outil de build rapide qui offre une expérience de développement extrêmement rapide pour les projets web modernes.
- **TypeScript :** (Indiqué par les fichiers `.ts` et `tsconfig.json`) Pour la sécurité des types et une meilleure maintenabilité du code.
- **CSS :** Pour le style de l'application.

## Structure du Projet :

- `src/components/` : Contient les composants Vue réutilisables comme `FlashcardGame`, `FlashcardResult`, `QuizQuestion`, et `QuizResult`.
- `src/data/` : Stocke les données de l'application, spécifiquement `flashcards.json` et `quiz.json`.
- `src/types/` : Définit les types TypeScript, comme `quiz.ts`.
- `main.ts` : Le point d'entrée de l'application Vue.
- `App.vue` : Le composant racine de l'application.

Ce projet vise à offrir aux utilisateurs un moyen engageant d'apprendre et d'auto-évaluer leur compréhension sur divers sujets.

---

## Directives de Développement

### Commentaires de Code

Le code doit être commenté de manière concise sur les parties peu claires ou complexes pour faciliter la compréhension et la maintenance.

## Directive de Journalisation des Sessions AI

**OBLIGATOIRE :** À chaque interaction, l'assistant IA doit documenter automatiquement la session dans le fichier `AI-sessions.md` à la racine du projet.

### Format de journalisation :

```markdown
## Session du [DATE] à [HEURE]

### Demande utilisateur

> [Prompt de l'utilisateur]

### Questions de clarification (si applicable)

- **Q :** [Question posée par l'IA]
- **R :** [Réponse de l'utilisateur]

### Conclusion

[Résumé concis de l'action effectuée ou de la réponse finale - PAS les réflexions intermédiaires]

---
```

### Règles :

1. **Horodatage** : Utiliser le format `YYYY-MM-DD` pour la date et `HH:MM` pour l'heure
2. **Prompts** : Reproduire fidèlement la demande de l'utilisateur
3. **Questions/Réponses** : Ne documenter que s'il y a eu des échanges de clarification
4. **Conclusion** : Résumer uniquement le résultat final, pas le processus de réflexion
5. **Séparateur** : Utiliser `---` entre chaque session
6. **Ajout** : Toujours ajouter les nouvelles sessions à la fin du fichier (ne pas écraser)
