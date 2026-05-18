# 📋 Tasky

Une application de gestion de tâches moderne construite avec React Router 7, Prisma et Tailwind CSS.

![React Router](https://img.shields.io/badge/React_Router-7.15-blue)
![Prisma](https://img.shields.io/badge/Prisma-7.8-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-gray)
![Vite](https://img.shields.io/badge/Vite-8.0-yellow)

---

## 🧱 Stack technique

| Couche | Technologie |
|---|---|
| Framework | React Router 7.15 |
| UI | React 19 + Tailwind CSS 4 |
| ORM | Prisma 7.8 |
| Base de données | SQLite / LibSQL |
| Build | Vite 8 |
| Tests | Vitest |

---

## ✅ Prérequis

- **Node.js** v20+

---

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# Initialiser la base de données
npm run prisma:migrate
npm run prisma:generate
npm run prisma:seed

# Lancer en développement
npm run dev
```

---

## 🖥️ Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Lance le serveur de développement avec hot-reload |
| `npm run build` | Compile l'application pour la production |
| `npm run start` | Démarre le serveur de production |
| `npm run typecheck` | Génère les types React Router et vérifie TypeScript |
| `npm run test` | Lance la suite de tests avec Vitest |
| `npm run prisma:migrate` | Applique les migrations de base de données |
| `npm run prisma:studio` | Ouvre l'interface visuelle Prisma Studio |
| `npm run prisma:generate` | Régénère le client Prisma |
| `npm run prisma:seed` | Peuple la base de données avec des données initiales |

---

## 📁 Structure du projet

```
tasky/
├── app/            — routes, composants, logique métier
├── database/       — schéma et migrations
├── public/         — assets statiques
├── seedDb.ts       — script de seeding (exécuté avec Bun)
└── vite.config.ts  — configuration Vite
```

## 🛠️ Outils utilisés

### Environnement de développement

- **WebStorm** — IDE principal utilisé pour le développement du projet.
### Intelligence artificielle

**Claude (Anthropic)** a été utilisé comme assistant pour :

- **Débogage de fonctions complexes** — vérification de la logique et détection de bugs sur des fonctionnalités avancées comme la pagination par curseur (*cursor pagination*).
- **Génération de tests Vitest** — aide à la création rapide de cas de test unitaires et d'intégration.
- **Génération de la documentation** — rédaction et mise en forme de ce README.