"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { Check, Eye, EyeOff, Loader } from "lucide-react";
import { loginUser } from "@/actions/auth";
import ForgotPasswordDialog from "@/components/modals/ForgotPasswordDialog";
import { ROLE_DASHBOARD } from "@/components/lib/checkRouteAccess";

export default function LoginPage() {
	const router = useRouter();
	const { setUser } = useAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [showForgotPassword, setShowForgotPassword] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email || !password) {
			toast.error("Please enter both email and password");
			return;
		}

		try {
			setLoading(true);

			const loadingToast = toast.loading("Signing you in...");

			const result = await loginUser({ email, password });

			toast.dismiss(loadingToast);

			if (result.success) {
				const { user, token } = result.data;

				localStorage.setItem("user", JSON.stringify(user));
				localStorage.setItem("token", token);

				setUser(user);

				toast.success(`Welcome back, ${user.name}!`);

				const redirectPath =
					ROLE_DASHBOARD[user.role as keyof typeof ROLE_DASHBOARD];

				if (redirectPath) {
					router.replace(redirectPath);
				} else {
					router.replace("/404");
				}
			} else {
				toast.error(result.message || "Invalid email or password");
			}
		} catch (error: any) {
			console.error(error);

			const message =
				error?.response?.data?.message ||
				error?.message ||
				"Login failed. Please try again.";

			toast.error(message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div className="min-h-screen flex">
				{/* Left Side - Bug Tracking Branding */}
				<div className="hidden lg:flex lg:w-1/2 bg-leftsection relative overflow-hidden">
					{/* Background Gradient */}
					<div className="absolute inset-0 bg-brand opacity-95"></div>

					{/* Brand Content */}
					<div className="relative z-10 flex flex-col justify-between p-12 text-white h-full">
						{/* Main Brand Message */}
						<div className="max-w-lg">
							<h2 className="text-4xl font-bold mb-6 leading-tight">
								Bug Tracking & Project Management
							</h2>
							<p className="text-lg text-white/90 mb-8">
								Efficiently track, manage, and resolve issues across your
								development projects — all in one unified platform.
							</p>

							{/* Bug Tracking Features */}
							<ul className="space-y-4">
								<li className="flex items-center">
									<Check className="w-5 h-5 mr-3 text-emerald-400" />
									<span>Create and assign issues with priorities</span>
								</li>

								<li className="flex items-center">
									<Check className="w-5 h-5 mr-3 text-emerald-400" />
									<span>Kanban boards for sprint planning</span>
								</li>

								<li className="flex items-center">
									<Check className="w-5 h-5 mr-3 text-emerald-400" />
									<span>Real-time bug reporting and notifications</span>
								</li>

								<li className="flex items-center">
									<Check className="w-5 h-5 mr-3 text-emerald-400" />
									<span>Detailed audit logs and history</span>
								</li>

								<li className="flex items-center">
									<Check className="w-5 h-5 mr-3 text-emerald-400" />
									<span>Team collaboration and comments</span>
								</li>
							</ul>
						</div>

						{/* Social Proof / Value Message */}
						<div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
							<p className="text-sm italic text-white/90">
								“Streamline your development workflow and deliver quality
								software faster.”
							</p>
						</div>
					</div>

					{/* Decorative Elements */}
					<div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
					<div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-48 translate-y-48"></div>
				</div>

				{/* Right Side - Login Form */}
				<div className="w-full lg:w-1/2 flex items-center justify-center bg-background p-4 lg:p-8">
					<div className="w-full max-w-md">
						{/* Form Container */}
						<div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 lg:p-8">
							{/* Form Header */}
							<div className="mb-8 text-center">
								<div className="flex justify-center mb-4">
									<img
										src="/bug-logo.png"
										alt="BugTrack Logo"
										className="h-12"
									/>
								</div>

								<h2 className="text-2xl font-bold text-gray-900 mb-2">
									Welcome back
								</h2>
								<p className="text-gray-600">
									Sign in to access your bug tracking dashboard
								</p>
							</div>

							{/* Form */}
							<form className="space-y-6" onSubmit={handleSubmit}>
								{/* Email */}
								<div className="space-y-2">
									<label
										htmlFor="email"
										className="text-sm font-medium text-gray-700">
										Email Address
									</label>
									<input
										id="email"
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder="you@company.com"
										disabled={loading}
										className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-[#7E5DED] focus:border-transparent text-gray-900 transition-all duration-200"
									/>
								</div>

								{/* Password */}
								<div className="space-y-2">
									<div className="flex justify-between items-center">
										<label
											htmlFor="password"
											className="text-sm font-medium text-gray-700">
											Password
										</label>
										<button
											type="button"
											onClick={() => setShowForgotPassword(true)}
											className="text-xs text-[#7E5DED] hover:underline font-medium">
											Forgot password?
										</button>
									</div>
									<div className="relative">
										<input
											id="password"
											type={showPassword ? "text" : "password"}
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											placeholder="Enter your password"
											disabled={loading}
											className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-[#7E5DED] focus:border-transparent text-gray-900 pr-12 transition-all duration-200"
										/>
										<button
											type="button"
											onClick={() => setShowPassword((prev) => !prev)}
											disabled={loading}
											className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#7E5DED] p-1">
											{showPassword ?
												<EyeOff className="w-5 h-5" />
											:	<Eye className="w-5 h-5" />}
										</button>
									</div>
								</div>

								{/* Submit Button */}
								<button
									type="submit"
									disabled={loading}
									className="w-full rounded-lg bg-gradient-to-r from-[#7E5DED] to-[#5841A6] hover:from-[#6a4ad8] hover:to-[#4d3891] px-4 py-3.5 text-sm font-medium text-white disabled:opacity-50 transition-all duration-200 shadow-sm hover:shadow-lg flex items-center justify-center">
									{loading ?
										<>
											<Loader className="w-4 h-4 mr-2 animate-spin" />
											Signing in...
										</>
									:	"Sign in to BugTrack"}
								</button>
							</form>

							{/* Footer */}
							<div className="mt-8 pt-6 border-t border-gray-200">
								<p className="text-center text-xs text-gray-500">
									By signing in, you agree to our{" "}
									<Link
										href="/terms"
										className="text-[#7E5DED] hover:underline">
										Terms of Service
									</Link>{" "}
									and{" "}
									<Link
										href="/privacy"
										className="text-[#7E5DED] hover:underline">
										Privacy Policy
									</Link>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Forgot Password Dialog */}
			<ForgotPasswordDialog
				isOpen={showForgotPassword}
				onClose={() => setShowForgotPassword(false)}
			/>
		</>
	);
}
