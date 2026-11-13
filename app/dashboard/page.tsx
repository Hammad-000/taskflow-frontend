
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  FolderKanban,
  ListTodo,
  Users,
  CircleCheck,
} from "lucide-react";

type DashboardStats = {
  totalProjects: number;
  totalTasks: number;
  teamMembers: number;
  completedTasks: number;
};

type RecentProject = {
  _id: string;
  name: string;
  status: "active" | "completed" | "on_hold";
  createdAt: string;
};

type DashboardResponse = {
  success: boolean;
  stats: DashboardStats;
  recentProjects: RecentProject[];
};

const initialStats: DashboardStats = {
  totalProjects: 0,
  totalTasks: 0,
  teamMembers: 0,
  completedTasks: 0,
};

export default function DashboardPage() {
  const [stats, setStats] = useState(initialStats);
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        if (!API_URL) {
          throw new Error("API URL is missing in environment variables");
        }

        const response = await fetch(`${API_URL}/api/dashboard`, {
          method: "GET",
          credentials: "include",
        });

        const data: DashboardResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new Error("Failed to fetch dashboard data");
        }

        setStats(data.stats);
        setRecentProjects(data.recentProjects || []);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError(
          err instanceof Error ? err.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const statsCards = [
    {
      title: "Total Projects",
      value: stats.totalProjects,
      icon: FolderKanban,
    },
    {
      title: "Total Tasks",
      value: stats.totalTasks,
      icon: ListTodo,
    },
    {
      title: "Team Members",
      value: stats.teamMembers,
      icon: Users,
    },
    {
      title: "Completed Tasks",
      value: stats.completedTasks,
      icon: CircleCheck,
    },
  ];

  const getStatusLabel = (status: RecentProject["status"]) => {
    switch (status) {
      case "active":
        return "Active";
      case "completed":
        return "Completed";
      case "on_hold":
        return "On Hold";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back! Here is your workspace overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.title}>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="mt-2 text-3xl font-bold">
                    {loading ? "..." : stat.value}
                  </p>
                </div>

                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <Icon size={22} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold">
            Recent Activity
          </h2>

          {loading ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Loading recent projects...
            </p>
          ) : error ? (
            <p className="mt-4 text-sm text-destructive">
              {error}
            </p>
          ) : recentProjects.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              No projects found. Create your first project!
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {recentProjects.map((project) => (
                <div
                  key={project._id}
                  className="flex flex-col justify-between gap-2 rounded-lg border p-4 sm:flex-row sm:items-center"
                >
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Created on{" "}
                      {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {getStatusLabel(project.status)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
