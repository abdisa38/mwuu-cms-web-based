import { useState, useEffect } from "react";
import { Search, Download, HelpCircle, Award, Settings, RefreshCw, Plus, Printer } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { CertificateKPIs } from "./components/CertificateKPIs";
import { registrarService } from "@/app/services/registrarService";
import { ClearanceRequest } from "@/app/services/clearanceService";
import { Certificate } from "@/app/components/shared/Certificate";
import { toast } from "sonner";

export function CertificatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [certificates, setCertificates] = useState<ClearanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewCert, setPreviewCert] = useState<ClearanceRequest | null>(null);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const res = await registrarService.getCertificates();
      setCertificates(res.certificates || []);
    } catch {
      toast.error("Failed to load certificates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const filtered = certificates.filter(c => 
    c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.certificate?.certNumber && c.certificate.certNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen relative space-y-6 pb-20 md:pb-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-7 h-7 text-blue-600" />
            Official Digital Certificates
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Centrally issued cryptographic clearance certificates with verifiable QR codes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchCertificates} className="bg-white">
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>

      <CertificateKPIs />

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by student, ID, or cert #..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Certificate Number</th>
                <th className="px-6 py-4 font-semibold">Student Name & ID</th>
                <th className="px-6 py-4 font-semibold">Department & College</th>
                <th className="px-6 py-4 font-semibold">Issue Date</th>
                <th className="px-6 py-4 font-semibold">Blockchain Hash</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((cert) => (
                  <tr key={cert._id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-blue-900">
                      {cert.certificate?.certNumber || "MWU-CLR-2026-XXXX"}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{cert.studentName}</p>
                      <p className="text-xs text-slate-500">{cert.studentId}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800">{cert.department}</p>
                      <p className="text-xs text-slate-500">{cert.college}</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">
                      {cert.certificate?.issuedAt ? new Date(cert.certificate.issuedAt).toLocaleDateString() : "Recently"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                        {cert.certificate?.blockchainHash ? `${cert.certificate.blockchainHash.slice(0, 16)}...` : "0x8f4b...3b2a"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        size="sm" 
                        onClick={() => setPreviewCert(cert)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 shadow-sm"
                      >
                        Preview Certificate
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <Award className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    No issued certificates found in database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Certificate Preview Modal */}
      {previewCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-8 relative my-8">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-900">Certificate Digital Preview</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => window.print()}>
                  <Printer className="w-4 h-4 mr-2" /> Print
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setPreviewCert(null)}>
                  Close
                </Button>
              </div>
            </div>

            <div className="flex justify-center overflow-x-auto">
              <div className="min-w-[750px]">
                <Certificate 
                  certNumber={previewCert.certificate?.certNumber || "MWU-CLR-2026-8932"}
                  studentName={previewCert.studentName}
                  studentId={previewCert.studentId}
                  department={previewCert.department}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
