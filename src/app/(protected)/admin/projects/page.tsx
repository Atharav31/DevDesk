"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import {
	Plus,
	Edit,
	Trash2,
	Folder,
	X,
	Users,
	Search,
	MoreVertical,
	Hash,
	Calendar,
	ArrowUpRight,
	ShieldCheck,
	UserMinus,
	UserPlus,
} from "lucide-react";
import { getToken } from "@/components/lib/getToken";
import toast from "react-hot-toast";
import {
	fetchProjects,
	createProject,
	updateProject,
	deleteProject,
	getProjectMembers,
	removeProjectMember,
	addProjectMember,
} from "@/actions/projects";
import { getOrgUsers } from "@/actions/users";

interface Project {
	id: string;
	name: string;
	key: string;
	description: string | null;
	organizationId: string;
	createdAt: string;
}

type OrgUserEntry = {
	userId: string;
	role: string;
	user: {
		id: string;
		name: string | null;
		email: string;
		avatar?: string | null;
	};
};

const KEY_COLORS = [
	"#6366F1",
	"#F43F5E",
	"#10B981",
	"#F59E0B",
	"#3B82F6",
	"#8B5CF6",
	"#EC4899",
	"#14B8A6",
];
const getAccent = (key: string) =>
	KEY_COLORS[key.charCodeAt(0) % KEY_COLORS.length];

export default function ProjectsPage() {
	const { user } = useAuth();
	const token = getToken();

	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [modalOpen, setModalOpen] = useState(false);
	const [editingProject, setEditingProject] = useState<Project | null>(null);
	const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
	const [orgUsers, setOrgUsers] = useState<OrgUserEntry[]>([]);
	const [openMenu, setOpenMenu] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		name: "",
		key: "",
		description: "",
	});
	const [submitting, setSubmitting] = useState(false);

	const [formMembers, setFormMembers] = useState<any[]>([]);
	const [loadingMembers, setLoadingMembers] = useState(false);
	const [selectedUserId, setSelectedUserId] = useState("");
	const [addingMember, setAddingMember] = useState(false);

	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node))
				setOpenMenu(null);
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	useEffect(() => {
		if (!user) return;
		(async () => {
			try {
				setLoading(true);
				setProjects((await fetchProjects(token!)) || []);
			} catch {
				toast.error("Could not load projects");
			} finally {
				setLoading(false);
			}
		})();
		getOrgUsers(token!)
			.then((data) =>
				setOrgUsers(Array.isArray(data) ? (data as OrgUserEntry[]) : []),
			)
			.catch(() => {});
	}, [user, token]);

	const loadFormMembers = async (projectId: string) => {
		try {
			setLoadingMembers(true);
			setFormMembers(await getProjectMembers(projectId, token!));
		} catch {
			toast.error("Failed to load members");
		} finally {
			setLoadingMembers(false);
		}
	};

	const openModal = (project?: Project) => {
		if (project) {
			setEditingProject(project);
			setFormData({
				name: project.name,
				key: project.key,
				description: project.description || "",
			});
			loadFormMembers(project.id);
		} else {
			setEditingProject(null);
			setFormData({ name: "", key: "", description: "" });
			setFormMembers([]);
		}
		setSelectedUserId("");
		setModalOpen(true);
		setOpenMenu(null);
	};

	const closeModal = () => {
		setModalOpen(false);
		setEditingProject(null);
		setFormMembers([]);
		setSelectedUserId("");
	};

	const handleAddMember = async () => {
		if (!selectedUserId || !editingProject) return;
		try {
			setAddingMember(true);
			await addProjectMember(editingProject.id, selectedUserId, token!);
			toast.success("Member added");
			setSelectedUserId("");
			loadFormMembers(editingProject.id);
		} catch {
			toast.error("Failed to add member");
		} finally {
			setAddingMember(false);
		}
	};

	const handleRemoveMember = async (userId: string) => {
		if (!editingProject) return;
		try {
			await removeProjectMember(editingProject.id, userId, token!);
			toast.success("Member removed");
			setFormMembers((prev) => prev.filter((m) => m.userId !== userId));
		} catch {
			toast.error("Failed to remove member");
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			setSubmitting(true);
			if (editingProject) {
				const updated = await updateProject(
					editingProject.id,
					formData,
					token!,
				);
				setProjects((prev) =>
					prev.map((p) => (p.id === updated.id ? updated : p)),
				);
				toast.success("Project updated");
			} else {
				const created = await createProject({ ...formData }, token!);
				setProjects((prev) => [...prev, created.project]);
				toast.success("Project created");
			}
			closeModal();
		} catch (err: any) {
			toast.error(err?.message || "Operation failed");
		} finally {
			setSubmitting(false);
		}
	};

	const handleDelete = async (id: string) => {
		try {
			await deleteProject(id, token!);
			setProjects((prev) => prev.filter((p) => p.id !== id));
			toast.success("Project deleted");
			setDeleteConfirm(null);
		} catch (err: any) {
			toast.error(err?.message || "Delete failed");
		}
	};

	const filtered = projects.filter(
		(p) =>
			p.name.toLowerCase().includes(search.toLowerCase()) ||
			p.key.toLowerCase().includes(search.toLowerCase()),
	);

	const availableUsers = orgUsers.filter(
		(entry) => !formMembers.some((m) => m.userId === entry.userId),
	);

	if (loading)
		return (
			<div className="bg-background text-foreground min-h-screen light">
				<div className="flex justify-between items-start pt-9 px-5 md:px-10 gap-4 flex-wrap">
					<div>
						<div className="animate-pulse bg-muted/50 rounded h-8 w-40" />
						<div className="animate-pulse bg-muted/50 rounded h-3.5 w-56 mt-2" />
					</div>
					<div className="animate-pulse bg-muted/50 rounded h-9 w-28" />
				</div>
				<div className="flex gap-px mt-7 mx-5 md:mx-10 bg-border rounded-xl overflow-hidden">
					{[1, 2, 3].map((i) => (
						<div key={i} className="flex-1 bg-card p-4">
							<div className="animate-pulse bg-muted/50 rounded h-5 w-10" />
							<div className="animate-pulse bg-muted/50 rounded h-2.5 w-16 mt-1.5" />
						</div>
					))}
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 p-5 md:p-7 pb-14">
					{[1, 2, 3, 4].map((i) => (
						<div
							key={i}
							className="bg-card border border-border rounded-2xl overflow-hidden">
							<div className="animate-pulse bg-muted/50 h-1" />
							<div className="p-5 md:p-6">
								<div className="animate-pulse bg-muted/50 rounded h-4.5 w-3/4" />
								<div className="animate-pulse bg-muted/50 rounded h-3 w-12 mt-2.5" />
								<div className="animate-pulse bg-muted/50 rounded h-3 w-full mt-3.5" />
							</div>
						</div>
					))}
				</div>
			</div>
		);

	return (
		<div className="bg-background text-foreground min-h-screen light">
			{/* Header */}
			<div className="flex justify-between items-start pt-9 px-5 md:px-10 gap-4 flex-wrap">
				<div>
					<h1 className="text-3xl font-bold tracking-tight text-foreground">
						Projects
					</h1>
					<p className="text-sm text-muted-foreground mt-1">
						All projects in your organization
					</p>
				</div>
				<div className="flex items-center gap-2">
					<label className="flex items-center gap-2 bg-muted/20 border border-border rounded-lg px-3 py-1.5 transition-all focus-within:border-ring focus-within:ring-1 focus-within:ring-ring">
						<Search size={14} className="text-muted-foreground" />
						<input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search projects…"
							className="bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/50 w-32 md:w-40"
						/>
					</label>
					<button
						className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
						onClick={() => openModal()}>
						<Plus size={15} /> New Project
					</button>
				</div>
			</div>

			{/* Stats */}
			<div className="flex gap-px mt-7 mx-5 md:mx-10 bg-border rounded-xl overflow-hidden">
				<div className="flex-1 bg-card p-4">
					<div className="text-2xl font-semibold text-foreground">
						{projects.length}
					</div>
					<div className="font-mono text-xs uppercase tracking-wider text-muted-foreground mt-1">
						Total projects
					</div>
				</div>
				<div className="flex-1 bg-card p-4">
					<div className="text-2xl font-semibold text-foreground">
						{orgUsers.length}
					</div>
					<div className="font-mono text-xs uppercase tracking-wider text-muted-foreground mt-1">
						Org members
					</div>
				</div>
				<div className="flex-1 bg-card p-4">
					<div className="text-2xl font-semibold text-foreground">
						{projects.filter((p) => p.description).length}
					</div>
					<div className="font-mono text-xs uppercase tracking-wider text-muted-foreground mt-1">
						Documented
					</div>
				</div>
			</div>

			{/* Projects Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 p-5 md:p-7 pb-14">
				{filtered.length === 0 ?
					<div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
						<div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-5">
							<Folder size={28} className="text-muted-foreground" />
						</div>
						<div className="text-2xl font-bold text-foreground mb-1.5">
							{search ? "No projects match" : "No projects yet"}
						</div>
						<p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
							{search ?
								"Try a different keyword or clear the search."
							:	"Create your first project to start tracking issues."}
						</p>
						{!search && (
							<button
								className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors mt-5"
								onClick={() => openModal()}>
								<Plus size={15} /> Create Project
							</button>
						)}
					</div>
				:	filtered.map((project, idx) => {
						const accent = getAccent(project.key);
						return (
							<div
								key={project.id}
								className="relative bg-card border border-border rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 animate-fade-in"
								style={{ animationDelay: `${idx * 0.06}s` }}>
								<div className="h-1 w-full" style={{ background: accent }} />
								<div className="p-5 md:p-6">
									<div className="flex justify-between items-start gap-2">
										<div className="flex-1 min-w-0">
											<div className="font-semibold text-foreground text-base tracking-tight">
												{project.name}
											</div>
											<div
												className="inline-flex items-center gap-1 font-mono text-xs font-medium py-1 px-2 rounded-md mt-1"
												style={{
													background: `${accent}18`,
													color: accent,
												}}>
												<Hash size={10} />
												{project.key}
											</div>
										</div>
										<div className="relative">
											<button
												className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-accent/10 hover:text-foreground transition-colors"
												onClick={() =>
													setOpenMenu(
														openMenu === project.id ? null : project.id,
													)
												}>
												<MoreVertical size={15} />
											</button>
											{openMenu === project.id && (
												<div
													className="absolute top-full right-0 mt-1 bg-card border border-border rounded-xl py-1.5 min-w-40 z-40 shadow-xl"
													ref={menuRef}>
													<div
														className="flex items-center gap-2 px-3 py-2 text-sm text-foreground/80 hover:bg-accent/10 rounded-md cursor-pointer"
														onClick={() => openModal(project)}>
														<Edit size={14} /> Edit project
													</div>
													<div
														className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md cursor-pointer"
														onClick={() => {
															setDeleteConfirm(project.id);
															setOpenMenu(null);
														}}>
														<Trash2 size={14} /> Delete project
													</div>
												</div>
											)}
										</div>
									</div>
									{project.description && (
										<p className="text-sm text-muted-foreground mt-2.5 line-clamp-2">
											{project.description}
										</p>
									)}
									<div className="flex items-center gap-1.5 mt-4 pt-3.5 border-t border-border">
										<div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
											<Calendar size={11} />
											{new Date(project.createdAt).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
												year: "numeric",
											})}
										</div>
										<div className="ml-auto flex gap-1">
											<button
												className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-accent/10 hover:text-foreground transition-colors"
												title="Edit project"
												onClick={() => openModal(project)}>
												<ArrowUpRight size={14} />
											</button>
										</div>
									</div>
								</div>
							</div>
						);
					})
				}
			</div>

			{/* Create/Edit Modal */}
			{modalOpen && (
				<div
					className="modal-overlay"
					onClick={(e) => {
						if (e.target === e.currentTarget) closeModal();
					}}>
					<div className="bg-black border border-border rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl animate-fade-up">
						<div className="flex justify-between items-center p-6 pb-0 shrink-0">
							<span className="font-serif text-2xl font-normal text-foreground">
								{editingProject ? "Edit project" : "New project"}
							</span>
							<button
								className="w-8 h-8 rounded-md border border-border bg-card hover:bg-muted transition-colors flex items-center justify-center"
								onClick={closeModal}>
								<X size={16} />
							</button>
						</div>

						<form onSubmit={handleSubmit} className="flex flex-col h-full">
							<div className="p-6 overflow-y-auto flex-1 space-y-4">
								{/* Name */}
								<div>
									<label className="block text-xs font-medium text-foreground/80 mb-1.5 uppercase tracking-wide font-mono">
										Project name *
									</label>
									<input
										className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all placeholder:text-muted-foreground/50"
										type="text"
										required
										value={formData.name}
										onChange={(e) =>
											setFormData((p) => ({ ...p, name: e.target.value }))
										}
										placeholder="e.g. Auth Service"
									/>
								</div>

								{/* Key */}
								<div>
									<label className="block text-xs font-medium text-foreground/80 mb-1.5 uppercase tracking-wide font-mono">
										Project key *
									</label>
									<input
										className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all placeholder:text-muted-foreground/50"
										type="text"
										required
										value={formData.key}
										onChange={(e) =>
											setFormData((p) => ({
												...p,
												key: e.target.value.toUpperCase(),
											}))
										}
										placeholder="e.g. AUTH"
									/>
									<div className="text-xs text-muted-foreground mt-1 font-mono">
										Short uppercase identifier used to prefix issue IDs
									</div>
								</div>

								{/* Description */}
								<div>
									<label className="block text-xs font-medium text-foreground/80 mb-1.5 uppercase tracking-wide font-mono">
										Description
									</label>
									<textarea
										className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all placeholder:text-muted-foreground/50"
										rows={2}
										value={formData.description}
										onChange={(e) =>
											setFormData((p) => ({
												...p,
												description: e.target.value,
											}))
										}
										placeholder="What does this project cover?"
										style={{ resize: "vertical" }}
									/>
								</div>

								{/* Members */}
								<div>
									<label className="block text-xs font-medium text-foreground/80 mb-1.5 uppercase tracking-wide font-mono">
										Team members
									</label>

									{editingProject ?
										<div className="bg-muted/20 border border-border rounded-xl overflow-hidden mt-1">
											<div className="p-3.5 pb-2.5 flex items-center gap-2">
												<div className="text-xs font-semibold text-foreground/80 uppercase tracking-wide font-mono flex items-center gap-1.5">
													<Users size={13} />
													{formMembers.length === 0 ?
														"No members yet"
													:	`${formMembers.length} member${formMembers.length !== 1 ? "s" : ""}`
													}
													{formMembers.length > 0 && (
														<span className="bg-border/50 text-foreground/70 text-xs px-2 py-0.5 rounded-full font-mono">
															{formMembers.length}
														</span>
													)}
												</div>
											</div>

											{/* Add member row */}
											<div className="px-3 pt-0 pb-3 flex gap-2">
												<select
													className="flex-1 border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
													value={selectedUserId}
													onChange={(e) => setSelectedUserId(e.target.value)}>
													<option value="" disabled>
														Select a member to add…
													</option>
													{availableUsers.length === 0 ?
														<option disabled>
															All org members are already added
														</option>
													:	availableUsers.map((entry) => (
															<option key={entry.userId} value={entry.userId}>
																{entry.user.name || "—"} — {entry.user.email}
															</option>
														))
													}
												</select>
												<button
													type="button"
													className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
													disabled={!selectedUserId || addingMember}
													onClick={handleAddMember}>
													<UserPlus size={13} />
													{addingMember ? "Adding…" : "Add"}
												</button>
											</div>

											{/* Member list */}
											{loadingMembers ?
												<div className="flex gap-1 items-center justify-center p-4">
													<span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
													<span
														className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"
														style={{ animationDelay: "150ms" }}
													/>
													<span
														className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"
														style={{ animationDelay: "300ms" }}
													/>
												</div>
											: formMembers.length === 0 ?
												<div className="p-4 text-center text-sm text-muted-foreground">
													Add people from your organization above
												</div>
											:	<div className="border-t border-border divide-y divide-border">
													{formMembers.map((m, i) => {
														const initials = m.user.name
															.split(" ")
															.map((n: string) => n[0])
															.join("")
															.slice(0, 2)
															.toUpperCase();
														const avatarColor = getAccent(initials);
														return (
															<div
																key={m.id}
																className="flex items-center gap-2.5 p-3 hover:bg-muted/20 transition-colors"
																style={{ animationDelay: `${i * 0.04}s` }}>
																<div
																	className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
																	style={{
																		background: `${avatarColor}18`,
																		color: avatarColor,
																	}}>
																	{initials}
																</div>
																<div className="flex-1 min-w-0">
																	<div className="text-sm font-medium text-foreground truncate">
																		{m.user.name}
																	</div>
																	<div className="text-xs text-muted-foreground truncate font-mono">
																		{m.user.email}
																	</div>
																</div>
																<span
																	className={`font-mono text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${
																		m.role === "ADMIN" ?
																			"bg-purple-500/20 text-purple-300"
																		:	"bg-muted/50 text-muted-foreground"
																	}`}>
																	{m.role === "ADMIN" && (
																		<ShieldCheck size={9} />
																	)}
																	{m.role}
																</span>
																<button
																	type="button"
																	className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-destructive/20 hover:text-destructive transition-colors"
																	onClick={() => handleRemoveMember(m.userId)}>
																	<UserMinus size={13} />
																</button>
															</div>
														);
													})}
												</div>
											}
										</div>
									:	<div className="flex items-center gap-2 p-3 bg-muted/20 border border-border rounded-lg text-xs text-muted-foreground">
											<Users size={13} className="text-muted-foreground" />
											You can add team members after creating the project.
										</div>
									}
								</div>
							</div>

							<div className="flex justify-end gap-2 p-6 pt-4 border-t border-border flex-shrink-0">
								<button
									type="button"
									className="inline-flex items-center gap-1.5 px-4 py-2 border border-border rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
									onClick={closeModal}>
									Cancel
								</button>
								<button
									type="submit"
									className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
									disabled={submitting}>
									{submitting ?
										"Saving…"
									: editingProject ?
										"Save changes"
									:	"Create project"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Delete Confirmation Modal */}
			{deleteConfirm && (
				<div
					className="modal-overlay"
					onClick={(e) => {
						if (e.target === e.currentTarget) setDeleteConfirm(null);
					}}>
					<div className="bg-card border border-border rounded-2xl w-full max-w-md flex flex-col shadow-2xl animate-fade-up">
						<div className="flex justify-between items-center p-6 pb-0 flex-shrink-0">
							<span className="font-serif text-2xl font-normal text-destructive">
								Delete project?
							</span>
							<button
								className="w-8 h-8 rounded-md border border-border bg-card hover:bg-muted transition-colors flex items-center justify-center"
								onClick={() => setDeleteConfirm(null)}>
								<X size={16} />
							</button>
						</div>
						<div className="p-6 pt-4 flex-1">
							<p className="text-sm text-muted-foreground leading-relaxed">
								This will permanently delete the project and all its associated
								issues.
								<strong className="text-foreground">
									{" "}
									This cannot be undone.
								</strong>
							</p>
						</div>
						<div className="flex justify-end gap-2 p-6 pt-2 border-t border-border flex-shrink-0">
							<button
								className="inline-flex items-center gap-1.5 px-4 py-2 border border-border rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
								onClick={() => setDeleteConfirm(null)}>
								Cancel
							</button>
							<button
								className="inline-flex items-center gap-1.5 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:bg-destructive/90 transition-colors"
								onClick={() => handleDelete(deleteConfirm)}>
								<Trash2 size={14} /> Delete project
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
