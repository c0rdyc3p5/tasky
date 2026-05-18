import type { Route } from "./+types/_index";
import TaskCard from "~/components/TaskCard";
import { getAllTasks, getAllTaskTags } from "~/services/db.server";
import { useFetcher, useLoaderData, useNavigate } from "react-router";
import type { Task } from "../../types";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Tasky" },
        { name: "description", content: "Fullstack task maker" },
    ];
}

export async function loader({ request }: Route.LoaderArgs) {
    const url = new URL(request.url);

    const selectedTags = url.searchParams.getAll("tag");
    const cursorCreatedAt = url.searchParams.get("cursorCreatedAt");
    const cursorId = url.searchParams.get("cursorId");

    const limit = 6;
    const tags = await getAllTaskTags();

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

interface TagsAndTasks {
    tags: Array<{ id: string; text: string }>;
    tasks: Task[];
    selectedTags: string[];
    nextCursor: {
        id: string;
        createdAt: string;
    } | null;
    hasMore: boolean;
}

export default function Index() {
    const fetcher = useFetcher();
    const navigate = useNavigate();
    const formRef = useRef<HTMLFormElement>(null);

    const {
        tags,
        tasks: initialTasks,
        selectedTags,
        nextCursor: initialCursor,
        hasMore: initialHasMore,
    } = useLoaderData<TagsAndTasks>();

    const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);

    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [cursor, setCursor] = useState(initialCursor);
    const [hasMore, setHasMore] = useState(initialHasMore);

    const [selectedTagsForCreation, setSelectedTagsForCreation] =
        useState<string[]>([]);

    useEffect(() => {
        if (fetcher.data?.error?.message) {
            toast.error(fetcher.data.error.message);
        }
    }, [fetcher.data]);

    useEffect(() => {
        if (fetcher.state === "idle" && !fetcher.data) {
            resetModal();
        }
    }, [fetcher.state, fetcher.data]);

    useEffect(() => {
        setTasks(initialTasks);
        setCursor(initialCursor);
        setHasMore(initialHasMore);
    }, [initialTasks, initialCursor, initialHasMore]);

    useEffect(() => {
        if (!fetcher.data || !("tasks" in fetcher.data)) return;

        const newTasks: Task[] = fetcher.data.tasks ?? [];
        const next = fetcher.data.nextCursor ?? null;
        const more = fetcher.data.hasMore ?? false;

        setTasks((prev) => {
            const existingIds = new Set(prev.map((t) => t.id));
            const filteredNew = newTasks.filter((t) => !existingIds.has(t.id));
            return [...prev, ...filteredNew];
        });

        setCursor(next);
        setHasMore(more);
    }, [fetcher.data]);

    const resetModal = () => {
        setSelectedTagsForCreation([]);
        formRef.current?.reset();
        setNewTaskModalOpen(false);
    };

    const toggleTag = (tagId: string) => {
        setSelectedTagsForCreation((prev) =>
            prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
        );
    };

    const toggleFilteringTag = (tagId: string) => {
        const updated = selectedTags.includes(tagId)
            ? selectedTags.filter((id) => id !== tagId)
            : [...selectedTags, tagId];

        const params = new URLSearchParams();
        updated.forEach((t) => params.append("tag", t));

        navigate(`/?${params.toString()}`);
    };

    const loadMore = () => {
        if (!cursor || fetcher.state !== "idle") return;
        const params = new URLSearchParams(window.location.search);
        const epochTime = new Date(cursor.createdAt).getTime();

        params.set("cursorCreatedAt", String(epochTime));
        params.set("cursorId", cursor.id);

        fetcher.load(`/api/tasks?${params.toString()}`).then(data => console.log(data));
    };

    return (
        <>
            <header>
                <div className={"top"}>
                    <h1>Tasky</h1>
                    <button className={"btn primary"} onClick={() => setNewTaskModalOpen(true)}>
                        New task
                    </button>
                </div>

                <div className={"bottom"}>
                    <span>Filter by tags: </span>
                    <div>
                        {tags.map((tag) => {
                            const isSelected = selectedTags.includes(tag.id);
                            return (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => toggleFilteringTag(tag.id)}
                                    className={`btn ${isSelected ? "primary" : "secondary"}`}
                                >
                                    {tag.text}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </header>

            <main>
                <section className={"new-task-modal-container"} data-open={newTaskModalOpen}>
                    <div className={"new-task-modal"}>
                        <fetcher.Form ref={formRef} method="POST" action={`/api/tasks`} className={"post-task"}>
                            <div className={"form-header"}>
                                <h6>Create a new task</h6>
                                <button type="button" onClick={resetModal}>X</button>
                            </div>

                            <div className={"form-body"}>
                                <input type="text" name="title" placeholder={"Title"} />
                                <textarea name="description" cols={30} rows={10} placeholder={"Description"} />
                                <input type="hidden" name={"tags"} value={JSON.stringify(selectedTagsForCreation)} />

                                <div className={"tags-container"}>
                                    {tags.map((tag) => {
                                        const isSelected = selectedTagsForCreation.includes(tag.id);
                                        return (
                                            <button
                                                key={tag.id}
                                                type="button"
                                                onClick={() => toggleTag(tag.id)}
                                                className={`btn ${isSelected ? "primary" : "secondary"}`}
                                            >
                                                {tag.text}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button className={"btn primary"}>Create</button>
                            </div>
                        </fetcher.Form>
                    </div>
                </section>

                <section className={"task-grid"}>
                    <TaskCard
                        key={'ERRORTEST'}
                        id={'0A0A'}
                        title={'Test erreur'}
                        tags={[]}
                        description={['Hardcodé task avec un mauvais ID pour tester les erreurs backend sur update et delete']}
                        status={false}
                        createdAt={new Date()}
                        updatedAt={new Date()}
                    />
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            id={task.id}
                            title={task.title}
                            tags={task.tags}
                            description={task.description}
                            status={task.status}
                            createdAt={task.createdAt}
                            updatedAt={task.updatedAt}
                        />
                    ))}
                </section>

                {hasMore && (
                    <div className="flex justify-center py-4">
                        <button
                            className="btn primary"
                            onClick={loadMore}
                            disabled={fetcher.state !== "idle"}
                        >
                            {fetcher.state !== "idle" ? "Loading..." : "Load more"}
                        </button>
                    </div>
                )}
            </main>
        </>
    );
}