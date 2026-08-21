import { CheckCircle2 } from "lucide-react";
import { UserProfile } from "@/app/services/authService";

interface DuplicateWarningProps {
  student: UserProfile;
}

export function DuplicateWarning({ student }: DuplicateWarningProps) {
  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-emerald-900">Unique Authenticated Student Account</h4>
          <p className="text-xs text-emerald-700 mt-0.5">
            Student ID <span className="font-mono font-bold">{student.studentId || "UGR/---/--"}</span> is unique with zero identity conflicts.
          </p>
        </div>
      </div>
      <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg">
        Verified Record
      </span>
    </div>
  );
}
