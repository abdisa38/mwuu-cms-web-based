import { Outlet, Link, useLocation } from "react-router";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import mwuLogo from "@/imports/download.jfif";
import { 
  LayoutDashboard, 
  Users, 
  GitMerge, 
  History, 
  Building2, 
  FileCheck2, 
  Award, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Settings, 
  LogOut,
  Menu,
  X,
  GraduationCap
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { registrarService } from "../../services/registrarService";

export function RegistrarLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [readyCount, setReadyCount] = useState(0);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    registrarService.getDashboard()
      .then(res => setReadyCount(res.stats?.readyForFinalApproval || 0))
      .catch(() => {});
  }, [location.pathname]);

  const closeMobile = () => setMobileDrawerOpen(false);

  const navSections = [
    {
      title: "Core",
      items: [
        { icon: LayoutDashboard, label: "Dashboard", path: "/registrar" },
      ]
    },
    {
      title: "Clearance Operations",
      items: [
        { icon: ShieldCheck, label: "Student Verification", path: "/registrar/verification" },
        { icon: Clock, label: "Pending Reviews", path: "/registrar/pending" },
        { icon: FileCheck2, label: "Final Approvals", path: "/registrar/approvals", badge: readyCount > 0 ? readyCount : undefined },
        { icon: CheckCircle2, label: "Completed", path: "/registrar/completed" },
        { icon: XCircle, label: "Rejected", path: "/registrar/rejected" },
        { icon: Award, label: "Certificates", path: "/registrar/certificates" },
      ]
    },
    {
      title: "Administration",
      items: [
        { icon: Users, label: "User Management", path: "/registrar/users" },
        { icon: GraduationCap, label: "Student Directory", path: "/registrar/students" },
        { icon: Building2, label: "Staff & Departments", path: "/registrar/staff-departments" },
        { icon: GitMerge, label: "Workflow Config", path: "/registrar/workflow-configuration" },
        { icon: History, label: "Audit Logs", path: "/registrar/audit-logs" },
        { icon: Settings, label: "Settings", path: "/registrar/settings" },
      ]
    }
  ];

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "RG";

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* Desktop Sidebar */}
      <aside 
        className={`${sidebarOpen ? 'w-64' : 'w-20'} hidden md:flex flex-col bg-slate-900 text-white transition-all duration-300 ease-in-out z-20`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center w-full'}`}>
            <ImageWithFallback src={mwuLogo} alt="MWU Logo" className="w-8 h-8 rounded-md object-contain bg-white p-0.5" />
            {sidebarOpen && <span className="font-bold text-white tracking-tight truncate">MWU Registrar</span>}
          </div>
          {sidebarOpen && (
            <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
              <Menu className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-6 px-3">
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)} className="flex justify-center p-2 mb-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
              <Menu className="w-5 h-5" />
            </button>
          )}

          {navSections.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-1">
                {sidebarOpen ? section.title : '•••'}
              </div>
              {section.items.map((item) => {
                const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== "/registrar");
                return (
                  <Link 
                    key={item.path} 
                    to={item.path}
                    className={`flex items-center ${sidebarOpen ? 'px-3' : 'justify-center'} py-2 rounded-lg transition-colors group relative ${
                      isActive 
                        ? 'bg-blue-600 text-white font-semibold shadow-sm' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                    {sidebarOpen && (
                      <>
                        <span className="ml-3 text-sm truncate">{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto bg-amber-500 text-slate-900 py-0.5 px-2 rounded-full text-xs font-bold">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}

          <div className="mt-auto pt-4 border-t border-slate-800">
            <button onClick={logout} className={`flex items-center ${sidebarOpen ? 'px-3' : 'justify-center'} py-2 rounded-lg text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors w-full`}>
              <LogOut className="w-4 h-4 text-red-400" />
              {sidebarOpen && <span className="ml-3 text-sm font-medium">Log out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-slate-900/60 backdrop-blur-xs flex">
          <div className="w-72 bg-slate-900 text-white h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <ImageWithFallback src={mwuLogo} alt="MWU Logo" className="w-8 h-8 rounded-md object-contain bg-white p-0.5" />
                <span className="font-bold text-white">MWU Registrar</span>
              </div>
              <button onClick={closeMobile} className="p-2 text-slate-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {navSections.map((section, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-1">
                    {section.title}
                  </div>
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== "/registrar");
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={closeMobile}
                        className={`flex items-center px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive ? "bg-blue-600 text-white font-bold" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        <item.icon className={`w-4 h-4 mr-3 ${isActive ? "text-white" : "text-slate-400"}`} />
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto bg-amber-500 text-slate-900 py-0.5 px-2 rounded-full text-xs font-bold">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              ))}

              <div className="pt-4 border-t border-slate-800 mt-4">
                <button
                  onClick={() => { closeMobile(); logout(); }}
                  className="w-full flex items-center px-3.5 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-3 text-red-400" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1" onClick={closeMobile} />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 sticky top-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileDrawerOpen(true)} 
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Open mobile menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-base sm:text-xl font-bold text-slate-900 truncate">
                Central Registrar Admin
              </h1>
              <span className="text-[11px] text-slate-500 hidden sm:block">Madda Walabu University e-Clearance</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {initials}
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-bold text-slate-900 leading-none">{user?.name || "Registrar Admin"}</span>
                <span className="text-xs text-slate-500 mt-0.5">University Registrar</span>
              </div>
            </div>
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
