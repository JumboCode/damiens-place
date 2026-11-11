/**
 * layout.tsx
 *
 * configure layout of successful admin sign in page to match figma
 *
 * created on 15 October 2026
 *
 * by William Balz and Nirvaan Govind
 */

import { requireAdminPage } from "@/lib/admin-auth";
import { ClerkProvider, SignOutButton } from "@clerk/nextjs";
import Image from "next/image";

import logo1 from "@/assets/images/logo1.png";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminPage();

  return (
    <ClerkProvider>
      <div>
        <div className="inline-flex h-full w-full items-center justify-between bg-primary px-4 py-3">
          <div className="flex items-center justify-start gap-2">
            <Image
              src={logo1}
              alt="Damien's Food Pantry logo"
              className="h-10 object-contain"
            />
            <h3 className="text-white">Damien’s Food Pantry</h3>
          </div>

          <SignOutButton redirectUrl="/admin/sign-in">
            <button
              type="button"
              className="inline-flex font-medium shrink-0 cursor-pointer items-center justify-center rounded-[9999px] border-none bg-background px-[20px] py-[10px] leading-[24px] whitespace-nowrap"
            >
              Log out
            </button>
          </SignOutButton>
        </div>
        <main>{children}</main>
      </div>
    </ClerkProvider>
  );
}
