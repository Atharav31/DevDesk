"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserClient } from "@/actions/auth";
import { getToken } from "../lib/getToken";

type AuthContextType = {
	user: any;
	loading: boolean;
	setUser: (user: any) => void;
	logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const router = useRouter();

	// ✅ Hydrate immediately
	const [user, setUser] = useState<any>(() => {
		if (typeof window === "undefined") return null;
		const stored = localStorage.getItem("user");
		return stored ? JSON.parse(stored) : null;
	});

	// ✅ loading depends on hydration
	const [loading, setLoading] = useState(() => {
		if (typeof window === "undefined") return true;
		return !localStorage.getItem("user");
	});

	useEffect(() => {
		const token = getToken();

		if (!token) {
			setUser(null);
			setLoading(false);
			return;
		}

		(async () => {
			try {
				const res = await getCurrentUserClient();
				if (res?.user?.userId) {
					setUser(res.user);
					localStorage.setItem("user", JSON.stringify(res.user));
				} else {
					setUser(null);
					localStorage.removeItem("user");
				}
			} catch {
				setUser(null);
				localStorage.removeItem("user");
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const logout = () => {
		localStorage.removeItem("ClmsToken");
		localStorage.removeItem("user");
		setUser(null);
		router.replace("/login");
	};

	return (
		<AuthContext.Provider value={{ user, loading, setUser, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
	return ctx;
};
