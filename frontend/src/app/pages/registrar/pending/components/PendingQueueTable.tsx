import { useState, useEffect } from "react";
import { MoreVertical, Mail, ShieldAlert, Clock, AlertCircle, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { registrarService } from "../../../../../services/registrarService";
import { ClearanceRequest } from "../../../../../services/clearanceService";

interface PendingQueueTableProps {
  onSelectClearance: (clearanceId: string) => void;
}

export function PendingQueueTable({ onSelectClearance }: PendingQueueTableProps) {
  const [clearances, setClearances] = useState<ClearanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    registrarService.getAllClearances({ status: "pending" })
      .then(res => setClearances(res.clearances || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="overflow-x-auto min-h-[400px]">
      <table className="w-full text-sm text-left border-collapse whitespace-nowrap">
        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 sticky top-0 z-10 shadow-sm">
          <tr>
            <th className="px-6 py-4 font-semibold">Student & ID</th>
            <th className="px-6 py-4 font-semibold">Clearance Type</th>
            <th className="px-6 py-4 font-semibold">Department & College</th>
            <th className="px-6 py-4 font-semibold">Progress</th>
            <th className="px-6 py-4 font-semibold">Submission Date</th>
            <th className="px-6 py-4 font-semibold">Status</th>
            <th className="px-6 py-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {clearances.length > 0 ? (
            clearances.map((req) => {
              const approvals = req.departmentApprovals || [];
              const approvedCount = approvals.filter(a => a.status === "approved").length;
              const percent = approvals.length > 0 ? Math.round((approvedCount / approvals.length) * 100) : 0;

              return (
                <tr 
                  key={req._id} 
                  onClick={() => onSelectClearance(req._id)}
                  className="hover:bg-blue-50/50 transition-colors cursor-pointer group bg-white"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                        {req.studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 group-hover:text-blue-700">{req.studentName}</span>
                        <span className="text-xs text-slate-500 font-mono">{req.studentId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900 capitalize">{req.clearanceType}</span>
                      <span className="text-xs text-slate-500 font-mono">{req.requestId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800">{req.department}</p>
                    <p className="text-xs text-slate-500">{req.college}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${percent}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{percent}% ({approvedCount}/{approvals.length})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {new Date(req.submittedAt || req.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      <Clock className="w-3 h-3 mr-1" /> Pending Department Review
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs bg-white"
                      onClick={() => onSelectClearance(req._id)}
                    >
                      Inspect
                    </Button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                No pending clearance applications.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
