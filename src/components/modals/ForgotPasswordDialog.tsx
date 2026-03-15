// components/ForgotPasswordDialog.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { forgetPassword } from "@/actions/auth";

interface ForgotPasswordDialogProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function ForgotPasswordDialog({
	isOpen,
	onClose,
}: ForgotPasswordDialogProps) {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState("");
	const [countdown, setCountdown] = useState(0);

	// Handle countdown timer for resend
	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (countdown > 0) {
			timer = setTimeout(() => setCountdown(countdown - 1), 1000);
		}
		return () => {
			if (timer) clearTimeout(timer);
		};
	}, [countdown]);

	const resetForm = () => {
		setEmail("");
		setError("");
		setSuccess(false);
		setCountdown(0);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		if (!email.trim()) {
			setError("Please enter your email address");
			setLoading(false);
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			setError("Please enter a valid email address");
			setLoading(false);
			return;
		}

		try {
			const res = await forgetPassword(email);

			setSuccess(true);
			setCountdown(30);
		} catch (error) {
			console.error("Forgot password error:", error);
			setError("An error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleResend = async () => {
		if (countdown > 0) return;

		setLoading(true);
		setError("");

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));
			setSuccess(true);
			setCountdown(30);
		} catch (error) {
			setError("Failed to resend email. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		resetForm();
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
			<AnimatePresence>
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.95 }}
					transition={{ duration: 0.2 }}
					className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
					{/* Header */}
					<div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-purple-100 rounded-lg">
									<Mail className="w-5 h-5 text-brand" />
								</div>
								<div>
									<h2 className="text-lg font-semibold text-formheading">
										Reset Your Password
									</h2>
									<p className="text-sm text-graytext">
										Enter your email to receive a reset link
									</p>
								</div>
							</div>
							<button
								onClick={handleClose}
								className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
								disabled={loading}>
								<X className="w-5 h-5 text-gray-500" />
							</button>
						</div>
					</div>

					{/* Content */}
					<div className="p-6">
						{
							!success ?
								<form onSubmit={handleSubmit} className="space-y-6">
									{/* Error Message */}
									{error && (
										<div className="p-3 bg-red-50 border border-red-100 rounded-lg">
											<div className="flex items-center gap-2 text-red-700">
												<AlertCircle className="w-4 h-4 flex-shrink-0" />
												<p className="text-sm">{error}</p>
											</div>
										</div>
									)}

									{/* Email Input */}
									<div>
										<label className="block text-sm font-medium text-label mb-2">
											Email Address
										</label>
										<input
											type="email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											disabled={loading}
											className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all text-placeholder disabled:opacity-50"
											placeholder="you@company.com"
										/>
										<p className="text-xs text-graytext mt-2">
											We'll send you a link to reset your password
										</p>
									</div>

									{/* Security Note */}
									<div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
										<p className="text-xs text-blue-700">
											<strong>Security Note:</strong> For your security, we
											don't indicate whether an email is registered. If the
											email exists in our system, you'll receive a reset link.
										</p>
									</div>

									{/* Submit Button */}
									<button
										type="submit"
										disabled={loading}
										className="w-full px-4 py-3 text-white bg-gradient-to-r from-[#7E5DED] to-[#5841A6] hover:from-[#6a4ad8] hover:to-[#4d3891] rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
										{loading && <Loader2 className="w-5 h-5 animate-spin" />}
										{loading ? "Sending Link..." : "Send Reset Link"}
									</button>
								</form>
								// Success State
							:	<div className="space-y-6 text-center">
									<div className="flex justify-center">
										<div className="p-3 bg-green-100 rounded-full">
											<CheckCircle className="w-12 h-12 text-green-600" />
										</div>
									</div>

									<div className="space-y-3">
										<h3 className="text-lg font-semibold text-formheading">
											Check Your Email
										</h3>
										<p className="text-graytext">
											We've sent a password reset link to:
										</p>
										<div className="p-3 bg-gray-50 rounded-lg">
											<p className="font-medium text-brand">{email}</p>
										</div>
										<p className="text-sm text-graytext">
											Click the link in the email to reset your password. The
											link will expire in 24 hours.
										</p>
									</div>

									{/* Resend Button */}
									<div className="space-y-3">
										<button
											onClick={handleResend}
											disabled={countdown > 0 || loading}
											className="w-full px-4 py-3 text-brand hover:text-secondary border-2 border-brand hover:border-secondary rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium">
											{loading ?
												<span className="flex items-center justify-center gap-2">
													<Loader2 className="w-5 h-5 animate-spin" />
													Resending...
												</span>
											: countdown > 0 ?
												`Resend in ${countdown}s`
											:	"Resend Email"}
										</button>
										<p className="text-xs text-graytext">
											Didn't receive the email? Check your spam folder or try
											resending.
										</p>
									</div>
								</div>

						}

						{/* Footer */}
						<div className="mt-6 pt-6 border-t border-gray-200">
							<div className="flex items-center justify-center gap-1 text-sm text-graytext">
								<svg
									className="w-4 h-4 text-gray-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
									/>
								</svg>
								<span>Your security is our priority</span>
							</div>
						</div>
					</div>
				</motion.div>
			</AnimatePresence>
		</div>
	);
}
