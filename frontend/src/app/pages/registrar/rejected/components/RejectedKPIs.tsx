import { useState, useEffect } from "react";
import { XCircle, AlertCircle, Clock, ShieldAlert } from "lucide-react";
import { registrarService } from "@/app/services/registrarService";

export function RejectedKPIs() {
  const [rejectedCount, setRejectedCount] = useState(0);

  useEffect(() => {
    registrarService.getDashboard()
      .then(res => {
        if (res.success && res.stats) {
          setRejectedCount(res.stats.rejectedClearances || 0);
        }
      })
      .catch(() => {});
  }, []);

  const kpis = [
    { label: "Total Rejected in DB", value: `${rejectedCount}`, icon: XCircle, color: "text-red-600", bg: "bg-red-100", trend: "Live Database Count" },
    { label: "Pending Obligations", value: `${rejectedCount}`, icon: Clock, color: "text-amber-600", bg: "bg-amber-100", trend: "Student Can Clear Dues" },
    { label: "Disciplinary / Holds", value: "0", icon: AlertCircle, color: "text-blue-600", bg: "bg-blue-100", trend: "Normal Status" },
    { label: "Permanent Rejections", value: "0", icon: ShieldAlert, color: "text-slate-600", bg: "bg-slate-200", trend: "Database Record" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => (
        <div key={index} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className={`p-3 rounded-xl ${kpi.bg}`}>
            <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 leading-tight">{kpi.label}</p>
            <h3 className="text-2xl font-bold text-slate-900">{kpi.value}</h3>
            <p className="text-xs text-slate-400 mt-1">{kpi.trend}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
