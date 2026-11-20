/**
 * CommonTabs.tsx
 *
 * Renders shared admin and volunteer tabs. Each tab links to its own page, and
 * the tab for the current page is highlighted.
 *
 * Carter & Jeremiah
 * Date Created: 11/07/2026
 */

// This line is needed because the tab bar reads the current page's address
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_TABS, getActiveTabHref, type CommonTab } from "./common-tabs";

type CommonTabsProps = {
  tabs?: CommonTab[];
  ariaLabel?: string;
};

/**
 * CommonTabs
 *
 * Reads the current pathname and renders links for the supplied tabs.
 * The most specific tab matching the current pathname gets aria-current="page"
 * and the selected style.
 * Other tabs get a hover style.
 *
 * @returns a <nav> that scrolls sideways
 */
export default function CommonTabs({
  tabs = ADMIN_TABS,
  ariaLabel = "Dashboard sections",
}: CommonTabsProps) {
  const pathname = usePathname();
  const activeTabHref = getActiveTabHref(pathname, tabs);

  return (
    <div className="border-b border-dashboard-frame">
      <nav
        aria-label={ariaLabel}
        className="-mb-px flex gap-2 overflow-x-auto whitespace-nowrap"
      >
        {tabs.map((tab) => {
          const activeTab = tab.href === activeTabHref;
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
