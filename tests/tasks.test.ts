import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { prisma } from "~/services/prisma";

import {
    createTask,
    updateTaskStatus,
    deleteTask,
    getAllTasks,
    createTaskTags,
    deleteTaskTag,
    getAllTaskTags,
} from "~/services/db.server";


// -------------------------
// CLEAN DB BEFORE EACH TEST
// -------------------------
beforeEach(async () => {
    await prisma.task.deleteMany();
    await prisma.taskTag.deleteMany();
});


// -------------------------
// CREATE TASK
// -------------------------
describe("Tasks service (integration)", () => {
    it("should create a task with tags in DB", async () => {
        const tag = await prisma.taskTag.create({
            data: { text: "tag1" },
        });

        await createTask("Test task", "Description", [tag.id]);

        const tasks = await prisma.task.findMany({
            include: { tags: true },
        });

        expect(tasks.length).toBe(1);
        expect(tasks[0].title).toBe("Test task");
        expect(tasks[0].tags[0].id).toBe(tag.id);
    });

    // -------------------------
    // UPDATE TASK STATUS
    // -------------------------
    it("should update task status", async () => {
        const task = await prisma.task.create({
            data: {
                title: "Task",
                description: "Desc",
            },
        });

        await updateTaskStatus(task.id, true);

        const updated = await prisma.task.findUnique({
            where: { id: task.id },
        });

        expect(updated?.status).toBe(true);
    });

    // -------------------------
    // DELETE TASK
    // -------------------------
    it("should delete a task", async () => {
        const task = await prisma.task.create({
            data: {
                title: "Task to delete",
                description: "Desc",
            },
        });

        await deleteTask(task.id);

        const found = await prisma.task.findUnique({
            where: { id: task.id },
        });

        expect(found).toBeNull();
    });

    // -------------------------
    // CREATE TAGS
    // -------------------------
    it("should create task tags", async () => {
        await createTaskTags(["tag1", "tag2"]);

        const tags = await prisma.taskTag.findMany();

        expect(tags.length).toBe(2);
        expect(tags.map(t => t.text).sort()).toEqual(["tag1", "tag2"]);
    });

    // -------------------------
    // DELETE TAG
    // -------------------------
    it("should delete a task tag", async () => {
        const tag = await prisma.taskTag.create({
            data: { text: "tag-to-delete" },
        });

        await deleteTaskTag(tag.id);

        const found = await prisma.taskTag.findUnique({
            where: { id: tag.id },
        });

        expect(found).toBeNull();
    });

    // -------------------------
    // GET ALL TASKS (WITH TRANSFORM)
    // -------------------------
    it("should fetch tasks and split description into array", async () => {
        const task = await prisma.task.create({
            data: {
                title: "Task",
                description: "line1\nline2",
            },
        });

        const result = await getAllTasks({});

        expect(result.length).toBe(1);
        expect(result[0].description).toEqual(["line1", "line2"]);
    });

    // -------------------------
    // GET TAGS
    // -------------------------
    it("should get all tags", async () => {
        await prisma.taskTag.createMany({
            data: [
                { text: "a" },
                { text: "b" },
            ],
        });

        const tags = await getAllTaskTags();

        expect(tags.length).toBe(2);
    });
});