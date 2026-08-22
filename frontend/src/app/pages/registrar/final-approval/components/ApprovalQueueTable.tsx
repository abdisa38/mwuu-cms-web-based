import { useState, useEffect } from "react";
import { CheckCircle2, Clock, Award, Eye, RefreshCw, XCircle } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { registrarService } from "@/app/services/registrarService";
import { ClearanceRequest } from "@/app/services/clearanceService";
import { toast } from "sonner";

interface ApprovalQueueTableProps {
  onSelectClearance: (clearance: ClearanceRequest) => void;
  refreshTrigger?: number;
}

export function ApprovalQueueTable({ onSelectClearance, refreshTrigger = 0 }: ApprovalQueueTableProps) {
  const [clearances, setClearances] = useState<ClearanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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
  }, [refreshTrigger]);

  const handleFinalApproveDirect = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActionLoading(id);
    try {
      const res = await registrarService.finalApprove(id);
      toast.success(
        `Clearance approved! Certificate #${res.clearance?.certificate?.certNumber || "MWU-CLR-2026-XXXX"} has been issued.`
      );
      fetchQueue();
    } catch (err: any) {
      toast.error(err.message || "Failed to finalize clearance.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="overflow-x-auto min-h-[400px]">
      <table className="w-full text-sm text-left border-collapse whitespace-nowrap">
        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 sticky top-0 z-10 shadow-sm">
          <tr>
            <th className="px-6 py-4 font-semibold">Student & ID</th>
            <th className="px-6 py-4 font-semibold">Clearance Type</th>
            <th className="px-6 py-4 font-semibold">Department Approvals</th>
            <th className="px-6 py-4 font-semibold">Clearance Status</th>
            <th className="px-6 py-4 font-semibold text-right">Registrar Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {loading ? (
            <tr>
              <td colSpan={5} className="px-6 py-16 text-center text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
                Loading clearance approval queue from database...
              </td>
            </tr>
          ) : clearances.length > 0 ? (
            clearances.map((req) => {
              const approvals = req.departmentApprovals || [];
              const approvedCount = approvals.filter((a) => a.status === "approved").length;
              const nonRegApprovals = approvals.filter(
                (a) => !a.departmentName.toLowerCase().includes("reg")
              );
              const allNonRegApproved =
                nonRegApprovals.length > 0 &&
                nonRegApprovals.every((a) => a.status === "approved");

              const isCompleted = req.status === "completed";
              const isRejected = req.status === "rejected";
              const isReadyForRegistrar =
                !isCompleted && !isRejected && (req.status === "approved" || allNonRegApproved);

              return (
                <tr
                  key={req._id}
                  onClick={() => onSelectClearance(req)}
                  className="hover:bg-blue-50/50 transition-colors cursor-pointer group bg-white"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                          isCompleted
                            ? "bg-emerald-100 text-emerald-700"
                            : isReadyForRegistrar
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {req.studentName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 group-hover:text-blue-700">
                          {req.studentName}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">{req.studentId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900 capitalize">{req.clearanceType}</span>
                      <span className="text-xs text-slate-500 font-mono font-bold text-blue-600">
                        {req.requestId}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isCompleted || isReadyForRegistrar ? "bg-emerald-500" : "bg-blue-600"
                          }`}
                          style={{
                            width: `${
                              approvals.length > 0 ? (approvedCount / approvals.length) * 100 : 0
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">
                        {approvedCount}/{approvals.length} Depts
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {isCompleted ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
                        <Award className="w-3.5 h-3.5 mr-1" /> CERTIFIED
                      </span>
                    ) : isReadyForRegistrar ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-300 animate-pulse">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-purple-600" /> READY FOR REGISTRAR
                      </span>
                    ) : isRejected ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                        <XCircle className="w-3.5 h-3.5 mr-1" /> REJECTED
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3.5 h-3.5 mr-1" /> IN PROGRESS
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      {isReadyForRegistrar && (
                        <Button
                          size="sm"
                          isLoading={actionLoading === req._id}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 shadow-sm text-xs font-semibold px-3"
                          onClick={(e) => handleFinalApproveDirect(req._id, e)}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Final Approve
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs bg-white hover:bg-slate-100"
                        onClick={() => onSelectClearance(req)}
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" /> Inspect
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
