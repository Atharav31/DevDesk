"use client";

import { Activity } from "lucide-react";

export default function AuditTrailPage() {
	const logs = [
		{
			id: 1,
			action: "User Login",
			user: "Atharav",
			date: "2026-03-13 10:20 AM",
		},
		{
			id: 2,
			action: "Inventory Updated",
			user: "Admin",
			date: "2026-03-13 09:45 AM",
		},
		{
			id: 3,
			action: "New Request Created",
			user: "Warehouse Manager",
			date: "2026-03-13 09:10 AM",
		},
	];

	return (
		<div className="p-8 bg-white rounded-xl border shadow-sm">
			<div className="flex items-center gap-2 mb-6">
				<Activity size={18} />
				<h1 className="text-xl font-semibold">Audit Trail</h1>
			</div>

			<table className="w-full text-sm border-collapse">
				<thead>
					<tr className="border-b text-left">
						<th className="py-2">Action</th>
						<th>User</th>
						<th>Date</th>
					</tr>
				</thead>

				<tbody>
					{logs.map((log) => (
						<tr key={log.id} className="border-b">
							<td className="py-3">{log.action}</td>
							<td>{log.user}</td>
							<td>{log.date}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
