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
        <div className="flex items-center justify-start gap-[13px]">
          <Image
            src={logo1}
            alt="Damien's Food Pantry logo"
            className="h-[29px] w-[28px] object-contain"
          />
          <div className="text-[18px] font-bold text-white wrap-break-word [font-family:'Inclusive_Sans']">
            Damien’s Food Pantry
          </div>
        </div>

        <ClerkProvider>
          <SignOutButton redirectUrl="/admin/sign-in">
            <button
              type="button"
              className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-[9999px] border-none bg-background px-[20px] py-[10px] text-[18px] leading-[24px] font-medium font-medium whitespace-nowrap text-black [font-family:inherit]"
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
