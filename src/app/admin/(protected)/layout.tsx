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
      <div
        style={{
          width: "100%",
          height: "100%",
          paddingLeft: 30,
          paddingRight: 30,
          paddingTop: 20,
          paddingBottom: 20,
          background: "var(--primary)",
          justifyContent: "space-between",
          alignItems: "center",
          display: "inline-flex",
        }}
      >
        <div
          style={{
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 13,
            display: "flex",
          }}
        >
          <Image
            src={logo1}
            alt="Damien's Food Pantry logo"
            style={{ width: 28, height: 29, objectFit: "contain" }}
          />
          <div
            style={{
              color: "white",
              fontSize: 18,
              fontFamily: "Inclusive Sans",
              fontWeight: "700",
              wordWrap: "break-word",
            }}
          >
            Damien’s Food Pantry
          </div>
        </div>

        <ClerkProvider>
          <SignOutButton redirectUrl="/admin/sign-in">
            <button
              type="button"
              style={{
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px 20px",
                background: "var(--background)",
                color: "black",
                borderRadius: 9999,
                border: "none",
                fontSize: 18,
                lineHeight: "24px",
                fontFamily: "inherit",
                fontWeight: 500,
                whiteSpace: "nowrap",
                flexShrink: 0,
                cursor: "pointer",
              }}
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
