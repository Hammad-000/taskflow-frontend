
"use client";

import {
  CalendarDays,
  CircleCheck,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Task } from "@/hooks/use-tasks";

type TaskCardProps = {
  task: Task;
  onToggle: (task: Task) => void;
};

const priorityStyle = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-blue-100 text-blue-700",
  urgent: "bg-purple-100 text-purple-700",
};

export default function TaskCard({
  task,
  onToggle,
}: TaskCardProps) {
  const completed = task.status === "done";

  const projectName =
  typeof task.projectId === "object" && task.projectId !== null
    ? task.projectId.name
    : "Unknown Project";
  
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
        <button
          onClick={() => onToggle(task)}
          aria-label={
            completed ? "Mark as pending" : "Mark as completed"
          }
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
            completed
              ? "border-green-600 bg-green-600 text-white"
              : "border-muted-foreground"
          }`}
        >
          {completed && <CircleCheck size={16} />}
        </button>

        <div className="min-w-0 flex-1">
          <h3
            className={`font-semibold ${
              completed
                ? "text-muted-foreground line-through"
                : ""
            }`}
          >
            {task.title}
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Project: {projectName}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {task.dueDate && (
              <span className="flex items-center gap-1">
                <CalendarDays size={14} />
                Due {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}

            <Badge className={priorityStyle[task.priority]}>
              {task.priority} priority
            </Badge>
          </div>
        </div>

        <Badge variant={completed ? "secondary" : "outline"}>
          {completed
            ? "Completed"
            : task.status.replace("_", " ")}
        </Badge>
      </CardContent>
    </Card>
  );
}
