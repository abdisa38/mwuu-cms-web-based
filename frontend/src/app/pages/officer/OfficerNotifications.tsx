import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/app/components/ui/Button";
import { 
  ChevronRight, 
  Search, 
  Check, 
  RefreshCw, 
  Bell, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldAlert, 
  Megaphone, 
  FileText, 
  ExternalLink, 
  User, 
  Filter, 
  Scale,
  X,
  Mail
} from "lucide-react";
import { notificationService, NotificationItem } from "../../services/notificationService";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";

export function OfficerNotifications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All Notifications");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationService.getMyNotifications();
      setNotifications(res.notifications || []);
      setUnreadCount(res.unreadCount || 0);
    } catch {
      toast.error("Failed to load notifications from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read.");
    } catch {
      toast.error("Failed to mark all as read.");
    }
  };

  const handleNotificationClick = async (notif: NotificationItem) => {
    setSelectedNotification(notif);
    setIsDrawerOpen(true);
    if (!notif.isRead) {
      try {
        await notificationService.markAsRead(notif._id);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    const matchesSearch =
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === "Unread") return !notif.isRead;
    if (activeFilter === "Approvals") return notif.type === "success";
    if (activeFilter === "Rejections") return notif.type === "error";
    if (activeFilter === "Clearance Updates") return notif.type === "clearance_update" || notif.type === "info";
    if (activeFilter === "Messages") return notif.type === "message";
    return true;
  });

  const filters = [
    { name: "All Notifications", count: notifications.length },
    { name: "Unread", count: unreadCount },
    { name: "Approvals", count: notifications.filter((n) => n.type === "success").length },
    { name: "Rejections", count: notifications.filter((n) => n.type === "error").length },
    { name: "Clearance Updates", count: notifications.filter((n) => n.type === "clearance_update" || n.type === "info").length },
    { name: "Messages", count: notifications.filter((n) => n.type === "message").length },
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 pb-20 md:pb-0 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center text-sm text-slate-500 mb-1">
            <Link to="/officer" className="hover:text-blue-600 transition-colors">Dashboard</Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-slate-900 font-medium">{user?.department || "Department"} Notifications</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Notification Center
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                {unreadCount} New
              </span>
            )}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Button variant="outline" onClick={handleMarkAllRead} className="bg-white border-slate-200 shadow-sm px-3 flex-1 sm:flex-none">
            <Check className="w-4 h-4 sm:mr-2 text-slate-500" /> <span className="hidden sm:inline text-slate-600">Mark All Read</span>
          </Button>
          <Button variant="outline" onClick={fetchNotifications} className="bg-white border-slate-200 shadow-sm px-3 flex-1 sm:flex-none">
            <RefreshCw className={`w-4 h-4 sm:mr-2 text-slate-500 ${loading ? "animate-spin" : ""}`} /> <span className="hidden sm:inline text-slate-600">Refresh</span>
          </Button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Notices</p>
            <Bell className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{notifications.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Unread Alerts</p>
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1"></div>
          </div>
          <p className="text-2xl font-bold text-blue-600">{unreadCount}</p>
        </div>
        <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Approved Requests</p>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-700">{notifications.filter((n) => n.type === "success").length}</p>
        </div>
        <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-semibold text-indigo-800 uppercase tracking-wider">Department Desk</p>
            <Megaphone className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-lg font-bold text-indigo-900 truncate">{user?.department || "Clearance Officer"}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Filter Sidebar */}
        <div className="w-full lg:w-64 shrink-0 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sticky top-24">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Filters</h3>
            <ul className="space-y-1">
              {filters.map((filter) => (
                <li key={filter.name}>
                  <button 
                    onClick={() => setActiveFilter(filter.name)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-colors ${
                      activeFilter === filter.name 
                        ? 'bg-blue-50 text-blue-700 font-semibold' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="truncate">{filter.name}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      activeFilter === filter.name ? 'bg-blue-200 text-blue-800 font-bold' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {filter.count}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Notification List */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[550px] relative">
          {/* Toolbar */}
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50 sticky top-0 z-10">
            <div className="relative flex-1 w-full sm:max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search real notifications or students..." 
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-16 text-center text-slate-400 flex flex-col items-center">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mb-3" />
                <p className="text-sm font-medium">Fetching notifications from database...</p>
              </div>
            ) : filteredNotifications.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {filteredNotifications.map((notif) => (
                  <div 
                    key={notif._id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`group p-4 sm:p-5 flex items-start gap-4 cursor-pointer transition-colors ${
                      notif.isRead ? 'hover:bg-slate-50' : 'bg-blue-50/40 hover:bg-blue-50/70'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${
                      notif.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                      notif.type === 'error' ? 'bg-red-50 text-red-600 border-red-200' :
                      notif.type === 'message' ? 'bg-purple-50 text-purple-600 border-purple-200' :
                      'bg-blue-50 text-blue-600 border-blue-200'
                    }`}>
                      {notif.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> :
                       notif.type === 'error' ? <XCircle className="w-5 h-5" /> :
                       notif.type === 'message' ? <Mail className="w-5 h-5" /> :
                       <Bell className="w-5 h-5" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h4 className={`text-sm font-semibold truncate ${notif.isRead ? 'text-slate-800' : 'text-slate-900 font-bold'}`}>
                          {notif.title}
                        </h4>
                        <span className="text-xs text-slate-400 whitespace-nowrap">
                          {new Date(notif.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                        </span>
                      </div>
                      
                      <p className={`text-xs leading-relaxed ${notif.isRead ? 'text-slate-500' : 'text-slate-700 font-medium'}`}>
                        {notif.message}
                      </p>
                    </div>

                    {!notif.isRead && (
                      <div className="w-2.5 h-2.5 bg-blue-600 rounded-full shrink-0 mt-1 shadow-sm ring-4 ring-blue-100"></div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-16 text-center text-slate-400 flex flex-col items-center">
                <Bell className="w-12 h-12 text-slate-300 mb-3" />
                <h3 className="font-semibold text-slate-800 text-base">No notifications</h3>
                <p className="text-xs text-slate-400 max-w-xs mt-1">
                  You're all caught up! New clearance requests and messages will appear here.
                </p>
              </div>
            )}
          </div>

          {/* Right Detail Drawer */}
          {isDrawerOpen && selectedNotification && (
            <div className="absolute top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl border-l border-slate-200 z-30 flex flex-col animate-in slide-in-from-right duration-200">
              <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-900 text-sm">Notification Details</h3>
                <button onClick={() => setIsDrawerOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">{selectedNotification.title}</h2>
                  <p className="text-xs text-slate-400">{new Date(selectedNotification.createdAt).toLocaleString()}</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm text-slate-800 leading-relaxed">
                  {selectedNotification.message}
                </div>

                {selectedNotification.link && (
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                    onClick={() => navigate(selectedNotification.link)}
                  >
                    Open Action <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
