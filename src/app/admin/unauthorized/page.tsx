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
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 48,
          display: "flex",
        }}
      >
        <div
          style={{
            alignSelf: "stretch",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 36,
            display: "flex",
          }}
        >
          <Image
            src={logo}
            alt="Damien's Food Pantry logo"
            style={{ width: 202, height: 82 }}
          />
          <div
            style={{
              alignSelf: "stretch",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 48,
              display: "flex",
            }}
          >
            <div
              style={{
                width: "100%",
                textAlign: "center",
                color: "#1C1E1F",
                fontSize: 40,
                fontFamily: "Inclusive Sans",
                fontWeight: "600",
                wordWrap: "break-word",
              }}
            >
              Sorry, you don’t have access to this page
            </div>
          </div>
        </div>
        <SignOutButton redirectUrl="/sign-in">
          <button
            type="button"
            style={{
              padding: "15px 33px",
              background: "var(--primary)",
              borderRadius: 9999,
              color: "var(--background)",
              fontSize: 32,
              fontFamily: "Inclusive Sans",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            Return to log in
          </button>
        </SignOutButton>
      </div>
    </ClerkProvider>
  );
}
