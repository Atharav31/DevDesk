import {
	LayoutDashboard,
	FileText,
	FileCheck,
	ClipboardList,
	CheckCircle,
	Users,
	Building2,
} from "lucide-react";

import { LucideIcon } from "lucide-react";

export type Role = "ADMIN" | "DEVELOPER";

export interface SidebarItem {
	label: string;
	href: string;
	icon?: LucideIcon;
	exact?: boolean;
}

export interface SidebarSection {
	title?: string;
	items: SidebarItem[];
}

export const SIDEBAR_CONFIG: Record<Role, SidebarSection[]> = {
	ADMIN: [
		{
			title: "Dashboard",
			items: [
				{
					label: "Dashboard",
					href: "/admin/dashboard",
					icon: LayoutDashboard,
				},
			],
		},
	],
	DEVELOPER: [
		{
			title: "Dashboard",
			items: [
				{
					label: "Dashboard",
					href: "/developer/dashboard",
					icon: LayoutDashboard,
				},
			],
		},
	],
};
