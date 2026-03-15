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

export type Role = "SUPER_ADMIN" | "ADMIN" | "USER";

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
			title: "Company Management",
			items: [
				{
					label: "Company Management",
					href: "/super-admin/companies",
					icon: FileText,
				},
				{
					label: "Approvals",
					href: "/super-admin/approvals",
					icon: CheckCircle,
				},
			],
		},
	],

	USER: [
		{
			title: "Overview",
			items: [
				{
					label: "Dashboard",
					href: "/user/dashboard",
					icon: LayoutDashboard,
				},
			],
		},
		{
			title: "Contracts",
			items: [
				{
					label: "Contracts",
					href: "/user/contracts",
					icon: ClipboardList,
				},
				{
					label: "Templates",
					href: "/user/templates",
					icon: FileText,
				},
				{
					label: "Clauses",
					href: "/user/clauses",
					icon: FileCheck,
				},
			],
		},
		{
			title: "Approvals",
			items: [
				{
					label: "Approvals",
					href: "/user/approvals",
					icon: CheckCircle,
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
			title: "Management",
			items: [
				{
					label: "User Management",
					href: "/admin/users",
					icon: Users,
				},
				{
					label: "Vendor Management",
					href: "/admin/vendors",
					icon: Building2,
				},
			],
		},
	],
};
