import { Link, useNavigate } from "react-router";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import mwuLogo from "@/imports/download.jfif";
import { ArrowLeft, Building, User, Lock, ShieldAlert, Sparkles } from "lucide-react";
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

  // Quick Demo Logins
  const setDemoCredentials = (role: "student" | "officer" | "registrar") => {
    if (role === "student") {
      setIdentifier("student@mwu.edu.et");
      setPassword("Student@12345");
      handleLogin("student@mwu.edu.et", "Student@12345");
    } else if (role === "officer") {
      setIdentifier("library@mwu.edu.et");
      setPassword("Officer@12345");
      handleLogin("library@mwu.edu.et", "Officer@12345");
    } else if (role === "registrar") {
      setIdentifier("registrar@mwu.edu.et");
      setPassword("Admin@12345");
      handleLogin("registrar@mwu.edu.et", "Admin@12345");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full bg-white">
      {/* Left side - University Visual */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 flex-col justify-between p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center text-blue-100 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="relative z-10 max-w-lg mt-auto pb-20">
          <h2 className="text-4xl font-bold mb-6 text-white leading-tight">
            Streamline your university clearance process.
          </h2>
          <p className="text-blue-100 text-lg leading-relaxed mb-8">
            The MWU e-Clearance System provides a seamless, secure, and fast way to manage university clearance directly connected to the central database.
          </p>
          <div className="flex items-center gap-4 text-sm font-medium text-blue-200">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" /> Students
            </div>
            <div className="w-1 h-1 rounded-full bg-blue-400" />
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5" /> Staff & Officers
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 md:p-16 lg:p-24 bg-slate-50 lg:bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left flex flex-col items-center lg:items-start">
            <ImageWithFallback src={mwuLogo} alt="MWU Logo" className="w-12 h-12 mb-4 rounded-md object-contain" />
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to MWU CMS</h1>
            <p className="text-slate-600">Please enter your credentials to sign in.</p>
          </div>

          {/* Quick Demo Login Badges */}
          <div className="mb-6 bg-blue-50/70 border border-blue-100 rounded-xl p-3">
            <div className="text-xs font-semibold text-blue-800 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Quick Live Demo Login:
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDemoCredentials("student")}
                className="text-xs bg-white text-blue-700 hover:bg-blue-100/60 font-medium py-1 px-2.5 rounded-lg border border-blue-200 shadow-sm transition-all"
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials("officer")}
                className="text-xs bg-white text-indigo-700 hover:bg-indigo-100/60 font-medium py-1 px-2.5 rounded-lg border border-indigo-200 shadow-sm transition-all"
              >
                Officer (Library)
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials("registrar")}
                className="text-xs bg-white text-purple-700 hover:bg-purple-100/60 font-medium py-1 px-2.5 rounded-lg border border-purple-200 shadow-sm transition-all"
              >
                Registrar
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900" htmlFor="identifier">
                Student ID, Staff ID or Email
              </label>
              <Input
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. UGR/1234/12 or student@mwu.edu.et"
                required
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-900" htmlFor="password">
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
                  className="h-12 text-base pr-10"
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

            <Button type="submit" className="w-full h-12 text-base mt-6 bg-blue-600 hover:bg-blue-700 text-white" isLoading={loading}>
              Sign In
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700">
              Register now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
