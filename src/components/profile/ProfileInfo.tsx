/**
 * ProfileInfo.tsx
 *
 * The bordered "Profile" box that sits inside ProfileCard. Lays out label/value
 * pairs so the admin and volunteer dashboards can each pass their own fields.
 *
 * Author: Natalie Phua
 * Date Created: 11/5/2026
 */
import type { ReactNode } from "react";

export type ProfileInfoItem = {
  label: string;
  value: ReactNode;
  // Small icon shown before the label
  icon?: ReactNode;
};

type ProfileInfoCardProps = {
  title?: string;
  items: ProfileInfoItem[];
};

/**
 * ProfileInfoCard
 *
 * Shows a titled box with one label/value pair per item.
 *
 * @param title - heading of the box (defaults to "Profile")
 * @param items - the fields to show, in order
 */
export default function ProfileInfoCard({
  title = "Profile",
  items,
}: ProfileInfoCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 p-4 sm:p-5">
      <h3>{title}</h3>

      <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.label}>
            <dt className="flex items-center gap-2 text-sm font-medium">
              {item.icon}
              {item.label}
            </dt>
            <dd className="mt-1 text-sm whitespace-pre-wrap">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
