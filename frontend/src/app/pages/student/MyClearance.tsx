import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/app/components/ui/Button";
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ChevronRight, 
  Download, 
  FileText,
  RefreshCw, 
  PlusCircle,
  Award,
  ShieldCheck
} from "lucide-react";
import { clearanceService, ClearanceRequest } from "../../services/clearanceService";
import { toast } from "sonner";

export function MyClearance() {
  const [clearance, setClearance] = useState<ClearanceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchClearance = async () => {
    setLoading(true);
    try {
      const res = await clearanceService.getMyActiveClearance();
      setClearance(res.clearance);
    } catch (err: any) {
      toast.error("Failed to load clearance data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClearance();
  }, []);

  const handleCancel = async () => {
    if (!clearance) return;
    if (!window.confirm("Are you sure you want to cancel this clearance request?")) return;
    try {
      await clearanceService.cancelClearance(clearance._id);
      toast.success("Clearance cancelled.");
      fetchClearance();
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel.");
    }
  };

  const isCompleted = clearance?.status === "completed";
  const rawApprovals = clearance?.departmentApprovals || [];
  
  // If completed, ensure all checkpoints (including Registrar) reflect approved status
  const approvals = rawApprovals.map(dept => {
    if (isCompleted) {
      return {
        ...dept,
        status: "approved" as const,
        reviewedByName: dept.reviewedByName || "Registrar Administration",
        reviewedAt: dept.reviewedAt || clearance?.finalApproval?.approvedAt || new Date().toISOString()
      };
    }
    return dept;
  });

  const approvedCount = isCompleted ? approvals.length : approvals.filter(a => a.status === "approved").length;
  const totalCount = approvals.length;
  const progressPercent = isCompleted ? 100 : (totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!clearance) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">No Active Clearance Found</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-6">
          You haven't initiated a clearance process yet. Submit an application to begin tracking your department approvals.
        </p>
        <Link to="/student/new-clearance">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <PlusCircle className="w-4 h-4 mr-2" /> Start New Clearance
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 md:pb-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center text-sm text-slate-500 mb-1">
            <Link to="/student" className="hover:text-blue-600">Dashboard</Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-slate-900 font-medium">My Clearance</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            {clearance.requestId}
            <span className={`text-xs px-3 py-1 rounded-full font-bold border ${
              isCompleted ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
              clearance.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
              'bg-blue-50 text-blue-700 border-blue-200'
            }`}>
              {clearance.status.toUpperCase()}
            </span>
          </h1>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" onClick={fetchClearance} className="bg-white border-slate-200">
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
          {clearance.status === 'pending' && (
            <Button variant="outline" onClick={handleCancel} className="text-red-600 hover:bg-red-50 border-red-200">
              Cancel Request
            </Button>
          )}
          {clearance.certificate?.certNumber && (
            <Link to="/student/certificate">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md">
                <Download className="w-4 h-4 mr-2" /> View Certificate
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Progress Bar Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
        <div className="flex justify-between items-center text-sm font-semibold">
          <span className="text-slate-700">Clearance Status Progress</span>
          <span className={isCompleted ? "text-emerald-700 font-bold" : "text-blue-600 font-bold"}>
            {approvedCount} of {totalCount} Departments Approved ({progressPercent}%)
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ease-out ${
              isCompleted ? "bg-emerald-600" : "bg-blue-600"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Celebration Banner: When Clearance is Completed */}
      {isCompleted && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-lg">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-950 flex items-center gap-2">
                🎓 Clearance 100% Completed & Officially Certified!
              </h3>
              <p className="text-sm text-emerald-800 mt-1 leading-relaxed">
                All 6 university department checkpoints including the Central Registrar have approved your clearance. Your official QR-verifiable certificate has been issued.
              </p>
              <p className="text-xs font-mono font-bold text-emerald-900 mt-2 bg-white/70 px-3 py-1 rounded-lg border border-emerald-200 inline-block">
                Certificate No: {clearance.certificate?.certNumber}
              </p>
            </div>
          </div>
          <Link to="/student/certificate" className="shrink-0 w-full sm:w-auto">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md">
              <ShieldCheck className="w-4 h-4 mr-2" /> Download Certificate
            </Button>
          </Link>
        </div>
      )}

      {/* Auto-Announcement: All Department Checkpoints Approved (Waiting for Registrar) */}
      {!isCompleted &&
        approvals.filter(a => !a.departmentName.toLowerCase().includes("reg")).every(a => a.status === "approved") &&
        approvals.some(a => a.departmentName.toLowerCase().includes("reg") && a.status === "pending") && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-5 shadow-sm flex items-start gap-4 animate-in slide-in-from-top-2 duration-300">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-blue-950 flex items-center gap-2">
              🎉 All Department Checkpoints Cleared!
            </h3>
            <p className="text-sm text-blue-800 mt-1 leading-relaxed">
              Your clearance application has been successfully approved across all university department checkpoints (Department Head, Library, Dormitory, Cafeteria, and Bookstore). The Central Registrar has been notified and is conducting final verification to release your official digital certificate.
            </p>
          </div>
        </div>
      )}

      {/* Department Approvals Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-semibold text-slate-900 text-lg">Department Approvals Status</h3>
          <span className="text-xs text-slate-500">Live University Database</span>
        </div>

        <div className="divide-y divide-slate-100">
          {approvals.map((dept, index) => {
            const isApproved = dept.status === "approved";
            const isRejected = dept.status === "rejected";
            const isHold = dept.status === "hold";
            
            return (
              <div key={index} className="p-6 hover:bg-slate-50/70 transition-colors">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                      isApproved ? 'bg-emerald-100 text-emerald-600' :
                      isRejected ? 'bg-red-100 text-red-600' :
                      isHold ? 'bg-amber-100 text-amber-600' :
                      'bg-slate-100 text-slate-400'
                    }`}>
                      {isApproved ? <CheckCircle2 className="w-5 h-5" /> :
                       isRejected ? <XCircle className="w-5 h-5" /> :
                       <Clock className="w-5 h-5" />}
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{dept.departmentName}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Reviewed by: {dept.reviewedByName || "Pending Officer Review"} 
                        {dept.reviewedAt && ` • ${new Date(dept.reviewedAt).toLocaleString()}`}
                      </p>

                      {dept.remarks && (
                        <p className="text-sm text-slate-700 mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 inline-block">
                          <strong>Remarks:</strong> {dept.remarks}
                        </p>
                      )}

                      {dept.rejectionReason && (
                        <p className="text-sm text-red-700 mt-2 bg-red-50 p-2.5 rounded-lg border border-red-200">
                          <strong>Rejection Reason:</strong> {dept.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>

                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                    isApproved ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    isRejected ? 'bg-red-50 text-red-700 border-red-200' :
                    isHold ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {dept.status.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
