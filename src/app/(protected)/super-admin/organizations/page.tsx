"use client";
import React, { useEffect, useState } from "react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus, Users, FolderGit2 } from "lucide-react";
import { deleteOrganization, getOrganization } from "@/actions/organization";
import CreateOrganizationDialog from "@/components/modals/OrganizationDialog";
import ConfirmationModal from "@/components/ui/Confirmation";
import { getToken } from "@/components/lib/getToken";

interface Organization {
	id: string;
	name: string;
	slug: string;
	adminEmail?: string;
	createdAt: string;
	_count: {
		users: number;
		projects: number;
	};
}
const OrganizationManager: React.FC = () => {
	const [organizations, setOrganizations] = useState<Organization[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
	const [deleteOrgId, setDeleteOrgId] = useState<string | null>(null);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const token = getToken();
	// Fetch organizations
	const fetchOrganizations = async () => {
		try {
			const response = await getOrganization(token!);
			setOrganizations(response);
		} catch (error) {
			console.error("Failed to fetch organizations", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchOrganizations();
	}, []);

	// Handlers (edit/delete placeholders)
	const onEdit = (org: Organization) => {
		setEditingOrg(org);
		setIsCreateDialogOpen(true);
	};
	const onDelete = (id: string) => {
		setDeleteOrgId(id);
		setIsDeleteOpen(true);
	};

	const handleConfirmDelete = async () => {
		if (!deleteOrgId) return;

		try {
			setIsDeleting(true);

			await deleteOrganization(deleteOrgId, token!);

			setOrganizations((prev) => prev.filter((org) => org.id !== deleteOrgId));

			setIsDeleteOpen(false);
			setDeleteOrgId(null);
		} catch (error) {
			console.error("Delete failed", error);
		} finally {
			setIsDeleting(false);
		}
	};

	const formatDate = (date: string | Date) => {
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		}).format(new Date(date));
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
			</div>
		);
	}

	return (
		<>
			<div className="container mx-auto p-4">
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-2xl font-semibold text-formheading dark:text-foreground">
						Organizations
					</h1>
					<Button
						onClick={() => setIsCreateDialogOpen(true)}
						className="btn-brand inline-flex items-center gap-2 px-4 py-2 rounded-lg">
						<Plus className="h-4 w-4" />
						New Organization
					</Button>
				</div>

				{/* Empty State */}
				{organizations.length === 0 && !isLoading && (
					<div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
						<p className="text-graytext mb-4">No organizations yet</p>
						<Button
							onClick={() => setIsCreateDialogOpen(true)}
							className="btn-brand">
							Create your first organization
						</Button>
					</div>
				)}

				{/* Grid of Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{organizations.map((org) => (
						<Card
							key={org.id}
							className="hover:shadow-lg transition-shadow border border-border dark:bg-card">
							<CardHeader className="pb-2">
								<CardTitle className="text-lg font-semibold text-formheading dark:text-foreground flex items-center justify-between">
									<span className="truncate">{org.name}</span>
									<span className="text-xs font-mono text-graytext bg-muted px-2 py-1 rounded">
										{org.slug}
									</span>
								</CardTitle>
							</CardHeader>

							<CardContent className="space-y-3">
								<p className="text-sm text-graytext flex items-center gap-2">
									<Users className="h-4 w-4 text-brand" />
									<span>{org._count?.users ?? 0} members</span>
								</p>
								<p className="text-sm text-graytext flex items-center gap-2">
									<FolderGit2 className="h-4 w-4 text-brand" />
									<span>{org._count?.projects ?? 0} projects</span>
								</p>
								<p className="text-xs text-muted-foreground">
									Created {formatDate(org.createdAt)}
								</p>
							</CardContent>

							<CardFooter className="flex justify-end gap-2 pt-2 border-t border-border">
								<Button
									variant="ghost"
									size="sm"
									onClick={() => onEdit(org)}
									className="text-muted-foreground hover:text-brand">
									<Pencil className="h-4 w-4" />
									<span className="sr-only">Edit</span>
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => onDelete(org.id)}
									className="text-muted-foreground hover:text-destructive">
									<Trash2 className="h-4 w-4" />
									<span className="sr-only">Delete</span>
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>
			</div>

			{/* Create Organization Dialog */}
			<CreateOrganizationDialog
				open={isCreateDialogOpen}
				onOpenChange={(v) => {
					setIsCreateDialogOpen(v);
					if (!v) setEditingOrg(null);
				}}
				onSuccess={fetchOrganizations}
				mode={editingOrg ? "edit" : "create"}
				organization={editingOrg}
			/>
			<ConfirmationModal
				open={isDeleteOpen}
				title="Delete Organization"
				description="This action cannot be undone. The organization and all related projects and issues will be permanently deleted."
				confirmText="Delete"
				cancelText="Cancel"
				loading={isDeleting}
				onCancel={() => {
					setIsDeleteOpen(false);
					setDeleteOrgId(null);
				}}
				onConfirm={handleConfirmDelete}
			/>
		</>
	);
};

export default OrganizationManager;
