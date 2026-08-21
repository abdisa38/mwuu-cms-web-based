import { useState, useEffect } from "react";
import { Search, RefreshCw, XCircle } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { RejectedKPIs } from "./components/RejectedKPIs";
import { registrarService } from "@/app/services/registrarService";
import { ClearanceRequest } from "@/app/services/clearanceService";
import { toast } from "sonner";

export function RejectedClearancesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [rejectedList, setRejectedList] = useState<ClearanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRejected = async () => {
    setLoading(true);
    try {
      const res = await registrarService.getAllClearances({ status: "rejected" });
      setRejectedList(res.clearances || []);
    } catch {
      toast.error("Failed to load rejected clearances.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRejected();
  }, []);

  const filtered = rejectedList.filter(c => 
    c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.requestId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen relative space-y-6 pb-20 md:pb-8 animate-in fade-in duration-300">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <XCircle className="w-7 h-7 text-red-600" />
            Rejected Clearances & Holds
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Applications blocked due to department obligations, missing materials, or disciplinary holds.
          </p>
        </div>

        <Button variant="outline" onClick={fetchRejected} className="bg-white">
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      <RejectedKPIs />

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by student, ID, reason..."
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
                <th className="px-6 py-4 font-semibold">Rejection Details</th>
                <th className="px-6 py-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((row) => {
                  const rejectedDept = row.departmentApprovals?.find(d => d.status === "rejected");
                  return (
                    <tr key={row._id} className="hover:bg-red-50/30">
                      <td className="px-6 py-4 font-mono font-bold text-red-900">{row.requestId}</td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{row.studentName}</p>
                        <p className="text-xs text-slate-500">{row.studentId}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-800">{row.department}</p>
                        <p className="text-xs text-slate-500">{row.college}</p>
                      </td>
                      <td className="px-6 py-4 capitalize font-medium text-slate-700">{row.clearanceType}</td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-semibold text-red-800">
                          {rejectedDept ? `${rejectedDept.departmentName}: ` : "Registrar Hold: "}
                          {rejectedDept?.rejectionReason || rejectedDept?.remarks || "Unfulfilled requirements"}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center text-xs font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                          REJECTED
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No rejected clearance applications.
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
