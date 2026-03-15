"use client";

import { getBaseUrl } from "@/components/lib/getBaseUrl";
import { getToken } from "@/components/lib/getToken";

const BASE_URL = getBaseUrl();

export async function getOrganization() {
	const token = getToken();
	if (!token) {
		console.warn("[getOrganization] no token found in localStorage");
		return null;
	}

	try {
		const res = await fetch(`${BASE_URL}/api/organizations`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
			cache: "no-store",
		});

		if (!res.ok) {
			console.error("[getOrganization] request failed");
			return null;
		}

		const data = await res.json();
		return data.organizations;
	} catch (error) {
		console.error("[getOrganization] fetch error:", error);
		return null;
	}
}

export async function createOrganization(data: any) {
	const token = getToken();
	if (!token) {
		console.warn("[createOrganization] no token found in localStorage");
		return null;
	}

	try {
		const res = await fetch(`${BASE_URL}/api/organizations`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		});

		return res.json();
	} catch (error) {
		console.error("[createOrganization] fetch error:", error);
		throw error;
	}
}

export async function updateOrganization(id: string, data: any) {
	const token = getToken();
	if (!token) {
		console.warn("[updateOrganization] no token found in localStorage");
		return null;
	}

	try {
		const res = await fetch(`${BASE_URL}/api/organizations/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		});

		return res.json();
	} catch (error) {
		console.error("[updateOrganization] fetch error:", error);
		throw error;
	}
}

export async function deleteOrganization(id: string) {
	const token = getToken();
	if (!token) {
		console.warn("[deleteOrganization] no token found in localStorage");
		return null;
	}

	try {
		const res = await fetch(`${BASE_URL}/api/organizations/${id}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return res.json();
	} catch (error) {
		console.error("[deleteOrganization] fetch error:", error);
		throw error;
	}
}
