/**
 * layout.tsx
 *
 * volunteer layout with the top bar and logout button
 *
 * Author: William
 * Date created: 15 November 2026
 */
import Image from "next/image";
import VolunteerLogoutButton from "./VolunteerLogoutButton";
import logo1 from "@/assets/images/logo1.png";

export default function VolunteerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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

        <VolunteerLogoutButton />
      </div>

      <main>{children}</main>
    </div>
  );
}
