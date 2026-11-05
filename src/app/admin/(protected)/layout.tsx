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
    <div>
      <div className="inline-flex h-full w-full items-center justify-between bg-primary px-[30px] py-[20px]">
        <div className="flex items-center justify-start gap-2">
          <Image
            src={logo1}
            alt="Damien's Food Pantry logo"
            className="h-[29px] w-[28px] object-contain"
          />
          <h2 className="text-white">Damien’s Food Pantry</h2>
        </div>

        <ClerkProvider>
          <SignOutButton redirectUrl="/admin/sign-in">
            <button
              type="button"
              className="inline-flex font-medium shrink-0 cursor-pointer items-center justify-center rounded-[9999px] border-none bg-background px-[20px] py-[10px] leading-[24px] whitespace-nowrap"
            >
              Log out
            </button>
          </SignOutButton>
        </ClerkProvider>
      </div>
      <main>{children}</main>
    </div>
  );
}
