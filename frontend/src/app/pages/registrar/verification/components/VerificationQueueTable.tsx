import { useState, useEffect } from "react";
import { CheckCircle2, Search, RefreshCw, UserCheck, Clock, ShieldCheck, Filter } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { registrarService } from "@/app/services/registrarService";
import { UserProfile } from "@/app/services/authService";

interface VerificationQueueTableProps {
  onSelectStudent: (student: UserProfile) => void;
}

export function VerificationQueueTable({ onSelectStudent }: VerificationQueueTableProps) {
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "pending" | "verified">("all");

  const fetchStudents = () => {
    setLoading(true);
    registrarService.getUsers({ role: "student" })
      .then((res) => setStudents(res.users || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((st) => {
    const matchesSearch = 
      st.name.toLowerCase().includes(search.toLowerCase()) ||
      (st.studentId || "").toLowerCase().includes(search.toLowerCase()) ||
      st.email.toLowerCase().includes(search.toLowerCase()) ||
      (st.department || "").toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filterTab === "pending") return !st.isVerified;
    if (filterTab === "verified") return !!st.isVerified;
    return true;
  });

  const pendingCount = students.filter(s => !s.isVerified).length;
  const verifiedCount = students.filter(s => s.isVerified).length;

  return (
    <div className="flex flex-col">
      {/* Top Filter Bar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 bg-slate-200/70 p-1 rounded-xl">
          <button
            onClick={() => setFilterTab("all")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              filterTab === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All Students ({students.length})
          </button>
          <button
            onClick={() => setFilterTab("pending")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              filterTab === "pending" ? "bg-amber-500 text-white shadow-sm" : "text-amber-800 hover:text-amber-950"
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilterTab("verified")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              filterTab === "verified" ? "bg-emerald-600 text-white shadow-sm" : "text-emerald-800 hover:text-emerald-950"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Verified ({verifiedCount})
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student, ID, dept..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button variant="outline" size="sm" onClick={fetchStudents} className="bg-white border-slate-200 shrink-0">
            <RefreshCw className={`w-4 h-4 mr-1.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-sm text-left border-collapse whitespace-nowrap">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 font-semibold">Student Name</th>
              <th className="px-6 py-4 font-semibold">Student ID</th>
              <th className="px-6 py-4 font-semibold">Department & College</th>
              <th className="px-6 py-4 font-semibold">Registration Email</th>
              <th className="px-6 py-4 font-semibold">Verification Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
                  Loading students from database...
                </td>
              </tr>
            ) : filteredStudents.length > 0 ? (
              filteredStudents.map((st) => (
                <tr 
                  key={st._id || st.id} 
                  onClick={() => onSelectStudent(st)}
                  className="hover:bg-blue-50/50 transition-colors cursor-pointer group bg-white"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                        st.isVerified ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                      }`}>
                        {st.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-blue-700">{st.name}</p>
                        <p className="text-xs text-slate-500">{st.program || "Undergraduate Regular"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-blue-900">
                    {st.studentId || "UGR/---/--"}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800">{st.department || "Computer Science"}</p>
                    <p className="text-xs text-slate-500">{st.college || "College of Computing"}</p>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600 font-mono">
                    {st.email}
                  </td>
                  <td className="px-6 py-4">
                    {st.isVerified ? (
                      <span className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> VERIFIED
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-300 shadow-sm">
                        <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" /> PENDING VERIFICATION
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <Button 
                      size="sm" 
                      className={`text-xs font-semibold ${
                        st.isVerified 
                          ? "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300"
                          : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                      }`}
                      onClick={() => onSelectStudent(st)}
                    >
                      <UserCheck className="w-3.5 h-3.5 mr-1" /> {st.isVerified ? "Review Info" : "Verify Student"}
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-slate-400">
                  No students matching criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
