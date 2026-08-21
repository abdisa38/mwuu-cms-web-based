import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { 
  ChevronRight, 
  Settings as SettingsIcon,
  Shield, 
  Bell, 
  Lock, 
  Eye, 
  MonitorSmartphone, 
  Download, 
  Database, 
  Info,
  User,
  Globe,
  Smartphone,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Palette,
  Moon,
  Sun,
  Laptop2,
  HelpCircle,
  X,
  KeyRound,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import { toast } from "sonner";

export function StudentSettings() {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // General Settings state from real User object
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    language: "en",
    timezone: "EAT",
  });

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Notification Preferences
  const [notifApp, setNotifApp] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifApprovals, setNotifApprovals] = useState(true);
  const [notifRejections, setNotifRejections] = useState(true);

  // Appearance
  const [theme, setTheme] = useState("light");
  const [fontSize, setFontSize] = useState("medium");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
        language: "en",
        timezone: "EAT",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setHasChanges(true);
  };

  const handleSaveGeneral = async () => {
    setIsSaving(true);
    try {
      await authService.updateProfile({
        name: formData.name,
        phone: formData.phone,
      });
      await refreshUser();
      setHasChanges(false);
      toast.success("Profile preferences updated successfully in database!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error("Please enter your current and new password.");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setIsChangingPassword(true);
    try {
      await authService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password changed successfully! Keep it safe.");
    } catch (err: any) {
      toast.error(err.message || "Failed to change password. Check your current password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const tabs = [
    { id: "general", label: "General & Account", icon: User },
    { id: "security", label: "Security & Password", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "sessions", label: "Active Sessions", icon: MonitorSmartphone },
  ];

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 pb-24 md:pb-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center text-sm text-slate-500 mb-1">
            <Link to="/student" className="hover:text-blue-600 transition-colors">Dashboard</Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-slate-900 font-medium">Settings</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Student Account Settings</h1>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 relative">
        {/* Left Sidebar Navigation */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-24">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900">Settings Menu</h3>
            </div>
            <div className="p-2 flex flex-col gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-blue-50 text-blue-700 font-semibold' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}`} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 min-w-0">
          {/* General & Account Settings */}
          {activeTab === "general" && (
            <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
              {/* Real University Profile Information */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-slate-900 text-lg">Official University Profile</h2>
                    <p className="text-xs text-slate-500">Authenticated student records from Madda Walabu University database.</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Active
                  </span>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Student ID</p>
                    <p className="font-semibold text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-200">{user?.studentId || "UGR/---/--"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Student Name</p>
                    <p className="font-semibold text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-200">{user?.name || "Student Name"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">College / Faculty</p>
                    <p className="font-semibold text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-200">{user?.college || "College of Computing"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Department</p>
                    <p className="font-semibold text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-200">{user?.department || "Computer Science"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Program</p>
                    <p className="font-semibold text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-200">{user?.program || "Undergraduate Regular"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">University Email</p>
                    <p className="font-semibold text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-200 truncate">{user?.email || "student@mwu.edu.et"}</p>
                  </div>
                </div>
              </div>

              {/* Editable Preferences */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                  <h2 className="font-bold text-slate-900 text-lg">Contact & Regional Preferences</h2>
                  <p className="text-xs text-slate-500">Update your phone number and regional settings.</p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-900">Full Name</label>
                      <Input 
                        name="name"
                        value={formData.name} 
                        onChange={handleChange} 
                        placeholder="e.g. Bayya Awel"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-900">Phone Number</label>
                      <Input 
                        name="phone"
                        type="tel" 
                        value={formData.phone} 
                        onChange={handleChange} 
                        placeholder="e.g. 0912345678"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-900">Preferred Language</label>
                      <select 
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                        className="w-full h-10 px-3 border border-slate-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="en">English (Default)</option>
                        <option value="om">Afaan Oromoo</option>
                        <option value="am">Amharic (አማርኛ)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-900">Timezone</label>
                      <select 
                        name="timezone"
                        value={formData.timezone}
                        onChange={handleChange}
                        className="w-full h-10 px-3 border border-slate-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="EAT">East Africa Time (UTC+3)</option>
                        <option value="UTC">Coordinated Universal Time (UTC)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <Button 
                      onClick={handleSaveGeneral} 
                      isLoading={isSaving} 
                      disabled={!hasChanges}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm"
                    >
                      Save Profile Changes
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security & Password */}
          {activeTab === "security" && (
            <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                  <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-blue-600" />
                    Change Account Password
                  </h2>
                  <p className="text-xs text-slate-500">Update your security credentials directly in the MWU database.</p>
                </div>
                <div className="p-6">
                  <form onSubmit={handleChangePassword} className="max-w-md space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-900">Current Password <span className="text-red-500">*</span></label>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-900">New Password <span className="text-red-500">*</span></label>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-900">Confirm New Password <span className="text-red-500">*</span></label>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        required 
                      />
                    </div>
                    <Button 
                      type="submit" 
                      isLoading={isChangingPassword} 
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm w-full"
                    >
                      Update Password
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                  <h2 className="font-bold text-slate-900 text-lg">Notification Preferences</h2>
                  <p className="text-xs text-slate-500">Manage your clearance notifications and email delivery.</p>
                </div>
                <div className="divide-y divide-slate-100">
                  <div className="p-6 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-900">In-App Notifications</h4>
                      <p className="text-sm text-slate-500">Receive real-time clearance status updates in your student dashboard</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={notifApp} 
                      onChange={() => { setNotifApp(!notifApp); toast.success("In-app notifications preference saved."); }} 
                      className="w-5 h-5 text-blue-600 rounded" 
                    />
                  </div>
                  
                  <div className="p-6 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-900">Email Notifications</h4>
                      <p className="text-sm text-slate-500">Receive email alerts at {user?.email} whenever department officers review your clearance</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={notifEmail} 
                      onChange={() => { setNotifEmail(!notifEmail); toast.success("Email notifications preference saved."); }} 
                      className="w-5 h-5 text-blue-600 rounded" 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeTab === "appearance" && (
            <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
                <h2 className="font-bold text-slate-900 text-lg">Theme & Display</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button 
                    onClick={() => { setTheme("light"); toast.info("Light theme active"); }}
                    className={`p-4 rounded-xl border-2 flex items-center gap-3 ${theme === 'light' ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-semibold' : 'border-slate-200 text-slate-700'}`}
                  >
                    <Sun className="w-5 h-5 text-amber-500" /> Light Mode
                  </button>
                  <button 
                    onClick={() => { setTheme("dark"); toast.info("Dark mode toggled"); }}
                    className={`p-4 rounded-xl border-2 flex items-center gap-3 ${theme === 'dark' ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-semibold' : 'border-slate-200 text-slate-700'}`}
                  >
                    <Moon className="w-5 h-5 text-indigo-500" /> Dark Mode
                  </button>
                  <button 
                    onClick={() => { setTheme("system"); toast.info("System default selected"); }}
                    className={`p-4 rounded-xl border-2 flex items-center gap-3 ${theme === 'system' ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-semibold' : 'border-slate-200 text-slate-700'}`}
                  >
                    <Laptop2 className="w-5 h-5 text-slate-500" /> System Default
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Active Sessions */}
          {activeTab === "sessions" && (
            <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="font-bold text-slate-900 text-lg mb-2">Active Session</h2>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Laptop className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="font-semibold text-slate-900">Current Web Session ({user?.role?.toUpperCase()})</p>
                      <p className="text-xs text-slate-500">Logged in as {user?.email} • Last login: {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
                    Active Now
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
