import { useState } from "react";
import { 
  X, 
  Maximize2, 
  Minimize2, 
  ShieldCheck, 
  CheckSquare, 
  FileText, 
  Activity, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Award, 
  Printer, 
  User, 
  GraduationCap 
} from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { ClearanceRequest } from "@/app/services/clearanceService";
import { registrarService } from "@/app/services/registrarService";
import { Certificate } from "@/app/components/shared/Certificate";
import { toast } from "sonner";

interface FinalApprovalWorkspaceProps {
  clearance: ClearanceRequest;
  onClose: () => void;
  onSuccess?: () => void;
}

export function FinalApprovalWorkspace({ clearance: initialClearance, onClose, onSuccess }: FinalApprovalWorkspaceProps) {
  const [clearance, setClearance] = useState<ClearanceRequest>(initialClearance);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'departments' | 'documents' | 'audit' | 'certificate'>('departments');
  const [remarks, setRemarks] = useState("");
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const approvals = clearance.departmentApprovals || [];
  const nonRegApprovals = approvals.filter(a => !a.departmentName.toLowerCase().includes("reg"));
  const allNonRegApproved = nonRegApprovals.length > 0 && nonRegApprovals.every(a => a.status === "approved");
  const isCompleted = clearance.status === "completed";

  const handleFinalApprove = async () => {
    setApproving(true);
    try {
      const res = await registrarService.finalApprove(clearance._id, remarks || "Approved and officially certified by Registrar Administration.");
      setClearance(res.clearance);
      toast.success(`Clearance approved! Certificate #${res.clearance.certificate?.certNumber} issued.`);
      setActiveTab('certificate');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Failed to finalize clearance.");
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    const reason = window.prompt("Enter rejection reason:");
    if (!reason) return;
    setRejecting(true);
    try {
      const res = await registrarService.rejectClearance(clearance._id, reason);
      setClearance(res.clearance);
      toast.success("Clearance rejected.");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to reject clearance.");
    } finally {
      setRejecting(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center ${isFullscreen ? 'p-0' : 'p-2 sm:p-4 md:p-6'}`}>
      <div className={`bg-white shadow-2xl flex flex-col w-full overflow-hidden transition-all duration-300 ${isFullscreen ? 'h-full w-full rounded-none' : 'h-[92vh] w-full max-w-[1300px] rounded-3xl border border-slate-200'}`}>
        
        {/* Workspace Header */}
        <div className="h-16 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Official Registrar Final Clearance Sign-Off</h2>
              <p className="text-xs text-slate-400 font-mono">Request: {clearance.requestId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)} 
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <button 
              onClick={onClose} 
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Student Banner */}
        <div className="bg-slate-50 border-b border-slate-200 p-5 px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base shadow-sm">
              {clearance.studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{clearance.studentName}</h3>
              <p className="text-xs text-slate-500 font-mono font-bold">{clearance.studentId} • {clearance.department} ({clearance.college})</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-slate-400 uppercase font-semibold">Clearance Type</p>
              <p className="text-sm font-bold text-slate-800 capitalize">{clearance.clearanceType}</p>
            </div>
            <div className="w-px h-8 bg-slate-200 mx-1"></div>
            <div>
              {isCompleted ? (
                <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-full shadow-sm">
                  <Award className="w-3.5 h-3.5 mr-1" /> COMPLETED & CERTIFIED
                </span>
              ) : allNonRegApproved ? (
                <span className="inline-flex items-center text-xs font-bold text-purple-700 bg-purple-100 border border-purple-300 px-3 py-1.5 rounded-full shadow-sm animate-pulse">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> READY FOR REGISTRAR
                </span>
              ) : (
                <span className="inline-flex items-center text-xs font-semibold text-amber-700 bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-full">
                  <Clock className="w-3.5 h-3.5 mr-1" /> IN PROGRESS
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-slate-200 px-6 flex gap-2 pt-2 shrink-0">
          {[
            { id: 'departments', label: 'Department Approvals Matrix', icon: CheckSquare },
            { id: 'documents', label: 'Submitted Documents', icon: FileText },
            { id: 'audit', label: 'Audit Trail', icon: Activity },
            ...(isCompleted ? [{ id: 'certificate', label: 'Official Certificate', icon: Award }] : [])
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-lg'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {activeTab === 'departments' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 text-base mb-4">University Department Clearance Checklist</h4>
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
                              Reviewed by: {dept.reviewedByName || "Pending review"} 
                              {dept.reviewedAt && ` • ${new Date(dept.reviewedAt).toLocaleString()}`}
                            </p>
                            {dept.remarks && (
                              <p className="text-xs text-slate-600 mt-1 bg-slate-50 p-1.5 rounded border border-slate-200">
                                <strong>Remarks:</strong> {dept.remarks}
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

              {/* Registrar Final Remarks Input */}
              {!isCompleted && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Registrar Final Verification Notes & Decision
                  </label>
                  <textarea 
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="e.g. Academic transcripts, graduation list clearance, and digital certificate approval authorized."
                    className="w-full h-24 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-900 text-base mb-2">Student Academic & Identification Records</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-xs text-slate-500 font-semibold uppercase">Admission Year</p>
                    <p className="font-bold text-slate-900 mt-1">{clearance.academicDetails?.admissionYear || "2013 E.C"}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-xs text-slate-500 font-semibold uppercase">Expected Graduation Year</p>
                    <p className="font-bold text-slate-900 mt-1">{clearance.academicDetails?.expectedGraduation || "2017 E.C"}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-xs text-slate-500 font-semibold uppercase">Current Semester / Class</p>
                    <p className="font-bold text-slate-900 mt-1">{clearance.academicDetails?.currentSemester || "Semester II"}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-xs text-slate-500 font-semibold uppercase">Reason for Clearance</p>
                    <p className="font-bold text-slate-900 mt-1">{clearance.reason || "Completion of Academic Degree Requirements"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="font-bold text-slate-900 text-base mb-4">Official Audit History</h4>
              <div className="space-y-3">
                {(clearance.auditTrail || []).map((audit, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800">{audit.action} • {audit.performedBy} ({audit.role})</p>
                      <p className="text-slate-500 mt-0.5">{audit.details}</p>
                    </div>
                    <span className="text-slate-400 font-mono">{new Date(audit.timestamp).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'certificate' && (
            <div className="flex justify-center overflow-x-auto py-4">
              <div className="min-w-[750px]">
                <Certificate 
                  certNumber={clearance.certificate?.certNumber || "MWU-CLR-2026-XXXX"}
                  studentName={clearance.studentName}
                  studentId={clearance.studentId}
                  department={clearance.department}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Action Bar */}
        <div className="h-20 bg-white border-t border-slate-200 px-6 flex justify-between items-center shrink-0">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>

          <div className="flex items-center gap-3">
            {!isCompleted && (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleReject} 
                  isLoading={rejecting}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <XCircle className="w-4 h-4 mr-2" /> Reject Clearance
                </Button>

                <Button 
                  onClick={handleFinalApprove} 
                  isLoading={approving} 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md px-6"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Approve & Issue Digital Certificate
                </Button>
              </>
            )}

            {isCompleted && (
              <Button 
                onClick={() => window.print()} 
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                <Printer className="w-4 h-4 mr-2" /> Print Official Certificate
              </Button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
