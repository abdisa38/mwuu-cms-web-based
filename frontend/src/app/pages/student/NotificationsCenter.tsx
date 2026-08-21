import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button } from "@/app/components/ui/Button";
import { 
  Bell, 
  CheckCheck, 
  ChevronRight, 
  Clock, 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Trash2,
  RefreshCw
} from "lucide-react";
import { notificationService, NotificationItem } from "../../services/notificationService";
import { toast } from "sonner";

export function NotificationsCenter() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    setLoading(true);
    try {
      const res = await notificationService.getMyNotifications();
      setNotifications(res.notifications);
    } catch {
      toast.error("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read.");
    } catch {
      toast.error("Failed to mark read.");
    }
  };

  const handleMarkSingle = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? ({ ...n, isRead: true }) : n));
    } catch {}
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center text-sm text-slate-500 mb-1">
            <Link to="/student" className="hover:text-blue-600">Dashboard</Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-slate-900 font-medium">Notifications</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications & Alerts</h1>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchNotifs} className="bg-white border-slate-200">
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
          <Button onClick={handleMarkAllRead} className="bg-slate-900 hover:bg-slate-800 text-white">
            <CheckCheck className="w-4 h-4 mr-2" /> Mark All as Read
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div 
              key={notif._id} 
              onClick={() => handleMarkSingle(notif._id)}
              className={`p-5 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer ${
                !notif.isRead ? 'bg-blue-50/40 font-medium' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                notif.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                notif.type === 'error' ? 'bg-red-100 text-red-600' :
                notif.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                {notif.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> :
                 notif.type === 'error' ? <XCircle className="w-5 h-5" /> :
                 <Bell className="w-5 h-5" />}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-base text-slate-900 font-semibold">{notif.title}</h4>
                  <span className="text-xs text-slate-400">
                    {new Date(notif.createdAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-1">{notif.message}</p>
                {notif.link && (
                  <Link to={notif.link} className="inline-block mt-2 text-xs font-semibold text-blue-600 hover:underline">
                    View Clearance Details &rarr;
                  </Link>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-slate-400">
            <Bell className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-base font-semibold text-slate-700">No Notifications</p>
            <p className="text-sm text-slate-500">You are all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}
