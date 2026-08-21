import { useState } from "react";
import { RefreshCw, Download, ChevronRight, Settings, HelpCircle, UserCheck } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { VerificationKPIs } from "./components/VerificationKPIs";
import { VerificationQueueTable } from "./components/VerificationQueueTable";
import { VerificationWorkspace } from "./components/workspace/VerificationWorkspace";
import { UserProfile } from "@/app/services/authService";

export function StudentVerificationPage() {
  const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(null);

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 pb-20 md:pb-8 relative animate-in fade-in duration-300">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center text-sm text-slate-500 mb-2">
            <span className="hover:text-blue-600 cursor-pointer">Dashboard</span>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-slate-900 font-medium">Student Verification</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <UserCheck className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Student Verification Center</h1>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <VerificationKPIs />

      {/* Main Content Area: Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <VerificationQueueTable onSelectStudent={(st) => setSelectedStudent(st)} />
      </div>

      {/* Full Screen Workspace Overlay */}
      {selectedStudent && (
        <VerificationWorkspace 
          student={selectedStudent} 
          onClose={() => setSelectedStudent(null)} 
        />
      )}
    </div>
  );
}
