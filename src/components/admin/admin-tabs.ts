// TODO: FILE HEADER

export type AdminTab = { label: string; href: string };

// The four tabs, in the order the Figma shows them
export const ADMIN_TABS: AdminTab[] = [
  { label: "Scheduling", href: "/admin/scheduling" },
  { label: "Applicants", href: "/admin/applicants" },
  { label: "Volunteers", href: "/admin/volunteers" },
  { label: "Edits", href: "/admin/edits" },
];


// TODO: function contract
export function isActiveTab(pathname: string, href: string): boolean {
  // TODO: true for the same path, or a path under it. "/admin/applicants-old" must NOT count as under "/admin/applicants".
  if (pathname == href || pathname.startsWith(href + '/')) {
    return true;
  }
  else {
    return false;
  }
}