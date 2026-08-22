import { useState, useEffect } from "react";
import { Clock, CheckCircle2, RefreshCw, Eye } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { registrarService } from "@/app/services/registrarService";
import { ClearanceRequest } from "@/app/services/clearanceService";

interface PendingQueueTableProps {
  search?: string;
  statusFilter?: string;
  onSelectClearance: (clearanceId: string) => void;
  refreshTrigger?: number;
}

export function PendingQueueTable({ 
  search = "", 
  statusFilter = "All", 
  onSelectClearance,
  refreshTrigger = 0 
}: PendingQueueTableProps) {
  const [clearances, setClearances] = useState<ClearanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClearances = () => {
    setLoading(true);
    registrarService.getAllClearances()
      .then(res => {
        // filter for active/pending/in_progress clearances
        const active = (res.clearances || []).filter(c => c.status !== "completed" && c.status !== "rejected");
        setClearances(active);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchClearances();
  }, [refreshTrigger]);

  const filteredClearances = clearances.filter(req => {
    const s = search.toLowerCase();
    const matchesSearch = 
      req.studentName.toLowerCase().includes(s) ||
      req.studentId.toLowerCase().includes(s) ||
      req.requestId.toLowerCase().includes(s) ||
      req.department.toLowerCase().includes(s);

    if (!matchesSearch) return false;

    if (statusFilter === "Pending") {
      return req.status === "pending";
    } else if (statusFilter === "In Progress" || statusFilter === "Partially Approved") {
      return req.status === "in_progress";
    } else if (statusFilter === "Ready for Review") {
      const approvals = req.departmentApprovals || [];
      const nonRegApproved = approvals.filter(a => !a.departmentName.toLowerCase().includes("reg")).every(a => a.status === "approved");
      return nonRegApproved;
    }
    return true;
  });

  return (
    <div className="overflow-x-auto min-h-[400px]">
      <table className="w-full text-sm text-left border-collapse whitespace-nowrap">
        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 sticky top-0 z-10 shadow-sm">
          <tr>
            <th className="px-6 py-4 font-semibold">Student & ID</th>
            <th className="px-6 py-4 font-semibold">Clearance Type</th>
            <th className="px-6 py-4 font-semibold">Department & College</th>
            <th className="px-6 py-4 font-semibold">Department Progress</th>
            <th className="px-6 py-4 font-semibold">Submission Date</th>
            <th className="px-6 py-4 font-semibold">Status</th>
            <th className="px-6 py-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {loading ? (
            <tr>
              <td colSpan={7} className="px-6 py-16 text-center text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
                Loading clearances from database...
              </td>
            </tr>
          ) : filteredClearances.length > 0 ? (
            filteredClearances.map((req) => {
              const approvals = req.departmentApprovals || [];
              const approvedCount = approvals.filter(a => a.status === "approved").length;
              const percent = approvals.length > 0 ? Math.round((approvedCount / approvals.length) * 100) : 0;
              const allNonRegApproved = approvals.filter(a => !a.departmentName.toLowerCase().includes("reg")).every(a => a.status === "approved");

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
                      <span className="text-xs text-slate-500 font-mono font-bold text-blue-600">{req.requestId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800">{req.department}</p>
                    <p className="text-xs text-slate-500">{req.college}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            allNonRegApproved ? "bg-emerald-500" : "bg-blue-600"
                          }`} 
                          style={{ width: `${percent}%` }} 
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">
                        {percent}% ({approvedCount}/{approvals.length})
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {new Date(req.submittedAt || req.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {allNonRegApproved ? (
                      <span className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Ready for Registrar
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" /> Dept Reviewing ({approvedCount}/{approvals.length})
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                      onClick={() => onSelectClearance(req._id)}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" /> Inspect
                    </Button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                No clearance applications currently pending.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
