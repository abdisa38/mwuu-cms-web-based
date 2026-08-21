import { useState, useEffect } from "react";
import { Search, Plus, UploadCloud, Download, RefreshCw, Mail, CheckCircle2, Eye, User } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { StudentKPIs } from "./components/StudentKPIs";
import { registrarService } from "@/app/services/registrarService";
import { UserProfile } from "@/app/services/authService";
import { toast } from "sonner";

export function StudentDatabasePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await registrarService.getUsers({ role: "student", search: searchQuery });
      setStudents(res.users || []);
    } catch {
      toast.error("Failed to load students directory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [searchQuery]);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen relative space-y-6 pb-20 md:pb-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Records Directory</h1>
          <p className="text-slate-500 text-sm mt-1">Official university-wide active student database.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by ID, Name, Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button variant="outline" onClick={fetchStudents} className="bg-white">
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-bold text-slate-900">Registered Students ({students.length})</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Student Name</th>
                <th className="px-6 py-4 font-semibold">Student ID</th>
                <th className="px-6 py-4 font-semibold">Department & College</th>
                <th className="px-6 py-4 font-semibold">Email & Phone</th>
                <th className="px-6 py-4 font-semibold">Program</th>
                <th className="px-6 py-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.length > 0 ? (
                students.map((st) => (
                  <tr key={st._id || st.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                          {st.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <p className="font-bold text-slate-900">{st.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-blue-900">{st.studentId || "UGR/1234/12"}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800">{st.department || "Computer Science"}</p>
                      <p className="text-xs text-slate-500">{st.college || "College of Computing"}</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">
                      <p>{st.email}</p>
                      {st.phone && <p>{st.phone}</p>}
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium">{st.program || "Undergraduate Regular"}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Active
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No student records matching query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
