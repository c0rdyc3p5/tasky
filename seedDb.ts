import { prisma } from "~/services/prisma";
import { createTask } from "~/services/db.server";

// On nettoie la DB
await prisma.taskTag.deleteMany();
await prisma.task.deleteMany();

// On seed les tags
const tags = await prisma.taskTag.createManyAndReturn({
    data: [
        { text: "Travail" },   // tag 0
        { text: "Personnel" }, // tag 1
        { text: "Gym" },       // tag 2
        { text: "Épicerie" },  // tag 3
        { text: "D&D" },       // tag 4
    ],
});

// Tasks de base
await createTask(
    "Bench",
    "Battre mon record de 225lbs",
    [tags[1].id, tags[2].id]
);

await createTask(
    "Aspyn",
    "Finir tasky",
    [tags[0].id]
);

await createTask(
    "Épicerie semaine 18 mai",
    "Acheter du lait",
    [tags[3].id]
);

await createTask(
    "Maintenance véhicule",
    "Changer mes tires\nChanger mon huile",
    [tags[1].id]
);

await createTask(
    "Downtime avant BBEG",
    "Vérifier ce que mes joueurs veulent faire pour leur downtime avant le fight contre le BBEG",
    [tags[4].id]
);

// 30 tasks random généré par Claude
const randomTasks = [
    {
        title: "Préparer présentation client",
        description: "Finaliser les slides pour lundi matin",
        tags: [tags[0].id],
    },
    {
        title: "Meal prep",
        description: "Préparer les lunchs pour la semaine",
        tags: [tags[1].id],
    },
    {
        title: "Leg day",
        description: "Squat, presse, fentes",
        tags: [tags[2].id],
    },
    {
        title: "Acheter des fruits",
        description: "Pommes, bananes, bleuets",
        tags: [tags[3].id],
    },
    {
        title: "Créer PNJ tavernier",
        description: "Ajouter une personnalité et une voix",
        tags: [tags[4].id],
    },
    {
        title: "Réviser budget",
        description: "Vérifier les dépenses du mois",
        tags: [tags[1].id],
    },
    {
        title: "Fix bug auth",
        description: "Erreur 401 après refresh token",
        tags: [tags[0].id],
    },
    {
        title: "Cardio",
        description: "30 minutes de tapis roulant",
        tags: [tags[2].id],
    },
    {
        title: "Acheter du café",
        description: "Beans espresso medium roast",
        tags: [tags[3].id],
    },
    {
        title: "Préparer session D&D",
        description: "Dessiner la map du donjon",
        tags: [tags[4].id],
    },
    {
        title: "Nettoyer bureau",
        description: "Organiser les câbles et jeter les papiers",
        tags: [tags[1].id],
    },
    {
        title: "Code review",
        description: "Review les PRs avant le merge",
        tags: [tags[0].id],
    },
    {
        title: "Deadlift PR",
        description: "Tester nouveau max",
        tags: [tags[1].id, tags[2].id],
    },
    {
        title: "Acheter oeufs",
        description: "2 douzaines",
        tags: [tags[3].id],
    },
    {
        title: "Créer encounter boss",
        description: "Balancer les stats du necromancer",
        tags: [tags[4].id],
    },
    {
        title: "Backup PC",
        description: "Sauvegarder les fichiers importants",
        tags: [tags[1].id],
    },
    {
        title: "Meeting sprint",
        description: "Planification de la prochaine semaine",
        tags: [tags[0].id],
    },
    {
        title: "Push workout",
        description: "Chest, shoulders, triceps",
        tags: [tags[2].id],
    },
    {
        title: "Acheter fromage",
        description: "Cheddar et mozzarella",
        tags: [tags[3].id],
    },
    {
        title: "Nommer les royaumes",
        description: "Trouver des noms fantasy crédibles",
        tags: [tags[4].id],
    },
    {
        title: "Laver vêtements",
        description: "Faire 2 brassées",
        tags: [tags[1].id],
    },
    {
        title: "Optimiser queries Prisma",
        description: "Réduire les includes inutiles",
        tags: [tags[0].id],
    },
    {
        title: "Abdos",
        description: "Circuit de 20 minutes",
        tags: [tags[2].id],
    },
    {
        title: "Acheter viande hachée",
        description: "Pour les repas de la semaine",
        tags: [tags[3].id],
    },
    {
        title: "Préparer loot magique",
        description: "Créer 5 items rares",
        tags: [tags[4].id],
    },
    {
        title: "Appeler assurance",
        description: "Question sur renouvellement auto",
        tags: [tags[1].id],
    },
    {
        title: "Corriger CSS mobile",
        description: "Navbar brisée sur iPhone",
        tags: [tags[0].id],
    },
    {
        title: "Pull workout",
        description: "Dos et biceps",
        tags: [tags[2].id],
    },
    {
        title: "Acheter yogourt",
        description: "Greco vanille",
        tags: [tags[3].id],
    },
    {
        title: "Écrire lore ancien empire",
        description: "Créer timeline historique",
        tags: [tags[4].id],
    },
];

for (const task of randomTasks) {
    await createTask(task.title, task.description, task.tags);
}