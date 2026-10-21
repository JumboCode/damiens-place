/**
 * page.tsx
 *
 * implements access denied page for admin sign in
 *
 * created on 17 October 2026
 *
 * by William Balz and Nirvaan Govind
 */

import { ClerkProvider, SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import logo from "@/assets/images/logo.png";

export default function AdminUnauthorizedPage() {
  return (
    <ClerkProvider>
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-[48px]">
        <div className="flex flex-col items-center justify-start gap-[36px] self-stretch">
          <Image
            src={logo}
            alt="Damien's Food Pantry logo"
            className="h-[82px] w-[202px]"
          />
          <div className="flex flex-col items-center justify-start gap-[48px] self-stretch">
            <div className="w-full text-center text-[40px] font-semibold text-text-primary wrap-break-word [font-family:'Inclusive_Sans']">
              Sorry, you don’t have access to this page
            </div>
          </div>
        </div>
        <SignOutButton redirectUrl="/sign-in">
          <button
            type="button"
            className="cursor-pointer rounded-[9999px] border-none bg-primary px-[33px] py[15px] text-[32px] font-semibold text-background [font-family:'Inclusive_Sans']"
          >
            Return to log in
          </button>
        </SignOutButton>
      </div>
    </ClerkProvider>
  );
}
