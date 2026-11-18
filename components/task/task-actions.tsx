
"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Task } from "@/hooks/use-tasks";

type TaskActionsProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
};

export default function TaskActions({
  task,
  onEdit,
  onDelete,
}: TaskActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon">
            <MoreHorizontal size={18} />
            <span className="sr-only">Task actions</span>
          </Button>
        }
      />

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(task)}>
          <Pencil size={16} />
          Edit task
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onDelete(task._id)}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 size={16} />
          Delete task
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
