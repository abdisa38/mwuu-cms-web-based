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
  Award,
  GraduationCap
} from "lucide-react";
import { registrarService } from "../../services/registrarService";
import { UserProfile } from "../../services/authService";
import { MWU_OFFICIAL_COLLEGES } from "../../data/mwuAcademicStructure";
import { toast } from "sonner";

export const CLEARANCE_OFFICES = [
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

  const [selectedCollege, setSelectedCollege] = useState(MWU_OFFICIAL_COLLEGES[0].college);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    userRoleCategory: "student", // 'student' | 'dept_head' | 'officer' | 'registrar'
    college: MWU_OFFICIAL_COLLEGES[0].college,
    department: MWU_OFFICIAL_COLLEGES[0].departments[0],
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
      toast.error("Failed to load users from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [activeTab, search]);

  const currentCollegeObj = MWU_OFFICIAL_COLLEGES.find((c) => c.college === selectedCollege) || MWU_OFFICIAL_COLLEGES[0];

  const handleRoleCategoryChange = (category: string) => {
    if (category === "student") {
      setNewUser({
        ...newUser,
        role: "student",
        userRoleCategory: "student",
        college: currentCollegeObj.college,
        department: currentCollegeObj.departments[0],
      });
    } else if (category === "dept_head") {
      setNewUser({
        ...newUser,
        role: "officer",
        userRoleCategory: "dept_head",
        college: currentCollegeObj.college,
        department: "Department Head",
      });
    } else if (category === "officer") {
      setNewUser({
        ...newUser,
        role: "officer",
        userRoleCategory: "officer",
        college: "Central Administration",
        department: "Library",
      });
    } else {
      // registrar
      setNewUser({
        ...newUser,
        role: "registrar",
        userRoleCategory: "registrar",
        college: "Registrar Administration",
        department: "Registrar",
      });
    }
  };

  const handleCollegeChange = (collegeName: string) => {
    setSelectedCollege(collegeName);
    const col = MWU_OFFICIAL_COLLEGES.find((c) => c.college === collegeName) || MWU_OFFICIAL_COLLEGES[0];
    setNewUser({
      ...newUser,
      college: col.college,
      department: newUser.userRoleCategory === "dept_head" ? "Department Head" : col.departments[0],
    });
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      await registrarService.createUser({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
        college: newUser.college,
        department: newUser.department,
        studentId: newUser.studentId,
        phone: newUser.phone,
      });

      toast.success(`User ${newUser.name} created successfully in MongoDB database!`);
      setIsAddModalOpen(false);
      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "student",
        userRoleCategory: "student",
        college: MWU_OFFICIAL_COLLEGES[0].college,
        department: MWU_OFFICIAL_COLLEGES[0].departments[0],
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
    if (!window.confirm("Are you sure you want to delete this user from database?")) return;
    try {
      await registrarService.deleteUser(id);
      toast.success("User deleted successfully.");
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 md:pb-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
          <p className="text-slate-500 text-sm mt-1">Manage authentic student accounts, department heads, officers, and administrators.</p>
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
              { id: 'officers', label: 'Officers & Heads' },
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
              placeholder="Search name, email, ID..." 
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
                          u.department === 'Department Head' ? 'bg-amber-100 text-amber-800' :
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
                        u.department === 'Department Head' ? 'bg-amber-50 text-amber-800 border-amber-200 font-bold' :
                        u.role === 'officer' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                        'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {u.department === 'Department Head' ? 'DEPT HEAD' : u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-800 font-medium">
                      {u.department === "Department Head" ? `Department Head (${u.college || "Academic"})` : u.department || "General"}
                    </td>
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
                <label className="text-xs font-bold text-slate-700">User Role Category *</label>
                <select 
                  value={newUser.userRoleCategory} 
                  onChange={e => handleRoleCategoryChange(e.target.value)}
                  className="w-full h-11 px-3 border border-slate-300 rounded-xl bg-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="student">Student (Clearance Applicant)</option>
                  <option value="dept_head">Department Head (Academic Sign-off Desk)</option>
                  <option value="officer">Department Officer (Clearance Desk)</option>
                  <option value="registrar">Registrar Administrator</option>
                </select>
              </div>

              {/* DYNAMIC DROPDOWNS BASED ON ROLE */}
              {newUser.userRoleCategory === "student" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Select College / Faculty</label>
                    <select 
                      value={selectedCollege} 
                      onChange={e => handleCollegeChange(e.target.value)}
                      className="w-full h-10 px-3 border border-slate-300 rounded-xl bg-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
                    >
                      {MWU_OFFICIAL_COLLEGES.map(c => (
                        <option key={c.college} value={c.college}>{c.college}</option>
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
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : newUser.userRoleCategory === "dept_head" ? (
                <div className="space-y-3 p-3.5 bg-amber-50/60 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                    <GraduationCap className="w-4 h-4 text-amber-700" /> Academic Department Head Setup
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Select College / Faculty</label>
                    <select 
                      value={selectedCollege} 
                      onChange={e => handleCollegeChange(e.target.value)}
                      className="w-full h-10 px-3 border border-slate-300 rounded-xl bg-white text-xs font-medium focus:ring-2 focus:ring-blue-500"
                    >
                      {MWU_OFFICIAL_COLLEGES.map(c => (
                        <option key={c.college} value={c.college}>{c.college}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Assigned Clearance Review Desk</label>
                    <Input value="Department Head" disabled className="bg-white text-sm font-semibold text-amber-900" />
                  </div>
                </div>
              ) : newUser.userRoleCategory === "officer" ? (
                <div className="space-y-1 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                  <label className="text-xs font-bold text-indigo-900">Assigned Clearance Desk *</label>
                  <select 
                    value={newUser.department} 
                    onChange={e => setNewUser({ ...newUser, department: e.target.value })}
                    className="w-full h-11 px-3 border border-slate-300 rounded-xl bg-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 text-indigo-900"
                  >
                    {CLEARANCE_OFFICES.map(off => (
                      <option key={off} value={off}>
                        {off} Clearance Desk
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
                  <label className="text-xs font-bold text-slate-700">{newUser.userRoleCategory === "student" ? "Student ID" : "Staff ID"}</label>
                  <Input 
                    value={newUser.studentId} 
                    onChange={e => setNewUser({ ...newUser, studentId: e.target.value })} 
                    placeholder={newUser.userRoleCategory === "student" ? "e.g. UGR/1234/12" : "e.g. EMP/042"}
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
