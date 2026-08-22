import { useState, useEffect } from "react";
import { CheckSquare, AlertTriangle, Clock, Award, FileWarning } from "lucide-react";
import { registrarService } from "@/app/services/registrarService";

export function ApprovalKPIs() {
  const [stats, setStats] = useState({
    readyForFinalApproval: 0,
    pendingClearances: 0,
    completedClearances: 0,
    rejectedClearances: 0,
  });

  useEffect(() => {
    registrarService.getDashboard()
      .then((res) => {
        if (res.success && res.stats) {
          setStats(res.stats as any);
        }
      })
      .catch(() => {});
  }, []);

  const kpis = [
    { label: 'Ready for Final Approval', value: `${stats.readyForFinalApproval}`, icon: CheckSquare, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Pending Dept Clearances', value: `${stats.pendingClearances}`, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Rejected / Holds', value: `${stats.rejectedClearances}`, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-100' },
    { label: 'Completed & Certified', value: `${stats.completedClearances}`, icon: Award, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => (
        <div key={index} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.bg}`}>
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              Live DB
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900">{kpi.value}</h3>
            <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wide">{kpi.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
