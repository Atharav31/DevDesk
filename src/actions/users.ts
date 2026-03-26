import { getBaseUrl } from "@/components/lib/getBaseUrl";

const BASE_URL = getBaseUrl();

// GET USERS (with organizationId)
export async function getOrgUsers(token: string) {
	try {
		const res = await fetch(`${BASE_URL}/api/users`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
			cache: "no-store",
		});

		if (!res.ok) {
			console.error("[getOrgUsers] request failed");
			return null;
		}

		const data = await res.json();
		return data?.users ?? data ?? null;
	} catch (error) {
		console.error("[getOrgUsers] fetch error:", error);
		return null;
	}
}

// CREATE USER
export async function createUser(data: any, token: string) {
	try {
		const res = await fetch(`${BASE_URL}/api/users`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		});

		return await res.json();
	} catch (error) {
		console.error("[createUser] fetch error:", error);
		throw error;
	}
}

// GET SINGLE USER
export async function getUserById(id: string, token: string) {
	try {
		const res = await fetch(`${BASE_URL}/api/users/${id}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return await res.json();
	} catch (error) {
		console.error("[getUserById] fetch error:", error);
		throw error;
	}
}

export async function updateUser(id: string, data: any, token: string) {
	try {
		const res = await fetch(`${BASE_URL}/api/users/${id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		});

		return await res.json();
	} catch (error) {
		console.error("[updateUser] fetch error:", error);
		throw error;
	}
}

// DELETE USER
export async function deleteUser(id: string, token: string) {
	try {
		const res = await fetch(`${BASE_URL}/api/users/${id}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return await res.json();
	} catch (error) {
		console.error("[deleteUser] fetch error:", error);
		throw error;
	}
}

export async function fetchUserProfile(token: string) {
	console.log("🔐 Fetching user profile...");
	console.log("📦 Token:", token);

	try {
		const res = await fetch(`${BASE_URL}/api/users/profile`, {
			credentials: "include",
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
			cache: "no-store",
		});

		console.log("📡 Response status:", res.status);

		const data = await res.json();

		console.log("📥 Response data:", data);

		if (!res.ok) {
			console.error("❌ Failed to fetch profile:", data);
			throw new Error("Failed to fetch profile");
		}

		return data;
	} catch (error) {
		console.error("🔥 Error in fetchUserProfile:", error);
		throw error;
	}
}

export async function updateUserProfile(data: any, token: string) {
	const res = await fetch(`${BASE_URL}/api/users/profile`, {
		method: "PUT",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		throw new Error("Failed to update profile");
	}

	return res.json();
}
