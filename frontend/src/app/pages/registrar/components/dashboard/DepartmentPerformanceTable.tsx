import { useState, useEffect } from "react";
import { Building2, CheckCircle2, Clock, ArrowUpRight } from "lucide-react";
import { registrarService } from "@/app/services/registrarService";

export function DepartmentPerformanceTable() {
  const [depts, setDepts] = useState<any[]>([]);

  useEffect(() => {
    registrarService.getDashboard()
      .then(res => setDepts(res.departmentPerformance || []))
      .catch(() => {});
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">Department Turnaround Performance</h3>
          <p className="text-xs text-slate-500">Real-time clearance queue efficiency by department</p>
        </div>
      </div>

      <div className="space-y-4">
        {depts.length > 0 ? (
          depts.map((d, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-slate-700 flex items-center justify-center font-bold text-xs shadow-sm border border-slate-200">
                  {d.code}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">{d.name}</h4>
                  <p className="text-xs text-slate-500">{d.pending} Pending Review</p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-slate-900 text-sm">{d.approved} Cleared</p>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Avg {d.avgHours}h
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center py-6 text-slate-400 text-sm">Loading department analytics...</p>
        )}
      </div>
    </div>
  );
}
