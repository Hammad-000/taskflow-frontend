
"use client";

import { useMemo, useState } from "react";
import {
  FolderKanban,
  Plus,
  Search,
  CalendarDays,
  Users,
  MoreHorizontal,
  ArrowUpRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
  id: number;
  name: string;
  description: string;
  status: "In Progress" | "Planning" | "Completed";
  members: number;
  dueDate: string;
};

const initialProjects: Project[] = [
  {
    id: 1,
    name: "Website Redesign",
    description: "Redesign the company website and improve user experience.",
    status: "In Progress",
    members: 5,
    dueDate: "2026-11-15",
  },
  {
    id: 2,
    name: "Mobile Application",
    description: "Build a responsive mobile application for customers.",
    status: "Planning",
    members: 3,
    dueDate: "2026-12-01",
  },
  {
    id: 3,
    name: "Marketing Campaign",
    description: "Plan and launch the next digital marketing campaign.",
    status: "Completed",
    members: 4,
    dueDate: "2026-10-20",
  },
  {
    id: 4,
    name: "TaskFlow Dashboard",
    description: "Develop the internal project management dashboard.",
    status: "In Progress",
    members: 6,
    dueDate: "2026-11-25",
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) =>
        `${project.name} ${project.description}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [projects, search]
  );

  function createProject() {
    if (!name.trim()) return;

    const newProject: Project = {
      id: Date.now(),
      name: name.trim(),
      description: description.trim() || "No description added yet.",
      status: "Planning",
      members: 1,
      dueDate: dueDate || "Not set",
    };

    setProjects((current) => [newProject, ...current]);
    setName("");
    setDescription("");
    setDueDate("");
    setOpen(false);
  }

  const completed = projects.filter(
    (project) => project.status === "Completed"
  ).length;

  return (
    <div className="space-y-8">
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

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={<Button className="gap-2" />}
          >
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

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Due date
                </label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={createProject}
                disabled={!name.trim()}
              >
                Create Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

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
              <p className="text-2xl font-bold">
                {projects.filter((p) => p.status === "In Progress").length}
              </p>
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

      {filteredProjects.length === 0 ? (
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
              key={project.id}
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
                        project.status === "Completed"
                          ? "default"
                          : project.status === "In Progress"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {project.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t pt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Users className="size-4" />
                    {project.members} members
                  </span>
                  <span className="flex items-center gap-2">
                    <CalendarDays className="size-4" />
                    {project.dueDate === "Not set"
                      ? "No deadline"
                      : new Date(
                          project.dueDate + "T12:00:00"
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
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
