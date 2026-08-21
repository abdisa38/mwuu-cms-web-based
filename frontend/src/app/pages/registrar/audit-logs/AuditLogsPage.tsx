import React, { useState, useEffect } from "react";
import { Download, RefreshCw, FileText, Shield, Clock, User, History } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { registrarService } from "@/app/services/registrarService";
import { toast } from "sonner";

export function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await registrarService.getAuditLogs();
      setLogs(res.logs || []);
    } catch {
      toast.error("Failed to load audit logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="text-sm font-medium text-slate-500 mb-1">Registrar Administration / Audit Trail</div>
          <h1 className="text-2xl font-bold text-slate-900">Audit Logs & Security Trail</h1>
          <p className="text-slate-500 text-sm mt-1">Immutable cryptographic log of clearance decisions, status changes, and user activities.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={fetchLogs} className="bg-white gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-bold text-slate-900">System Activity Records ({logs.length})</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Timestamp</th>
                <th className="px-6 py-4 font-semibold">Action Performed</th>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Target Entity</th>
                <th className="px-6 py-4 font-semibold">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-900">{log.action}</span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-800">
                      {log.userName || "System"} ({log.userRole || "automated"})
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 font-mono">
                      {log.entityType}: {log.entityId}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {log.ipAddress || "127.0.0.1"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <History className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    No audit records logged yet.
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
