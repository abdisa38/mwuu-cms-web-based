import { useState, useEffect } from "react";
import { MoreVertical, ShieldAlert, AlertCircle, FileText, CheckCircle2, Clock, CheckSquare, RefreshCw } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { registrarService } from "@/app/services/registrarService";
import { ClearanceRequest } from "@/app/services/clearanceService";
import { toast } from "sonner";

interface ApprovalQueueTableProps {
  onSelectClearance: (clearanceId: string) => void;
}

export function ApprovalQueueTable({ onSelectClearance }: ApprovalQueueTableProps) {
  const [clearances, setClearances] = useState<ClearanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await registrarService.getAllClearances();
      setClearances(res.clearances || []);
    } catch {
      toast.error("Failed to load approval queue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleFinalApproveDirect = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await registrarService.finalApprove(id);
      toast.success("Clearance officially approved & Certificate generated!");
      fetchQueue();
    } catch (err: any) {
      toast.error(err.message || "Failed to approve.");
    }
  };

  return (
    <div className="overflow-x-auto min-h-[400px]">
      <table className="w-full text-sm text-left border-collapse whitespace-nowrap">
        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 sticky top-0 z-10 shadow-sm">
          <tr>
            <th className="px-6 py-3 font-semibold">Student & ID</th>
            <th className="px-6 py-3 font-semibold">Clearance Type</th>
            <th className="px-6 py-3 font-semibold">Department Approvals</th>
            <th className="px-6 py-3 font-semibold">Status</th>
            <th className="px-6 py-3 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {clearances.length > 0 ? (
            clearances.map((req) => {
              const approvals = req.departmentApprovals || [];
              const approvedCount = approvals.filter(a => a.status === "approved").length;
              const isReady = req.status === "approved";
              const isCompleted = req.status === "completed";

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
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full" 
                          style={{ width: `${approvals.length > 0 ? (approvedCount / approvals.length) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">
                        {approvedCount}/{approvals.length} Depts
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      isCompleted ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      isReady ? 'bg-purple-50 text-purple-700 border-purple-200 animate-pulse' :
                      req.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {isCompleted ? 'CERTIFICATE ISSUED' : isReady ? 'READY FOR FINAL APPROVAL' : req.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      {isReady && (
                        <Button 
                          size="sm" 
                          className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 shadow-sm text-xs"
                          onClick={(e) => handleFinalApproveDirect(req._id, e)}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve & Issue
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-xs bg-white"
                        onClick={() => onSelectClearance(req._id)}
                      >
                        Inspect
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                No clearance applications currently in queue.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
