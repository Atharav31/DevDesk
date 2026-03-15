"use client";

import { Bell } from "lucide-react";

export default function NotificationsPage() {
	const notifications = [
		{
			id: 1,
			message: "Inventory request approved",
			time: "2 minutes ago",
		},
		{
			id: 2,
			message: "New user registered",
			time: "10 minutes ago",
		},
		{
			id: 3,
			message: "Stock level low for Item #123",
			time: "1 hour ago",
		},
	];

	return (
		<div className="p-8 bg-white rounded-xl border shadow-sm">
			<div className="flex items-center gap-2 mb-6">
				<Bell size={18} />
				<h1 className="text-xl font-semibold">Notifications</h1>
			</div>

			<div className="space-y-4">
				{notifications.map((note) => (
					<div
						key={note.id}
						className="border rounded-lg p-4 flex justify-between items-center">
						<p>{note.message}</p>
						<span className="text-sm text-gray-500">{note.time}</span>
					</div>
				))}
			</div>
		</div>
	);
}
