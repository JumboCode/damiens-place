/**
 * common-tabs.ts
 *
 * Shared tab types, admin and volunteer tab lists, and the active-tab check.
 *
 * Author: Jeremiah and Carter
 * Date Created: 11/8/26
 */

export type CommonTab = { label: string; href: string };

// The four tabs, in the order the Figma shows them
export const ADMIN_TABS: CommonTab[] = [
  { label: "Scheduling", href: "/admin/scheduling" },
  { label: "Applicants", href: "/admin/applicants" },
  { label: "Volunteers", href: "/admin/volunteers" },
  { label: "Edits", href: "/admin/edits" },
];

/**
 * Creates the tabs for a volunteer's dashboard.
 *
 * @param volunteerId - The volunteer's ID
 * @returns The volunteer dashboard tabs
 */
export function getVolunteerTabs(volunteerId: string): CommonTab[] {
  const base = `/volunteer/${encodeURIComponent(volunteerId)}`;

  return [
    { label: "Scheduling", href: `${base}/scheduling` },
    { label: "Volunteer Hours", href: `${base}/hours` },
    { label: "Resources", href: `${base}/resources` },
  ];
}

/**
 * isActiveTab
 *
 * Decides whether a tab should be highlighted for the current page. A tab is
 * active on its own page and on any page under it, but not on a page that only
 * shares the same starting letters (e.g. "/admin/applicants-old" is not under
 * "/admin/applicants").
 *
 * @param pathname - the current page's path
 * @param href - the tab's path
 * @returns true if pathname is href or a path under href, false otherwise
 */
export function isActiveTab(pathname: string, href: string): boolean {
  if (pathname == href || pathname.startsWith(href + "/")) {
    return true;
  } else {
    return false;
  }
}

/**
 * Returns the deepest tab route matching the current path.
 *
 * @param pathname - the current page's path
 * @param tabs - the available dashboard tabs
 * @returns the matching tab's href, or null when no tab matches
 */
export function getActiveTabHref(
  pathname: string,
  tabs: CommonTab[],
): string | null {
  return tabs.reduce<string | null>((activeHref, tab) => {
    if (!isActiveTab(pathname, tab.href)) return activeHref;
    return activeHref === null || tab.href.length > activeHref.length
      ? tab.href
      : activeHref;
  }, null);
}
