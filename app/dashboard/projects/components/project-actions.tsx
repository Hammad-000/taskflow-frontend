
"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { Project } from "../hooks/use-projects";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

interface ProjectActionsProps {
  projects: Project[];
  onFilteredProjectsChange: (projects: Project[]) => void;

  onCreate: (data: {
    name: string;
    description: string;
  }) => Promise<any>;

  onEdit: (
    id: string,
    data: {
      name: string;
      description: string;
    }
  ) => Promise<any>;

  editingProject: Project | null;
  onEditingProjectChange: (project: Project | null) => void;
}

export function ProjectActions({
  projects,
  onFilteredProjectsChange,
  onCreate,
  onEdit,
  editingProject,
  onEditingProjectChange,
}: ProjectActionsProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [dialogOpen, setDialogOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        project.name.toLowerCase().includes(searchValue) ||
        (project.description || "")
          .toLowerCase()
          .includes(searchValue);

      const matchesFilter =
        filter === "all" || project.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [projects, search, filter]);

  useEffect(() => {
    onFilteredProjectsChange(filteredProjects);
  }, [filteredProjects, onFilteredProjectsChange]);

  useEffect(() => {
    if (editingProject) {
      setName(editingProject.name);
      setDescription(editingProject.description || "");
      setActionError("");
      setDialogOpen(true);
    }
  }, [editingProject]);

  const openCreateDialog = () => {
    onEditingProjectChange(null);

    setName("");
    setDescription("");
    setActionError("");
    setDialogOpen(true);
  };

  // Close Dialog
  const closeDialog = () => {
    setDialogOpen(false);
    onEditingProjectChange(null);

    setName("");
    setDescription("");
    setActionError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      setActionError("Project name is required.");
      return;
    }

    try {
      setSaving(true);
      setActionError("");

      const projectData = {
        name: name.trim(),
        description: description.trim(),
      };

      if (editingProject) {
        await onEdit(editingProject._id, projectData);
      } else {
        await onCreate(projectData);
      }

      closeDialog();
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Search, Filters and Create */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex flex-1 flex-col gap-3 sm:flex-row">

          {/* Search */}
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              placeholder="Search projects..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-9"
            />
          </div>

          {/* Filter */}
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="all">All Projects</option>
            <option value="active">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on_hold">Planning</option>
          </select>

        </div>

        {/* Create Button */}
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Create Project
        </Button>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          } else {
            setDialogOpen(true);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingProject
                ? "Edit Project"
                : "Create New Project"}
            </DialogTitle>

            <DialogDescription>
              {editingProject
                ? "Update your project details."
                : "Add a new project to your workspace."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Project Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Project Name
              </label>

              <Input
                placeholder="Enter project name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Description
              </label>

              <Textarea
                placeholder="Enter project description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
              />
            </div>

            {/* Error */}
            {actionError && (
              <p className="text-sm text-destructive">
                {actionError}
              </p>
            )}

            {/* Buttons */}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
                disabled={saving}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={saving}>
                {saving
                  ? "Saving..."
                  : editingProject
                    ? "Save Changes"
                    : "Create Project"}
              </Button>
            </DialogFooter>

          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function ProjectCardMenu({
  project,
  onEdit,
  onDelete,
}: {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => Promise<void>;
}) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.name}"?`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      await onDelete(project._id);
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Failed to delete project."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Project options"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        }
      />

      <DropdownMenuContent align="end">

        {/* Edit */}
        <DropdownMenuItem
          onClick={() => onEdit(project)}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>

        {/* Delete */}
        <DropdownMenuItem
          onClick={handleDelete}
          disabled={deleting}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {deleting ? "Deleting..." : "Delete"}
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}
