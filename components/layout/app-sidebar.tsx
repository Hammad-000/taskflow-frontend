"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Settings,
  Plus,
  Command,
  ChevronsUpDown,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";

const mainLinks = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    url: "/dashboard/projects",
    icon: FolderKanban,
  },
  {
    title: "My Tasks",
    url: "/dashboard/tasks",
    icon: CheckSquare,
  },
  {
    title: "Team",
    url: "/dashboard/team",
    icon: Users,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="p-1">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="TaskFlow"
              render={<Link href="/dashboard" />}
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Command className="size-5" />
              </div>

              <div className="grid flex-2 text-left text-sm leading-tight">
                <span className="truncate font-bold">TaskFlow</span>
                <span className="truncate text-xs text-muted-foreground">
                  Project Workspace
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="px-2">
        <SidebarGroup>
          <div className="mb-2 flex items-center justify-between px-2">
            <SidebarGroupLabel>WORKSPACE</SidebarGroupLabel>

            <Button
              variant="ghost"
              size="icon"
              className="size-7 shrink-0"
              aria-label="Create project"
              title="Create project"
              onClick={() =>
                window.alert("Create Project feature coming soon!")
              }
            >
              <Plus className="size-4" />
            </Button>
          </div>

          <SidebarMenu>
            {mainLinks.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.url === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname === item.url ||
                    pathname.startsWith(`${item.url}/`);

              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    render={<Link href={item.url} />}
                    isActive={isActive}
                    tooltip={item.title}
                    className="h-10"
                  >
                    <Icon className="size-4 shrink-0" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>GENERAL</SidebarGroupLabel>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="/dashboard/settings" />}
                isActive={
                  pathname === "/dashboard/settings" ||
                  pathname.startsWith("/dashboard/settings/")
                }
                tooltip="Settings"
                className="h-10"
              >
                <Settings className="size-4 shrink-0" />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Hammad · Free Plan"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted font-semibold">
                H
              </div>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Hammad</span>
                <span className="truncate text-xs text-muted-foreground">
                  Free Plan
                </span>
              </div>

              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}