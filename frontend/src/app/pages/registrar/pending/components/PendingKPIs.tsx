import { useState, useEffect } from "react";
import { Clock, Layers, AlertCircle, CalendarX, CheckSquare, AlertTriangle, Timer } from "lucide-react";
import { registrarService } from "@/app/services/registrarService";

export function PendingKPIs() {
  const [stats, setStats] = useState({
    totalClearances: 0,
    pendingClearances: 0,
    readyForFinalApproval: 0,
    completedClearances: 0,
    rejectedClearances: 0,
    avgProcessingDays: 2.4,
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
    { label: "Active Clearances", value: `${stats.pendingClearances}`, icon: Layers, color: "text-blue-600", bg: "bg-blue-100", border: "border-blue-200" },
    { label: "Pending Dept Review", value: `${stats.pendingClearances}`, icon: Clock, color: "text-amber-600", bg: "bg-amber-100", border: "border-amber-200" },
    { label: "Awaiting Final Sign-off", value: `${stats.readyForFinalApproval}`, icon: CheckSquare, color: "text-emerald-600", bg: "bg-emerald-100", border: "border-emerald-200" },
    { label: "Completed in DB", value: `${stats.completedClearances}`, icon: CheckSquare, color: "text-indigo-600", bg: "bg-indigo-100", border: "border-indigo-200" },
    { label: "Rejected Requests", value: `${stats.rejectedClearances}`, icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-100", border: "border-rose-200" },
    { label: "High Priority", value: `${stats.readyForFinalApproval}`, icon: AlertTriangle, color: "text-purple-600", bg: "bg-purple-100", border: "border-purple-200" },
    { label: "Avg Processing Time", value: `${stats.avgProcessingDays || 2.4}d`, icon: Timer, color: "text-slate-600", bg: "bg-slate-100", border: "border-slate-200" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
      {kpis.map((kpi, index) => (
        <div key={index} className={`bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-slate-300 transition-colors`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`w-8 h-8 rounded-lg ${kpi.bg} ${kpi.color} flex items-center justify-center`}>
              <kpi.icon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-2xl font-bold text-slate-900">{kpi.value}</h4>
            <p className="text-[10px] sm:text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">{kpi.label}</p>
          </div>
          <div className={`absolute -right-4 -bottom-4 w-16 h-16 ${kpi.bg} rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500`}></div>
        </div>
      ))}
    </div>
  );
}
