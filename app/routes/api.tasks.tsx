import type {Route} from "./+types/api.tasks";
import {createTask, getAllTasks, getAllTaskTags} from "~/services/db.server";
import {data} from "react-router";
import {buildErrorObj} from "~/services/utils";
import type {PrismaError} from "../../types";

export async function loader({request, params}: Route.LoaderArgs) {
    const url = new URL(request.url);

    const selectedTags = url.searchParams.getAll("tag");
    const cursorCreatedAt = url.searchParams.get("cursorCreatedAt");
    const cursorId = url.searchParams.get("cursorId");

    const limit = 6;
    const tags = await getAllTaskTags();

    // Convert the incoming epoch string back to a valid Date object
    const parsedEpoch = cursorCreatedAt ? parseInt(cursorCreatedAt, 10) : NaN;
    const cursorDate = !isNaN(parsedEpoch) ? new Date(parsedEpoch) : undefined;

    const tasks = await getAllTasks({
        tagIds: selectedTags,
        cursor:
            cursorDate && cursorId
                ? {
                    createdAt: cursorDate,
                    id: cursorId,
                }
                : undefined,
        limit,
    });

    const hasMore = tasks.length > limit;
    const paginatedTasks = hasMore ? tasks.slice(0, limit) : tasks;

    const nextCursor = hasMore
        ? {
            id: paginatedTasks[paginatedTasks.length - 1].id,
            createdAt: paginatedTasks[paginatedTasks.length - 1].createdAt,
        }
        : null;

    return {
        tags,
        tasks: paginatedTasks,
        selectedTags,
        nextCursor,
        hasMore,
    };
}

export async function action({ request, params }: Route.ActionArgs) {

    switch (request.method) {
        case "POST":
            try {
                const formData = await request.formData();
                const title = formData.get('title') as string;
                const description = formData.get('description') as string;
                const tags = formData.get('tags') as string;
                const tagsArr = JSON.parse(tags);

                if (!title) {
                    return data(
                        buildErrorObj(
                            'E001',
                            "The task needs a title"
                        )
                    );
                }

                if (!description) {
                    return data(
                        buildErrorObj(
                            'E002',
                            "The task needs a description"
                        )
                    );
                }

                await createTask(title, description, tagsArr);
            } catch (e) {
                return data(
                    buildErrorObj(
                        (e as PrismaError).code,
                        "Could not create the task"
                    )
                );
            }
            break;
    }
}