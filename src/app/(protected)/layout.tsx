"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { getCurrentUserClient } from "@/actions/auth";
import { useSidebar } from "@/components/providers/SidebarContext";
import { hasRouteAccess } from "@/components/lib/checkRouteAccess";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const { toggle, isOpen } = useSidebar();
	const [data, setData] = useState<any>(null);

	const pathname = usePathname();

	useEffect(() => {
		(async () => {
			try {
				const user = await getCurrentUserClient();

				if (!user) {
					router.replace("/");
					return;
				}

				const role = user.user.role;

				const allowed = hasRouteAccess(role, pathname);

				if (!allowed) {
					router.replace(`/${role.toLowerCase()}/dashboard`);
					return;
				}

				setData(user);
			} catch (err) {
				router.replace("/");
			}
		})();
	}, [pathname]);

	if (!data) return null;

	return (
		<div className="flex min-h-screen bg-muted/20">
			{/* Sidebar */}
			<Sidebar role={data.user.role} />

			{/* Main Content Wrapper */}
			<div
				className={`flex flex-col flex-1 transition-all duration-300 ${
					isOpen ? "md:ml-0" : "md:ml-20"
				}`}>
				{/* Mobile Header */}
				<header className="md:hidden flex items-center justify-between px-4 py-3 border-b bg-background">
					<button
						onClick={toggle}
						className="p-2 rounded hover:bg-muted transition">
						<Menu size={20} />
					</button>

					<h1 className="text-sm font-semibold">Inventory Dashboard</h1>
				</header>

				{/* Page Content */}
				<div className="flex flex-col flex-1">
					{/* Top Navbar */}
					<Navbar />

					{/* Page Content */}
					<main className="flex-1 overflow-y-auto mt-14">{children}</main>
				</div>
			</div>
		</div>
	);
}
