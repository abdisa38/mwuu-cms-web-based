import { useState, useEffect } from "react";
import { Link } from "react-router";
import { 
  Search, 
  Filter, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Building2,
  FileCheck2,
  RefreshCw
} from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { registrarService } from "../../../../../services/registrarService";
import { ClearanceRequest } from "../../../../../services/clearanceService";

export function RecentClearanceRequestsTable() {
  const [requests, setRequests] = useState<ClearanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    registrarService.getAllClearances()
      .then(res => setRequests(res.clearances || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">Recent Clearance Applications</h3>
          <p className="text-xs text-slate-500">Live student clearance records submitted to the central database</p>
        </div>
        <Link to="/registrar/pending">
          <Button variant="outline" size="sm" className="bg-white">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Request ID</th>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Department & Program</th>
              <th className="px-6 py-4">Clearance Type</th>
              <th className="px-6 py-4">Current Status</th>
              <th className="px-6 py-4">Submitted Date</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.length > 0 ? (
              requests.slice(0, 8).map((req) => (
                <tr key={req._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-blue-900">{req.requestId}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{req.studentName}</p>
                    <p className="text-xs text-slate-500">{req.studentId}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800">{req.department}</p>
                    <p className="text-xs text-slate-500">{req.program}</p>
                  </td>
                  <td className="px-6 py-4 capitalize text-slate-700">{req.clearanceType}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                      req.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      req.status === 'approved' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                      req.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {req.status === 'approved' ? 'READY FOR FINAL SIGNOFF' : req.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={req.status === 'approved' ? "/registrar/approvals" : "/registrar/pending"}>
                      <Button size="sm" variant="outline" className="text-xs bg-white">
                        Manage
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                  No clearance requests in database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
