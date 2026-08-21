import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button } from "@/app/components/ui/Button";
import { 
  FileText, 
  Download, 
  Eye, 
  UploadCloud, 
  Trash2, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ExternalLink,
  Plus
} from "lucide-react";
import { clearanceService, ClearanceRequest } from "../../services/clearanceService";
import { toast } from "sonner";

export function MyDocuments() {
  const [clearance, setClearance] = useState<ClearanceRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clearanceService.getMyActiveClearance()
      .then(res => setClearance(res.clearance))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const documents = clearance?.documents || [];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 md:pb-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center text-sm text-slate-500 mb-1">
            <Link to="/student" className="hover:text-blue-600">Dashboard</Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-slate-900 font-medium">My Documents</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Uploaded Clearance Documents</h1>
        </div>

        <Link to="/student/new-clearance">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" /> Upload New Document
          </Button>
        </Link>
      </div>

      {/* Documents Grid */}
      {documents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between hover:border-blue-300 transition-all group">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base truncate">{doc.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Size: {doc.fileSize || "1.2 MB"} • Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
                <a 
                  href={doc.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full text-xs bg-slate-50 border-slate-200 hover:bg-slate-100">
                    <Eye className="w-3.5 h-3.5 mr-1.5" /> View File
                  </Button>
                </a>
                <a 
                  href={doc.url} 
                  download={doc.name}
                  className="flex-1"
                >
                  <Button className="w-full text-xs bg-blue-600 hover:bg-blue-700 text-white">
                    <Download className="w-3.5 h-3.5 mr-1.5" /> Download
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <UploadCloud className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-1">No Documents Uploaded</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
            Attach student identification copies or required supporting letters during clearance submission.
          </p>
          <Link to="/student/new-clearance">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Start New Application</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
