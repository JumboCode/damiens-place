// TODO: FILE HEADER
// This line is needed because the tab bar reads the current page's address
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_TABS, isActiveTab } from "./admin-tabs";

// TODO: function contract
export default function AdminTabs() {
    const pathname = usePathname();

    return (
        <nav
            aria-label="Admin sections"
            className="flex items-center flex-col"
        >
            {ADMIN_TABS.map(
                (tab) => {
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            aria-current={isActiveTab(pathname, tab.href) ? "page" : undefined}
                            className={`font-size: 24px, font-style: normal, font-weight: 500, line-height: normal ${
                            
                                isActiveTab(pathname, tab.href) ? "text-primary" : "text-muted-foreground"
                            }`} 
                        >
                            {tab.label}
                        </Link>
                    );
                },
                                                        /* TODO: a <Link> for each tab in ADMIN_TABS.
                                                        The selected tab (isActiveTab(pathname, tab.href)) gets aria-current="page" and the selected look
                                                        from the Figma (maroon text with an underline). The others get a hover style.
                                                        Every link needs a clear focus style for keyboard users. Use our theme classes, not hex codes. */
            )}
            ;
        </nav>
    );
}
