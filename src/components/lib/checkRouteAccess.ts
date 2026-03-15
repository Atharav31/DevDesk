import { Role, SIDEBAR_CONFIG } from "./sidebar.config";
export const ROLE_DASHBOARD: Record<Role, string> = {
	ADMIN: "/admin/dashboard",
	DEVELOPER: "/developer/dashboard",
};
export const COMMON_ROUTES = [
	"/profile",
	"/settings",
	"/notifications",
	"/audit-trail",
	"/404",
];
export function hasRouteAccess(role: Role, pathname: string) {
	const sections = SIDEBAR_CONFIG[role] || [];

	// 1️⃣ Check sidebar routes
	for (const section of sections) {
		for (const item of section.items) {
			if (pathname.startsWith(item.href)) {
				return true;
			}
		}
	}

	// 2️⃣ Allow common routes
	for (const route of COMMON_ROUTES) {
		if (pathname.startsWith(route)) {
			return true;
		}
	}

	// 3️⃣ Check role prefix
	const rolePrefix = role.toLowerCase().replace(/_/g, "-");

	if (pathname.startsWith(`/${rolePrefix}`)) {
		return true;
	}

	return false;
}
