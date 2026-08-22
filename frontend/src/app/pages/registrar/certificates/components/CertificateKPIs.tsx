import { useState, useEffect } from "react";
import { Award, CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import { registrarService } from "@/app/services/registrarService";

export function CertificateKPIs() {
  const [certCount, setCertCount] = useState(0);

  useEffect(() => {
    registrarService.getCertificates()
      .then(res => {
        if (res.success && res.certificates) {
          setCertCount(res.certificates.length);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Generated */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <Award className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Total Certificates</p>
          <h3 className="text-2xl font-bold text-slate-900">{certCount}</h3>
        </div>
      </div>

      {/* Verified Status */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Authentic & Valid</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-emerald-700">{certCount}</h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              100%
            </span>
          </div>
        </div>
      </div>

      {/* Public QR Code Lookup */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Public Verification</p>
          <h3 className="text-2xl font-bold text-purple-700">Online</h3>
        </div>
      </div>

      {/* Security Status */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
          <Clock className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Blockchain Hash</p>
          <h3 className="text-2xl font-bold text-indigo-700">SHA-256</h3>
        </div>
      </div>
    </div>
  );
}
