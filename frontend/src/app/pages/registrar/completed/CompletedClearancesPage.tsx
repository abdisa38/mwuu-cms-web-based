import { useState, useEffect } from "react";
import { Building2, Search, Filter, Download, HelpCircle, Archive, ShieldCheck, Settings, RefreshCw } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { CompletedKPIs } from "./components/CompletedKPIs";
import { registrarService } from "@/app/services/registrarService";
import { ClearanceRequest } from "@/app/services/clearanceService";
import { toast } from "sonner";

export function CompletedClearancesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [completedList, setCompletedList] = useState<ClearanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompleted = async () => {
    setLoading(true);
    try {
      const res = await registrarService.getAllClearances({ status: "completed" });
      setCompletedList(res.clearances || []);
    } catch {
      toast.error("Failed to load completed clearances.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompleted();
  }, []);

  const filtered = completedList.filter(c => 
    c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.requestId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen relative space-y-6 pb-20 md:pb-8 animate-in fade-in duration-300">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Archive className="w-7 h-7 text-indigo-600" />
            Completed Clearances Archive
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Archived record of all successfully processed and certified student clearances.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchCompleted} className="bg-white">
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>

      <CompletedKPIs />

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search archive..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Request ID</th>
                <th className="px-6 py-4 font-semibold">Student & ID</th>
                <th className="px-6 py-4 font-semibold">Department & College</th>
                <th className="px-6 py-4 font-semibold">Clearance Type</th>
                <th className="px-6 py-4 font-semibold">Certificate Number</th>
                <th className="px-6 py-4 font-semibold">Approved Date</th>
                <th className="px-6 py-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((row) => (
                  <tr key={row._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-mono font-bold text-blue-900">{row.requestId}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{row.studentName}</p>
                      <p className="text-xs text-slate-500">{row.studentId}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800">{row.department}</p>
                      <p className="text-xs text-slate-500">{row.college}</p>
                    </td>
                    <td className="px-6 py-4 capitalize font-medium text-slate-700">{row.clearanceType}</td>
                    <td className="px-6 py-4 font-mono text-xs font-bold text-indigo-700">
                      {row.certificate?.certNumber || "MWU-CLR-2026-XXXX"}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">
                      {row.certificate?.issuedAt ? new Date(row.certificate.issuedAt).toLocaleDateString() : "Recently"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        COMPLETED
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    No completed clearance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
