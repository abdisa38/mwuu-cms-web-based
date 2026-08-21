import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button } from "@/app/components/ui/Button";
import { 
  ChevronRight, 
  Search, 
  Download, 
  CheckCircle2, 
  RefreshCw,
  FileText
} from "lucide-react";
import { officerService, OfficerQueueItem } from "../../services/officerService";
import { toast } from "sonner";

export function ApprovedRequests() {
  const [approvedList, setApprovedList] = useState<OfficerQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchApproved = async () => {
    setLoading(true);
    try {
      const res = await officerService.getQueue("approved");
      setApprovedList(res.requests || []);
    } catch {
      toast.error("Failed to load approved clearances.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApproved();
  }, []);

  const filtered = approvedList.filter(r => 
    r.studentName.toLowerCase().includes(search.toLowerCase()) ||
    r.studentId.toLowerCase().includes(search.toLowerCase()) ||
    r.requestId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 pb-20 md:pb-0 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center text-sm text-slate-500 mb-1">
            <Link to="/officer" className="hover:text-blue-600">Dashboard</Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-slate-900 font-medium">Approved Requests</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            Department Approvals Log
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-md border border-emerald-200">
              {filtered.length} Approved
            </span>
          </h1>
        </div>

        <Button variant="outline" onClick={fetchApproved} className="bg-white">
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search approved students..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Request ID</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Department & Program</th>
                <th className="px-6 py-4">Approved Date</th>
                <th className="px-6 py-4">Approver</th>
                <th className="px-6 py-4">Remarks</th>
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
                      <p className="text-slate-800">{row.department}</p>
                      <p className="text-xs text-slate-500">{row.program}</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">
                      {row.reviewedAt ? new Date(row.reviewedAt).toLocaleString() : "Recently"}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-800">
                      {row.reviewedByName || "Department Officer"}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 italic">
                      {row.remarks || "No remarks"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No approved clearance records found.
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
