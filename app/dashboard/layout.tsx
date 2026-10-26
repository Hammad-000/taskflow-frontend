import type { ReactNode } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />

      <SidebarInset className="min-w-0">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-background px-4 md:px-6">
          <SidebarTrigger />

          <span className="flex-1 font-semibold">
            TaskFlow Workspace
          </span>

          <ThemeToggle />
        </header>

        <main className="min-w-0 flex-1">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}