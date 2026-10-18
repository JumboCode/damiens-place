/**
 * page.tsx (dropdown-test)
 *
 * Temporary page for trying out CommonDropdown. Delete before merging.
 *
 * Author: Natalie Phua
 * Date Created: 10/17/2026
 */

// This line is needed because the page remembers what is selected
"use client";

import { useState } from "react";
import CommonDropdown from "@/components/common/CommonDropdown";

const options = [
  { value: "community-outreach", label: "Community Outreach" },
  { value: "dot-truck-drivers", label: "DOT Certified Truck Drivers" },
  { value: "guest-intake", label: "Guest Intake" },
  { value: "home-deliveries", label: "Home Deliveries" },
  { value: "inside-traffic-control", label: "Inside Traffic Control" },
  { value: "newsletter", label: "Newsletter" },
  { value: "operations", label: "Operations" },
  { value: "outside-wait-list", label: "Outside Wait List" },
  { value: "parking-lot", label: "Parking Lot" },
  { value: "social-media", label: "Social Media" },
  { value: "social-services-liaison", label: "Social Services Liaison" },
  { value: "super-volunteer", label: "Super Volunteer" },
  { value: "translator", label: "Translator" },
];

export default function DropdownTestPage() {
  // Two separate dropdowns, to check that each one keeps its own selections
  const [first, setFirst] = useState<string[]>([]);
  const [second, setSecond] = useState<string[]>(["newsletter"]);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 p-8">
      <h1 className="text-xl font-bold">CommonDropdown test</h1>

      <section className="flex max-w-sm flex-col gap-2">
        {/* The dropdown has no label of its own, so the page adds one */}
        <p className="font-medium">
          Position of Interest <span className="text-red-600">*</span>
        </p>
        <CommonDropdown
          options={options}
          selectedValues={first}
          onChange={setFirst}
        />
      </section>

      <p className="text-gray-600">
        This text sits right below the first dropdown. When the list opens, it
        should cover this text instead of pushing it down.
      </p>

      <section className="flex max-w-sm flex-col gap-2">
        <p className="font-medium">
          Second dropdown (starts with one selected)
        </p>
        <CommonDropdown
          options={options}
          selectedValues={second}
          onChange={setSecond}
        />
      </section>

      <pre className="rounded-md bg-gray-100 p-4 text-sm">
        {JSON.stringify({ first, second }, null, 2)}
      </pre>
    </main>
  );
}
