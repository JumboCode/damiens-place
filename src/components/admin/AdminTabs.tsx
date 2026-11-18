/**
 * AdminTabs.tsx
 *
 * Implemented the admin tab bar. Each tab is a link to its own page, and the tab
 * for the current page is highlighted.
 *
 * Carter & Jeremiah
 * Date Created: 11/07/2026
 */

// This line is needed because the tab bar reads the current page's address
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_TABS, isActiveTab, type AdminTab } from "./admin-tabs";

type AdminTabsProps = {
  tabs?: AdminTab[];
  ariaLabel?: string;
};

/**
 * AdminTabs
 *
 * Reads the current pathname and renders links for enabled tabs
 * and noninteractive text for disabled tabs.
 * The tab where isActiveTab() is true gets
 * aria-current="page" and the selected style.
 * Other enabled tabs get a hover style.
 *
 * @returns a <nav> that scrolls sideways
 */
export default function AdminTabs({
  tabs = ADMIN_TABS,
  ariaLabel = "Admin sections",
}: AdminTabsProps) {
  const pathname = usePathname();

  return (
    <div className="border-b border-input-hover-frame">
      <nav
        aria-label={ariaLabel}
        className="-mb-px flex gap-2 overflow-x-auto whitespace-nowrap"
      >
        {tabs.map((tab) => {
          if (tab.disabled) {
            return (
              <span
                key={tab.href}
                aria-disabled="true"
                className="border-b-2 border-transparent px-4 pb-2 pt-3 text-lg font-medium leading-normal text-muted-foreground opacity-50"
              >
                {tab.label}
              </span>
            );
          }
          const activeTab = isActiveTab(pathname, tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={activeTab ? "page" : undefined}
              className={`border-b-2 px-4 pb-2 pt-3 text-lg font-medium leading-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary ${
                activeTab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
