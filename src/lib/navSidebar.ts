import type { ElementType } from "react";
import {
  Assignment,
  BarChart,
  CalendarMonth,
  Chat,
  ConfirmationNumber,
  Dashboard,
  Forum,
  Inventory2,
  Laptop,
  People,
} from "@mui/icons-material";
import type { UserRole } from "../types";

export interface NavItem {
  label: string;
  path: string;
  icon: ElementType;
}

// Sidebar links per role.
export const navItems: Record<UserRole, NavItem[]> = {
  user: [
    { label: "Overview", path: "/dashboard", icon: Dashboard },
    { label: "My Tickets", path: "/dashboard/tickets", icon: ConfirmationNumber },
    { label: "My Assets", path: "/dashboard/assets", icon: Laptop },
    { label: "Appointments", path: "/dashboard/appointments", icon: CalendarMonth },
    { label: "Messages", path: "/dashboard/messages", icon: Chat },
  ],
  admin: [
    { label: "Dashboard", path: "/admin", icon: Assignment },
    { label: "All Assets", path: "/admin/assets", icon: Inventory2 },
    { label: "Appointments Schedule", path: "/admin/appointments", icon: CalendarMonth },
    { label: "Users & Roles", path: "/admin/users", icon: People },
    { label: "Team Messages", path: "/admin/messages", icon: Forum },
    { label: "System Metrics", path: "/admin/metrics", icon: BarChart },
  ],
};

// Where a role lands after login / on unauthorized redirect.
export function getHomePath(role?: UserRole): string {
  return role === "admin" ? "/admin" : "/dashboard";
}
