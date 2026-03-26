"use client";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Search, Users } from "lucide-react";
import { getToken } from "@/components/lib/getToken";
import { fetchProjects, getProjectMembers } from "@/actions/projects";
import { useAuth } from "@/components/providers/AuthProvider";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Project = {
	id: string;
	name: string;
	key: string;
	description: string | null;
	createdAt: string;
};

export default function ProjectsPage() {
	const { user } = useAuth();
	const token = getToken();

	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");

	const [membersOpen, setMembersOpen] = useState(false);
	const [membersLoading, setMembersLoading] = useState(false);
	const [activeProject, setActiveProject] = useState<Project | null>(null);
	const [members, setMembers] = useState<any[]>([]);

	useEffect(() => {
		if (!user || !token) return;
		(async () => {
			try {
				setLoading(true);
				const data = await fetchProjects(token);
				setProjects(Array.isArray(data) ? data : []);
			} catch {
				toast.error("Could not load projects");
			} finally {
				setLoading(false);
			}
		})();
	}, [user, token]);

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return projects;
		return projects.filter(
			(p) => p.name.toLowerCase().includes(q) || p.key.toLowerCase().includes(q),
		);
	}, [projects, search]);

	const openMembers = async (project: Project) => {
		if (!token) return;
		try {
			setActiveProject(project);
			setMembersOpen(true);
			setMembersLoading(true);
			const data = await getProjectMembers(project.id, token);
			setMembers(Array.isArray(data) ? data : []);
		} catch {
			toast.error("Failed to load members");
		} finally {
			setMembersLoading(false);
		}
	};

	return (
		<div className="container mx-auto p-4">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
				<div>
					<h2 className="text-2xl font-semibold text-formheading dark:text-foreground">
						Projects
					</h2>
					<p className="text-sm text-graytext">
						Projects you have access to in your organization
					</p>
				</div>

				<div className="flex items-center gap-2">
					<div className="relative w-full sm:w-72">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search projects…"
							className="pl-9"
						/>
					</div>
				</div>
			</div>

			{loading ? (
				<div className="flex items-center justify-center h-48">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
				</div>
			) : filtered.length === 0 ? (
				<div className="rounded-lg border border-border p-10 text-center text-graytext">
					No projects found.
				</div>
			) : (
				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{filtered.map((p) => (
						<div
							key={p.id}
							className="card-elevated p-4 flex flex-col gap-2">
							<div className="flex items-start justify-between gap-3">
								<div className="min-w-0">
									<div className="flex items-center gap-2">
										<span className="badge-brand">{p.key}</span>
										<div className="font-semibold truncate">{p.name}</div>
									</div>
									{p.description && (
										<div className="text-sm text-graytext mt-1 line-clamp-2">
											{p.description}
										</div>
									)}
								</div>
							</div>

							<div className="mt-2 flex items-center justify-between">
								<div className="text-xs text-muted-foreground text-mono">
									{new Date(p.createdAt).toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
										year: "numeric",
									})}
								</div>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => openMembers(p)}
									className="text-muted-foreground hover:text-primary">
									<Users className="h-4 w-4 mr-2" />
									Members
								</Button>
							</div>
						</div>
					))}
				</div>
			)}

			<Dialog
				open={membersOpen}
				onOpenChange={(open) => {
					setMembersOpen(open);
					if (!open) {
						setActiveProject(null);
						setMembers([]);
						setMembersLoading(false);
					}
				}}>
				<DialogContent className="sm:max-w-2xl">
					<DialogHeader>
						<DialogTitle>
							{activeProject ? `Members — ${activeProject.name}` : "Members"}
						</DialogTitle>
						<DialogDescription>
							Team members currently added to this project.
						</DialogDescription>
					</DialogHeader>

					{membersLoading ? (
						<div className="flex items-center justify-center h-32">
							<div className="animate-spin rounded-full h-7 w-7 border-b-2 border-brand"></div>
						</div>
					) : members.length === 0 ? (
						<div className="rounded-md border border-border p-6 text-center text-graytext">
							No members yet.
						</div>
					) : (
						<div className="rounded-md border border-border divide-y divide-border">
							{members.map((m: any) => (
								<div
									key={m.id ?? `${m.userId}-${m.role}`}
									className="flex items-center justify-between gap-3 p-3">
									<div className="min-w-0">
										<div className="font-medium truncate">{m.user?.name || "—"}</div>
										<div className="text-xs text-muted-foreground truncate text-mono">
											{m.user?.email || "—"}
										</div>
									</div>
									<div className="text-xs text-mono text-muted-foreground">
										{m.role}
									</div>
								</div>
							))}
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
