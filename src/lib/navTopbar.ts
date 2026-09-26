import { navItems } from "./navSidebar";

const extraTitles: Record<string, string> = {
  "/dashboard/tickets/new": "New Ticket",
  "/profile": "Profile",
};

export function getPageTitle(pathname: string): string {
  for (const items of Object.values(navItems)) {
    const match = items.find((item) => item.path === pathname);
    if (match) return match.label;
  }
  if (extraTitles[pathname]) return extraTitles[pathname];
  if (/\/tickets\/[^/]+$/.test(pathname)) return "Ticket Details";
  return "IT Service Desk";
}
