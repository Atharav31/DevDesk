"use client";

import { createContext, useContext, useState } from "react";

type SidebarContextType = {
	isOpen: boolean;
	toggle: () => void;
	open: () => void;
	close: () => void;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
	const [isOpen, setIsOpen] = useState(true);

	const toggle = () => setIsOpen((prev) => !prev);
	const open = () => setIsOpen(true);
	const close = () => setIsOpen(false);

	return (
		<SidebarContext.Provider value={{ isOpen, toggle, open, close }}>
			{children}
		</SidebarContext.Provider>
	);
}

export function useSidebar() {
	const context = useContext(SidebarContext);
	if (!context) {
		throw new Error("useSidebar must be used within SidebarProvider");
	}
	return context;
}
