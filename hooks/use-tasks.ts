
"use client";

import { useCallback, useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export type Task = {
  _id: string;
  title: string;
  description?: string;
  projectId:
    | string
    | {
        _id: string;
        name: string;
      };
  assigneeId?: {
    _id: string;
    name?: string;
    email?: string;
  } | null;
  priority: "low" | "medium" | "high" | "urgent";
  status: "todo" | "in_progress" | "review" | "done";
  dueDate?: string;
  createdAt?: string;
};

export type TaskInput = {
  title: string;
  description?: string;
  projectId: string;
  assigneeId?: string;
  priority?: Task["priority"];
  status?: Task["status"];
  dueDate?: string;
};

type ApiResponse = {
  success: boolean;
  message?: string;
  tasks?: Task[];
  task?: Task;
};

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/tasks`, {
        credentials: "include",
      });

      const data: ApiResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch tasks");
      }

      setTasks(data.tasks || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (taskData: TaskInput) => {
    const response = await fetch(`${API_URL}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(taskData),
    });

    const data: ApiResponse = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to create task");
    }

    await fetchTasks();
    return data.task;
  };

  const updateTask = async (
    id: string,
    taskData: Partial<TaskInput>
  ) => {
    const response = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(taskData),
    });

    const data: ApiResponse = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to update task");
    }

    await fetchTasks();
    return data.task;
  };

  const deleteTask = async (id: string) => {
    const response = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data: ApiResponse = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to delete task");
    }

    await fetchTasks();
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
}
