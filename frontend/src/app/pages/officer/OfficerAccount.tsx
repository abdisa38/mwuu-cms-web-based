import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { 
  ChevronRight, 
  Download, 
  Printer, 
  Edit, 
  CheckCircle2, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Building2, 
  Award, 
  Laptop, 
  UserCheck, 
  User, 
  Briefcase, 
  Shield, 
  Activity, 
  FileText,
  Clock,
  RefreshCw
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import { officerService, OfficerDashboardStats } from "../../services/officerService";
import { toast } from "sonner";

export function OfficerAccount() {
  const { user, refreshUser } = useAuth();
  const [stats, setStats] = useState<OfficerDashboardStats | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
      });
    }
  }, [user]);

  useEffect(() => {
    officerService.getDashboard()
      .then((res) => {
        if (res.success && res.stats) {
          setStats(res.stats);
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await authService.updateProfile({
        name: formData.name,
        phone: formData.phone,
      });
      await refreshUser();
      setIsEditing(false);
      toast.success("Officer profile updated in database!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const initials = (user?.name || "Officer").split(" ").map((n) => n[0]).join("").slice(0, 2);

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 pb-24 md:pb-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm shrink-0">
        <div>
          <div className="flex items-center text-sm text-slate-500 mb-1">
            <Link to="/officer" className="hover:text-blue-600 transition-colors">Dashboard</Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-slate-900 font-medium">Account</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">My Account</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)} className="bg-white border-slate-200 shadow-sm px-4 flex-1 sm:flex-none">
              <Edit className="w-4 h-4 mr-2" /> Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column (Main Details) */}
        <div className="flex-1 space-y-6 min-w-0">
          {/* Hero Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
            <div className="h-32 bg-gradient-to-r from-blue-900 to-indigo-800 w-full relative"></div>
            
            <div className="px-6 sm:px-8 pb-8 relative">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-12 sm:-mt-16 mb-6">
                <div className="relative group">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl border-4 border-white bg-blue-100 shadow-md flex items-center justify-center text-4xl font-bold text-blue-800 overflow-hidden">
                    {initials}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full flex items-center justify-center" title="Verified Officer">
                    <ShieldCheck className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 pb-2">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                      {user?.name || "Department Officer"}
                    </h2>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200 font-mono">
                      {user?.staffId || "EMP/001"}
                    </span>
                  </div>
                  <p className="text-slate-600 font-medium flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400" /> {user?.department || "Clearance Desk"} • Official Reviewer
                  </p>
                </div>

                <div className="w-full sm:w-auto flex flex-col gap-2">
                  <div className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    Profile Active
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">Account Role</p>
                  <p className="font-medium text-slate-900 flex items-center capitalize"><UserCheck className="w-4 h-4 mr-1.5 text-blue-500"/> {user?.role || "officer"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">Status</p>
                  <p className="font-medium text-emerald-600 flex items-center"><CheckCircle2 className="w-4 h-4 mr-1.5"/> Active</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">Department Desk</p>
                  <p className="font-medium text-slate-900 flex items-center"><Award className="w-4 h-4 mr-1.5 text-amber-500"/> {user?.department || "General"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">Work Email</p>
                  <p className="font-medium text-slate-900 truncate font-mono text-xs">{user?.email || "officer@mwu.edu.et"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information Form */}
          <form onSubmit={handleSave}>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 flex items-center">
                  <User className="w-5 h-5 mr-2 text-slate-400" /> Personal & Contact Information
                </h3>
                {!isEditing && <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="text-blue-600 h-8">Edit</Button>}
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                    {isEditing ? (
                      <Input 
                        value={formData.name} 
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                        required 
                      />
                    ) : (
                      <p className="font-semibold text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-200">{user?.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Official Email</label>
                    <p className="font-semibold text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono text-sm">{user?.email}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Contact Phone</label>
                    {isEditing ? (
                      <Input 
                        type="tel" 
                        value={formData.phone} 
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                        placeholder="+251 91 200 0001"
                      />
                    ) : (
                      <p className="font-semibold text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-200">{user?.phone || "+251 91 000 0000"}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Assigned Department</label>
                    <p className="font-semibold text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-200">{user?.department || "General Desk"}</p>
                  </div>
                </div>

                {isEditing && (
                  <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                    <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button type="submit" isLoading={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm">
                      Save Profile Changes
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </form>

          {/* Permissions Matrix */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-slate-400" /> Assigned Permissions
              </h3>
              <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-md uppercase tracking-wider">
                Role: {user?.role?.toUpperCase()}
              </span>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-medium text-slate-700">Approve Clearances</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-medium text-slate-700">Reject Clearances</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-medium text-slate-700">View Student Records</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-medium text-slate-700">Direct Inquiries Access</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-medium text-slate-700">Department Audit Log</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Live KPI Stats) */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          {/* Performance KPI Widget */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
              <h3 className="font-bold text-slate-900 flex items-center">
                <Activity className="w-4 h-4 mr-2 text-slate-500" /> Live Performance
              </h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assigned Total</p>
                  <p className="text-2xl font-bold text-slate-900">{stats?.totalAssigned || 0}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-center">
                  <p className="text-xl font-bold text-emerald-700">{stats?.approvedCount || 0}</p>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Approvals</p>
                </div>
                <div className="bg-red-50 p-3 rounded-xl border border-red-100 text-center">
                  <p className="text-xl font-bold text-red-700">{stats?.rejectedCount || 0}</p>
                  <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Rejections</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Queue</span>
                  <span className="text-sm font-bold text-amber-600">{stats?.pendingCount || 0} Pending</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Session */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-bold text-slate-900 text-sm mb-3">Active Web Session</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-xs">Logged into MWU Officer Portal</p>
                <p className="text-[11px] text-slate-500 font-mono">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
