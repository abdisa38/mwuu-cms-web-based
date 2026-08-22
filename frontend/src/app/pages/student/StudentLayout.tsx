import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import mwuLogo from "@/imports/download.jfif";
import { 
  Bell, 
  LayoutDashboard, 
  FileCheck2, 
  PlusCircle, 
  FolderOpen, 
  MessageSquare, 
  Award, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { notificationService } from "../../services/notificationService";

export function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    notificationService.getMyNotifications()
      .then((res) => setUnreadCount(res.unreadCount || 0))
      .catch(() => {});
  }, [location.pathname]);

  const closeMobile = () => setMobileDrawerOpen(false);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/student" },
    { icon: FileCheck2, label: "My Clearance", path: "/student/clearance" },
    { icon: PlusCircle, label: "Start New Clearance", path: "/student/new-clearance" },
    { icon: FolderOpen, label: "My Documents", path: "/student/documents" },
    { icon: Bell, label: "Notifications", path: "/student/notifications", badge: unreadCount > 0 ? unreadCount : undefined },
    { icon: MessageSquare, label: "Messages", path: "/student/messages" },
    { icon: Award, label: "Certificate", path: "/student/certificate" },
  ];

  const bottomNavItems = [
    { icon: User, label: "Profile", path: "/student/profile" },
    { icon: Settings, label: "Settings", path: "/student/settings" },
  ];

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "ST";

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* Desktop Sidebar */}
      <aside 
        className={`${sidebarOpen ? 'w-64' : 'w-20'} hidden md:flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ease-in-out z-20`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
          <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center w-full'}`}>
            <ImageWithFallback src={mwuLogo} alt="MWU Logo" className="w-8 h-8 rounded-md object-contain" />
            {sidebarOpen && <span className="font-bold text-slate-900 truncate">MWU Student</span>}
          </div>
          {sidebarOpen && (
            <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-slate-600">
              <Menu className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-1 px-3">
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)} className="flex justify-center p-2 mb-4 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
              <Menu className="w-5 h-5" />
            </button>
          )}
          
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3 mt-2">
            {sidebarOpen ? 'Menu' : '•••'}
          </div>
          
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex items-center ${sidebarOpen ? 'px-3' : 'justify-center'} py-2.5 rounded-xl transition-colors group relative ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 font-semibold' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                {sidebarOpen && (
                  <>
                    <span className="ml-3 truncate text-sm">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-blue-100 text-blue-700 py-0.5 px-2 rounded-full text-xs font-bold">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}

          <div className="mt-auto pt-4 border-t border-slate-200 flex flex-col gap-1">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">
              {sidebarOpen ? 'Account' : '•••'}
            </div>
            {bottomNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className={`flex items-center ${sidebarOpen ? 'px-3' : 'justify-center'} py-2.5 rounded-xl transition-colors group relative ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 font-semibold' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  {sidebarOpen && <span className="ml-3 truncate text-sm">{item.label}</span>}
                </Link>
              );
            })}
            <button onClick={logout} className={`flex items-center ${sidebarOpen ? 'px-3' : 'justify-center'} py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors group relative mt-1 text-sm`}>
              <LogOut className="w-5 h-5 text-red-500" />
              {sidebarOpen && <span className="ml-3 font-medium">Log out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-slate-900/50 backdrop-blur-xs flex">
          <div className="w-72 bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <ImageWithFallback src={mwuLogo} alt="MWU Logo" className="w-8 h-8 rounded-md object-contain" />
                <span className="font-bold text-slate-900">MWU Student</span>
              </div>
              <button onClick={closeMobile} className="p-2 text-slate-400 hover:text-slate-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">
                Clearance Portal
              </div>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMobile}
                    className={`flex items-center px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive ? "bg-blue-50 text-blue-700 font-bold" : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <item.icon className={`w-5 h-5 mr-3 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-blue-100 text-blue-700 py-0.5 px-2 rounded-full text-xs font-bold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              <div className="pt-4 border-t border-slate-200 mt-4">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">
                  Account
                </div>
                {bottomNavItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={closeMobile}
                      className={`flex items-center px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive ? "bg-blue-50 text-blue-700 font-bold" : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <item.icon className={`w-5 h-5 mr-3 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
                <button
                  onClick={() => { closeMobile(); logout(); }}
                  className="w-full flex items-center px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-2"
                >
                  <LogOut className="w-5 h-5 mr-3 text-red-500" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1" onClick={closeMobile} />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 sticky top-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileDrawerOpen(true)} 
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Open mobile menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
              {navItems.find(i => i.path === location.pathname)?.label || bottomNavItems.find(i => i.path === location.pathname)?.label || "Student Portal"}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/student/notifications" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              )}
            </Link>
            
            <div className="w-px h-6 bg-slate-200 mx-1 sm:mx-2"></div>
            
            <Link to="/student/profile" className="flex items-center gap-2 hover:bg-slate-50 p-1 pr-2 rounded-full transition-colors border border-transparent hover:border-slate-200">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {initials}
              </div>
              <div className="hidden sm:flex flex-col items-start text-left">
                <span className="text-xs font-bold text-slate-900 leading-none">{user?.name || "Student"}</span>
                <span className="text-[10px] text-slate-500 mt-0.5">{user?.studentId || "MWU"}</span>
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
