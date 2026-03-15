"use client";

import { useState } from "react";

export default function SettingsPage() {
	const [settings, setSettings] = useState({
		emailNotifications: true,
		darkMode: false,
		autoSave: true,
	});

	const handleToggle = (key: string) => {
		setSettings((prev) => ({
			...prev,
			[key]: !prev[key as keyof typeof prev],
		}));
	};

	return (
		<div className="p-8 bg-white rounded-xl border shadow-sm">
			<h1 className="text-xl font-semibold mb-6">Settings</h1>

			<div className="space-y-4">
				<SettingRow
					title="Email Notifications"
					description="Receive updates via email"
					enabled={settings.emailNotifications}
					onToggle={() => handleToggle("emailNotifications")}
				/>

				<SettingRow
					title="Dark Mode"
					description="Enable dark interface"
					enabled={settings.darkMode}
					onToggle={() => handleToggle("darkMode")}
				/>

				<SettingRow
					title="Auto Save"
					description="Automatically save changes"
					enabled={settings.autoSave}
					onToggle={() => handleToggle("autoSave")}
				/>
			</div>
		</div>
	);
}

function SettingRow({ title, description, enabled, onToggle }: any) {
	return (
		<div className="flex justify-between items-center border p-4 rounded-lg">
			<div>
				<h3 className="font-medium">{title}</h3>
				<p className="text-sm text-gray-500">{description}</p>
			</div>

			<button
				onClick={onToggle}
				className={`px-4 py-1 rounded-full text-sm ${
					enabled ? "bg-green-500 text-white" : "bg-gray-200"
				}`}>
				{enabled ? "ON" : "OFF"}
			</button>
		</div>
	);
}
