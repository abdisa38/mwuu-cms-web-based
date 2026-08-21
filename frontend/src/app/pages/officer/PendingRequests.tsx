import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { 
  ChevronRight, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  MessageSquare, 
  FileText, 
  X, 
  AlertCircle, 
  UploadCloud, 
  RefreshCw,
  MoreHorizontal
} from "lucide-react";
import { officerService, OfficerQueueItem } from "../../services/officerService";
import { toast } from "sonner";

export function PendingRequests() {
  const [requests, setRequests] = useState<OfficerQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<OfficerQueueItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState<"approve" | "reject" | "info" | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await officerService.getQueue("pending");
      setRequests(res.requests || []);
    } catch (err: any) {
      toast.error("Failed to load queue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleRowClick = (req: OfficerQueueItem) => {
    setSelectedRequest(req);
    setIsDrawerOpen(true);
  };

  const handleActionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    setActionLoading(true);
    try {
      const actionType = isActionModalOpen === "approve" ? "approve" : isActionModalOpen === "reject" ? "reject" : "hold";
      await officerService.reviewClearance(selectedRequest._id, {
        action: actionType,
        remarks,
        rejectionReason: rejectReason,
      });

      setActionSuccess(true);
      toast.success(`Clearance ${actionType.toUpperCase()}D successfully!`);
      setTimeout(() => {
        setIsActionModalOpen(null);
        setActionSuccess(false);
        setRemarks("");
        setRejectReason("");
        setIsDrawerOpen(false);
        fetchQueue();
      }, 1200);
    } catch (err: any) {
      toast.error(err.message || "Failed to process review.");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredRequests = requests.filter(r => 
    r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.requestId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 pb-20 md:pb-0 animate-in fade-in duration-300 relative">
      {/* Live Notice Banner */}
      <div className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
          Live Department Clearance Queue
        </div>
        <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-mono">Connected to Atlas</span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center text-sm text-slate-500 mb-1">
            <Link to="/officer" className="hover:text-blue-600">Dashboard</Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-slate-900 font-medium">Pending Requests</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            Pending Clearance Queue
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-md border border-amber-200">
              {filteredRequests.length} Pending
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" onClick={fetchQueue} className="bg-white border-slate-200 shadow-sm">
            <RefreshCw className="w-4 h-4 mr-2 text-slate-500" /> Refresh
          </Button>
        </div>
      </div>

      {/* Main Queue Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-slate-50/50">
          <div className="relative flex-1 lg:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search Student Name, ID, or Request #..." 
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none shadow-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Request ID</th>
                <th className="px-6 py-4 font-semibold">Student Name & ID</th>
                <th className="px-6 py-4 font-semibold">Department & Program</th>
                <th className="px-6 py-4 font-semibold">Clearance Type</th>
                <th className="px-6 py-4 font-semibold">Department Status</th>
                <th className="px-6 py-4 font-semibold">Submitted Date</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((row) => (
                  <tr 
                    key={row._id} 
                    onClick={() => handleRowClick(row)}
                    className="hover:bg-indigo-50/40 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4 font-mono font-bold text-blue-900">{row.requestId}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shadow-sm">
                          {row.studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-blue-700">{row.studentName}</p>
                          <p className="text-xs text-slate-500">{row.studentId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-900 font-medium">{row.department}</p>
                      <p className="text-xs text-slate-500">{row.program}</p>
                    </td>
                    <td className="px-6 py-4 capitalize font-medium text-slate-700">{row.clearanceType}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3 h-3 mr-1" /> Pending Review
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(row.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm h-8" onClick={() => handleRowClick(row)}>
                        Review Request
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-slate-500">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
                    <p className="font-semibold text-slate-800">All Caught Up!</p>
                    <p className="text-sm text-slate-400">No pending clearance applications awaiting review.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* FULL SCREEN REVIEW DRAWER */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[550px] lg:w-[650px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedRequest && (
          <>
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <button onClick={() => setIsDrawerOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-md transition-colors bg-white border border-slate-200 shadow-sm">
                  <X className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="font-bold text-slate-900 text-lg">Review Clearance Request</h2>
                  <p className="text-xs font-mono text-slate-500">{selectedRequest.requestId}</p>
                </div>
              </div>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
              {/* Student Header */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg border-2 border-white shadow shrink-0">
                  {selectedRequest.studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedRequest.studentName}</h3>
                  <p className="text-sm font-semibold text-slate-600">{selectedRequest.studentId} • {selectedRequest.department}</p>
                  <p className="text-xs text-blue-600 font-medium capitalize mt-1">{selectedRequest.clearanceType} Clearance</p>
                </div>
              </div>

              {/* Context Grid */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 grid grid-cols-2 gap-4 shadow-sm text-sm">
                <div>
                  <p className="text-xs text-slate-400">College</p>
                  <p className="font-semibold text-slate-800">{selectedRequest.college || "College of Computing"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Program</p>
                  <p className="font-semibold text-slate-800">{selectedRequest.program}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Submission Date</p>
                  <p className="font-semibold text-slate-800">{new Date(selectedRequest.submittedAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Reason</p>
                  <p className="font-semibold text-slate-800">{selectedRequest.reason || "Exit clearance"}</p>
                </div>
              </div>

              {/* Uploaded Documents */}
              {selectedRequest.documents && selectedRequest.documents.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Attached Documents</h4>
                  <div className="space-y-2">
                    {selectedRequest.documents.map((doc, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 p-3.5 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <p className="text-sm font-medium text-slate-900 truncate">{doc.name}</p>
                        </div>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline" className="text-xs">
                            <Eye className="w-3.5 h-3.5 mr-1" /> View
                          </Button>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Officer Decision Panel */}
            <div className="p-6 border-t border-slate-200 bg-white shadow-lg shrink-0">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Record Officer Decision</h4>
              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-base shadow-sm"
                  onClick={() => setIsActionModalOpen("approve")}
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" /> Approve Clearance
                </Button>
                <Button 
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white h-12 text-base shadow-sm"
                  onClick={() => setIsActionModalOpen("reject")}
                >
                  <XCircle className="w-5 h-5 mr-2" /> Reject / Hold
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Decision Modal */}
      {isActionModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            {actionSuccess ? (
              <div className="p-10 text-center flex flex-col items-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                  isActionModalOpen === 'approve' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                }`}>
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  Decision Recorded in Database!
                </h3>
                <p className="text-sm text-slate-500">The student clearance record has been updated.</p>
              </div>
            ) : (
              <form onSubmit={handleActionSubmit}>
                <div className={`px-6 py-4 border-b flex justify-between items-center ${
                  isActionModalOpen === 'approve' ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'
                }`}>
                  <h3 className={`text-base font-bold flex items-center ${
                    isActionModalOpen === 'approve' ? 'text-emerald-900' : 'text-red-900'
                  }`}>
                    {isActionModalOpen === 'approve' ? <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-600" /> : <AlertCircle className="w-5 h-5 mr-2 text-red-600" />}
                    {isActionModalOpen === 'approve' ? 'Confirm Approval' : 'Reject / Hold Clearance'}
                  </h3>
                  <button type="button" onClick={() => setIsActionModalOpen(null)} className="text-slate-400 hover:text-slate-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex justify-between items-center text-sm font-semibold">
                    <span className="text-slate-700">{selectedRequest?.studentId}</span>
                    <span className="text-slate-900">{selectedRequest?.studentName}</span>
                  </div>

                  {isActionModalOpen === 'reject' && (
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-900">Rejection Reason <span className="text-red-500">*</span></label>
                      <Input 
                        required
                        value={rejectReason}
                        onChange={e => setRejectReason(e.target.value)}
                        placeholder="e.g. Unreturned library books or unpaid fines"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-900">Officer Remarks</label>
                    <textarea 
                      value={remarks}
                      onChange={e => setRemarks(e.target.value)}
                      placeholder="Add official department clearance remarks..."
                      className="w-full min-h-[90px] p-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                  <Button type="button" variant="ghost" onClick={() => setIsActionModalOpen(null)}>Cancel</Button>
                  <Button 
                    type="submit" 
                    isLoading={actionLoading}
                    className={`text-white px-6 ${
                      isActionModalOpen === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {isActionModalOpen === 'approve' ? 'Approve' : 'Confirm Rejection'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
