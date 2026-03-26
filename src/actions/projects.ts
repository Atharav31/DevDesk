import { getBaseUrl } from "@/components/lib/getBaseUrl";

const BASE_URL = getBaseUrl();

// 🔹 GET ALL PROJECTS
export async function fetchProjects(token: string) {
	try {
		const res = await fetch(`${BASE_URL}/api/projects`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
			cache: "no-store",
		});
		console.log(res, "fetchProjects response");
		if (!res.ok) {
			console.error("[fetchProjects] request failed");
			return null;
		}

		const data = await res.json();
		return data.projects || data;
	} catch (error) {
		console.error("[fetchProjects] fetch error:", error);
		return null;
	}
}

// 🔹 CREATE PROJECT
export async function createProject(data: any, token: string) {
	try {
		const res = await fetch(`${BASE_URL}/api/projects`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		});

		if (!res.ok) {
			throw new Error("Failed to create project");
		}

		return res.json();
	} catch (error) {
		console.error("[createProject] fetch error:", error);
		throw error;
	}
}

// 🔹 UPDATE PROJECT
export async function updateProject(id: string, data: any, token: string) {
	try {
		const res = await fetch(`${BASE_URL}/api/projects/${id}`, {
			method: "PUT", // or PATCH based on your backend
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		});

		if (!res.ok) {
			throw new Error("Failed to update project");
		}

		return res.json();
	} catch (error) {
		console.error("[updateProject] fetch error:", error);
		throw error;
	}
}

// 🔹 DELETE PROJECT
export async function deleteProject(id: string, token: string) {
	try {
		const res = await fetch(`${BASE_URL}/api/projects/${id}`, {
			method: "DELETE", // adjust if your backend uses POST
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!res.ok) {
			throw new Error("Failed to delete project");
		}

		return res.json();
	} catch (error) {
		console.error("[deleteProject] fetch error:", error);
		throw error;
	}
}
export async function getProjectMembers(projectId: string, token: string) {
	try {
		const res = await fetch(`${BASE_URL}/api/projects/${projectId}/members`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
			cache: "no-store",
		});

		if (!res.ok) {
			console.error("[getProjectMembers] request failed");
			return [];
		}

		const data = await res.json();
		return data.members || [];
	} catch (error) {
		console.error("[getProjectMembers] fetch error:", error);
		return [];
	}
}
export async function addProjectMember(
	projectId: string,
	userId: string,
	token: string,
) {
	try {
		const res = await fetch(`${BASE_URL}/api/projects/${projectId}/members`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ userId }),
		});

		if (!res.ok) {
			throw new Error("Failed to add project member");
		}

		return res.json();
	} catch (error) {
		console.error("[addProjectMember] fetch error:", error);
		throw error;
	}
}
export async function removeProjectMember(
	projectId: string,
	userId: string,
	token: string,
) {
	try {
		const res = await fetch(
			`${BASE_URL}/api/projects/${projectId}/members/${userId}`,
			{
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		);

		if (!res.ok) {
			throw new Error("Failed to remove project member");
		}

		return res.json();
	} catch (error) {
		console.error("[removeProjectMember] fetch error:", error);
		throw error;
	}
}
