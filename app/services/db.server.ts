import {prisma} from "./prisma";

export async function createTaskTags(tags: string[]) {
    await prisma.taskTag.createMany({
        data: tags.map((text) => ({
            text,
        })),
    });
}

export async function deleteTaskTag(tagUuid: string) {
    await prisma.taskTag.delete({
        where: {
            id: tagUuid,
        },
    });
}

export async function createTask(
    title: string,
    description: string,
    tagUuids: string[] = []
) {
    await prisma.task.create({
        data: {
            title,
            description,
            tags: {
                connect: tagUuids.map((id) => ({ id })),
            },
        },
    });
}

export async function updateTaskStatus(taskId: string, status: boolean) {
    await prisma.task.update({
        where: {
            id: taskId,
        },
        data: {
            status,
        },
    });
}

export async function deleteTask(taskId: string) {
    await prisma.task.delete({
        where: {
            id: taskId,
        },
    });
}

export async function getAllTasks(params: {
    tagIds?: string[];
    cursor?: { createdAt: Date; id: string };
    limit?: number;
}) {
    const { tagIds, cursor, limit = 6 } = params;

    const tasks = await prisma.task.findMany({
        take: limit + 1, // fetch one extra to detect "hasMore"
        skip: cursor ? 1 : 0,

        cursor: cursor
            ? {
                createdAt_id: {
                    createdAt: cursor.createdAt,
                    id: cursor.id,
                },
            }
            : undefined,

        orderBy: [
            { createdAt: "desc" },
            { id: "desc" },
        ],

        where: tagIds?.length
            ? {
                tags: {
                    some: {
                        id: { in: tagIds },
                    },
                },
            }
            : undefined,

        include: {
            tags: true,
        },
    });

    // On veut handle la transformation de la description en array pour éviter de 'setInnerHTML' dans le frontend avec un replace de '\n' vers '<br>' pour des raisons de sécurités
    return tasks.map(task => ({
        ...task,
        description: task.description.split("\n"),
    }));
}

export async function getAllTaskTags() {
    return prisma.taskTag.findMany();
}