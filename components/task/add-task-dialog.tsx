"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { TaskInput } from "@/hooks/use-tasks";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Project = {
  _id: string;
  name: string;
};

type AddTaskDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (task: TaskInput) => Promise<void>;
};

export default function AddTaskDialog({
  open,
  onClose,
  onSubmit,
}: AddTaskDialogProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [priority, setPriority] =
    useState<TaskInput["priority"]>("medium");
  const [status, setStatus] =
    useState<TaskInput["status"]>("todo");
  const [dueDate, setDueDate] = useState("");
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    const fetchProjects = async () => {
      try {
        setLoadingProjects(true);
        setError("");

        const response = await fetch(`${API_URL}/api/projects`, {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Projects load nahi ho sake.");
        }

        const projectList: Project[] = data.projects || [];
        setProjects(projectList);

        if (projectList.length > 0) {
          setProjectId(projectList[0]._id);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Projects load nahi ho sake."
        );
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, [open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!projectId) {
      setError("Pehle ek project select karo.");
      return;
    }

    try {
      setSaving(true);

      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        projectId,
        priority,
        status,
        ...(dueDate ? { dueDate: new Date(dueDate).toISOString() } : {}),
      });

      setTitle("");
      setDescription("");
      setProjectId("");
      setPriority("medium");
      setStatus("todo");
      setDueDate("");
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Task create nahi ho saka."
      );
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
      <div className="flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-xl border bg-background shadow-xl">
        <div className="flex items-start justify-between gap-3 border-b p-4 sm:p-5">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold sm:text-xl">
              Create New Task
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Add a task to your project.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close dialog"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted sm:h-9 sm:w-9"
          >
            <X size={20} />
          </button>
        </div>

        <form
          id="add-task-form"
          onSubmit={handleSubmit}
          className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">Task Title *</label>
            <input
              required
              maxLength={120}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Build login page"
              className="h-11 w-full rounded-md border bg-background px-3 text-base outline-none focus:ring-2 focus:ring-ring sm:h-10 sm:text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task details..."
              className="w-full resize-none rounded-md border bg-background p-3 text-base outline-none focus:ring-2 focus:ring-ring sm:text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Project *</label>
            <select
              required
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              disabled={loadingProjects || projects.length === 0}
              className="h-11 w-full rounded-md border bg-background px-3 text-base outline-none focus:ring-2 focus:ring-ring sm:h-10 sm:text-sm"
            >
              <option value="">
                {loadingProjects ? "Loading projects..." : "Select project"}
              </option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>

            {!loadingProjects && projects.length === 0 && (
              <p className="text-xs text-amber-600">
                Task banane se pehle ek project create karo.
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as TaskInput["priority"])
                }
                className="h-11 w-full rounded-md border bg-background px-3 text-base sm:h-10 sm:text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as TaskInput["status"])
                }
                className="h-11 w-full rounded-md border bg-background px-3 text-base sm:h-10 sm:text-sm"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="h-11 w-full rounded-md border bg-background px-3 text-base sm:h-10 sm:text-sm"
            />
          </div>

          {error && (
            <p className="rounded-md bg-red-100 p-3 text-sm text-red-700">
              {error}
            </p>
          )}
        </form>

        <div className="flex flex-col-reverse gap-2 border-t p-4 sm:flex-row sm:justify-end sm:gap-3 sm:p-5">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="h-11 rounded-md border px-4 text-sm hover:bg-muted sm:h-10"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="add-task-form"
            disabled={saving || loadingProjects || projects.length === 0}
            className="h-11 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50 sm:h-10"
          >
            {saving ? "Creating..." : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
}