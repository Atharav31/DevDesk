"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import {
	Mail,
	User,
	Building2,
	Phone,
	ShieldCheck,
	KeyRound,
} from "lucide-react";

import { fetchUserProfile, updateUserProfile } from "@/actions/users";
import { getToken } from "@/app/utils/getToken";
import ForgotPasswordDialog from "@/components/modals/ForgotPasswordDialog";
import toast from "react-hot-toast";

export default function ProfilePage() {
	const { user } = useAuth();
	const token = getToken();

	const [profile, setProfile] = useState<any>(null);
	const [form, setForm] = useState<any>({});
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [openReset, setOpenReset] = useState(false);

	// fields config (easy to extend)
	const editableFields = [
		{ key: "name", label: "Full Name", icon: User },
		{ key: "phone", label: "Phone", icon: Phone },
	];

	// fetch profile
	useEffect(() => {
		const loadProfile = async () => {
			try {
				const res = await fetchUserProfile(token!);
				const data = res.data;

				setProfile(data);
				setForm(data); // auto populate form
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		if (user) loadProfile();
	}, [user]);

	// dynamic change handler
	const handleChange = (key: string, value: string) => {
		setForm((prev: any) => ({
			...prev,
			[key]: value,
		}));
	};

	// update profile
	const handleSave = async () => {
		try {
			setSaving(true);

			const updated = await updateUserProfile(form, token!);

			setProfile(updated.data);
			setForm(updated.data);

			toast.success("Profile updated successfully");
		} catch (err: any) {
			console.error(err);

			toast.error(err?.message || "Failed to update profile");
		} finally {
			setSaving(false);
		}
	};

	if (loading) return <div className="p-8">Loading profile...</div>;
	if (!profile) return null;

	return (
		<div className="p-8 bg-gray-50 min-h-screen">
			<div className="mb-6">
				<h1 className="text-2xl font-semibold">My Profile</h1>
				<p className="text-gray-500 text-sm">Manage your account information</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* PROFILE CARD */}
				<div className="bg-white rounded-xl shadow-sm border p-6">
					<div className="flex items-center gap-4 mb-6">
						<div className="h-16 w-16 rounded-full bg-brand text-white flex items-center justify-center text-xl font-bold overflow-hidden">
							{profile?.avatar ?
								<img
									src={profile.avatar}
									alt={profile.name || "User"}
									className="w-full h-full object-cover"
								/>
							: profile?.name ?
								profile.name
									.split(" ")
									.map((n: string) => n[0])
									.join("")
									.slice(0, 2)
									.toUpperCase()
							:	<User size={24} />}
						</div>

						<div>
							<h2 className="font-semibold text-lg">{profile.name}</h2>
							<p className="text-sm text-gray-500">{profile.email}</p>
						</div>
					</div>

					<div className="space-y-4">
						{/* Dynamic editable fields */}
						{editableFields.map((field) => {
							const Icon = field.icon;

							return (
								<div key={field.key}>
									<label className="text-sm text-gray-600">{field.label}</label>

									<div className="flex items-center border rounded-md px-3 py-2 mt-1">
										<Icon size={16} className="text-gray-400 mr-2" />

										<input
											className="w-full outline-none text-sm"
											value={form[field.key] || ""}
											onChange={(e) => handleChange(field.key, e.target.value)}
										/>
									</div>
								</div>
							);
						})}

						{/* Email (readonly) */}
						<div>
							<label className="text-sm text-gray-600">Email</label>

							<div className="flex items-center border rounded-md px-3 py-2 mt-1 bg-gray-50">
								<Mail size={16} className="text-gray-400 mr-2" />
								{profile.email}
							</div>
						</div>

						{/* Buttons */}
						<div className="flex gap-3 pt-2">
							<button
								onClick={handleSave}
								disabled={saving}
								className="px-5 py-2 rounded-md bg-brand text-white text-sm hover:bg-brand-dark disabled:opacity-50">
								{saving ? "Saving..." : "Save Changes"}
							</button>

							<button
								onClick={() => setOpenReset(true)}
								className="flex items-center gap-2 px-4 py-2 text-sm border rounded-md hover:bg-gray-100">
								<KeyRound size={16} />
								Forgot Password
							</button>
						</div>
					</div>
				</div>

				{/* ACCOUNT DETAILS */}
				<div className="bg-white rounded-xl shadow-sm border p-6">
					<h2 className="font-semibold text-lg mb-4">Account Details</h2>

					<div className="space-y-4 text-sm">
						<InfoRow label="User ID" value={profile.id} />
						<InfoRow label="Role" value={profile.role} />

						<InfoRow
							label="Company"
							value={
								<span className="flex items-center gap-1">
									<Building2 size={14} />
									{profile.companyName}
								</span>
							}
						/>

						<InfoRow
							label="Status"
							value={
								<span className="text-green-600 font-medium">
									{profile.isActive ? "Active" : "Inactive"}
								</span>
							}
						/>

						<InfoRow
							label="Created At"
							value={new Date(profile.createdAt).toLocaleDateString()}
						/>

						<InfoRow
							label="Last Active"
							value={
								profile.lastActive ?
									new Date(profile.lastActive).toLocaleString()
								:	"Never"
							}
						/>
					</div>

					{/* Permissions */}
					<div className="mt-6">
						<h3 className="font-medium mb-2 flex items-center gap-2">
							<ShieldCheck size={16} />
							Permissions
						</h3>

						<div className="grid grid-cols-2 gap-2 text-sm">
							<span>
								Can Create: {profile.permissions?.canCreate ? "✔" : "✖"}
							</span>
							<span>Can Edit: {profile.permissions?.canEdit ? "✔" : "✖"}</span>
							<span>
								Can Delete: {profile.permissions?.canDelete ? "✔" : "✖"}
							</span>
							<span>
								Can Approve: {profile.permissions?.canApprove ? "✔" : "✖"}
							</span>
						</div>
					</div>
				</div>
			</div>

			<ForgotPasswordDialog
				isOpen={openReset}
				onClose={() => setOpenReset(false)}
			/>
		</div>
	);
}

function InfoRow({ label, value }: any) {
	return (
		<div className="flex justify-between">
			<span className="text-gray-500">{label}</span>
			<span className="font-medium">{value}</span>
		</div>
	);
}
