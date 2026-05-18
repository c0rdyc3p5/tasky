import type {Route} from "./+types/api.tasks.$taskUuid";
import {deleteTask, updateTaskStatus} from "~/services/db.server";
import {buildErrorObj} from "~/services/utils";
import type {PrismaError} from "../../types";

export async function action({ request, params }: Route.ActionArgs) {
    const method = request.method;

    try {
        switch (method) {
            case "PUT": {
                const jsonData = await request.json();
                await updateTaskStatus(params.taskUuid, jsonData.status);

                return Response.json({
                    ok: true,
                    task: {
                        id: params.taskUuid,
                        status: jsonData.status,
                    },
                });
            }

            case "DELETE": {
                await deleteTask(params.taskUuid!);

                return Response.json({
                    ok: true,
                    deletedId: params.taskUuid,
                });
            }

            default:
                return Response.json(
                    buildErrorObj("E000", "Unsupported method"),
                    { status: 405 }
                );
        }
    } catch (e) {
        return Response.json(
            buildErrorObj(
                (e as PrismaError).code,
                method === "PUT"
                    ? "Could not update the task"
                    : "Could not delete the task"
            ),
            { status: 500 }
        );
    }
}