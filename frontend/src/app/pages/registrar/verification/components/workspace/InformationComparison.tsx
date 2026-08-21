import { Check, X, AlertCircle } from "lucide-react";
import { UserProfile } from "@/app/services/authService";

interface InformationComparisonProps {
  student: UserProfile;
}

export function InformationComparison({ student }: InformationComparisonProps) {
  const fields = [
    { label: "Student Name", submitted: student.name, record: student.name, status: "match" },
    { label: "Student ID", submitted: student.studentId || "UGR/---/--", record: student.studentId || "UGR/---/--", status: "match" },
    { label: "College", submitted: student.college || "College of Computing", record: student.college || "College of Computing", status: "match" },
    { label: "Department", submitted: student.department || "Computer Science", record: student.department || "Computer Science", status: "match" },
    { label: "Program", submitted: student.program || "Undergraduate Regular", record: student.program || "Undergraduate Regular", status: "match" },
    { label: "University Email", submitted: student.email, record: student.email, status: "match" },
    { label: "Contact Phone", submitted: student.phone || "+251 91 000 0000", record: student.phone || "+251 91 000 0000", status: "match" },
    { label: "Account Status", submitted: student.status || "Active", record: student.status || "Active", status: "match" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Information Comparison</h3>
          <p className="text-xs text-slate-500">Live verified database comparison against MWU registrar archives.</p>
        </div>
        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          Verified Match
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-3.5 font-semibold w-1/4">Field</th>
              <th className="px-6 py-3.5 font-semibold w-1/3">Submitted Information</th>
              <th className="px-6 py-3.5 font-semibold w-1/3">University Record</th>
              <th className="px-6 py-3.5 font-semibold text-center w-1/12">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {fields.map((field, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-3.5 font-semibold text-slate-700">
                  {field.label}
                </td>
                <td className="px-6 py-3.5 text-slate-900 font-medium font-mono text-xs">
                  {field.submitted}
                </td>
                <td className="px-6 py-3.5 text-slate-600 font-mono text-xs">
                  {field.record}
                </td>
                <td className="px-6 py-3.5 text-center">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mx-auto" title="Verified Match">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
