import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { 
  Search, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  RefreshCw, 
  X, 
  User as UserIcon, 
  Building2, 
  ShieldCheck,
  ChevronDown
} from "lucide-react";
import { registrarService } from "../../services/registrarService";
import { UserProfile } from "../../services/authService";
import { MWU_ACADEMIC_COLLEGES } from "../../data/mwuAcademicStructure";
import { toast } from "sonner";

export const CLEARANCE_OFFICES = [
  "Department Head",
  "Library",
  "Dormitory",
  "Cafeteria",
  "Bookstore",
  "Sports Master",
  "Campus Security",
  "Finance Office",
  "Student Affairs",
  "Registrar",
];

export function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  const [selectedCollege, setSelectedCollege] = useState(MWU_ACADEMIC_COLLEGES[0].name);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    college: MWU_ACADEMIC_COLLEGES[0].name,
    department: MWU_ACADEMIC_COLLEGES[0].departments[0].name,
    studentId: "",
    phone: "",
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const roleParam = activeTab === "all" ? undefined : activeTab.slice(0, -1);
      const res = await registrarService.getUsers({ role: roleParam, search });
      setUsers(res.users || []);
    } catch {
      toast.error("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [activeTab, search]);

  const currentCollegeObj = MWU_ACADEMIC_COLLEGES.find((c) => c.name === selectedCollege) || MWU_ACADEMIC_COLLEGES[0];

  const handleRoleChange = (role: string) => {
    if (role === "student") {
      setNewUser({
        ...newUser,
        role,
        college: currentCollegeObj.name,
        department: currentCollegeObj.departments[0].name,
      });
    } else if (role === "officer") {
      setNewUser({
        ...newUser,
        role,
        college: "Central Administration",
        department: "Department Head",
      });
    } else {
      // registrar
      setNewUser({
        ...newUser,
        role,
        college: "Registrar Administration",
        department: "Registrar",
      });
    }
  };

  const handleCollegeChange = (collegeName: string) => {
    setSelectedCollege(collegeName);
    const col = MWU_ACADEMIC_COLLEGES.find((c) => c.name === collegeName) || MWU_ACADEMIC_COLLEGES[0];
    setNewUser({
      ...newUser,
      college: col.name,
      department: col.departments[0].name,
    });
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      await registrarService.createUser(newUser);
      toast.success(`User ${newUser.name} created successfully as ${newUser.role.toUpperCase()}!`);
      setIsAddModalOpen(false);
      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "student",
        college: MWU_ACADEMIC_COLLEGES[0].name,
        department: MWU_ACADEMIC_COLLEGES[0].departments[0].name,
        studentId: "",
        phone: "",
      });
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Failed to create user.");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await registrarService.deleteUser(id);
      toast.success("User removed.");
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 md:pb-0 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
          <p className="text-slate-500 text-sm mt-1">Manage student accounts, department officers, and university administrators.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchUsers} className="bg-white">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm">
            <Plus className="w-4 h-4 mr-2" /> Add New User
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between gap-4 bg-slate-50/50">
          <div className="flex gap-1 bg-slate-200/70 p-1 rounded-xl self-start">
            {[
              { id: 'all', label: 'All Users' },
              { id: 'students', label: 'Students' },
              { id: 'officers', label: 'Officers' },
              { id: 'admins', label: 'Admins' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, student ID..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Department / Desk</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.length > 0 ? (
                users.map((u) => (
                  <tr key={u._id || u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                          u.role === 'registrar' || u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                          u.role === 'officer' ? 'bg-indigo-100 text-indigo-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{u.name}</p>
                          <p className="text-xs text-slate-500 font-mono">{u.studentId || u.staffId || u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase border ${
                        u.role === 'registrar' || u.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        u.role === 'officer' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                        'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-800 font-medium">{u.department || "General"}</td>
                    <td className="px-6 py-4 text-xs text-slate-600 font-mono">
                      <p>{u.email}</p>
                      {u.phone && <p className="text-slate-400 font-sans">{u.phone}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDeleteUser(u._id || u.id!)} 
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No users matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Create New University User</h3>
                <p className="text-xs text-slate-500">Add authentic student, department head, or clearance officer.</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Full Name *</label>
                <Input 
                  required 
                  value={newUser.name} 
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })} 
                  placeholder="e.g. Dr. Abebe Kebede or Bayya Awel"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Email Address *</label>
                  <Input 
                    type="email" 
                    required 
                    value={newUser.email} 
                    onChange={e => setNewUser({ ...newUser, email: e.target.value })} 
                    placeholder="name@mwu.edu.et"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Initial Password *</label>
                  <Input 
                    type="password" 
                    required 
                    value={newUser.password} 
                    onChange={e => setNewUser({ ...newUser, password: e.target.value })} 
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">User Role *</label>
                <select 
                  value={newUser.role} 
                  onChange={e => handleRoleChange(e.target.value)}
                  className="w-full h-11 px-3 border border-slate-300 rounded-xl bg-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="student">Student (Clearance Applicant)</option>
                  <option value="officer">Department Officer / Department Head</option>
                  <option value="registrar">Registrar Administrator</option>
                </select>
              </div>

              {/* DYNAMIC DROPDOWNS BASED ON ROLE */}
              {newUser.role === "student" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Select College / Faculty</label>
                    <select 
                      value={selectedCollege} 
                      onChange={e => handleCollegeChange(e.target.value)}
                      className="w-full h-10 px-3 border border-slate-300 rounded-xl bg-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
                    >
                      {MWU_ACADEMIC_COLLEGES.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Academic Department</label>
                    <select 
                      value={newUser.department} 
                      onChange={e => setNewUser({ ...newUser, department: e.target.value })}
                      className="w-full h-10 px-3 border border-slate-300 rounded-xl bg-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
                    >
                      {currentCollegeObj.departments.map(d => (
                        <option key={d.name} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : newUser.role === "officer" ? (
                <div className="space-y-1 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                  <label className="text-xs font-bold text-indigo-900">Assigned Clearance Desk / Department Head *</label>
                  <select 
                    value={newUser.department} 
                    onChange={e => setNewUser({ ...newUser, department: e.target.value })}
                    className="w-full h-11 px-3 border border-slate-300 rounded-xl bg-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 text-indigo-900"
                  >
                    {CLEARANCE_OFFICES.map(off => (
                      <option key={off} value={off}>
                        {off === "Department Head" ? "Department Head (Academic Sign-off Desk)" : `${off} Clearance Desk`}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-1 p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                  <label className="text-xs font-bold text-purple-900">Registrar Administration Desk</label>
                  <Input value="Registrar" disabled className="bg-white text-sm font-semibold" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">{newUser.role === "student" ? "Student ID" : "Staff ID"}</label>
                  <Input 
                    value={newUser.studentId} 
                    onChange={e => setNewUser({ ...newUser, studentId: e.target.value })} 
                    placeholder={newUser.role === "student" ? "e.g. UGR/1234/12" : "e.g. EMP/042"}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Phone Number</label>
                  <Input 
                    type="tel"
                    value={newUser.phone} 
                    onChange={e => setNewUser({ ...newUser, phone: e.target.value })} 
                    placeholder="+251 91 123 4567"
                  />
                </div>
              </div>

              <div className="px-0 pt-4 border-t border-slate-100 flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                <Button type="submit" isLoading={createLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm px-6">
                  Save User to Database
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
