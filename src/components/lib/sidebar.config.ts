import {
	LayoutDashboard,
	Users,
	Building2,
	FolderKanban,
	Bug,
} from "lucide-react";

import { LucideIcon } from "lucide-react";

export type Role = "SUPER_ADMIN" | "ADMIN" | "DEVELOPER";

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
	SUPER_ADMIN: [
		{
			title: "Overview",
			items: [
				{
					label: "Dashboard",
					href: "/super-admin/dashboard",
					icon: LayoutDashboard,
				},
			],
		},
		{
			title: "Management",
			items: [
				{
					label: "Organizations",
					href: "/super-admin/organizations",
					icon: Building2,
				},
				{
					label: "Users",
					href: "/super-admin/users",
					icon: Users,
				},
			],
		},
	],

	ADMIN: [
		{
			title: "Overview",
			items: [
				{
					label: "Dashboard",
					href: "/admin/dashboard",
					icon: LayoutDashboard,
				},
			],
		},
		{
			title: "Project Management",
			items: [
				{
					label: "Projects",
					href: "/admin/projects",
					icon: FolderKanban,
				},
				{
					label: "Issues",
					href: "/admin/issues",
					icon: Bug,
				},
				{
					label: "Team Members",
					href: "/admin/users",
					icon: Users,
				},
			],
		},
	],

	DEVELOPER: [
		{
			title: "Overview",
			items: [
				{
					label: "Dashboard",
					href: "/developer/dashboard",
					icon: LayoutDashboard,
				},
			],
		},
		{
			title: "Work",
			items: [
				{
					label: "Projects",
					href: "/developer/projects",
					icon: FolderKanban,
				},
				{
					label: "My Issues",
					href: "/developer/issues",
					icon: Bug,
				},
			],
		},
	],
};
