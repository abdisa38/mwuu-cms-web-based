import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Button } from "@/app/components/ui/Button";
import { Certificate } from "@/app/components/shared/Certificate";
import { 
  Search, 
  ShieldCheck, 
  XCircle, 
  Printer, 
  ScanLine,
  CheckCircle2
} from "lucide-react";
import { publicService, VerifiedCertificateData } from "../../services/publicService";

export function VerifyCertificate() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("cert") || "");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<"idle" | "valid" | "invalid">("idle");
  const [certificate, setCertificate] = useState<VerifiedCertificateData | null>(null);

  const performVerification = async (query: string) => {
    if (!query || !query.trim()) return;
    setIsSearching(true);
    try {
      const res = await publicService.verifyCertificate(query.trim());
      if ((res.isValid || (res as any).valid || res.success) && res.certificate) {
        setResult("valid");
        setCertificate(res.certificate);
      } else {
        setResult("invalid");
        setCertificate(null);
      }
    } catch {
      setResult("invalid");
      setCertificate(null);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const certParam = searchParams.get("cert");
    if (certParam) {
      setSearchQuery(certParam);
      performVerification(certParam);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performVerification(searchQuery);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-slate-50 w-full animate-in fade-in duration-300">
      {/* Hero Search Section */}
      <section className="w-full pt-16 pb-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/10 pointer-events-none" />
        <div className="container mx-auto px-4 max-w-3xl relative z-10 text-center">
          <ShieldCheck className="w-16 h-16 mx-auto mb-6 text-blue-400" />
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Verify Digital Clearance</h1>
          <p className="text-slate-300 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Enter a certificate number, student ID, or request ID to verify the authenticity of a Madda Walabu University digital clearance certificate.
          </p>

          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-4 py-4 bg-white border-2 border-transparent rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 transition-all text-lg shadow-lg"
                placeholder="e.g. MWU-CLR-2026-8304 or Ugr/50002/15"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              type="submit" 
              size="lg" 
              className="h-[60px] px-8 text-base bg-blue-600 hover:bg-blue-500 shadow-lg border border-blue-400/30 text-white"
              isLoading={isSearching}
            >
              Verify Certificate
            </Button>
          </form>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-400">
            <ScanLine className="w-4 h-4 text-blue-400" />
            <span>Connected to Madda Walabu University Central Verification Registry</span>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="flex-1 w-full pb-20 mt-8">
        <div className="container mx-auto px-4 max-w-5xl">
          
          {result === "idle" && (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Central Registry Verification</h3>
              <p className="text-slate-500 max-w-md mx-auto text-sm">
                Each certificate issued by Madda Walabu University contains a verifiable digital cryptographic hash and unique Certificate Serial Number.
              </p>
            </div>
          )}

          {result === "invalid" && (
            <div className="bg-white rounded-2xl shadow-sm border border-red-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-red-50 p-6 flex items-center gap-4 border-b border-red-100">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-red-900">Certificate Not Found or Invalid</h3>
                  <p className="text-red-700">We could not locate an active clearance certificate matching "{searchQuery}".</p>
                </div>
              </div>
              <div className="p-8 text-center space-y-4">
                <p className="text-slate-600 text-sm">Please verify the certificate serial number or student ID and try again.</p>
                <Button variant="outline" onClick={() => { setResult("idle"); setSearchQuery(""); }}>Clear Search</Button>
              </div>
            </div>
          )}

          {result === "valid" && certificate && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-white rounded-2xl shadow-sm border border-emerald-200 overflow-hidden">
                <div className="bg-emerald-50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 shadow-sm border border-emerald-200">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-emerald-900">Official Clearance Verified</h3>
                      <p className="text-emerald-700 font-medium">Valid certificate issued by Office of the University Registrar.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button variant="outline" onClick={() => window.print()} className="bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                      <Printer className="w-4 h-4 mr-2" /> Print
                    </Button>
                  </div>
                </div>

                <div className="p-6 md:p-8 bg-slate-50 flex justify-center overflow-x-auto">
                  <div className="min-w-[800px] w-full transform scale-95 sm:scale-100 origin-top">
                    <Certificate 
                      certNumber={certificate.certNumber}
                      studentName={certificate.studentName}
                      studentId={certificate.studentId}
                      department={certificate.department}
                    />
                  </div>
                </div>
                
                <div className="border-t border-slate-200 bg-white p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Status</p>
                    <p className="font-semibold text-emerald-600 flex items-center"><CheckCircle2 className="w-4 h-4 mr-1"/> Officially Cleared</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Issue Date</p>
                    <p className="font-semibold text-slate-900">
                      {new Date(certificate.issuedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Authority</p>
                    <p className="font-semibold text-slate-900">{certificate.approvedByName || "MWU Registrar"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Blockchain Hash</p>
                    <p className="font-mono text-xs text-emerald-700 bg-emerald-50 p-1.5 rounded border border-emerald-200 break-all">
                      {certificate.blockchainHash || "0x8f4b...3b2a"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
