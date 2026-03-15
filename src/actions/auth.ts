"use client";

import { getBaseUrl } from "@/components/lib/getBaseUrl";
import { getToken } from "@/components/lib/getToken";

const BASE_URL = getBaseUrl();
export async function getCurrentUserClient() {
	const token = getToken();
	if (!token) {
		console.warn("[getCurrentUserClient] no token found in localStorage");
		return null;
	}

	console.log("[getCurrentUserClient] sending request to /api/auth/me");

	try {
		const res = await fetch(`${BASE_URL}/api/auth/me`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
			},
			cache: "no-store",
		});

		console.log(
			"[getCurrentUserClient] response status:",
			res.status,
			res.statusText,
		);

		if (!res.ok) {
			console.error("[getCurrentUserClient] request failed");
			return null;
		}

		const data = await res.json();
		console.log("[getCurrentUserClient] response body:", data);

		return data;
	} catch (error) {
		console.error("[getCurrentUserClient] fetch error:", error);
		return null;
	}
}

export async function loginUser(data: any) {
	try {
		const res = await fetch(`${BASE_URL}/api/auth/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
			credentials: "include",
		});

		return res.json();
	} catch (error) {
		throw error;
	}
}
export async function forgetPassword(email: string) {
	try {
		const res = await await fetch(`${BASE_URL}/api/auth/forgot-password`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email }),
		});

		return res.json();
	} catch (error) {
		throw error;
	}
}

export async function GetCurrentUserData(token: string) {
	try {
		const res = await fetch(`${BASE_URL}/api/auth/current-user`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!res.ok) {
			throw new Error("Failed to fetch user data");
		}

		return await res.json();
	} catch (error: any) {
		console.error(error);
		throw new Error(error);
	}
}
