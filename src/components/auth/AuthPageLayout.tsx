/**
 * AuthPageLayout.tsx
 *
 * Shared page shell for the volunteer and admin sign-in pages:
 * white background, centered card, logo, and heading. Both sign-in pages stay
 * visually consistent while being built separately.
 *
 * Author: Natalie Phua
 * Date Created: 10/2/2026
 */

import Image from "next/image";
import type { ReactNode } from "react";
import logo from "@/assets/images/logo.png";

type AuthPageLayoutProps = {
  user: string;
  children: ReactNode;
};

export default function AuthPageLayout({
  user,
  children,
}: AuthPageLayoutProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm flex flex-col items-center">
        <Image
          src={logo}
          alt="Damien's Place Logo"
          className="mx-auto mb-8 h-auto w-45"
          priority
        />
        <h1 className="text-center text-4xl font-bold tracking-tight text-black">
          Welcome, <span className="text-secondary">Volunteer</span>!
        </h1>
        <div className="mt-8 w-full text-2xl justify-center font-medium">
          {children}
        </div>
      </div>
    </main>
  );
}
