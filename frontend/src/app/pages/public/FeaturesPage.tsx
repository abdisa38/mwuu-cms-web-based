import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button } from "@/app/components/ui/Button";
import { 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Lock, 
  Smartphone, 
  QrCode, 
  Bell, 
  FileCheck, 
  GraduationCap, 
  Users, 
  Building2,
  ArrowRight,
  Sparkles,
  Zap,
  Award
} from "lucide-react";
import { publicService, CollegeDepartmentItem } from "../../services/publicService";

export function FeaturesPage() {
  const [colleges, setColleges] = useState<CollegeDepartmentItem[]>([]);
  const [programs, setPrograms] = useState<string[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<string>("");

  useEffect(() => {
    publicService.getCollegesAndDepartments()
      .then(res => {
        if (res.colleges) {
          setColleges(res.colleges);
          if (res.colleges.length > 0) {
            setSelectedCollege(res.colleges[0].college);
          }
        }
        if (res.programs) {
          setPrograms(res.programs);
        }
      })
      .catch(() => {});
  }, []);

  const coreFeatures = [
    {
      icon: Layers,
      color: "text-blue-600 bg-blue-50 border-blue-200",
      title: "100% Paperless Department Routing",
      desc: "Eliminates manual paper clearance slips. Clearance requests automatically route in parallel across all 6 departments (Department Head, Library, Dormitory, Cafeteria, Bookstore, and Registrar).",
    },
    {
      icon: Lock,
      color: "text-indigo-600 bg-indigo-50 border-indigo-200",
      title: "Cryptographic Certificate Generation",
      desc: "Upon final Registrar sign-off, an official digital certificate is generated with an immutable SHA-256 blockchain hash, unique serial number (e.g. MWU-CLR-2026-XXXX), and QR code.",
    },
    {
      icon: QrCode,
      color: "text-purple-600 bg-purple-50 border-purple-200",
      title: "Universal Public QR Verification",
      desc: "Employers, embassies, and universities can verify clearance authenticity instantly by scanning the certificate QR code or entering the student ID into the public verification registry.",
    },
    {
      icon: Bell,
      color: "text-amber-600 bg-amber-50 border-amber-200",
      title: "Real-time Live Notification Center",
      desc: "Instant notifications and automated email alerts keep students and officers synchronized whenever a checkpoint is approved, held, or requires action.",
    },
    {
      icon: Users,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      title: "Department Isolation & Role Security",
      desc: "Officers only access students relevant to their assigned desks, preventing unauthorized approvals and ensuring strict audit compliance across colleges.",
    },
    {
      icon: FileCheck,
      color: "text-rose-600 bg-rose-50 border-rose-200",
      title: "Registrar Oversight & Comprehensive Audit",
      desc: "Full administrative dashboard featuring live throughput KPIs, student verification queues, appeal handling, and immutable audit logs recording every action.",
    },
  ];

  const activeCollegeData = colleges.find(c => c.college === selectedCollege) || colleges[0];

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-slate-50 w-full animate-in fade-in duration-300">
      {/* Hero Section */}
      <section className="w-full pt-16 pb-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/10 pointer-events-none" />
        <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-900/50 px-4 py-1.5 text-xs text-blue-300 mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-blue-400" />
            Next-Generation University Clearance Platform
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            Designed for Modern Academic Institutions
          </h1>
          <p className="text-slate-300 text-base md:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Madda Walabu University e-Clearance platform replaces weeks of paperwork with a fast, transparent, and digitally verified clearance process.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg font-bold px-8">
                Get Started Now <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/verify">
              <Button size="lg" variant="outline" className="border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700 font-medium">
                <QrCode className="w-4 h-4 mr-2" /> Verify a Certificate
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 6 Core Features Grid */}
      <section className="container mx-auto px-4 max-w-7xl py-16">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
            Core Capabilities & Security Architecture
          </h2>
          <p className="text-slate-600 text-sm md:text-base">
            Built to provide high operational efficiency for faculty officers and complete transparency for students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreFeatures.map((feat, idx) => (
            <div 
              key={idx} 
              className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 border ${feat.color}`}>
                  <feat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-blue-600">
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" /> Active in MWU Portal
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* College & Department Structure Explorer */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-3">
              <GraduationCap className="w-4 h-4" /> Academic Coverage
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              Supported Colleges & Departments
            </h2>
            <p className="text-slate-600 text-sm">
              All faculties across Madda Walabu University are integrated with dedicated clearance routing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* College Tabs */}
            <div className="lg:col-span-5 space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Select College / School</h4>
              <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-2">
                {colleges.map((col, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedCollege(col.college)}
                    className={`w-full text-left p-3.5 rounded-2xl text-sm font-semibold transition-all flex items-center justify-between ${
                      selectedCollege === col.college
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    <span>{col.college}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      selectedCollege === col.college ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                    }`}>
                      {col.departments.length} Depts
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Departments Card */}
            <div className="lg:col-span-7 bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{activeCollegeData?.college}</h3>
                  <p className="text-xs text-slate-500 font-medium">Departmental Head Clearance Portals</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeCollegeData?.departments.map((dept, dIdx) => (
                  <div 
                    key={dIdx} 
                    className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-2.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{dept}</span>
                  </div>
                ))}
              </div>

              {/* Supported Programs */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Supported Degree Programs</h4>
                <div className="flex flex-wrap gap-2">
                  {programs.slice(0, 5).map((prog, pIdx) => (
                    <span key={pIdx} className="text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-full">
                      {prog}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-16 container mx-auto px-4 max-w-5xl text-center">
        <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-bold">Ready to Start Your Digital Clearance?</h2>
            <p className="text-blue-200 text-sm sm:text-base leading-relaxed">
              Register with your student ID or log in to track your clearances in real time across all university departments.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-white text-blue-900 hover:bg-slate-100 font-bold px-8 shadow-md">
                  Register as Student
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-blue-300 text-white hover:bg-blue-800 font-semibold px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
