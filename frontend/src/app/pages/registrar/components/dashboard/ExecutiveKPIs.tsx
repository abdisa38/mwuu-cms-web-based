import { useState, useEffect } from "react";
import { 
  Users,
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  FileText,
  Building2,
  UserCheck,
  ShieldAlert,
  Activity,
  Calendar
} from "lucide-react";
import { registrarService, RegistrarDashboardStats } from "../../../../services/registrarService";

export function ExecutiveKPIs() {
  const [stats, setStats] = useState<RegistrarDashboardStats | null>(null);

  useEffect(() => {
    registrarService.getDashboard()
      .then(res => setStats(res.stats))
      .catch(() => {});
  }, []);

  const totalStudents = stats?.totalStudents ?? 0;
  const totalOfficers = stats?.totalOfficers ?? 0;
  const totalClearances = stats?.totalClearances ?? 0;
  const pendingClearances = stats?.pendingClearances ?? 0;
  const readyForApproval = stats?.readyForFinalApproval ?? 0;
  const completedClearances = stats?.completedClearances ?? 0;
  const rejectedClearances = stats?.rejectedClearances ?? 0;
  const totalDepts = stats?.totalDepartments ?? 6;

  const kpis = [
    {
      title: "Total Students",
      value: String(totalStudents),
      subtext: "Registered in Database",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
      accent: "bg-blue-50"
    },
    {
      title: "Active Clearances",
      value: String(totalClearances),
      subtext: "Total Applications",
      icon: Activity,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
      accent: "bg-indigo-50"
    },
    {
      title: "Pending Dept Reviews",
      value: String(pendingClearances),
      subtext: "Across Departments",
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-100",
      accent: "bg-amber-50"
    },
    {
      title: "Ready for Final Signoff",
      value: String(readyForApproval),
      subtext: "Registrar Queue",
      icon: FileText,
      color: "text-rose-600",
      bg: "bg-rose-100",
      accent: "bg-rose-50"
    },
    {
      title: "Completed Clearances",
      value: String(completedClearances),
      subtext: "Fully Cleared",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      accent: "bg-emerald-50"
    },
    {
      title: "Certificates Generated",
      value: String(completedClearances),
      subtext: "Officially Issued",
      icon: Award,
      color: "text-purple-600",
      bg: "bg-purple-100",
      accent: "bg-purple-50"
    },
    {
      title: "Rejected Clearances",
      value: String(rejectedClearances),
      subtext: "Holds / Dues",
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-100",
      accent: "bg-red-50"
    },
    {
      title: "Clearance Departments",
      value: String(totalDepts),
      subtext: "Active Desks",
      icon: Building2,
      color: "text-slate-600",
      bg: "bg-slate-100",
      accent: "bg-slate-50"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col relative overflow-hidden group hover:border-slate-300 transition-colors">
            <div className={`absolute -right-4 -top-4 w-16 h-16 ${kpi.accent} rounded-full group-hover:scale-150 transition-transform duration-500 ease-out`} />
            <div className="relative z-10 flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-full ${kpi.bg} ${kpi.color} flex items-center justify-center shadow-sm`}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-slate-500">{kpi.title}</p>
            </div>
            <div className="relative z-10 flex items-end justify-between mt-2">
              <p className="text-3xl font-bold text-slate-900">{kpi.value}</p>
              <span className={`text-xs font-medium ${kpi.color} flex items-center ${kpi.accent} border border-transparent px-2 py-0.5 rounded-full`}>
                {kpi.subtext}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
