import { useState, useEffect } from "react";
import { CheckCircle2, ShieldCheck, GraduationCap, Building2 } from "lucide-react";
import { registrarService } from "@/app/services/registrarService";

export function CompletedKPIs() {
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    registrarService.getDashboard()
      .then(res => {
        if (res.success && res.stats) {
          setCompletedCount(res.stats.completedClearances || 0);
        }
      })
      .catch(() => {});
  }, []);

  const kpis = [
    { label: "Total Completed in DB", value: `${completedCount}`, icon: CheckCircle2, color: "text-indigo-600", bg: "bg-indigo-100", trend: "Live Database Record" },
    { label: "Certificates Generated", value: `${completedCount}`, icon: GraduationCap, color: "text-emerald-600", bg: "bg-emerald-100", trend: "100% Cryptographic QR" },
    { label: "Publicly Verifiable", value: `${completedCount}`, icon: ShieldCheck, color: "text-blue-600", bg: "bg-blue-100", trend: "Instant Portal Lookup" },
    { label: "Official Archival", value: "Active", icon: Building2, color: "text-slate-600", bg: "bg-slate-100", trend: "Immutable Audit Log" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => (
        <div key={index} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className={`p-3 rounded-xl ${kpi.bg}`}>
            <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{kpi.label}</p>
            <h3 className="text-2xl font-bold text-slate-900">{kpi.value}</h3>
            <p className="text-xs text-slate-400 mt-1">{kpi.trend}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
