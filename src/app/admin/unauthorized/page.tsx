/**
 * page.tsx
 *
 * implements access denied page for admin sign in
 *
 * created on 17 October 2026
 *
 * by William Balz and Nirvaan Govind
 */
"use client";
import { useRouter } from "next/navigation";
import { ClerkProvider } from "@clerk/nextjs";
import Image from "next/image";
import logo from "@/assets/images/logo.png";
import CommonButton from "@/components/common/CommonButton";

export default function AdminUnauthorizedPage() {
  const router = useRouter();
  return (
    <ClerkProvider>
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-[48px]">
        <div className="flex flex-col items-center justify-start gap-[36px] self-stretch">
          <Image
            src={logo}
            alt="Damien's Food Pantry logo"
            className="h-[82px] w-[202px]"
          />
          <h1 className="text-4xl font-semibold">
            Sorry, you don&apos;t have access to this page.
          </h1>
        </div>
        <CommonButton
          title="Return to login"
          onClick={() => {
            router.push("/admin/sign-in");
          }}
          size="lg"
        />
      </div>
    </ClerkProvider>
  );
}
