"use client";
import { useTheme } from "next-themes";
import { useState, useEffect, } from "react";
import {
  UserRound, Bell, Palette, ShieldCheck, Camera, Save, Mail, LockKeyhole, Monitor,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const [name, setName] = useState("Hammad Ahmed");
  const [email, setEmail] = useState("hammad@example.com");
  const [role, setRole] = useState("MERN Stack Developer");
  const [bio, setBio] = useState(
    "Building projects and improving my development skills."
  );

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [teamUpdates, setTeamUpdates] = useState(false);
  const { theme, setTheme } = useTheme();
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const saveSettings = () => {
    const settings = {
       name, email, role, bio, emailNotifications, taskReminders, teamUpdates, theme,};

    localStorage.setItem("taskflow-settings", JSON.stringify(settings));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  const toggleClass =
    "h-5 w-5 cursor-pointer accent-primary";

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4 md:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-muted-foreground">
            Customize your workspace
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            Settings
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your profile, preferences and notifications.
          </p>
        </div>

        <Button onClick={saveSettings} className="gap-2">
          <Save size={17} />
          Save Changes
        </Button>
      </div>

      {saved && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          Settings saved successfully on this device.
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <UserRound size={20} />
            </div>
            <div>
              <CardTitle>Profile Settings</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Update your personal information.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
              {name.trim().split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "HA"}
            </div>

            <div>
              <p className="font-semibold">{name || "Your Name"}</p>
              <p className="mt-1 text-sm text-muted-foreground">{role}</p>
              <Badge variant="secondary" className="mt-2">
                Free Plan
              </Badge>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Job Title</label>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Your role"
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Tell your team about yourself..."
                className="w-full resize-y rounded-md border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
              <Bell size={20} />
            </div>
            <div>
              <CardTitle>Notifications</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose which updates you want to receive.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="divide-y">
          <label className="flex cursor-pointer items-center justify-between gap-4 py-4">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Receive important updates by email.
              </p>
            </div>
            <input
              type="checkbox"
              className={toggleClass}
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
            />
          </label>

          <label className="flex cursor-pointer items-center justify-between gap-4 py-4">
            <div>
              <p className="font-medium">Task Reminders</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Get reminders about upcoming deadlines.
              </p>
            </div>
            <input
              type="checkbox"
              className={toggleClass}
              checked={taskReminders}
              onChange={(e) => setTaskReminders(e.target.checked)}
            />
          </label>

          <label className="flex cursor-pointer items-center justify-between gap-4 py-4">
            <div>
              <p className="font-medium">Team Updates</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Stay informed about team activity.
              </p>
            </div>
            <input
              type="checkbox"
              className={toggleClass}
              checked={teamUpdates}
              onChange={(e) => setTeamUpdates(e.target.checked)}
            />
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2 text-purple-700">
              <Palette size={20} />
            </div>
            <div>
              <CardTitle>Appearance</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose your preferred theme.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { value: "light", label: "Light", icon: "☀️" },
              { value: "dark", label: "Dark", icon: "🌙" },
              { value: "system", label: "System", icon: "💻" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={`rounded-xl border p-4 text-left transition-colors ${mounted && theme === option.value
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "hover:bg-muted/50"
                  }`}
              >
                <span className="text-xl">{option.icon}</span>

                <p className="mt-3 font-medium">{option.label}</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {!mounted
                    ? "Choose theme"
                    : theme === option.value
                      ? "Selected"
                      : "Choose theme"}
                </p>
              </button>
            ))}
          </div>

        
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-100 p-2 text-amber-700">
              <ShieldCheck size={20} />
            </div>
            <div>
              <CardTitle>Security</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Account security options.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="rounded-lg border p-3">
              <LockKeyhole size={20} />
            </div>
            <div>
              <p className="font-medium">Password</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Change your account password.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() =>
              window.alert("Password change backend authentication ke baad add hoga.")
            }
          >
            Change Password
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={saveSettings} className="gap-2">
          <Save size={17} />
          Save Changes
        </Button>
      </div>
    </div>
  );
}