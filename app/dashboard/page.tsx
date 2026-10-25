import { Card, CardContent } from "@/components/ui/card";
import {
  FolderKanban,
  ListTodo,
  Users,
  CircleCheck,
} from "lucide-react";

const stats = [
  {
    title: "Total Projects",
    value: "12",
    icon: FolderKanban,
  },
  {
    title: "Total Tasks",
    value: "48",
    icon: ListTodo,
  },
  {
    title: "Team Members",
    value: "8",
    icon: Users,
  },
  {
    title: "Completed Tasks",
    value: "32",
    icon: CircleCheck,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back! Here is your workspace overview.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.title}>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="mt-2 text-3xl font-bold">
                    {stat.value}
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

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold">
            Recent Activity
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your recent projects and tasks will appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}