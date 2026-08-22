import { useState } from "react";
import { RefreshCw, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { PendingKPIs } from "./components/PendingKPIs";
import { PendingFilters } from "./components/PendingFilters";
import { PendingQueueTable } from "./components/PendingQueueTable";
import { PendingWorkspace } from "./components/workspace/PendingWorkspace";

export function PendingClearancesPage() {
  const [selectedClearanceId, setSelectedClearanceId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 pb-20 md:pb-8 relative animate-in fade-in duration-300">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center text-sm text-slate-500 mb-2">
            <span className="hover:text-blue-600 cursor-pointer">Dashboard</span>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-slate-900 font-medium">Pending Clearances</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Pending Clearances Center</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} className="h-9 bg-white border-slate-200">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Queue
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <PendingKPIs key={`kpi-${refreshTrigger}`} />

      {/* Main Content Area: Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <PendingQueueTable 
          key={`table-${refreshTrigger}`}
          onSelectClearance={(id) => setSelectedClearanceId(id)} 
          refreshTrigger={refreshTrigger}
        />
      </div>

      {/* Full Screen Workspace Overlay */}
      {selectedClearanceId && (
        <PendingWorkspace 
          clearanceId={selectedClearanceId} 
          onClose={() => setSelectedClearanceId(null)} 
        />
      )}
    </div>
  );
}
