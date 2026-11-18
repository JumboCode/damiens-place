/**
 * file header
 */

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { logoutVolunteer } from "@/lib/volunteer-api";

export default function VolunteerLogoutButton() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleLogout() {
    setError("");

    const success = await logoutVolunteer();

    if (success) {
      router.replace("/sign-in");
    } else {
      setError("Could not log out. Please try again.");
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleLogout}
        className="inline-flex font-medium shrink-0 cursor-pointer items-center justify-center rounded-[9999px] border-none bg-background px-[20px] py-[10px] leading-[24px] whitespace-nowrap"
      >
        Log out
      </button>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}