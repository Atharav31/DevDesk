"use client";

import React, { useEffect, useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Pencil, Trash2, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { getToken } from "@/components/lib/getToken";
import {
	createUser,
	getOrgUsers,
	deleteUser,
	updateUser,
} from "@/actions/users";

// Types
interface OrgUser {
	userId: string;
	organizationId: string;
	role: string;
	user: {
		id: string;
		name: string | null;
		email: string;
		avatar: string | null;
	};
}

interface UserManagerProps {
	organizationId: string;
	// Optional: current user's role to conditionally show actions
	currentUserRole?: string;
}

// Only Developer role is assignable via this UI
const ASSIGNABLE_ROLES = [{ value: "DEVELOPER", label: "Developer" }];

const UserManager: React.FC<UserManagerProps> = ({
	organizationId,
	currentUserRole = "ADMIN", // assume admin for simplicity
}) => {
	const [users, setUsers] = useState<OrgUser[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
	const [editingUser, setEditingUser] = useState<OrgUser | null>(null);
	const [formName, setFormName] = useState("");
	const [formEmail, setFormEmail] = useState("");
	const [formRole, setFormRole] = useState("DEVELOPER");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const token = getToken();

	const fetchUsers = async () => {
		try {
			const data = await getOrgUsers(token!);
			setUsers(data);
		} catch (error) {
			console.error("Failed to fetch users", error);
			toast.error("Failed to load users");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, [organizationId]);

	const handleAddUser = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			await createUser(
				{
					name: formName,
					email: formEmail,
					role: formRole,
				},
				token!,
			);
			toast.success("User added to organization");
			resetForm();
			setIsDialogOpen(false);
			fetchUsers();
		} catch (error: any) {
			toast.error(error.message || "Failed to add user");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleUpdateUser = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!editingUser) return;
		setIsSubmitting(true);
		try {
			await updateUser(
				editingUser.userId,
				{ name: formName, role: formRole },
				token!,
			);
			toast.success("User updated");
			setIsDialogOpen(false);
			setEditingUser(null);
			fetchUsers();
		} catch (error: any) {
			toast.error(error.message || "Failed to update user");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleRemoveUser = async (user: OrgUser) => {
		if (!confirm(`Are you sure you want to remove ${user.user.email}?`)) return;
		try {
			await deleteUser(user.userId, token!);
			toast.success("User removed from organization");
			fetchUsers();
		} catch (error: any) {
			toast.error(error.message || "Failed to remove user");
		}
	};

	const resetForm = () => {
		setFormName("");
		setFormEmail("");
		setFormRole("DEVELOPER");
	};

	const openAddDialog = () => {
		setDialogMode("add");
		setEditingUser(null);
		resetForm();
		setIsDialogOpen(true);
	};

	const openEditDialog = (user: OrgUser) => {
		setDialogMode("edit");
		setEditingUser(user);
		setFormName(user.user.name || "");
		setFormEmail(user.user.email);
		setFormRole("DEVELOPER"); // only assignable role
		setIsDialogOpen(true);
	};

	const canEdit =
		currentUserRole === "SUPER_ADMIN" || currentUserRole === "ADMIN";

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-4">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-2xl font-semibold text-formheading dark:text-foreground">
					Organization Members
				</h2>
				{canEdit && (
					<Button
						onClick={openAddDialog}
						className="btn-brand inline-flex items-center gap-2">
						<UserPlus className="h-4 w-4" />
						Add Member
					</Button>
				)}
			</div>

			{/* Users Table */}
			<div className="rounded-md border border-border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>User</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Role</TableHead>
							{canEdit && <TableHead className="text-right">Actions</TableHead>}
						</TableRow>
					</TableHeader>
					<TableBody>
						{users.length === 0 ?
							<TableRow>
								<TableCell
									colSpan={canEdit ? 4 : 3}
									className="text-center py-8 text-graytext">
									No members found.
								</TableCell>
							</TableRow>
						:	users.map((entry) => (
								<TableRow key={entry.userId}>
									<TableCell className="font-medium">
										<div className="flex items-center gap-2">
											<Avatar className="h-8 w-8">
												<AvatarImage src={entry.user.avatar || ""} />
												<AvatarFallback>
													{entry.user.name?.charAt(0) ||
														entry.user.email.charAt(0)}
												</AvatarFallback>
											</Avatar>
											<span>{entry.user.name || "—"}</span>
										</div>
									</TableCell>
									<TableCell>{entry.user.email}</TableCell>
									<TableCell>{entry.role}</TableCell>
									{canEdit && (
										<TableCell className="text-right space-x-2">
											<Button
												variant="ghost"
												size="sm"
												onClick={() => openEditDialog(entry)}
												className="text-muted-foreground hover:text-primary">
												<Pencil className="h-4 w-4" />
												<span className="sr-only">Edit</span>
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => handleRemoveUser(entry)}
												className="text-muted-foreground hover:text-destructive">
												<Trash2 className="h-4 w-4" />
												<span className="sr-only">Remove</span>
											</Button>
										</TableCell>
									)}
								</TableRow>
							))
						}
					</TableBody>
				</Table>
			</div>

			{/* Unified Add/Edit Dialog */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="sm:max-w-106.25">
					<DialogHeader>
						<DialogTitle>
							{dialogMode === "add" ? "Add Member" : "Edit Member"}
						</DialogTitle>
						<DialogDescription>
							{dialogMode === "add" ?
								"Enter the user's name, email, and assign the Developer role."
							:	`Update name or role for ${editingUser?.user.email}.`}
						</DialogDescription>
					</DialogHeader>
					<form
						onSubmit={dialogMode === "add" ? handleAddUser : handleUpdateUser}>
						<div className="grid gap-4 py-4">
							{/* Name field (editable in both modes) */}
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="name" className="text-right">
									Name
								</Label>
								<Input
									id="name"
									type="text"
									value={formName}
									onChange={(e) => setFormName(e.target.value)}
									placeholder="John Doe"
									className="col-span-3"
									required
								/>
							</div>

							{/* Email field: editable in add, read-only in edit */}
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="email" className="text-right">
									Email
								</Label>
								<Input
									id="email"
									type="email"
									value={formEmail}
									onChange={(e) => setFormEmail(e.target.value)}
									placeholder="user@example.com"
									className="col-span-3"
									disabled={dialogMode === "edit"}
									required
								/>
							</div>

							{/* Role selector (common for both modes) */}
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="role" className="text-right">
									Role
								</Label>
								<Select value={formRole} onValueChange={setFormRole}>
									<SelectTrigger className="col-span-3">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{ASSIGNABLE_ROLES.map((opt) => (
											<SelectItem key={opt.value} value={opt.value}>
												{opt.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsDialogOpen(false)}
								disabled={isSubmitting}>
								Cancel
							</Button>
							<Button
								type="submit"
								className="btn-brand"
								disabled={isSubmitting}>
								{isSubmitting ?
									dialogMode === "add" ?
										"Adding..."
									:	"Saving..."
								: dialogMode === "add" ?
									"Add Member"
								:	"Save Changes"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default UserManager;
