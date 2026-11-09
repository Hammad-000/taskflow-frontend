"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Logout failed");
            }

            router.replace("/login");
            router.refresh();
        } catch {
            alert("Logout nahi ho saka. Dobara try karo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            title="Logout"
            className="flex size-9 shrink-0 items-center justify-center rounded-md text-red-500 hover:bg-red-500/10"
        >
            <LogOut size={18} />
        </button>
    );
}