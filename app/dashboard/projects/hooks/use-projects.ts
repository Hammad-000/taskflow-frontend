
import { useCallback, useEffect, useState } from "react";

export type ProjectStatus = "active" | "completed" | "on_hold";

export interface Project {
  _id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  createdAt?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getApiUrl() {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  return API_URL;
}

async function parseResponse(response: Response) {
  const text = await response.text();

  let data: any = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Server returned an invalid response");
    }
  }

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${getApiUrl()}/api/projects`, {
        method: "GET",
        credentials: "include",
      });

      const data = await parseResponse(response);

      setProjects(data.projects || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch projects"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (projectData: {
    name: string;
    description: string;
  }) => {
    const response = await fetch(`${getApiUrl()}/api/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(projectData),
    });

    const data = await parseResponse(response);

    if (data.project) {
      setProjects((prev) => [data.project, ...prev]);
    } else {
      await fetchProjects();
    }

    return data;
  };

  const updateProject = async (
    id: string,
    projectData: {
      name: string;
      description: string;
    }
  ) => {
    const response = await fetch(`${getApiUrl()}/api/projects/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(projectData),
    });

    const data = await parseResponse(response);

    if (data.project) {
      setProjects((prev) =>
        prev.map((project) =>
          project._id === id ? data.project : project
        )
      );
    } else {
      setProjects((prev) =>
        prev.map((project) =>
          project._id === id
            ? { ...project, ...projectData }
            : project
        )
      );
    }

    return data;
  };

  const deleteProject = async (id: string) => {
    const response = await fetch(`${getApiUrl()}/api/projects/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    await parseResponse(response);

    setProjects((prev) => prev.filter((project) => project._id !== id));
  };

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}
