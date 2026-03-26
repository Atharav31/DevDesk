"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import {
	Mail,
	User,
	Phone,
	KeyRound,
	ShieldCheck,
	ExternalLink,
} from "lucide-react";

import { fetchUserProfile, updateUserProfile } from "@/actions/users";
import ForgotPasswordDialog from "@/components/modals/ForgotPasswordDialog";
import toast from "react-hot-toast";
import { getToken } from "@/components/lib/getToken";

// ---------- Types ----------
interface UserProfile {
	id: string;
	name: string;
	email: string;
	phone?: string;
	role: string;
	avatar?: string;
	// extra fields may still come from API but are not shown
}

// ---------- Component ----------
export default function ProfilePage() {
	const { user } = useAuth();
	const token = getToken();

	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [form, setForm] = useState<Partial<UserProfile>>({});
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [openReset, setOpenReset] = useState(false);

	// Editable fields configuration
	const editableFields = [
		{ key: "name" as const, label: "Full Name", icon: User, type: "text" },
		{ key: "phone" as const, label: "Phone", icon: Phone, type: "tel" },
	];

	// Fetch profile
	useEffect(() => {
		const loadProfile = async () => {
			try {
				const data = await fetchUserProfile(token!);
				setProfile(data);
				setForm(data);
			} catch (err) {
				console.error("Error fetching profile:", err);
				toast.error("Failed to load profile");
			} finally {
				setLoading(false);
			}
		};

		if (user) loadProfile();
	}, [user, token]);

	const handleChange = (key: keyof UserProfile, value: string) => {
		setForm((prev) => ({ ...prev, [key]: value }));
	};

	const handleSave = async () => {
		try {
			setSaving(true);
			const updated = await updateUserProfile(form, token!);
			setProfile(updated.user);
			setForm(updated.user);
			toast.success("Profile updated successfully");
		} catch (err: any) {
			console.error(err);
			toast.error(err?.message || "Failed to update profile");
		} finally {
			setSaving(false);
		}
	};

	// Loading state with skeleton
	if (loading) {
		return (
			<div className="p-8 bg-gray-50 min-h-screen animate-pulse">
				<div className="mb-6">
					<div className="h-8 w-48 bg-gray-200 rounded"></div>
					<div className="h-4 w-64 bg-gray-200 rounded mt-2"></div>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
						<div className="flex items-center gap-4">
							<div className="h-16 w-16 rounded-full bg-gray-200"></div>
							<div className="space-y-2">
								<div className="h-5 w-32 bg-gray-200 rounded"></div>
								<div className="h-4 w-48 bg-gray-200 rounded"></div>
							</div>
						</div>
						{[1, 2, 3].map((i) => (
							<div key={i} className="h-12 bg-gray-200 rounded"></div>
						))}
					</div>
					<div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
						<div className="h-6 w-36 bg-gray-200 rounded"></div>
						{[1, 2].map((i) => (
							<div key={i} className="h-8 bg-gray-200 rounded"></div>
						))}
					</div>
				</div>
			</div>
		);
	}

	if (!profile) return null;

	return (
		<div className="p-8 bg-gray-50 min-h-screen">
			{/* Header */}
			<div className="mb-6">
				<h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
				<p className="text-gray-500 text-sm">Manage your account information</p>
			</div>

			{/* Two-column layout */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Profile Card */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					{/* Avatar + name/email */}
					<div className="flex items-center gap-4 mb-6">
						<div className="h-16 w-16 rounded-full bg-brand text-white flex items-center justify-center text-xl font-bold overflow-hidden shadow-sm">
							{profile.avatar ?
								<img
									src={profile.avatar}
									alt={profile.name || "User"}
									className="w-full h-full object-cover"
								/>
							: profile.name ?
								profile.name
									.split(" ")
									.map((n) => n[0])
									.join("")
									.slice(0, 2)
									.toUpperCase()
							:	<User size={24} />}
						</div>
						<div>
							<h2 className="font-semibold text-lg text-gray-900">
								{profile.name}
							</h2>
							<p className="text-sm text-gray-500">{profile.email}</p>
						</div>
					</div>

					{/* Editable fields */}
					<div className="space-y-4">
						{editableFields.map((field) => {
							const Icon = field.icon;
							return (
								<div key={field.key}>
									<label
										htmlFor={field.key}
										className="text-sm text-gray-600 font-medium">
										{field.label}
									</label>
									<div className="flex items-center border border-gray-300 rounded-md px-3 py-2 mt-1 focus-within:ring-2 focus-within:ring-brand/20 focus-within:border-brand transition">
										<Icon size={16} className="text-gray-400 mr-2" />
										<input
											id={field.key}
											type={field.type}
											className="w-full outline-none text-sm bg-transparent"
											value={form[field.key] || ""}
											onChange={(e) => handleChange(field.key, e.target.value)}
										/>
									</div>
								</div>
							);
						})}

						{/* Email (read-only) */}
						<div>
							<label className="text-sm text-gray-600 font-medium">Email</label>
							<div className="flex items-center border border-gray-300 rounded-md px-3 py-2 mt-1 bg-gray-50 text-gray-700">
								<Mail size={16} className="text-gray-400 mr-2" />
								{profile.email}
							</div>
						</div>

						{/* Buttons */}
						<div className="flex gap-3 pt-2">
							<button
								onClick={handleSave}
								disabled={saving}
								className="px-5 py-2 rounded-md bg-brand text-white text-sm font-medium hover:bg-brand-dark transition disabled:opacity-50 disabled:cursor-not-allowed">
								{saving ? "Saving..." : "Save Changes"}
							</button>
							<button
								onClick={() => setOpenReset(true)}
								className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition">
								<KeyRound size={16} />
								Forgot Password
							</button>
						</div>
					</div>
				</div>

				{/* Account Details Card */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h2 className="font-semibold text-lg mb-4 text-gray-900">
						Account Details
					</h2>
					<div className="space-y-3 text-sm">
						<InfoRow label="User ID" value={profile.id} />
						<InfoRow label="Role" value={profile.role} />
					</div>

					{/* Optional: if you want to show a subtle divider */}
					<div className="border-t border-gray-100 my-4"></div>

					{/* Permissions (as per design, not shown, but if you want to keep them you can add a separate section later) */}
					{/* We omit permissions to match the design exactly */}
				</div>
			</div>

			{/* Forgot password dialog */}
			<ForgotPasswordDialog
				isOpen={openReset}
				onClose={() => setOpenReset(false)}
			/>
		</div>
	);
}

// ---------- Helper Component ----------
function InfoRow({ label, value }: { label: string; value: string | number }) {
	return (
		<div className="flex justify-between py-1">
			<span className="text-gray-500">{label}</span>
			<span className="font-medium text-gray-900">{value}</span>
		</div>
	);
}
