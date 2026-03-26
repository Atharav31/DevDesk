"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import {
	Eye,
	EyeOff,
	Loader,
	ArrowRight,
	Bug,
	Zap,
	Shield,
	GitBranch,
	AlertCircle,
	CheckCircle2,
	Clock,
} from "lucide-react";
import { loginUser } from "@/actions/auth";
import ForgotPasswordDialog from "@/components/modals/ForgotPasswordDialog";
import { ROLE_DASHBOARD } from "@/components/lib/checkRouteAccess";

// Floating issue cards data
const ISSUE_CARDS = [
	{
		id: "DEV-2891",
		title: "Auth token expiry not handled",
		priority: "critical",
		status: "open",
		tag: "Backend",
		time: "2m ago",
		icon: AlertCircle,
		color: "#FF4D6D",
	},
	{
		id: "DEV-2890",
		title: "Dashboard chart renders twice",
		priority: "high",
		status: "in-progress",
		tag: "Frontend",
		time: "14m ago",
		icon: Zap,
		color: "#FBBF24",
	},
	{
		id: "DEV-2887",
		title: "File upload size limit fixed",
		priority: "medium",
		status: "resolved",
		tag: "API",
		time: "1h ago",
		icon: CheckCircle2,
		color: "#34D399",
	},
	{
		id: "DEV-2883",
		title: "Webhook retry on 429 response",
		priority: "low",
		status: "review",
		tag: "Infra",
		time: "3h ago",
		icon: GitBranch,
		color: "#818CF8",
	},
	{
		id: "DEV-2879",
		title: "XSS in markdown renderer",
		priority: "critical",
		status: "open",
		tag: "Security",
		time: "5h ago",
		icon: Shield,
		color: "#FF4D6D",
	},
];

const STATUS_STYLES: Record<
	string,
	{ bg: string; text: string; label: string }
> = {
	open: { bg: "rgba(255,77,109,0.15)", text: "#FF4D6D", label: "Open" },
	"in-progress": {
		bg: "rgba(251,191,36,0.15)",
		text: "#FBBF24",
		label: "In Progress",
	},
	resolved: { bg: "rgba(52,211,153,0.15)", text: "#34D399", label: "Resolved" },
	review: { bg: "rgba(129,140,248,0.15)", text: "#818CF8", label: "In Review" },
};

export default function LoginPage() {
	const router = useRouter();
	const { setUser } = useAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [showForgotPassword, setShowForgotPassword] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

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
				router.replace(redirectPath || "/404");
			} else {
				toast.error(result.message || "Invalid email or password");
			}
		} catch (error: any) {
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
			<style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          display: flex;
          font-family: 'Bricolage Grotesque', sans-serif;
          background: #08080F;
        }

        /* ── LEFT PANEL ── */
        .left-panel {
          display: none;
          position: relative;
          overflow: hidden;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px;
          background: #0D0D1A;
          border-right: 1px solid rgba(255,255,255,0.04);
        }
        @media (min-width: 1024px) { .left-panel { display: flex; width: 52%; } }

        /* Orb glows */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }
        .orb-1 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%);
          top: -120px; left: -80px;
        }
        .orb-2 {
          width: 350px; height: 350px;
          background: radial-gradient(circle, rgba(52,211,153,0.12) 0%, transparent 70%);
          bottom: 60px; right: -60px;
        }
        .orb-3 {
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%);
          top: 45%; left: 40%;
        }

        /* Grid overlay */
        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        /* Brand header */
        .brand-header { position: relative; z-index: 10; }
        .brand-logo {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 56px;
        }
        .brand-logo-icon {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #7C3AED, #4F46E5);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
        }
        .brand-logo-text {
          font-size: 18px; font-weight: 700;
          color: #fff; letter-spacing: -0.3px;
        }
        .brand-logo-text span { color: #A78BFA; }

        .panel-headline {
          font-size: clamp(28px, 3.2vw, 40px);
          font-weight: 800;
          color: #F8FAFC;
          line-height: 1.15;
          letter-spacing: -1.2px;
          margin-bottom: 16px;
        }
        .panel-headline em {
          font-style: normal;
          background: linear-gradient(90deg, #A78BFA, #34D399);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .panel-sub {
          font-size: 15px; color: rgba(248,250,252,0.5);
          line-height: 1.7; max-width: 380px;
          margin-bottom: 44px;
          font-family: 'DM Mono', monospace;
          font-weight: 300;
        }

        /* Stats row */
        .stats-row {
          display: flex; gap: 24px; margin-bottom: 48px;
        }
        .stat-chip {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 14px 18px;
          flex: 1;
        }
        .stat-chip .val {
          font-size: 22px; font-weight: 800;
          color: #fff; letter-spacing: -0.5px;
        }
        .stat-chip .lbl {
          font-size: 11px; color: rgba(255,255,255,0.38);
          margin-top: 2px;
          font-family: 'DM Mono', monospace;
          text-transform: uppercase; letter-spacing: 0.8px;
        }

        /* Issue cards stack */
        .cards-stack {
          position: relative; z-index: 10;
          display: flex; flex-direction: column; gap: 10px;
        }
        .issue-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 14px 16px;
          display: flex; align-items: center; gap: 12px;
          transition: border-color 0.2s, background 0.2s;
          cursor: default;
          opacity: 0;
          transform: translateX(-20px);
          animation: slideInCard 0.5s forwards;
        }
        .issue-card:hover {
          border-color: rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.065);
        }
        @keyframes slideInCard {
          to { opacity: 1; transform: translateX(0); }
        }

        .card-icon-wrap {
          width: 34px; height: 34px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .card-id {
          font-family: 'DM Mono', monospace;
          font-size: 10px; color: rgba(255,255,255,0.3);
          margin-bottom: 2px; letter-spacing: 0.5px;
        }
        .card-title {
          font-size: 13px; font-weight: 600;
          color: rgba(255,255,255,0.85); line-height: 1.3;
        }
        .card-meta {
          display: flex; align-items: center; gap: 8px;
          margin-top: 5px;
        }
        .status-pill {
          font-family: 'DM Mono', monospace;
          font-size: 10px; padding: 2px 8px;
          border-radius: 20px; font-weight: 500;
          letter-spacing: 0.3px;
        }
        .card-time {
          font-family: 'DM Mono', monospace;
          font-size: 10px; color: rgba(255,255,255,0.25);
          margin-left: auto; flex-shrink: 0;
          display: flex; align-items: center; gap: 4px;
        }

        /* Bottom tagline */
        .panel-footer {
          position: relative; z-index: 10;
          font-family: 'DM Mono', monospace;
          font-size: 12px; color: rgba(255,255,255,0.2);
          letter-spacing: 0.5px;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .panel-footer span { color: rgba(167,139,250,0.6); }

        /* ── RIGHT PANEL ── */
        .right-panel {
          width: 100%;
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          position: relative;
          background: #08080F;
        }
        @media (min-width: 1024px) { .right-panel { width: 48%; } }

        /* Subtle bg dots */
        .right-panel::before {
          content: '';
          position: absolute; inset: 0;
          background-image: radial-gradient(rgba(124,58,237,0.06) 1px, transparent 1px);
          background-size: 24px 24px;
          pointer-events: none;
        }

        .form-container { width: 100%; max-width: 420px; position: relative; z-index: 1; }

        /* Form card */
        .form-card {
          background: rgba(13,13,26,0.9);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 40px;
          backdrop-filter: blur(20px);
          box-shadow: 0 0 0 1px rgba(124,58,237,0.08), 0 32px 80px rgba(0,0,0,0.5);
          opacity: 0;
          transform: translateY(16px);
          animation: fadeUp 0.6s 0.1s forwards;
        }
        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        /* Form header */
        .form-header { text-align: center; margin-bottom: 36px; }
        .form-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(124,58,237,0.12);
          border: 1px solid rgba(124,58,237,0.25);
          border-radius: 20px; padding: 5px 14px;
          font-family: 'DM Mono', monospace;
          font-size: 11px; color: #A78BFA;
          letter-spacing: 0.5px; margin-bottom: 20px;
        }
        .badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #34D399;
          box-shadow: 0 0 6px #34D399;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; } 50% { opacity: 0.4; }
        }

        .form-title {
          font-size: 28px; font-weight: 800;
          color: #F8FAFC; letter-spacing: -0.8px;
          margin-bottom: 8px;
        }
        .form-sub {
          font-size: 14px; color: rgba(248,250,252,0.38);
          font-family: 'DM Mono', monospace; font-weight: 300;
        }

        /* Fields */
        .field-group { margin-bottom: 20px; }
        .field-label {
          display: block;
          font-size: 12px; font-weight: 600;
          color: rgba(248,250,252,0.6);
          margin-bottom: 8px; letter-spacing: 0.3px;
          font-family: 'DM Mono', monospace;
          text-transform: uppercase;
        }
        .field-label-row {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 8px;
        }

        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 14px;
          color: #F8FAFC;
          font-family: 'Bricolage Grotesque', sans-serif;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .field-input::placeholder { color: rgba(255,255,255,0.2); }
        .field-input:focus {
          border-color: rgba(124,58,237,0.6);
          background: rgba(124,58,237,0.06);
          box-shadow: 0 0 0 3px rgba(124,58,237,0.12);
        }
        .field-input:disabled { opacity: 0.5; cursor: not-allowed; }

        .password-wrap { position: relative; }
        .password-wrap .field-input { padding-right: 48px; }
        .toggle-pw {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,0.3);
          padding: 4px; border-radius: 6px;
          transition: color 0.2s;
          display: flex; align-items: center;
        }
        .toggle-pw:hover { color: #A78BFA; }

        .forgot-link {
          background: none; border: none; cursor: pointer;
          font-size: 11px; color: #7C6AFA;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.3px;
          transition: color 0.2s;
        }
        .forgot-link:hover { color: #A78BFA; }

        /* Submit btn */
        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #7C3AED 0%, #4338CA 100%);
          border: none; border-radius: 12px;
          padding: 15px 24px;
          font-size: 15px; font-weight: 700;
          color: #fff; cursor: pointer;
          font-family: 'Bricolage Grotesque', sans-serif;
          letter-spacing: -0.2px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          margin-top: 28px;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 24px rgba(124,58,237,0.35);
          position: relative; overflow: hidden;
        }
        .submit-btn::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
          opacity: 0; transition: opacity 0.2s;
        }
        .submit-btn:hover::after { opacity: 1; }
        .submit-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 32px rgba(124,58,237,0.5); }
        .submit-btn:active { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

        .arrow-icon { transition: transform 0.2s; }
        .submit-btn:hover .arrow-icon { transform: translateX(3px); }

        /* Divider */
        .form-divider {
          margin: 28px 0;
          border: none; border-top: 1px solid rgba(255,255,255,0.06);
        }

        /* Footer */
        .form-footer {
          text-align: center;
          font-size: 11px; color: rgba(255,255,255,0.25);
          font-family: 'DM Mono', monospace; line-height: 1.8;
        }
        .form-footer a { color: rgba(167,139,250,0.7); text-decoration: none; transition: color 0.2s; }
        .form-footer a:hover { color: #A78BFA; }

        /* Powered by tag */
        .powered-tag {
          text-align: center; margin-top: 24px;
          font-family: 'DM Mono', monospace;
          font-size: 11px; color: rgba(255,255,255,0.15);
          letter-spacing: 0.5px;
        }
        .powered-tag span { color: rgba(124,58,237,0.5); }
      `}</style>

			<div className="login-root">
				{/* ──────────────── LEFT PANEL ──────────────── */}
				<div className="left-panel">
					<div className="orb orb-1" />
					<div className="orb orb-2" />
					<div className="orb orb-3" />
					<div className="grid-overlay" />

					{/* Brand + Headline */}
					<div className="brand-header">
						<div className="brand-logo">
							<div className="brand-logo-icon">
								<Bug size={18} color="#fff" />
							</div>
							<div className="brand-logo-text">
								Dev<span>Desk</span>
							</div>
						</div>

						<h1 className="panel-headline">
							Ship faster.
							<br />
							Break <em>less</em>.<br />
							Fix everything.
						</h1>
						<p className="panel-sub">
							The issue tracker your engineering team
							<br />
							actually wants to open every morning.
						</p>

						{/* Stats */}
						<div className="stats-row">
							<div className="stat-chip">
								<div className="val">12.4k</div>
								<div className="lbl">Bugs closed</div>
							</div>
							<div className="stat-chip">
								<div className="val">98.2%</div>
								<div className="lbl">Uptime</div>
							</div>
							<div className="stat-chip">
								<div className="val">3.1x</div>
								<div className="lbl">Faster sprints</div>
							</div>
						</div>
					</div>

					{/* Issue Cards */}
					<div className="cards-stack">
						{ISSUE_CARDS.map((card, i) => {
							const Icon = card.icon;
							const statusStyle = STATUS_STYLES[card.status];
							return (
								<div
									key={card.id}
									className="issue-card"
									style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
									<div
										className="card-icon-wrap"
										style={{ background: `${card.color}18` }}>
										<Icon size={16} color={card.color} />
									</div>
									<div style={{ flex: 1, minWidth: 0 }}>
										<div className="card-id">
											{card.id} · {card.tag}
										</div>
										<div className="card-title">{card.title}</div>
										<div className="card-meta">
											<span
												className="status-pill"
												style={{
													background: statusStyle.bg,
													color: statusStyle.text,
												}}>
												{statusStyle.label}
											</span>
										</div>
									</div>
									<div className="card-time">
										<Clock size={10} />
										{card.time}
									</div>
								</div>
							);
						})}
					</div>

					<div className="panel-footer">
						trusted by teams at <span>stripe · vercel · linear · notion</span>
					</div>
				</div>

				{/* ──────────────── RIGHT PANEL ──────────────── */}
				<div className="right-panel">
					<div className="form-container">
						<div className="form-card">
							{/* Header */}
							<div className="form-header">
								<div className="form-badge">
									<div className="badge-dot" />
									All systems operational
								</div>
								<h2 className="form-title">Welcome back</h2>
								<p className="form-sub">sign in to your workspace</p>
							</div>

							{/* Form */}
							<form onSubmit={handleSubmit}>
								{/* Email */}
								<div className="field-group">
									<label className="field-label" htmlFor="email">
										Email
									</label>
									<input
										id="email"
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder="you@company.com"
										disabled={loading}
										className="field-input"
									/>
								</div>

								{/* Password */}
								<div className="field-group">
									<div className="field-label-row">
										<label
											className="field-label"
											htmlFor="password"
											style={{ marginBottom: 0 }}>
											Password
										</label>
										<button
											type="button"
											className="forgot-link"
											onClick={() => setShowForgotPassword(true)}>
											forgot password?
										</button>
									</div>
									<div className="password-wrap">
										<input
											id="password"
											type={showPassword ? "text" : "password"}
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											placeholder="••••••••••••"
											disabled={loading}
											className="field-input"
										/>
										<button
											type="button"
											className="toggle-pw"
											onClick={() => setShowPassword((p) => !p)}
											disabled={loading}>
											{showPassword ?
												<EyeOff size={16} />
											:	<Eye size={16} />}
										</button>
									</div>
								</div>

								{/* Submit */}
								<button type="submit" disabled={loading} className="submit-btn">
									{loading ?
										<>
											<Loader size={16} className="animate-spin" />
											Signing in...
										</>
									:	<>
											Sign in to DevDesk
											<ArrowRight size={16} className="arrow-icon" />
										</>
									}
								</button>
							</form>

							<hr className="form-divider" />

							<p className="form-footer">
								By signing in you agree to our{" "}
								<Link href="/terms">Terms of Service</Link> and{" "}
								<Link href="/privacy">Privacy Policy</Link>
							</p>
						</div>

						<div className="powered-tag">
							© 2025 DevDesk · Built for <span>engineering teams</span>
						</div>
					</div>
				</div>
			</div>

			<ForgotPasswordDialog
				isOpen={showForgotPassword}
				onClose={() => setShowForgotPassword(false)}
			/>
		</>
	);
}
