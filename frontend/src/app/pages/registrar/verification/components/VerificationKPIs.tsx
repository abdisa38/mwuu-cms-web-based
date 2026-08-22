import { useState, useEffect } from "react";
import { Clock, ShieldCheck, XCircle, AlertCircle, AlertTriangle, TrendingUp, Search } from "lucide-react";
import { registrarService } from "@/app/services/registrarService";

export function VerificationKPIs() {
  const [stats, setStats] = useState({
    pendingVerification: 0,
    verifiedToday: 0,
    rejectedToday: 0,
    needsMoreInfo: 0,
    suspiciousAccounts: 0,
    avgVerificationTime: "2.4m",
    successRate: "100%",
  });

  useEffect(() => {
    registrarService.getVerificationStats()
      .then((res: any) => {
        if (res.success && res.stats) {
          setStats(res.stats);
        }
      })
      .catch(() => {});
  }, []);

  const kpis = [
    { label: "Pending Verification", value: `${stats.pendingVerification}`, icon: Clock, color: "text-blue-600", bg: "bg-blue-100", border: "border-blue-200" },
    { label: "Verified In DB", value: `${stats.verifiedToday}`, icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-100", border: "border-emerald-200" },
    { label: "Rejected / Suspended", value: `${stats.rejectedToday}`, icon: XCircle, color: "text-rose-600", bg: "bg-rose-100", border: "border-rose-200" },
    { label: "Needs More Info", value: `${stats.needsMoreInfo}`, icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-100", border: "border-amber-200" },
    { label: "Suspicious Accounts", value: `${stats.suspiciousAccounts}`, icon: AlertTriangle, color: "text-purple-600", bg: "bg-purple-100", border: "border-purple-200" },
    { label: "Average Time", value: stats.avgVerificationTime, icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-100", border: "border-indigo-200" },
    { label: "Success Rate", value: stats.successRate, icon: Search, color: "text-slate-600", bg: "bg-slate-100", border: "border-slate-200" },
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
            <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wide">{kpi.label}</p>
          </div>
          <div className={`absolute -right-4 -bottom-4 w-16 h-16 ${kpi.bg} rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500`}></div>
        </div>
      ))}
    </div>
  );
}
