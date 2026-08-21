import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button } from "@/app/components/ui/Button";
import { Certificate } from "@/app/components/shared/Certificate";
import { 
  Download, 
  Printer, 
  Share2, 
  ShieldCheck, 
  Clock, 
  ChevronRight, 
  AlertCircle,
  QrCode,
  FileCheck2,
  RefreshCw
} from "lucide-react";
import { clearanceService, ClearanceRequest } from "../../services/clearanceService";
import { toast } from "sonner";

export function StudentCertificate() {
  const [clearance, setClearance] = useState<ClearanceRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clearanceService.getMyActiveClearance()
      .then(res => setClearance(res.clearance))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast.success("Downloading Certificate PDF...");
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  const isCompleted = clearance?.status === "completed" && clearance?.certificate?.certNumber;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 md:pb-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm print:hidden">
        <div>
          <div className="flex items-center text-sm text-slate-500 mb-1">
            <Link to="/student" className="hover:text-blue-600">Dashboard</Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-slate-900 font-medium">Clearance Certificate</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Official Clearance Certificate</h1>
        </div>

        {isCompleted && (
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={handlePrint} className="bg-white border-slate-200 flex-1 sm:flex-none">
              <Printer className="w-4 h-4 mr-2" /> Print
            </Button>
            <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700 text-white flex-1 sm:flex-none">
              <Download className="w-4 h-4 mr-2" /> Download PDF
            </Button>
          </div>
        )}
      </div>

      {isCompleted ? (
        <div className="space-y-6">
          {/* Certificate Preview Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sm:p-10 overflow-x-auto flex justify-center bg-gradient-to-b from-slate-50/50 to-white">
            <div className="min-w-[800px] w-full max-w-4xl transform scale-95 sm:scale-100 origin-top">
              <Certificate 
                certNumber={clearance.certificate?.certNumber || "MWU-CLR-2026-8932"}
                studentName={clearance.studentName}
                studentId={clearance.studentId}
                department={clearance.department}
              />
            </div>
          </div>

          {/* Certificate Metadata Details */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6 print:hidden">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Certificate Number</p>
              <p className="font-mono text-sm font-bold text-blue-900">{clearance.certificate?.certNumber}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Issuing Authority</p>
              <p className="text-sm font-semibold text-slate-800">Office of University Registrar</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Date Issued</p>
              <p className="text-sm font-semibold text-slate-800">
                {clearance.certificate?.issuedAt ? new Date(clearance.certificate.issuedAt).toLocaleDateString("en-US", { dateStyle: "long" }) : "Recently"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Digital Verification</p>
              <p className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 break-all">
                {clearance.certificate?.blockchainHash || "0x8f4b...3b2a"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Clearance In Progress Notice */
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner border border-amber-100">
            <Clock className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Certificate Not Yet Available</h2>
            <p className="text-slate-600 max-w-md mx-auto">
              Your official digital clearance certificate will be automatically generated and issued once all required university departments and the Registrar have approved your clearance.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-2 text-sm text-slate-700">
            <div className="flex justify-between">
              <span>Current Status:</span>
              <span className="font-bold text-amber-700">{clearance?.status?.toUpperCase() || "NO CLEARANCE SUBMITTED"}</span>
            </div>
            <div className="flex justify-between">
              <span>Clearance Request ID:</span>
              <span className="font-mono">{clearance?.requestId || "N/A"}</span>
            </div>
          </div>

          <Link to="/student/clearance">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <FileCheck2 className="w-4 h-4 mr-2" /> View Department Approvals
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
