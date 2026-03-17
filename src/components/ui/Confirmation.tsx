"use client";

import { ReactNode } from "react";
import { Button } from "./button";

interface ConfirmationModalProps {
	open: boolean;
	title?: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
	loading?: boolean;
	children?: ReactNode;
	onConfirm?: () => void;
	onCancel: () => void;
}

export default function ConfirmationModal({
	open,
	title = "Are you sure?",
	description,
	confirmText,
	cancelText = "Cancel",
	loading = false,
	children,
	onConfirm,
	onCancel,
}: ConfirmationModalProps) {
	if (!open) return null;

	return (
		<div className="modal-overlay">
			<div className="relative w-full max-w-2xl rounded-lg bg-card p-6 shadow-xl">
				{/* HEADER */}
				<h2 className="text-lg font-semibold">{title}</h2>
				{description && (
					<p className="mt-1 text-sm text-graytext">{description}</p>
				)}

				{/* BODY */}
				<div className="mt-4">{children}</div>

				{/* FOOTER (optional) */}
				{onConfirm && (
					<div className="mt-6 flex justify-end gap-3">
						<Button variant="outline" onClick={onCancel}>
							{cancelText}
						</Button>
						<Button onClick={onConfirm} disabled={loading}>
							{loading ? "Processing..." : (confirmText ?? "Confirm")}
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
