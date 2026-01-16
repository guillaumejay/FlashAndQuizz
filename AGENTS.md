# Description du Projet : FlashAndQuizz

Ce projet, nommé "FlashAndQuizz", est une application web développée avec Vue.js et Vite. Il semble être conçu comme une plateforme interactive pour l'apprentissage et l'évaluation des connaissances à travers des flashcards (cartes mémoire) et des quiz.

## Fonctionnalités Clés (Déduites) :
- **Jeu de Flashcards :** Permet aux utilisateurs d'interagir avec des cartes mémoire pour la mémorisation et l'apprentissage. (Suggéré par `FlashcardGame.vue`, `FlashcardResult.vue`, `flashcards.json`)
- **Quiz Interactif :** Fournit une interface de quiz pour tester les connaissances, afficher des questions et présenter les résultats. (Suggéré par `QuizQuestion.vue`, `QuizResult.vue`, `quiz.json`, `quiz.ts`)
- **Interface à base de Composants :** Utilise les composants Vue.js pour une interface utilisateur modulaire et réactive.
- **Contenu piloté par les données :** Les flashcards et les questions de quiz sont probablement chargées à partir de fichiers JSON, ce qui simplifie la gestion du contenu.

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