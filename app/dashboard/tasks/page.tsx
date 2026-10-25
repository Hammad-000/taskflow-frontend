"use client";

import { useState } from "react";
import {
  Search,
  CalendarDays,
  CircleCheck,
  Clock,
  ListTodo,
  Plus,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Task = {
  id: number;
  title: string;
  project: string;
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  completed: boolean;
};

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Design dashboard UI",
    project: "TaskFlow",
    priority: "High",
    dueDate: "2026-10-27",
    completed: false,
  },
  {
    id: 2,
    title: "Build authentication pages",
    project: "TaskFlow",
    priority: "High",
    dueDate: "2026-10-29",
    completed: false,
  },
  {
    id: 3,
    title: "Create responsive navbar",
    project: "Portfolio",
    priority: "Medium",
    dueDate: "2026-10-30",
    completed: true,
  },
  {
    id: 4,
    title: "Fix mobile layout",
    project: "Portfolio",
    priority: "Low",
    dueDate: "2026-11-02",
    completed: false,
  },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const toggleTask = (id: number) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.project.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ||
      (filter === "Completed" && task.completed) ||
      (filter === "Pending" && !task.completed);

    return matchesSearch && matchesFilter;
  });

  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.length - completedCount;

  const priorityStyle = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-amber-100 text-amber-700",
    Low: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-muted-foreground">Manage your work</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">My Tasks</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Organize your tasks and track your daily progress.
          </p>
        </div>

        <Button
          className="gap-2"
          onClick={() =>
            alert("Task creation form MongoDB integration ke baad add karenge.")
          }
        >
          <Plus size={18} />
          Add Task
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Total Tasks</p>
              <h2 className="mt-2 text-3xl font-bold">{tasks.length}</h2>
            </div>
            <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
              <ListTodo size={22} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <h2 className="mt-2 text-3xl font-bold">{pendingCount}</h2>
            </div>
            <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
              <Clock size={22} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <h2 className="mt-2 text-3xl font-bold">{completedCount}</h2>
            </div>
            <div className="rounded-xl bg-green-100 p-3 text-green-700">
              <CircleCheck size={22} />
            </div>
          </CardContent>
        </Card>
      </div>

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
          onChange={(e) => setFilter(e.target.value)}
          className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option>All</option>
          <option>Pending</option>
          <option>Completed</option>
        </select>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Your task list</h2>

        {filteredTasks.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              No tasks found.
            </CardContent>
          </Card>
        )}

        {filteredTasks.map((task) => (
          <Card key={task.id}>
            <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <button
                onClick={() => toggleTask(task.id)}
                aria-label={
                  task.completed ? "Mark as pending" : "Mark as completed"
                }
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                  task.completed
                    ? "border-green-600 bg-green-600 text-white"
                    : "border-muted-foreground"
                }`}
              >
                {task.completed && <CircleCheck size={16} />}
              </button>

              <div className="min-w-0 flex-1">
                <h3
                  className={`font-semibold ${
                    task.completed
                      ? "text-muted-foreground line-through"
                      : ""
                  }`}
                >
                  {task.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Project: {task.project}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CalendarDays size={14} />
                    Due {task.dueDate}
                  </span>
                  <Badge className={priorityStyle[task.priority]}>
                    {task.priority} priority
                  </Badge>
                </div>
              </div>

              <Badge variant={task.completed ? "secondary" : "outline"}>
                {task.completed ? "Completed" : "In progress"}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}