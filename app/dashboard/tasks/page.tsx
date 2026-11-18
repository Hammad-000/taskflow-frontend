
"use client";

import { useState } from "react";
import {
  Search,
  CircleCheck,
  Clock,
  ListTodo,
  Plus,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useTasks, type Task } from "@/hooks/use-tasks";
import TaskCard from "@/components/task/task-card";
import TaskActions from "@/components/task/task-actions";

type Filter = "All" | "Pending" | "Completed";

export default function TasksPage() {
  const {
    tasks,
    loading,
    error,
    updateTask,
    deleteTask,
  } = useTasks();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [actionError, setActionError] = useState<string | null>(null);

  const completedCount = tasks.filter(
    (task) => task.status === "done"
  ).length;

  const pendingCount = tasks.length - completedCount;

  const filteredTasks = tasks.filter((task) => {
  const projectName =
  typeof task.projectId === "object" && task.projectId !== null
    ? task.projectId.name
    : "";

    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      projectName.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ||
      (filter === "Completed" && task.status === "done") ||
      (filter === "Pending" && task.status !== "done");

    return matchesSearch && matchesFilter;
  });

  const toggleTask = async (task: Task) => {
    try {
      setActionError(null);

      await updateTask(task._id, {
        status: task.status === "done" ? "todo" : "done",
      });
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Unable to update task"
      );
    }
  };

  const handleEdit = async (task: Task) => {
    const newTitle = window.prompt("Enter task title:", task.title);

    if (!newTitle || !newTitle.trim()) return;

    try {
      setActionError(null);

      await updateTask(task._id, {
        title: newTitle.trim(),
      });
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Unable to edit task"
      );
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      setActionError(null);
      await deleteTask(id);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Unable to delete task"
      );
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-muted-foreground">
            Manage your work
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            My Tasks
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Organize your tasks and track your daily progress.
          </p>
        </div>

        <Button
          className="gap-2"
          onClick={() =>
            alert("Add Task form hum next step mein banayenge.")
          }
        >
          <Plus size={18} />
          Add Task
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Tasks
              </p>
              <h2 className="mt-2 text-3xl font-bold">
                {tasks.length}
              </h2>
            </div>

            <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
              <ListTodo size={22} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Pending
              </p>
              <h2 className="mt-2 text-3xl font-bold">
                {pendingCount}
              </h2>
            </div>

            <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
              <Clock size={22} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Completed
              </p>
              <h2 className="mt-2 text-3xl font-bold">
                {completedCount}
              </h2>
            </div>

            <div className="rounded-xl bg-green-100 p-3 text-green-700">
              <CircleCheck size={22} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks or projects..."
            className="h-10 w-full rounded-md border bg-background pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as Filter)}
          className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">
          Your task list
        </h2>

        {actionError && (
          <p className="rounded-md bg-red-100 p-3 text-sm text-red-700">
            {actionError}
          </p>
        )}

        {loading && (
          <Card>
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              Loading tasks...
            </CardContent>
          </Card>
        )}

        {!loading && error && (
          <Card>
            <CardContent className="space-y-3 p-8 text-center">
              <p className="text-sm text-red-600">{error}</p>

              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {!loading && !error && filteredTasks.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              No tasks found.
            </CardContent>
          </Card>
        )}

        {!loading &&
          !error &&
          filteredTasks.map((task) => (
            <div
              key={task._id}
              className="flex items-center gap-2"
            >
              <div className="min-w-0 flex-1">
                <TaskCard
                  task={task}
                  onToggle={toggleTask}
                />
              </div>

              <TaskActions
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
