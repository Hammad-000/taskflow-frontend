"use client";

import { useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Mail,
  MoreHorizontal,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Member = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Pending";
  color: string;
};

const initialMembers: Member[] = [
  {
    id: 1,
    name: "Hammad Ahmed",
    email: "hammad@example.com",
    role: "Admin",
    status: "Active",
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: 2,
    name: "Ali Khan",
    email: "ali@example.com",
    role: "Developer",
    status: "Active",
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: 3,
    name: "Sara Ahmed",
    email: "sara@example.com",
    role: "Designer",
    status: "Active",
    color: "bg-pink-100 text-pink-700",
  },
  {
    id: 4,
    name: "Usman Malik",
    email: "usman@example.com",
    role: "Developer",
    status: "Pending",
    color: "bg-amber-100 text-amber-700",
  },
];

export default function TeamPage() {
  const [members, setMembers] = useState(initialMembers);
  const [search, setSearch] = useState("");

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase()) ||
      member.role.toLowerCase().includes(search.toLowerCase())
  );

  const activeMembers = members.filter(
    (member) => member.status === "Active"
  ).length;

  const inviteMember = () => {
    const email = window.prompt("Team member ka email address enter karo:");

    if (!email || !email.includes("@")) {
      if (email) window.alert("Valid email address enter karo.");
      return;
    }

    const exists = members.some(
      (member) => member.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (exists) {
      window.alert("Ye member pehle se team mein hai.");
      return;
    }

    const name = email.split("@")[0].replace(/[._-]/g, " ");

    setMembers((current) => [
      ...current,
      {
        id: Date.now(),
        name: name.replace(/\b\w/g, (letter) => letter.toUpperCase()),
        email: email.trim(),
        role: "Developer",
        status: "Pending",
        color: "bg-amber-100 text-amber-700",
      },
    ]);

    window.alert("Demo member add ho gaya. Abhi real email invite send nahi hota.");
  };

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-muted-foreground">People and permissions</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Team</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your team members and their roles.
          </p>
        </div>

        <Button className="gap-2" onClick={inviteMember}>
          <UserPlus size={18} />
          Invite Member
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Team Members</p>
              <h2 className="mt-2 text-3xl font-bold">{members.length}</h2>
            </div>
            <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
              <Users size={22} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Active Members</p>
              <h2 className="mt-2 text-3xl font-bold">{activeMembers}</h2>
            </div>
            <div className="rounded-xl bg-green-100 p-3 text-green-700">
              <ShieldCheck size={22} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Pending Invites</p>
              <h2 className="mt-2 text-3xl font-bold">
                {members.length - activeMembers}
              </h2>
            </div>
            <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
              <Mail size={22} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="space-y-5 p-5">
          <div>
            <h2 className="text-lg font-semibold">All Members</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              View and manage everyone in your workspace.
            </p>
          </div>

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or role..."
              className="h-10 w-full rounded-md border bg-background pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="flex flex-col gap-3 rounded-xl border p-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center"
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-semibold ${member.color}`}
                >
                  {member.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="mt-1 break-all text-sm text-muted-foreground">
                    {member.email}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant="outline">{member.role}</Badge>
                  <Badge
                    className={
                      member.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }
                  >
                    {member.status}
                  </Badge>
                  <button
                    onClick={() =>
                      window.alert(
                        `${member.name}\nRole: ${member.role}\nStatus: ${member.status}`
                      )
                    }
                    aria-label={`View ${member.name}`}
                    className="rounded-md p-2 text-muted-foreground hover:bg-muted"
                  >
                    <MoreHorizontal size={20} />
                  </button>
                </div>
              </div>
            ))}

            {filteredMembers.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No team members found.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}