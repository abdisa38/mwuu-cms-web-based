import { useState } from "react";
import { ZoomIn, ZoomOut, RotateCw, Download, FileText, User } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { UserProfile } from "@/app/services/authService";

interface DocumentViewerProps {
  student: UserProfile;
}

export function DocumentViewer({ student }: DocumentViewerProps) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  return (
    <div className="h-full flex flex-col bg-slate-900 overflow-hidden relative">
      {/* Viewer Header */}
      <div className="h-14 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3 text-white">
          <FileText className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs sm:text-sm font-medium truncate">MWU_ID_{student.studentId || "CARD"}.jpg</h3>
          <span className="text-[10px] text-slate-400 bg-slate-700 px-2 py-0.5 rounded">Digital ID</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-slate-700" onClick={handleZoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs text-slate-300 w-10 text-center font-mono">{Math.round(scale * 100)}%</span>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-slate-700" onClick={handleZoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <div className="w-px h-4 bg-slate-600 mx-1"></div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-slate-700" onClick={handleRotate}>
            <RotateCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Document Display */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-6 bg-slate-950">
        <div 
          className="transition-transform duration-200 ease-out origin-center"
          style={{ transform: `scale(${scale}) rotate(${rotation}deg)` }}
        >
          {/* Dynamic Authentic Student ID card */}
          <div className="w-[380px] h-[230px] bg-gradient-to-br from-white to-slate-100 rounded-2xl border-4 border-blue-900 shadow-2xl flex flex-col justify-between p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-10 bg-blue-900 text-white flex items-center justify-between px-4">
              <span className="text-xs font-bold tracking-wider uppercase">Madda Walabu University</span>
              <span className="text-[9px] font-semibold bg-white/20 px-2 py-0.5 rounded">STUDENT ID</span>
            </div>

            <div className="mt-8 flex gap-3 items-center">
              <div className="w-18 h-18 rounded-xl bg-blue-100 border-2 border-blue-900/30 flex items-center justify-center text-blue-800 font-bold text-xl shrink-0 overflow-hidden shadow-inner">
                {student.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-slate-900 text-base leading-tight truncate">{student.name}</h4>
                <p className="text-xs font-mono font-bold text-blue-800 mt-0.5">{student.studentId || "UGR/---/--"}</p>
                <p className="text-[11px] text-slate-600 font-medium truncate mt-0.5">{student.department || "Computer Science"}</p>
                <p className="text-[10px] text-slate-500 truncate">{student.college || "College of Computing"}</p>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-[10px] text-slate-500 font-mono">
              <span>PROG: {student.program || "REGULAR"}</span>
              <span className="text-emerald-700 font-bold">STATUS: ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
