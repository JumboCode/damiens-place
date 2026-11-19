/**
 * VolunteerLogoutButton.tsx
 *
 * Logs out the signed-in volunteer and returns them to the sign-in page.
 *
 * Author: Will & Elijah
 * Date Created: 11/17/26
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
        className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-background px-5 py-2.5 font-medium leading-6 whitespace-nowrap"
      >
        Log out
      </button>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
