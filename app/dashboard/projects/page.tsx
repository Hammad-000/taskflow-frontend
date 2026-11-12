
"use client";

import { useMemo, useState, useEffect } from "react";
import {
  FolderKanban,
  Plus,
  Search,
  Users,
  MoreHorizontal,
  ArrowUpRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

type Project = {
  _id: string;
  name: string;
  description?: string;
  status: "active" | "completed" | "on_hold";
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getStatusLabel = (status: Project["status"]) => {
  const labels = {
    active: "In Progress",
    completed: "Completed",
    on_hold: "Planning",
  };

  return labels[status];
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  // FETCH PROJECTS
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_URL}/api/projects`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch projects");
      }

      setProjects(data.projects || []);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // CREATE PROJECT
  const createProject = async () => {
    if (!name.trim()) return;

    try {
      setCreating(true);
      setError("");

      const res = await fetch(`${API_URL}/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create project");
      }

      setProjects((current) => [data.project, ...current]);

      setName("");
      setDescription("");
      setOpen(false);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setCreating(false);
    }
  };

  // SEARCH
  const filteredProjects = useMemo(
    () =>
      projects.filter((project) =>
        `${project.name} ${project.description || ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [projects, search]
  );

  const completed = projects.filter(
    (project) => project.status === "completed"
  ).length;

  const inProgress = projects.filter(
    (project) => project.status === "active"
  ).length;

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-muted-foreground">
            Workspace / Projects
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Projects
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage your projects and keep your team on track.
          </p>
        </div>

        {/* CREATE DIALOG */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button className="gap-2" />}>
            <Plus className="size-4" />
            Create Project
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new project</DialogTitle>
              <DialogDescription>
                Add project details to get started.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Project name
                </label>

                <Input
                  placeholder="e.g. Website Redesign"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Description
                </label>

                <Textarea
                  placeholder="What is this project about?"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={creating}
              >
                Cancel
              </Button>

              <Button
                onClick={createProject}
                disabled={!name.trim() || creating}
              >
                {creating ? "Creating..." : "Create Project"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* ERROR */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
          <Button
            variant="outline"
            size="sm"
            className="ml-3"
            onClick={fetchProjects}
          >
            Retry
          </Button>
        </div>
      )}

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <FolderKanban className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Total Projects
              </p>
              <p className="text-2xl font-bold">{projects.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-blue-500/10 p-3 text-blue-600">
              <ArrowUpRight className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                In Progress
              </p>
              <p className="text-2xl font-bold">{inProgress}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-green-500/10 p-3 text-green-600">
              <FolderKanban className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Completed
              </p>
              <p className="text-2xl font-bold">{completed}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SEARCH */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">All Projects</h2>

        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search projects..."
            className="pl-9"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      {/* PROJECT LIST */}
      {loading ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Loading projects...
          </CardContent>
        </Card>
      ) : filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-center">
            <FolderKanban className="mb-3 size-10 text-muted-foreground" />

            <p className="font-medium">No projects found</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Try another search or create a new project.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card
              key={project._id}
              className="group transition-shadow hover:shadow-md"
            >
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <FolderKanban className="size-5" />
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Options for ${project.name}`}
                  onClick={() =>
                    window.alert(
                      "Project options will be added in a later step."
                    )
                  }
                >
                  <MoreHorizontal className="size-5" />
                </Button>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{project.name}</h3>

                    <Badge
                      variant={
                        project.status === "completed"
                          ? "default"
                          : project.status === "active"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {getStatusLabel(project.status)}
                    </Badge>
                  </div>

                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {project.description || "No description added yet."}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t pt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Users className="size-4" />
                    Team not added
                  </span>

                  <span className="text-xs">
                    Project
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
