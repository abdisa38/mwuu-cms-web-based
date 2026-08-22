import { useState, useEffect } from "react";
import { StaffKPIs } from "./components/StaffKPIs";
import { Users, Building2, Shield, Key, Plus, RefreshCw, Trash2, Mail, Phone, X } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { registrarService } from "@/app/services/registrarService";
import { UserProfile } from "@/app/services/authService";
import { toast } from "sonner";

export function StaffDepartmentsPage() {
  const [activeTab, setActiveTab] = useState<"staff" | "departments">("departments");
  const [departments, setDepartments] = useState<any[]>([]);
  const [staff, setStaff] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);
  const [newDept, setNewDept] = useState({ name: "", code: "", description: "" });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [deptRes, usersRes] = await Promise.all([
        registrarService.getDepartments().catch(() => ({ departments: [] })),
        registrarService.getUsers({ role: 'officer' }).catch(() => ({ users: [] }))
      ]);
      setDepartments(deptRes.departments || []);
      setStaff(usersRes.users || []);
    } catch {
      toast.error("Failed to load departments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateDept = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registrarService.createDepartment(newDept);
      toast.success("Department created successfully.");
      setIsAddDeptOpen(false);
      setNewDept({ name: "", code: "", description: "" });
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to create department.");
    }
  };

  const handleDeleteDept = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this department?")) return;
    try {
      await registrarService.deleteDepartment(id);
      toast.success("Department removed.");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete department.");
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Departments & Staff Administration</h1>
          <p className="text-slate-500 text-sm mt-1">Manage university clearance departments and officer access permissions.</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData} className="bg-white">
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
          <Button onClick={() => setIsAddDeptOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" /> Add Department
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50/50 px-4">
          <button
            onClick={() => setActiveTab("departments")}
            className={`flex items-center gap-2 py-4 px-4 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "departments" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Building2 className="w-4 h-4" /> Clearance Departments ({departments.length})
          </button>
          <button
            onClick={() => setActiveTab("staff")}
            className={`flex items-center gap-2 py-4 px-4 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "staff" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Users className="w-4 h-4" /> Department Officers ({staff.length})
          </button>
        </div>

        <div className="p-6">
          {activeTab === "departments" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((d) => (
                <div key={d._id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-colors">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                        {d.code}
                      </div>
                      <button 
                        onClick={() => handleDeleteDept(d._id)} 
                        className="text-slate-400 hover:text-red-600 p-1 rounded-md"
                        title="Delete Department"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base">{d.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{d.description || "University clearance desk."}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                    <span>Officer: {d.headOfDepartment?.name || "Assigned"}</span>
                    <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "staff" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Officer</th>
                    <th className="px-6 py-4 font-semibold">Department Desk</th>
                    <th className="px-6 py-4 font-semibold">Email</th>
                    <th className="px-6 py-4 font-semibold">Phone</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {staff.length > 0 ? (
                    staff.map((s) => (
                      <tr key={s._id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900">{s.name}</p>
                          <p className="text-xs text-slate-500">{s.staffId || "Officer"}</p>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-800">{s.department}</td>
                        <td className="px-6 py-4 text-xs text-slate-600">{s.email}</td>
                        <td className="px-6 py-4 text-xs text-slate-600">{s.phone || "+251 91 000 0000"}</td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                        No officer accounts found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Department Modal */}
      {isAddDeptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Add University Department</h3>
              <button onClick={() => setIsAddDeptOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateDept} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Department Name *</label>
                <Input required value={newDept.name} onChange={e => setNewDept({ ...newDept, name: e.target.value })} placeholder="e.g. Sports Department" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Department Code *</label>
                <Input required value={newDept.code} onChange={e => setNewDept({ ...newDept, code: e.target.value.toUpperCase() })} placeholder="e.g. SPORTS" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Description</label>
                <textarea 
                  value={newDept.description} 
                  onChange={e => setNewDept({ ...newDept, description: e.target.value })}
                  placeholder="Clearance criteria or scope..." 
                  className="w-full min-h-[80px] p-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsAddDeptOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Create Department</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
