"use client";
export const getToken = (): string | null => {
	if (typeof window !== "undefined") {
		return localStorage.getItem("token") || null;
	}
	return null;
};
