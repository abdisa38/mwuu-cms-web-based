import { useState } from "react";
import { X, ShieldOff, AlertTriangle } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { UserProfile } from "@/app/services/authService";
import { registrarService } from "@/app/services/registrarService";
import { toast } from "sonner";

interface SuspendModalProps {
  student: UserProfile;
  onClose: () => void;
  onSuccess: () => void;
}

export function SuspendModal({ student, onClose, onSuccess }: SuspendModalProps) {
  const [loading, setLoading] = useState(false);

  const handleSuspend = async () => {
    setLoading(true);
    try {
      await registrarService.updateUser(student._id || student.id!, {
        status: "Suspended",
      });
      toast.success(`Account for ${student.name} has been suspended.`);
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Failed to suspend account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-rose-50">
          <h3 className="text-lg font-bold text-rose-900 flex items-center gap-2">
            <ShieldOff className="w-5 h-5 text-rose-600" />
            Suspend Student Account
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800">
              Are you sure you want to suspend the account for <strong>{student.name} ({student.studentId || student.email})</strong>? This will block portal access and hold clearance workflows.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose} className="text-slate-600">Cancel</Button>
          <Button 
            onClick={handleSuspend} 
            isLoading={loading} 
            className="bg-rose-600 hover:bg-rose-700 text-white shadow-sm font-semibold px-5"
          >
            Confirm Suspension
          </Button>
        </div>
      </div>
    </div>
  );
}
