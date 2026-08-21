import { useState, useEffect } from "react";
import { MoreVertical, Mail, User, ShieldAlert, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { registrarService } from "@/app/services/registrarService";
import { UserProfile } from "@/app/services/authService";

interface VerificationQueueTableProps {
  onSelectStudent: (studentId: string) => void;
}

export function VerificationQueueTable({ onSelectStudent }: VerificationQueueTableProps) {
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    registrarService.getUsers({ role: "student" })
      .then(res => setStudents(res.users || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="overflow-x-auto min-h-[400px]">
      <table className="w-full text-sm text-left border-collapse whitespace-nowrap">
        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
          <tr>
            <th className="px-6 py-4 font-semibold">Student Name</th>
            <th className="px-6 py-4 font-semibold">Student ID</th>
            <th className="px-6 py-4 font-semibold">Department & College</th>
            <th className="px-6 py-4 font-semibold">Registration Email</th>
            <th className="px-6 py-4 font-semibold">Status</th>
            <th className="px-6 py-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {students.length > 0 ? (
            students.map((st) => (
              <tr 
                key={st._id || st.id} 
                onClick={() => onSelectStudent(st.studentId || st._id || "")}
                className="hover:bg-blue-50/50 transition-colors cursor-pointer group bg-white"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                      {st.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 group-hover:text-blue-700">{st.name}</p>
                      <p className="text-xs text-slate-500">{st.program || "Regular"}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono font-bold text-blue-900">
                  {st.studentId || "UGR/1234/12"}
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-slate-800">{st.department || "Computer Science"}</p>
                  <p className="text-xs text-slate-500">{st.college || "College of Computing"}</p>
                </td>
                <td className="px-6 py-4 text-xs text-slate-600">
                  {st.email}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Active
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs bg-white"
                    onClick={() => onSelectStudent(st.studentId || st._id || "")}
                  >
                    Inspect Records
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                No student verification records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
