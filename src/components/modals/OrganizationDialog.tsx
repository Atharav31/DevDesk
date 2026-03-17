"use client";

import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { createOrganization, updateOrganization } from "@/actions/organization";

import toast from "react-hot-toast";
import { getToken } from "../lib/getToken";

interface Organization {
	id: string;
	name: string;
	slug: string;
	adminEmail?: string;
	adminName?: string;
}

interface Props {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess: () => void;
	mode?: "create" | "edit";
	organization?: Organization | null;
}

const CreateOrganizationDialog: React.FC<Props> = ({
	open,
	onOpenChange,
	onSuccess,
	mode = "create",
	organization,
}) => {
	const [name, setName] = useState("");
	const [slug, setSlug] = useState("");
	const [adminEmail, setAdminEmail] = useState("");
	const [adminName, setAdminName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const token = getToken();
	useEffect(() => {
		if (mode === "edit" && organization) {
			setName(organization.name);
			setSlug(organization.slug);
			setAdminEmail(organization.adminEmail ?? "");
			setAdminName(organization.adminName ?? "");
		}
	}, [organization, mode]);

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setName(value);

		if (mode === "create") {
			const generatedSlug = value
				.toLowerCase()
				.replace(/\s+/g, "-")
				.replace(/[^a-z0-9-]/g, "");

			setSlug(generatedSlug);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			if (mode === "create") {
				await createOrganization(
					{
						name,
						slug,
						adminName,
						adminEmail,
					},
					token!,
				);

				toast.success("Organization created");
			} else {
				await updateOrganization(
					organization!.id,
					{
						name,
						slug,
					},
					token!,
				);

				toast.success("Organization updated");
			}

			onOpenChange(false);
			onSuccess();

			setName("");
			setSlug("");
			setAdminEmail("");
		} catch (error) {
			console.error(error);
			toast.error("Operation failed");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[450px]">
				<DialogHeader>
					<DialogTitle>
						{mode === "create" ? "Create Organization" : "Edit Organization"}
					</DialogTitle>

					<DialogDescription>
						{mode === "create" ?
							"Create a new organization and invite an admin."
						:	"Update organization information."}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="name" className="text-right">
								Name
							</Label>
							<Input
								id="name"
								value={name}
								onChange={handleNameChange}
								className="col-span-3"
								required
							/>
						</div>

						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="slug" className="text-right">
								Slug
							</Label>
							<Input
								id="slug"
								value={slug}
								onChange={(e) => setSlug(e.target.value)}
								className="col-span-3"
								required
							/>
						</div>

						{mode === "create" && (
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="adminName" className="text-right">
									Admin Name
								</Label>
								<Input
									id="adminName"
									value={adminName}
									onChange={(e) => setAdminName(e.target.value)}
									className="col-span-3"
									required
								/>
								<Label htmlFor="adminEmail" className="text-right">
									Admin Email
								</Label>
								<Input
									id="adminEmail"
									type="email"
									value={adminEmail}
									onChange={(e) => setAdminEmail(e.target.value)}
									className="col-span-3"
									required
								/>
							</div>
						)}
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isLoading}>
							Cancel
						</Button>

						<Button type="submit" className="btn-brand" disabled={isLoading}>
							{isLoading ?
								"Saving..."
							: mode === "create" ?
								"Create"
							:	"Update"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default CreateOrganizationDialog;
