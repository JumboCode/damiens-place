/**
 * NavBar.tsx
 *
 * Top navigation bar showing the Damien's Place logo.
 * Rendered in the root layout.
 *
 * Author: Natalie Phua
 * Date Created: 11/4/26
 */
import Image from "next/image";
import logo from "@/assets/images/logo.png";

export default function NavBar() {
  return (
    <nav className="mb-12 mt-5 flex justify-end px-6 pt-2 md:px-12">
      <Image
        src={logo}
        alt="Damien's Place Logo"
        className="h-15 w-auto object-contain"
        priority
      />
    </nav>
  );
}
