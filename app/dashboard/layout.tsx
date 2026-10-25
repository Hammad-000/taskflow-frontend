import type { ReactNode } from "react";

import { AppSidebar } from "@/components/layout/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />

      <SidebarInset className="min-w-0">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-background px-6">
          <SidebarTrigger />
          <span className="font-semibold">
            TaskFlow Workspace
          </span>
        </header>

<main className="min-w-0 flex-1">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}