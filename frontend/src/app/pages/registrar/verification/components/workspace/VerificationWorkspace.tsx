import { useState } from "react";
import { X, Maximize2, Minimize2, CheckCircle2 } from "lucide-react";
import { DocumentViewer } from "./DocumentViewer";
import { InformationComparison } from "./InformationComparison";
import { DuplicateWarning } from "./DuplicateWarning";
import { DecisionPanel } from "./DecisionPanel";
import { ApproveModal } from "../modals/ApproveModal";
import { RejectModal } from "../modals/RejectModal";
import { RequestInfoModal } from "../modals/RequestInfoModal";
import { SuspendModal } from "../modals/SuspendModal";
import { UserProfile } from "@/app/services/authService";

interface VerificationWorkspaceProps {
  student: UserProfile;
  onClose: () => void;
}

export function VerificationWorkspace({ student, onClose }: VerificationWorkspaceProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeModal, setActiveModal] = useState<'Approve' | 'Reject' | 'RequestInfo' | 'Suspend' | null>(null);

  return (
    <div className={`fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center ${isFullscreen ? 'p-0' : 'p-2 sm:p-4 md:p-6'}`}>
      <div className={`bg-white shadow-2xl flex flex-col w-full overflow-hidden transition-all duration-300 ${isFullscreen ? 'h-full w-full rounded-none' : 'h-[92vh] w-full max-w-[1400px] rounded-2xl border border-slate-200'}`}>
        
        {/* Workspace Header */}
        <div className="h-16 border-b border-slate-200 bg-slate-50 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Student Verification Workspace</h2>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-semibold text-xs rounded-full border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Database Linked
            </span>
            <div className="w-px h-5 bg-slate-300 hidden sm:block"></div>
            <span className="text-sm text-slate-600 font-mono font-bold hidden sm:inline">
              {student.studentId || student._id}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)} 
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <button 
              onClick={onClose} 
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Close Workspace"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Workspace Body */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row bg-slate-100">
          {/* Left Column: Document & ID Card Viewer */}
          <div className="w-full lg:w-1/2 xl:w-5/12 border-b lg:border-b-0 lg:border-r border-slate-200 bg-white flex flex-col h-1/2 lg:h-full">
            <DocumentViewer student={student} />
          </div>

          {/* Right Column: Real Student Information Comparison */}
          <div className="w-full lg:w-1/2 xl:w-7/12 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 flex-1 bg-slate-50">
            <DuplicateWarning student={student} />
            <InformationComparison student={student} />
          </div>
        </div>

        {/* Workspace Footer: Decision Panel */}
        <div className="shrink-0 bg-white border-t border-slate-200 p-4 sm:px-6 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <DecisionPanel onAction={(action) => setActiveModal(action)} />
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'Approve' && <ApproveModal onClose={() => { setActiveModal(null); onClose(); }} />}
      {activeModal === 'Reject' && <RejectModal onClose={() => { setActiveModal(null); onClose(); }} />}
      {activeModal === 'RequestInfo' && <RequestInfoModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'Suspend' && <SuspendModal onClose={() => setActiveModal(null)} />}
    </div>
  );
}
