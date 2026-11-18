/**
 * admin-tabs.ts
 *
 * The list of admin dashboard tabs and the check for which tab is active.
 *
 * Author: Jeremiah and Carter
 * Date Created: 11/8/26
 */

export type AdminTab = { label: string; href: string; disabled?: boolean };

// The four tabs, in the order the Figma shows them
export const ADMIN_TABS: AdminTab[] = [
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
export function getVolunteerTabs(volunteerId: string): AdminTab[] {
  const base = `/volunteer/${encodeURIComponent(volunteerId)}`;

  return [
    { label: "Scheduling", href: `${base}/scheduling`, disabled: true },
    { label: "Volunteer Hours", href: base },
    { label: "Resources", href: `${base}/resources`, disabled: true },
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
