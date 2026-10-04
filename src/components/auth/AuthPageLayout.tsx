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
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export default function AuthPageLayout({
  title,
  subtitle,
  children,
}: AuthPageLayoutProps) {
  return (
    <main
      className="flex min-h-screen items-center justify-center bg-background 
      px-4 py-12"
    >
      <div className="w-full max-w-md">
        <Image
          src={logo}
          alt="Damien's Place"
          className="mx-auto mb-8 h-auto w-40"
          priority
        />
        <h1 className="text-center text-2xl font-semibold text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {subtitle}
          </p>
        )}
        <div className="mt-6 flex justify-center">{children}</div>
      </div>
    </main>
  );
}
