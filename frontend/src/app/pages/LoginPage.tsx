import { Link, useNavigate } from "react-router";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import mwuLogo from "@/imports/download.jfif";
import { ArrowLeft, Building, User, Lock, ShieldCheck, Award, Sparkles, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (idVal: string, passVal: string) => {
    setLoading(true);
    try {
      const user = await login(idVal, passVal);
      toast.success(`Welcome back, ${user.name}!`);

      if (user.role === "student") {
        navigate("/student");
      } else if (user.role === "officer") {
        navigate("/officer");
      } else if (user.role === "registrar" || user.role === "admin") {
        navigate("/registrar");
      } else {
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(identifier, password);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full bg-slate-50">
      {/* Left side - Beautiful University Card Presentation */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 flex-col justify-between p-10 xl:p-14 text-white relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Link */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-blue-200 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl backdrop-blur-md transition-all border border-white/10 shadow-xs">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Featured Center Card with User's Stretched Banner */}
        <div className="relative z-10 my-auto py-4 max-w-lg w-full">
          {/* Card Container */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4 transform hover:scale-[1.01] transition-transform duration-300">
            {/* Campus Banner Image from public folder - Full Vertical Stretch */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-white/25 h-[420px] sm:h-[460px] xl:h-[500px] w-full bg-slate-900 group">
              <img 
                src="/stretch mwu banner.jpg" 
                alt="Madda Walabu University Campus" 
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/mwu banner.jfif";
                }}
              />
              {/* Bottom Gradient Overlay on Image */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent flex flex-col justify-end p-6">
                <div className="flex items-center gap-3.5 mb-3">
                  <ImageWithFallback src={mwuLogo} alt="MWU Logo" className="w-12 h-12 rounded-xl object-contain bg-white p-1 shadow-lg border border-white/40" />
                  <div>
                    <h3 className="text-white font-extrabold text-xl leading-tight drop-shadow-md">Madda Walabu University</h3>
                    <span className="text-blue-200 text-xs font-semibold tracking-wide uppercase">Official Digital Clearance Portal</span>
                  </div>
                </div>

                {/* Feature Badges overlaid directly at bottom of the banner */}
                <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-white/15">
                  <div className="bg-white/15 backdrop-blur-md rounded-xl p-2.5 border border-white/15 flex items-center gap-2 text-xs font-medium text-blue-100">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Real-Time Desk Routing</span>
                  </div>
                  <div className="bg-white/15 backdrop-blur-md rounded-xl p-2.5 border border-white/15 flex items-center gap-2 text-xs font-medium text-blue-100">
                    <Award className="w-4 h-4 text-amber-300 shrink-0" />
                    <span>QR Verifiable Certificate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Role Badges */}
        <div className="relative z-10 flex items-center gap-4 text-xs font-semibold text-blue-200">
          <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
            <User className="w-4 h-4 text-blue-300" />
            <span>Undergraduate & Postgraduate Students</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
            <Building className="w-4 h-4 text-emerald-300" />
            <span>Staff & Registrar Officers</span>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-10 md:p-14 lg:p-20 bg-slate-50 lg:bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left flex flex-col items-center lg:items-start">
            <ImageWithFallback src={mwuLogo} alt="MWU Logo" className="w-14 h-14 mb-4 rounded-xl object-contain shadow-xs border border-slate-100 p-1 bg-white" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Welcome to MWU CMS</h1>
            <p className="text-slate-600 text-sm">Please enter your university credentials to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800" htmlFor="identifier">
                Student ID, Staff ID or Email
              </label>
              <Input
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. UGR/1234/12 or student@mwu.edu.et"
                required
                className="h-12 text-base rounded-xl border-slate-200 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-800" htmlFor="password">
                  Password
                </label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-12 text-base pr-10 rounded-xl border-slate-200 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Lock className="w-5 h-5" />
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base font-bold mt-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-600/20" isLoading={loading}>
              Sign In to Portal
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700 underline underline-offset-2">
              Register student account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
