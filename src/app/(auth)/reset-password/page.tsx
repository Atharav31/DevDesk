// app/set-password/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

function SetPasswordContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const email = searchParams.get("email");

	const [formData, setFormData] = useState({
		password: "",
		confirmPassword: "",
	});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [passwordStrength, setPasswordStrength] = useState({
		score: 0,
		message: "",
	});

	const validatePassword = (password: string) => {
		let score = 0;
		const messages = [];

		// Length check
		if (password.length >= 8) score += 1;
		else messages.push("At least 8 characters");

		// Uppercase check
		if (/[A-Z]/.test(password)) score += 1;
		else messages.push("One uppercase letter");

		// Lowercase check
		if (/[a-z]/.test(password)) score += 1;
		else messages.push("One lowercase letter");

		// Number check
		if (/[0-9]/.test(password)) score += 1;
		else messages.push("One number");

		// Special character check
		if (/[^A-Za-z0-9]/.test(password)) score += 1;
		else messages.push("One special character");

		let message = "";
		if (score === 5) {
			message = "Strong password";
		} else if (score >= 3) {
			message = "Moderate password";
		} else {
			message = "Weak password";
		}

		return { score, message, requirements: messages };
	};

	useEffect(() => {
		if (!token) {
			setError("Invalid or expired reset link. Please request a new one.");
		}
	}, [token]);

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newPassword = e.target.value;
		setFormData((prev) => ({ ...prev, password: newPassword }));
		setPasswordStrength(validatePassword(newPassword));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		// Validate passwords match
		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match");
			setLoading(false);
			return;
		}

		// Validate password strength
		if (passwordStrength.score < 3) {
			setError("Password is too weak. Please use a stronger password.");
			setLoading(false);
			return;
		}

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/reset-password`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email,
						token,
						newPassword: formData.password,
					}),
				},
			);

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Failed to set password");
			}

			setSuccess(true);
			// Auto redirect to login after 3 seconds
			setTimeout(() => {
				router.push("/login");
			}, 3000);
		} catch (error: any) {
			console.error("Error setting password:", error);
			setError(
				error.message || "Failed to set password. The link may have expired.",
			);
		} finally {
			setLoading(false);
		}
	};

	const getStrengthColor = (score: number) => {
		if (score === 5) return "bg-green-500";
		if (score >= 3) return "bg-yellow-500";
		return "bg-red-500";
	};

	const getStrengthText = (score: number) => {
		if (score === 5) return "Strong";
		if (score >= 3) return "Moderate";
		return "Weak";
	};

	if (!token) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
				<div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
					<XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
					<h1 className="text-2xl font-bold text-formheading mb-2">
						Invalid Reset Link
					</h1>
					<p className="text-graytext mb-6">
						The password reset link is invalid or has expired. Please request a
						new reset link.
					</p>
					<Link
						href="/forgot-password"
						className="inline-block px-6 py-3 bg-brand text-white font-medium rounded-lg hover:bg-secondary transition-colors">
						Request New Link
					</Link>
				</div>
			</div>
		);
	}

	if (success) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
				<div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
					<CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
					<h1 className="text-2xl font-bold text-formheading mb-2">
						Password Set Successfully!
					</h1>
					<p className="text-graytext mb-6">
						Your password has been successfully updated. You will be redirected
						to the login page in a few seconds.
					</p>
					<div className="flex items-center justify-center space-x-4">
						<Loader2 className="w-5 h-5 animate-spin text-brand" />
						<span className="text-sm text-graytext">
							Redirecting to login...
						</span>
					</div>
					<Link
						href="/login"
						className="inline-block mt-6 px-6 py-3 bg-brand text-white font-medium rounded-lg hover:bg-secondary transition-colors">
						Go to Login
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
			<div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
				{/* Header */}
				<div className="bg-brand p-6 text-center">
					<h1 className="text-2xl font-bold text-white">Set New Password</h1>
					<p className="text-white/80 text-sm mt-1">
						Create a secure password for your account
					</p>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="p-6">
					{error && (
						<div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg">
							<div className="flex items-center gap-2 text-red-700">
								<div className="w-2 h-2 bg-red-500 rounded-full" />
								<p className="text-sm">{error}</p>
							</div>
						</div>
					)}

					<div className="space-y-6">
						{/* Password Field */}
						<div>
							<label className="block text-sm font-medium text-label mb-2">
								New Password
							</label>
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									required
									value={formData.password}
									onChange={handlePasswordChange}
									className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all pr-10 text-placeholder"
									placeholder="Enter your new password"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
									{showPassword ?
										<EyeOff className="w-5 h-5" />
									:	<Eye className="w-5 h-5" />}
								</button>
							</div>

							{/* Password Strength Indicator */}
							{formData.password && (
								<div className="mt-3 space-y-2">
									<div className="flex items-center justify-between">
										<span className="text-xs text-graytext">
											Password strength:
										</span>
										<span
											className={`text-xs font-medium ${
												passwordStrength.score === 5 ? "text-green-600"
												: passwordStrength.score >= 3 ? "text-yellow-600"
												: "text-red-600"
											}`}>
											{getStrengthText(passwordStrength.score)}
										</span>
									</div>
									<div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
										<div
											className={`h-full ${getStrengthColor(
												passwordStrength.score,
											)} transition-all duration-300`}
											style={{
												width: `${(passwordStrength.score / 5) * 100}%`,
											}}
										/>
									</div>

									{/* Password Requirements */}
									<div className="mt-3 space-y-1">
										<p className="text-xs text-graytext mb-1">Requirements:</p>
										{[
											"At least 8 characters",
											"One uppercase letter",
											"One lowercase letter",
											"One number",
											"One special character",
										].map((req) => {
											const isMet = !validatePassword(
												formData.password,
											).requirements.includes(req);
											return (
												<div key={req} className="flex items-center gap-2">
													<div
														className={`w-3 h-3 rounded-full flex items-center justify-center ${
															isMet ? "bg-green-100" : "bg-gray-100"
														}`}>
														<div
															className={`w-1.5 h-1.5 rounded-full ${
																isMet ? "bg-green-500" : "bg-gray-300"
															}`}
														/>
													</div>
													<span
														className={`text-xs ${
															isMet ? "text-green-600" : "text-gray-400"
														}`}>
														{req}
													</span>
												</div>
											);
										})}
									</div>
								</div>
							)}
						</div>

						{/* Confirm Password Field */}
						<div>
							<label className="block text-sm font-medium text-label mb-2">
								Confirm New Password
							</label>
							<div className="relative">
								<input
									type={showConfirmPassword ? "text" : "password"}
									required
									value={formData.confirmPassword}
									onChange={(e) =>
										setFormData({
											...formData,
											confirmPassword: e.target.value,
										})
									}
									className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all pr-10 text-placeholder ${
										(
											formData.confirmPassword &&
											formData.password !== formData.confirmPassword
										) ?
											"border-red-300"
										:	"border-gray-300"
									}`}
									placeholder="Confirm your new password"
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
									{showConfirmPassword ?
										<EyeOff className="w-5 h-5" />
									:	<Eye className="w-5 h-5" />}
								</button>
							</div>
							{formData.confirmPassword &&
								formData.password === formData.confirmPassword && (
									<div className="mt-2 flex items-center gap-2 text-green-600 text-sm">
										<div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
											<div className="w-2 h-2 rounded-full bg-green-500" />
										</div>
										Passwords match
									</div>
								)}
						</div>

						{/* Terms Note */}
						<div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
							<p className="text-sm text-blue-700">
								<strong>Note:</strong> Your password must be unique and not used
								on other websites. For security reasons, we recommend changing
								your password regularly.
							</p>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={loading}
							className="w-full px-4 py-3 text-white bg-brand hover:bg-secondary rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2">
							{loading && <Loader2 className="w-5 h-5 animate-spin" />}
							{loading ? "Setting Password..." : "Set Password"}
						</button>

						{/* Back to Login */}
						<div className="text-center">
							<Link
								href="/login"
								className="text-sm text-brand hover:text-secondary transition-colors">
								← Back to Login
							</Link>
						</div>
					</div>
				</form>

				{/* Footer */}
				<div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
					<p className="text-xs text-graytext text-center">
						Need help?{" "}
						<Link href="/contact" className="text-brand hover:underline">
							Contact Support
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}

export default function SetPasswordPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen flex items-center justify-center">
					<Loader2 className="w-8 h-8 animate-spin text-brand" />
				</div>
			}>
			<SetPasswordContent />
		</Suspense>
	);
}
