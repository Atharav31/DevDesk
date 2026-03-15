"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Menu, User, UserPenIcon } from "lucide-react";
import { useAuth } from "../providers/AuthProvider";
import { useState, useRef, useEffect } from "react";
import { useSidebar } from "../providers/SidebarContext";

export default function Navbar() {
	const { toggle } = useSidebar();
	const { user, logout } = useAuth();
	const router = useRouter();

	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close on outside click
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Close on Escape key
	useEffect(() => {
		function handleEscape(event: KeyboardEvent) {
			if (event.key === "Escape") {
				setIsOpen(false);
			}
		}
		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, []);

	// Get user initials for avatar fallback
	const getUserInitials = () => {
		if (!user?.role) return "";
		return user.role
			.split(" ")
			.map((n: string) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	// Handle logout with confirmation
	const handleLogout = async () => {
		await logout();
		router.push("/login");
	};

	return (
		<header className="fixed top-0 left-0 right-0 z-50 h-14 border-b bg-white/80 backdrop-blur-sm flex items-center justify-between px-4 md:px-6 shadow-sm">
			{/* Left section */}
			<div className="flex items-center gap-3">
				<button
					onClick={toggle}
					className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
					aria-label="Toggle sidebar">
					<Menu size={20} />
				</button>

				<Link href="/" className="flex items-center">
					<img
						src="/devdesk-logo.png"
						alt="DevDesk Logo"
						className="h-8 w-auto"
					/>
				</Link>
			</div>

			{/* Right section (user menu) */}
			<div className="relative" ref={dropdownRef}>
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="flex items-center gap-3 rounded-full hover:bg-gray-100 pr-2 pl-1 py-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
					aria-expanded={isOpen}
					aria-haspopup="true"
					aria-label="User menu">
					{/* Avatar with initials fallback */}
					<div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-semibold">
						{user?.name ? getUserInitials() : <User size={18} />}
					</div>

					{/* User info (hidden on mobile) */}
					<div className="hidden sm:block text-left">
						<p className="font-medium text-sm leading-tight">{user?.name}</p>
						<p className="text-xs text-gray-500 truncate max-w-[150px]">
							{user?.email}
						</p>
					</div>
				</button>

				{/* Dropdown menu */}
				{isOpen && (
					<div
						className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
						role="menu"
						aria-orientation="vertical"
						aria-labelledby="user-menu-button">
						<Link
							href="/profile"
							className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:bg-gray-50 transition-colors"
							role="menuitem"
							onClick={() => setIsOpen(false)}>
							<UserPenIcon size={16} />
							Profile
						</Link>

						<div className="border-t my-1" aria-hidden="true" />

						<button
							onClick={handleLogout}
							className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 focus:outline-none focus-visible:bg-red-50 transition-colors"
							role="menuitem">
							<LogOut size={16} />
							Logout
						</button>
					</div>
				)}
			</div>
		</header>
	);
}
