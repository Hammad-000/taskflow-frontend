
"use client";

import { useCallback, useState } from "react";

import {
  useProjects,
  type Project,
} from "./hooks/use-projects";

import {
  ProjectActions,
  ProjectCardMenu,
} from "./components/project-actions";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Eye,
} from "lucide-react";

export default function ProjectsPage() {
  const {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
  } = useProjects();

  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleFilteredProjects = useCallback((items: Project[]) => {
    setFilteredProjects(items);
  }, []);

  const handleEdit = async (
    id: string,
    data: { name: string; description: string }
  ) => {
    await updateProject(id, data);
  };

  const getStatus = (status: Project["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-600">Completed</Badge>;
      case "on_hold":
        return <Badge variant="secondary">Planning</Badge>;
      default:
        return <Badge className="bg-blue-600">In Progress</Badge>;
    }
  };

  const totalProjects = projects.length;
  const activeProjects = projects.filter(
    (project) => project.status === "active"
  ).length;
  const completedProjects = projects.filter(
    (project) => project.status === "completed"
  ).length;

  return (
    <div className="w-full max-w-none space-y-8 p-4 md:p-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="mt-2 text-muted-foreground">
          Manage and track all your workspace projects.
        </p>
      </div>

      {/* Project Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Projects</p>
              <h2 className="mt-2 text-3xl font-bold">{totalProjects}</h2>
            </div>
            <FolderKanban className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">In Progress</p>
              <h2 className="mt-2 text-3xl font-bold">{activeProjects}</h2>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <h2 className="mt-2 text-3xl font-bold">{completedProjects}</h2>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
      </div>

      {/* Create, Search and Filter */}
      <ProjectActions
        projects={projects}
        onFilteredProjectsChange={handleFilteredProjects}
        onCreate={createProject}
        onEdit={updateProject}
        editingProject={editingProject}
        onEditingProjectChange={setEditingProject}
      />

      {/* Projects List */}
      <div>
        <div className="mb-5">
          <h2 className="text-xl font-semibold">All Projects</h2>
          <p className="text-sm text-muted-foreground">
            {filteredProjects.length} projects found
          </p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-muted-foreground">
            Loading projects...
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/30 p-6 text-center">
            <p className="text-destructive">{error}</p>
            <Button
              className="mt-3"
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <FolderKanban className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <h3 className="font-semibold">No projects found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Create a project or change your search filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => (
              <Card key={project._id} className="flex flex-col">
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div className="min-w-0">
                    <CardTitle className="break-words text-lg">
                      {project.name}
                    </CardTitle>
                    <div className="mt-3">{getStatus(project.status)}</div>
                  </div>

                  <ProjectCardMenu
                    project={project}
                    onEdit={setEditingProject}
                    onDelete={deleteProject}
                  />
                </CardHeader>

                <CardContent className="flex flex-1 flex-col">
                  <p className="mb-5 line-clamp-3 min-h-14 text-sm text-muted-foreground">
                    {project.description || "No description added."}
                  </p>

                  <div className="mt-auto flex items-center justify-between border-t pt-4">
                    <span className="text-xs text-muted-foreground">
                      {project.createdAt
                        ? new Date(project.createdAt).toLocaleDateString()
                        : "Recently created"}
                    </span>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedProject(project)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* View Project Dialog */}
      <Dialog
        open={!!selectedProject}
        onOpenChange={(open) => !open && setSelectedProject(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedProject?.name}</DialogTitle>
            <DialogDescription>Project details</DialogDescription>
          </DialogHeader>

          {selectedProject && (
            <div className="space-y-4">
              <div>
                <p className="mb-1 text-sm font-medium">Description</p>
                <p className="text-sm text-muted-foreground">
                  {selectedProject.description || "No description added."}
                </p>
              </div>

              <div>
                <p className="mb-1 text-sm font-medium">Status</p>
                {getStatus(selectedProject.status)}
              </div>

              <div>
                <p className="mb-1 text-sm font-medium">Created At</p>
                <p className="text-sm text-muted-foreground">
                  {selectedProject.createdAt
                    ? new Date(selectedProject.createdAt).toLocaleString()
                    : "Not available"}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingProject}
        onOpenChange={(open) => !open && setEditingProject(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Edit functionality is handled by the Project Actions component.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            The Edit dialog should be opened inside the `ProjectActions` component.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
