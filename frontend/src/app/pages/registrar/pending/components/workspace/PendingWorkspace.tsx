import { useState, useEffect } from "react";
import { 
  X, 
  Maximize2, 
  Minimize2, 
  FileText, 
  CheckSquare, 
  Activity, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  RefreshCw, 
  AlertCircle,
  GraduationCap
} from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { ClearanceRequest, clearanceService } from "@/app/services/clearanceService";
import { toast } from "sonner";

interface PendingWorkspaceProps {
  clearanceId: string;
  onClose: () => void;
}

export function PendingWorkspace({ clearanceId, onClose }: PendingWorkspaceProps) {
  const [clearance, setClearance] = useState<ClearanceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'departments' | 'academic' | 'audit'>('departments');

  useEffect(() => {
    setLoading(true);
    clearanceService.getClearanceById(clearanceId)
      .then(res => setClearance(res.clearance))
      .catch(() => toast.error("Failed to load clearance details."))
      .finally(() => setLoading(false));
  }, [clearanceId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl flex items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="font-semibold text-slate-700">Loading clearance record from database...</span>
        </div>
      </div>
    );
  }

  if (!clearance) return null;

  const approvals = clearance.departmentApprovals || [];
  const approvedCount = approvals.filter(a => a.status === "approved").length;
  const percent = approvals.length > 0 ? Math.round((approvedCount / approvals.length) * 100) : 0;
  const nonRegApproved = approvals.filter(a => !a.departmentName.toLowerCase().includes("reg")).every(a => a.status === "approved");

  return (
    <div className={`fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center ${isFullscreen ? 'p-0' : 'p-2 sm:p-4 md:p-6'}`}>
      <div className={`bg-white shadow-2xl flex flex-col w-full overflow-hidden transition-all duration-300 ${isFullscreen ? 'h-full w-full rounded-none' : 'h-[92vh] w-full max-w-[1300px] rounded-2xl border border-slate-200'}`}>
        
        {/* Header */}
        <div className="h-16 border-b border-slate-200 bg-slate-50 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Clearance Application Inspector</h2>
              <p className="text-xs text-slate-500 font-mono">ID: {clearance.requestId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)} 
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <button 
              onClick={onClose} 
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Student Profile Ribbon */}
        <div className="bg-white border-b border-slate-200 p-5 px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base shadow-sm">
              {clearance.studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{clearance.studentName}</h3>
              <p className="text-xs text-slate-500 font-mono font-bold">{clearance.studentId} • {clearance.department} ({clearance.college})</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-slate-400 uppercase font-semibold">Clearance Progress</p>
              <p className="text-sm font-bold text-blue-600">{approvedCount} of {approvals.length} Approved ({percent}%)</p>
            </div>
            <div className="w-px h-8 bg-slate-200 mx-1"></div>
            <div>
              {nonRegApproved ? (
                <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-full shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> READY FOR REGISTRAR
                </span>
              ) : (
                <span className="inline-flex items-center text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-full">
                  <Clock className="w-3.5 h-3.5 mr-1" /> DEPT REVIEW IN PROGRESS
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 flex gap-2 pt-2 shrink-0">
          {[
            { id: 'departments', label: 'Department Approvals Matrix', icon: CheckSquare },
            { id: 'academic', label: 'Academic & Contact Info', icon: FileText },
            { id: 'audit', label: 'Live Audit Trail', icon: Activity },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 bg-white shadow-sm rounded-t-lg'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Workspace Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <div className="max-w-5xl mx-auto space-y-6">
            {activeTab === 'departments' && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h4 className="font-bold text-slate-900 text-base">Department Review Matrix</h4>
                <div className="divide-y divide-slate-100">
                  {approvals.map((dept, idx) => {
                    const isAppr = dept.status === "approved";
                    const isRej = dept.status === "rejected";
                    return (
                      <div key={idx} className="py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            isAppr ? 'bg-emerald-100 text-emerald-600' :
                            isRej ? 'bg-red-100 text-red-600' :
                            'bg-slate-100 text-slate-400'
                          }`}>
                            {isAppr ? <CheckCircle2 className="w-4 h-4" /> :
                             isRej ? <XCircle className="w-4 h-4" /> :
                             <Clock className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{dept.departmentName}</p>
                            <p className="text-xs text-slate-500">
                              Reviewed by: {dept.reviewedByName || "Pending officer review"} 
                              {dept.reviewedAt && ` • ${new Date(dept.reviewedAt).toLocaleString()}`}
                            </p>
                            {dept.remarks && (
                              <p className="text-xs text-slate-600 mt-1 bg-slate-50 p-1.5 rounded border border-slate-200">
                                <strong>Remarks:</strong> {dept.remarks}
                              </p>
                            )}
                            {dept.rejectionReason && (
                              <p className="text-xs text-red-700 mt-1 bg-red-50 p-1.5 rounded border border-red-200 font-semibold">
                                <strong>Rejection Reason:</strong> {dept.rejectionReason}
                              </p>
                            )}
                          </div>
                        </div>

                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                          isAppr ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          isRej ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {dept.status.toUpperCase()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'academic' && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h4 className="font-bold text-slate-900 text-base">Academic & Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-xs text-slate-500 font-semibold uppercase">Student Email</p>
                    <p className="font-mono text-slate-900 font-medium mt-1">{clearance.contactDetails?.email || "student@mwu.edu.et"}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-xs text-slate-500 font-semibold uppercase">Phone Number</p>
                    <p className="font-mono text-slate-900 font-medium mt-1">{clearance.contactDetails?.phone || "+251 91 123 4567"}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-xs text-slate-500 font-semibold uppercase">Admission & Expected Graduation</p>
                    <p className="font-bold text-slate-900 mt-1">{clearance.academicDetails?.admissionYear || "2013"} — {clearance.academicDetails?.expectedGraduation || "2017 E.C"}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-xs text-slate-500 font-semibold uppercase">Clearance Reason</p>
                    <p className="font-bold text-slate-900 mt-1">{clearance.reason || "Graduation & Degree Completion"}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'audit' && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h4 className="font-bold text-slate-900 text-base">System Audit Trail</h4>
                <div className="space-y-3">
                  {(clearance.auditTrail || []).map((log, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-800">{log.action} • {log.performedBy} ({log.role})</p>
                        <p className="text-slate-500 mt-0.5">{log.details}</p>
                      </div>
                      <span className="text-slate-400 font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="h-16 bg-white border-t border-slate-200 px-6 flex justify-end items-center shrink-0">
          <Button variant="outline" onClick={onClose}>
            Close Inspector
          </Button>
        </div>
      </div>
    </div>
  );
}
