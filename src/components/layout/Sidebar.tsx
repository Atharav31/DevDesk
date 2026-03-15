"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight, LogOut, Menu } from "lucide-react";
import { useAuth } from "../providers/AuthProvider";
import { useEffect } from "react";
import { Role, SIDEBAR_CONFIG } from "../lib/sidebar.config";
import { useSidebar } from "../providers/SidebarContext";

export default function Sidebar({ role }: { role: Role }) {
	const pathname = usePathname();
	const sections = SIDEBAR_CONFIG[role];
	const { isOpen, toggle, close } = useSidebar();
	const { user, logout } = useAuth();

	useEffect(() => {
		if (pathname.startsWith("/contracts/")) {
			close();
		}
	}, [pathname, close]); // fixed dependency warning

	return (
		<>
			{/* Mobile backdrop */}
			{isOpen && (
				<div
					onClick={close}
					className="fixed inset-0 bg-black/40 z-40 md:hidden"
				/>
			)}

			<aside
				className={`
				fixed md:sticky top-14 z-40 h-[calc(100vh-3.5rem)]
				bg-background border-r
				transition-all duration-300
				flex flex-col
				${isOpen ? "w-64" : "w-16"}
				${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
			`}>
				<hr />

				{/* Content */}
				<div className="flex-1 overflow-y-auto p-2 space-y-6">
					{sections?.map((section, i) => (
						<div key={i}>
							{/* Section title */}
							{section.title && isOpen && (
								<p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
									{section.title}
								</p>
							)}

							<ul className="space-y-1">
								{section.items.map((item) => {
									const active =
										pathname === item.href ||
										pathname.startsWith(item.href + "/");

									return (
										<li key={item.href}>
											<Link
												href={item.href}
												className={`
												flex items-center ${isOpen ? "gap-2" : "justify-center"}
												rounded px-3 py-2 text-sm transition
												${
													active ?
														"bg-muted font-medium text-foreground"
													:	"text-muted-foreground hover:bg-muted"
												}
											`}>
												{/* Icon */}
												{item.icon && <item.icon size={20} />}

												{/* Label */}
												{isOpen && <span>{item.label}</span>}
											</Link>
										</li>
									);
								})}
							</ul>
						</div>
					))}
				</div>
			</aside>
		</>
	);
}
