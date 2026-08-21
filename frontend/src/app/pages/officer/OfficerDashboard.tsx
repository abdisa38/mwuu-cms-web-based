import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button } from "@/app/components/ui/Button";
import { 
  ClipboardList, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ChevronRight, 
  TrendingUp, 
  Users, 
  ArrowUpRight,
  RefreshCw
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { officerService, OfficerDashboardData } from "../../services/officerService";
import { toast } from "sonner";

export function OfficerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<OfficerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await officerService.getDashboard();
      setData(res);
    } catch {
      toast.error("Failed to load officer dashboard metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const stats = data?.stats;
  const recentRequests = data?.recentRequests || [];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 md:pb-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">
            {user?.department || "Department"} Clearance Queue
          </h2>
          <p className="text-slate-600 mb-3">
            Logged in as {user?.name || "Officer"} • Desk: {user?.department || "Main Desk"}
          </p>
          <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2 animate-pulse"></span>
            {stats?.pendingCount || 0} Pending Clearance Requests Awaiting Review
          </div>
        </div>

        <div className="relative z-10 flex gap-2 w-full md:w-auto">
          <Button variant="outline" onClick={fetchDashboard} className="bg-white border-slate-200">
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
          <Link to="/officer/pending" className="flex-1 md:flex-none">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              Open Review Queue
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Pending Review</p>
            <p className="text-2xl font-bold text-slate-900">{stats?.pendingCount ?? 0}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Approved</p>
            <p className="text-2xl font-bold text-slate-900">{stats?.approvedCount ?? 0}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Rejected / Holds</p>
            <p className="text-2xl font-bold text-slate-900">{stats?.rejectedCount ?? 0}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Approval Rate</p>
            <p className="text-2xl font-bold text-slate-900">{stats?.approvalRate ?? 100}%</p>
          </div>
        </div>
      </div>

      {/* Recent Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Department Request Queue</h3>
            <p className="text-xs text-slate-500">Latest student clearance applications submitted to your desk</p>
          </div>
          <Link to="/officer/pending">
            <Button variant="outline" size="sm" className="bg-white">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Request Number</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Clearance Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Submitted</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentRequests.length > 0 ? (
                recentRequests.map((req) => (
                  <tr key={req._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-blue-900">{req.requestId}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-slate-900">{req.studentName}</p>
                        <p className="text-xs text-slate-500">{req.studentId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{req.department}</td>
                    <td className="px-6 py-4 capitalize text-slate-700">{req.clearanceType}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        req.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        req.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {req.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {new Date(req.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to="/officer/pending">
                        <Button size="sm" variant="outline" className="text-xs bg-white hover:bg-indigo-50 hover:text-indigo-700">
                          Review
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No clearance requests currently assigned to your department.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
