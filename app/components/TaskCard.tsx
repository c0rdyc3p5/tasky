import type { Task } from "../../types";
import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import toast from "react-hot-toast";

export default function TaskCard(initialTask: Task) {
    const [task, setTask] = useState(initialTask);
    const [now, setNow] = useState(Date.now());
    const [isDeleted, setIsDeleted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [taskInternalStatus, setTaskInternalStatus] = useState(initialTask.status);

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(Date.now());
        }, 60_000);

        return () => clearInterval(interval);
    }, []);

    const formattedDate = useMemo(() => {
        return moment(task.createdAt).format("dddd MMMM D, YYYY HH:mm");
    }, [task.createdAt]);

    const toggleStatus = async () => {
        if (loading) return;
        setLoading(true);

        const newStatus = !task.status;

        setTask((prev) => ({
            ...prev,
            status: newStatus,
        }));

        try {
            const res = await fetch(`/api/tasks/${task.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: newStatus,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.error?.message || "Update failed");
            }

            if (data?.task) {
                setTaskInternalStatus(data?.task.status)
            }
        } catch (err: any) {
            toast.error(err.message);

            setTask((prev) => ({
                ...prev,
                status: !newStatus,
            }));
        } finally {
            setLoading(false);
        }
    };

    const deleteTask = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const res = await fetch(`/api/tasks/${task.id}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.error?.message || "Delete failed");
            }

            setIsDeleted(true);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (isDeleted) return null;

    return (
        <div className="card">
            <div className="card-header">
                <div className="title-actions">
                    <h6>{task.title}</h6>

                    <div className="actions">
                        <button
                            onClick={toggleStatus}
                            disabled={loading}
                            data-done={taskInternalStatus ? "true" : "false"}
                            className={'update'}
                        >
                            {taskInternalStatus ? "Done" : "In progress"}
                        </button>

                        <button
                            className="delete"
                            onClick={deleteTask}
                            disabled={loading}
                        >
                            Delete
                        </button>
                    </div>
                </div>

                <div className="tags-container">
                    {task.tags.map((tag) => (
                        <span className="tag" key={tag.id}>
                            {tag.text}
                        </span>
                    ))}
                </div>
            </div>

            <div className="card-body">
                {task.description.map((line, index) => (
                    <p key={index}>{line}</p>
                ))}
            </div>

            <div className="card-footer">
                <span data-date={formattedDate}>
                    {moment(task.createdAt).from(now)}
                </span>
            </div>
        </div>
    );
}