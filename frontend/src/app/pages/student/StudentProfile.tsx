import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  GraduationCap, 
  ShieldCheck, 
  Edit3, 
  Save, 
  ChevronRight,
  CheckCircle2
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import { toast } from "sonner";

export function StudentProfile() {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "John Doe",
    phone: user?.phone || "+251 91 234 5678",
    emergencyName: user?.emergencyContact?.name || "Abebe Kebede",
    emergencyPhone: user?.emergencyContact?.phone || "+251 92 111 2233",
    emergencyAddress: user?.emergencyContact?.address || "Robe Town, Kebele 02",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        emergencyName: user.emergencyContact?.name || "",
        emergencyPhone: user.emergencyContact?.phone || "",
        emergencyAddress: user.emergencyContact?.address || "",
      });
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.updateProfile({
        name: formData.name,
        phone: formData.phone,
        emergencyContact: {
          name: formData.emergencyName,
          phone: formData.emergencyPhone,
          address: formData.emergencyAddress,
        },
      });
      await refreshUser();
      setIsEditing(false);
      toast.success("Profile details updated successfully.");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "ST";

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 md:pb-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center text-sm text-slate-500 mb-1">
            <Link to="/student" className="hover:text-blue-600">Dashboard</Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-slate-900 font-medium">Profile</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Student Profile & Records</h1>
        </div>

        <Button 
          variant={isEditing ? "outline" : "default"} 
          onClick={() => setIsEditing(!isEditing)}
          className={!isEditing ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-white border-slate-200"}
        >
          <Edit3 className="w-4 h-4 mr-2" />
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-2xl mb-4 shadow-md">
            {initials}
          </div>
          <h3 className="text-xl font-bold text-slate-900">{user?.name || "Student"}</h3>
          <p className="text-sm font-mono text-blue-600 font-medium mt-0.5">{user?.studentId || "UGR/1234/12"}</p>
          
          <div className="mt-6 w-full pt-6 border-t border-slate-100 space-y-3 text-left text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Active Student
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Program:</span>
              <span className="font-medium text-slate-900">{user?.program || "Undergraduate Regular"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">College:</span>
              <span className="font-medium text-slate-900">{user?.college || "College of Computing"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Department:</span>
              <span className="font-medium text-slate-900">{user?.department || "Computer Science"}</span>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                Personal & Contact Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">Full Name</label>
                  <Input 
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })} 
                    disabled={!isEditing} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">University Email</label>
                  <Input value={user?.email || ""} disabled className="bg-slate-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">Phone Number</label>
                  <Input 
                    value={formData.phone} 
                    onChange={e => setFormData({ ...formData, phone: e.target.value })} 
                    disabled={!isEditing} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">Residential Address</label>
                  <Input 
                    value={formData.emergencyAddress} 
                    onChange={e => setFormData({ ...formData, emergencyAddress: e.target.value })} 
                    disabled={!isEditing} 
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                Emergency Contact
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">Contact Person</label>
                  <Input 
                    value={formData.emergencyName} 
                    onChange={e => setFormData({ ...formData, emergencyName: e.target.value })} 
                    disabled={!isEditing} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">Emergency Phone</label>
                  <Input 
                    value={formData.emergencyPhone} 
                    onChange={e => setFormData({ ...formData, emergencyPhone: e.target.value })} 
                    disabled={!isEditing} 
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end pt-4 border-t border-slate-100">
                <Button type="submit" isLoading={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
