import { useState } from "react";
import { RefreshCw, ChevronRight, Award } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { ApprovalKPIs } from "./components/ApprovalKPIs";
import { ApprovalQueueTable } from "./components/ApprovalQueueTable";
import { FinalApprovalWorkspace } from "./components/workspace/FinalApprovalWorkspace";
import { ClearanceRequest } from "@/app/services/clearanceService";

export function FinalApprovalPage() {
  const [selectedClearance, setSelectedClearance] = useState<ClearanceRequest | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 pb-20 md:pb-8 relative animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <span>Dashboard</span>
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium text-slate-900">Final Approval Center</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
              <Award className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Final Approval & Certificate Issuance</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh} className="bg-white border-slate-200" size="sm">
            <RefreshCw className="w-4 h-4 mr-2 text-slate-500" />
            Refresh Queue
          </Button>
        </div>
      </div>

      <ApprovalKPIs key={`kpi-${refreshTrigger}`} />
      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <ApprovalQueueTable 
          key={`table-${refreshTrigger}`}
          onSelectClearance={(req) => setSelectedClearance(req)} 
          refreshTrigger={refreshTrigger}
        />
      </div>

      {selectedClearance && (
        <FinalApprovalWorkspace 
          clearance={selectedClearance} 
          onClose={() => setSelectedClearance(null)}
          onSuccess={handleRefresh}
        />
      )}
    </div>
  );
}
