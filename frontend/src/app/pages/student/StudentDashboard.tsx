import { Link } from "react-router";
import { Button } from "@/app/components/ui/Button";
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  FileText, 
  ChevronRight, 
  Download,
  AlertCircle,
  MessageSquare,
  PlusCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { clearanceService, ClearanceRequest } from "../../services/clearanceService";
import { notificationService, NotificationItem } from "../../services/notificationService";

export function StudentDashboard() {
  const { user } = useAuth();
  const [clearance, setClearance] = useState<ClearanceRequest | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [clearanceRes, notifRes] = await Promise.all([
          clearanceService.getMyActiveClearance().catch(() => ({ success: false, clearance: null })),
          notificationService.getMyNotifications().catch(() => ({ success: false, unreadCount: 0, notifications: [] })),
        ]);
        if (clearanceRes.clearance) {
          setClearance(clearanceRes.clearance);
        }
        if (notifRes.notifications) {
          setNotifications(notifRes.notifications);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const approvals = clearance?.departmentApprovals || [];
  const totalSteps = approvals.length;
  const approvedCount = approvals.filter(a => a.status === "approved").length;
  const pendingCount = approvals.filter(a => a.status === "pending" || a.status === "hold").length;
  const rejectedCount = approvals.filter(a => a.status === "rejected").length;
  const completionPercentage = totalSteps > 0 ? Math.round((approvedCount / totalSteps) * 100) : 0;

  const rejectedDept = approvals.find(a => a.status === "rejected");

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 md:pb-0">
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">
            Welcome back, {user?.name || "Student"}!
          </h2>
          <p className="text-slate-600 mb-4">
            {user?.department || "Department"} • {user?.studentId || "Student"}
          </p>
          
          {clearance ? (
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              <span className={`flex h-2 w-2 rounded-full mr-2 ${
                clearance.status === 'completed' ? 'bg-emerald-600' :
                clearance.status === 'rejected' ? 'bg-red-600' :
                'bg-blue-600 animate-pulse'
              }`}></span>
              Status: {clearance.status.toUpperCase()} ({clearance.requestId})
            </div>
          ) : (
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
              No Active Clearance
            </div>
          )}
        </div>
        <div className="relative z-10 flex gap-3 w-full md:w-auto">
          {clearance ? (
            <Link to="/student/clearance" className="flex-1 md:flex-none">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Track Clearance</Button>
            </Link>
          ) : (
            <Link to="/student/new-clearance" className="flex-1 md:flex-none">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <PlusCircle className="w-4 h-4 mr-2" /> Start Clearance
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Steps</p>
            <p className="text-2xl font-bold text-slate-900">{totalSteps || 6}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Approved</p>
            <p className="text-2xl font-bold text-slate-900">{approvedCount}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Pending</p>
            <p className="text-2xl font-bold text-slate-900">{pendingCount}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Rejected</p>
            <p className="text-2xl font-bold text-slate-900">{rejectedCount}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Action Required Banner if any rejection */}
          {rejectedDept && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-4 items-start animate-in fade-in">
              <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900 mb-1">
                  Action Required: {rejectedDept.departmentName} Department
                </h4>
                <p className="text-sm text-red-700 mb-3">
                  {rejectedDept.rejectionReason || rejectedDept.remarks || "Please resolve pending dues or missing items with the department."}
                </p>
                <Link to="/student/clearance">
                  <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">View Details</Button>
                </Link>
              </div>
            </div>
          )}

          {/* Progress Timeline Widget */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-semibold text-slate-900">Clearance Progress</h3>
              <span className="text-sm font-medium text-blue-600">{completionPercentage}% Complete</span>
            </div>
            <div className="p-6">
              <div className="w-full bg-slate-100 rounded-full h-2 mb-8">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              
              {approvals.length > 0 ? (
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                  {approvals.map((dept, i) => {
                    const isApproved = dept.status === "approved";
                    const isRejected = dept.status === "rejected";
                    const isHold = dept.status === "hold";
                    const Icon = isApproved ? CheckCircle2 : isRejected ? XCircle : Clock;
                    const color = isApproved ? "text-emerald-500" : isRejected ? "text-red-500" : isHold ? "text-amber-500" : "text-slate-400";
                    const bg = isApproved ? "bg-emerald-50" : isRejected ? "bg-red-50" : isHold ? "bg-amber-50" : "bg-slate-100";

                    return (
                      <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white ${bg} ${color} shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-slate-900">{dept.departmentName}</h4>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${bg} ${color}`}>
                              {dept.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500">
                            {dept.reviewedAt 
                              ? new Date(dept.reviewedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) 
                              : "Pending Department Review"}
                          </p>
                          {dept.remarks && (
                            <p className="text-xs text-slate-600 mt-1 italic">Note: {dept.remarks}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500">
                  <p className="mb-4">You have not submitted a clearance application yet.</p>
                  <Link to="/student/new-clearance">
                    <Button className="bg-blue-600 hover:bg-blue-700">Start New Clearance</Button>
                  </Link>
                </div>
              )}
            </div>
            <div className="border-t border-slate-200 p-4 bg-slate-50/50 text-center">
              <Link to="/student/clearance" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center justify-center">
                View Full Department Breakdown <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/student/documents">
                <Button variant="outline" className="w-full justify-start text-left bg-slate-50 hover:bg-slate-100 border-slate-200 shadow-none mb-2">
                  <FileText className="w-4 h-4 mr-3 text-slate-500" />
                  My Documents
                </Button>
              </Link>
              <Link to="/student/messages">
                <Button variant="outline" className="w-full justify-start text-left bg-slate-50 hover:bg-slate-100 border-slate-200 shadow-none mb-2">
                  <MessageSquare className="w-4 h-4 mr-3 text-slate-500" />
                  Contact Officer / Registrar
                </Button>
              </Link>
              {clearance?.certificate?.certNumber ? (
                <Link to="/student/certificate">
                  <Button className="w-full justify-start text-left bg-emerald-600 hover:bg-emerald-700 text-white shadow-none">
                    <Download className="w-4 h-4 mr-3" />
                    Download Official Certificate
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" disabled className="w-full justify-start text-left bg-slate-50 border-slate-200 shadow-none opacity-50">
                  <Download className="w-4 h-4 mr-3 text-slate-500" />
                  Certificate (Pending Approval)
                </Button>
              )}
            </div>
          </div>

          {/* Real Live Notifications */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-slate-900">Recent Updates</h3>
              <Link to="/student/notifications" className="text-xs text-blue-600 hover:underline">View all</Link>
            </div>
            <div className="space-y-4">
              {notifications.length > 0 ? (
                notifications.slice(0, 4).map((n) => (
                  <div key={n._id} className="flex gap-3">
                    <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${
                      n.type === 'success' ? 'bg-emerald-600' :
                      n.type === 'error' ? 'bg-red-600' :
                      n.type === 'warning' ? 'bg-amber-600' : 'bg-blue-600'
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{n.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No updates at the moment.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
