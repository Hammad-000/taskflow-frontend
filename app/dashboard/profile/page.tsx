
"use client";

import { useEffect, useState } from "react";
import { User, Mail,  ShieldCheck, CalendarDays, Loader2, ArrowLeft,
} from "lucide-react";
import Link from "next/link";

type UserData = {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  createdAt: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile");
        }

        setUser(data.user);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-7 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-6">
        <User className="size-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Profile Not Found</h2>
        <p className="text-sm text-muted-foreground">
          {error || "Unable to load your account details."}
        </p>
        <Link
          href="/login"
          className="text-sm font-medium text-primary hover:underline"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const profileDetails = [
    {
      label: "Full Name",
      value: user.name,
      icon: User,
    },
    {
      label: "Email Address",
      value: user.email,
      icon: Mail,
    },
    {
      label: "Account Role",
      value: user.role,
      icon: ShieldCheck,
    },
    {
      label: "Member Since",
      value: user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "Not available",
      icon: CalendarDays,
    },
  ];

  return (
    <div className="space-y-8 p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="flex size-9 items-center justify-center rounded-lg border hover:bg-muted transition-colors"
        >
          <ArrowLeft className="size-4" />
        </Link>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            My Profile
          </h1>
          <p className="text-sm text-muted-foreground">
            View your personal account information.
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div className="rounded-xl border bg-card p-6 md:p-8">
          <div className="flex flex-col items-center gap-4 border-b pb-8 sm:flex-row">
            <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {user.email}
              </p>
              <span className="mt-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium capitalize text-primary">
                {user.role}
              </span>
            </div>
          </div>

          {/* Account Details */}
          <div className="mt-7 space-y-6">
            <div>
              <h3 className="text-lg font-semibold">
                Personal Information
              </h3>
              <p className="text-sm text-muted-foreground">
                Your registered account details.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {profileDetails.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="flex items-start gap-3 rounded-lg border p-4"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Icon className="size-5 text-muted-foreground" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="mt-1 break-all text-sm font-semibold capitalize">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
