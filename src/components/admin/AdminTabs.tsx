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
import { ADMIN_TABS, isActiveTab } from "./admin-tabs";

/**
 * AdminTabs
 *
 * Reads the current pathname and renders one <Link> per entry in ADMIN_TABS.
 * The tab where isActiveTab() is true gets
 * aria-current="page" and the selected style.
 * Every other tab gets a hover style.
 *
 * @returns a <nav> that scrolls sideways
 */
export default function AdminTabs() {
    const pathname = usePathname();

    return (
        <nav
            aria-label="Admin sections"
            className="flex w-full gap-2 overflow-x-auto whitespace-nowrap border-b-1 border-[#e5e7eb]"
        >
            {ADMIN_TABS.map(
                (tab) => {
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            aria-current={isActiveTab(pathname, tab.href) ? "page" : undefined}
                            className={`h-[47.297px] text-2xl font-medium leading-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 border-b-3 px-3 ${
                            
                                isActiveTab(pathname, tab.href) ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                            }`} 
                        >
                            {tab.label}
                        </Link>
                    );
                },
            )}
        </nav>
    );
}
