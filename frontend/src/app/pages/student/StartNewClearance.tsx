import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import {
  ChevronRight, Save, HelpCircle, GraduationCap, XOctagon, 
  ArrowRightLeft, AlertTriangle, Briefcase, FileText, UploadCloud,
  CheckCircle2, Clock, X, Info, ShieldCheck,
  ChevronLeft, FileCheck2
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { clearanceService, ClearanceRequest } from "../../services/clearanceService";
import { toast } from "sonner";

export function StartNewClearance() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [clearanceType, setClearanceType] = useState("graduation");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [createdClearance, setCreatedClearance] = useState<ClearanceRequest | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    phone: user?.phone || "+251 91 234 5678",
    emergencyContactName: user?.emergencyContact?.name || "Abebe Kebede",
    emergencyPhone: user?.emergencyContact?.phone || "+251 92 111 2233",
    currentAddress: user?.emergencyContact?.address || "Robe Town, Kebele 02",
    reason: "Standard exit clearance application",
    admissionYear: user?.academicInfo?.admissionYear || "2013",
    expectedGraduation: user?.academicInfo?.expectedGraduation || "2017",
    currentSemester: user?.academicInfo?.currentSemester || "Semester II",
    cgpa: user?.academicInfo?.cgpa ? String(user.academicInfo.cgpa) : "3.82",
    advisorName: user?.academicInfo?.advisor || "Dr. Abebe Kebede",
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const totalSteps = 5; // Step 6 is success

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };
  
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const saveDraft = () => {
    setLastSaved(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
    toast.info("Draft saved locally.");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArr = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...filesArr]);
      toast.success(`${filesArr.length} file(s) attached.`);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("clearanceType", clearanceType);
      data.append("reason", formData.reason);
      data.append("phone", formData.phone);
      data.append("emergencyContactName", formData.emergencyContactName);
      data.append("emergencyPhone", formData.emergencyPhone);
      data.append("currentAddress", formData.currentAddress);
      data.append("admissionYear", formData.admissionYear);
      data.append("expectedGraduation", formData.expectedGraduation);
      data.append("currentSemester", formData.currentSemester);
      data.append("cgpa", formData.cgpa);
      data.append("advisorName", formData.advisorName);

      uploadedFiles.forEach(file => {
        data.append("documents", file);
      });

      const res = await clearanceService.submitClearance(data);
      setCreatedClearance(res.clearance);
      toast.success("Clearance request successfully submitted to the university!");
      setStep(6); // Success Step
    } catch (err: any) {
      toast.error(err.message || "Failed to submit clearance.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearanceTypes = [
    { id: 'graduation', title: 'Graduation Clearance', icon: GraduationCap, desc: 'For students who have completed all academic requirements for graduation.' },
    { id: 'withdrawal', title: 'Withdrawal Clearance', icon: XOctagon, desc: 'For students officially withdrawing from the university before graduation.' },
    { id: 'transfer', title: 'Transfer Clearance', icon: ArrowRightLeft, desc: 'For students transferring to another university or program.' },
    { id: 'dismissal', title: 'Academic Dismissal', icon: AlertTriangle, desc: 'For students leaving due to academic dismissal.' },
    { id: 'staff', title: 'Staff Clearance', icon: Briefcase, desc: 'For staff members completing their tenure or transitioning roles.' },
  ];

  const steps = [
    "Clearance Type",
    "Student Info",
    "Academic Info",
    "Upload Documents",
    "Review"
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24 md:pb-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center text-sm text-slate-500 mb-1">
            <Link to="/student" className="hover:text-blue-600 transition-colors">Dashboard</Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-slate-900 font-medium">Start New Clearance</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Start New Clearance</h1>
        </div>
        
        {step < 6 && (
          <div className="flex items-center gap-3 w-full md:w-auto">
            {lastSaved && (
              <span className="text-xs font-medium text-slate-400 flex items-center mr-2">
                <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" /> Saved {lastSaved}
              </span>
            )}
            <Button variant="outline" className="bg-white border-slate-200 shadow-sm flex-1 md:flex-none" onClick={saveDraft}>
              <Save className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Save Draft</span>
            </Button>
            <Button variant="ghost" className="text-slate-500 hover:text-red-600 hover:bg-red-50" onClick={() => navigate('/student')}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {step < 6 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          {/* Stepper Header */}
          <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50 hidden md:block">
            <div className="flex items-center justify-between relative max-w-3xl mx-auto">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 rounded-full" />
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
              />
              {steps.map((label, i) => {
                const stepNum = i + 1;
                const isCompleted = stepNum < step;
                const isCurrent = stepNum === step;
                return (
                  <div key={stepNum} className="relative flex flex-col items-center group">
                    <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center font-bold text-sm transition-colors z-10 ${
                      isCompleted ? 'bg-blue-600 border-blue-100 text-white' : 
                      isCurrent ? 'bg-white border-blue-600 text-blue-600' : 
                      'bg-white border-slate-200 text-slate-400'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : stepNum}
                    </div>
                    <span className={`absolute top-12 text-xs font-semibold whitespace-nowrap ${
                      isCurrent ? 'text-blue-600' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                    }`}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-6 md:p-8 flex-1 min-h-[400px]">
            <form onSubmit={step === totalSteps ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }} className="h-full">
              
              {/* STEP 1: Type Selection */}
              {step === 1 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Select Clearance Type</h2>
                    <p className="text-slate-600">Choose the type of clearance you are applying for.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {clearanceTypes.map((type) => (
                      <div 
                        key={type.id}
                        onClick={() => setClearanceType(type.id)}
                        className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                          clearanceType === type.id 
                            ? 'border-blue-600 bg-blue-50/50 shadow-md ring-4 ring-blue-500/10' 
                            : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50 bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                            clearanceType === type.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                          }`}>
                            <type.icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className={`font-bold ${clearanceType === type.id ? 'text-blue-900' : 'text-slate-900'}`}>{type.title}</h3>
                            <p className={`text-sm mt-1 ${clearanceType === type.id ? 'text-blue-700' : 'text-slate-500'}`}>{type.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: Student Info */}
              {step === 2 && (
                <div className="space-y-8 animate-in slide-in-from-right-4 fade-in">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Student Information</h2>
                    <p className="text-slate-600">Verify your details and provide contact information.</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center">
                      <ShieldCheck className="w-4 h-4 mr-2 text-emerald-600" /> University Records (Auto-filled)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Full Name</p>
                        <p className="font-medium text-slate-900">{user?.name || "Student"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Student ID</p>
                        <p className="font-medium text-slate-900">{user?.studentId || "UGR/1234/12"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">University Email</p>
                        <p className="font-medium text-slate-900">{user?.email || "student@mwu.edu.et"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">College</p>
                        <p className="font-medium text-slate-900">{user?.college || "College of Computing"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Department</p>
                        <p className="font-medium text-slate-900">{user?.department || "Computer Science"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Program</p>
                        <p className="font-medium text-slate-900">{user?.program || "Undergraduate Regular"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">Contact Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-900">Current Phone Number <span className="text-red-500">*</span></label>
                        <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-900">Emergency Contact Name <span className="text-red-500">*</span></label>
                        <Input value={formData.emergencyContactName} onChange={e => setFormData({ ...formData, emergencyContactName: e.target.value })} required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-900">Emergency Phone Number <span className="text-red-500">*</span></label>
                        <Input value={formData.emergencyPhone} onChange={e => setFormData({ ...formData, emergencyPhone: e.target.value })} required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-900">Current Address <span className="text-red-500">*</span></label>
                        <Input value={formData.currentAddress} onChange={e => setFormData({ ...formData, currentAddress: e.target.value })} required />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-900">Reason for Clearance <span className="text-red-500">*</span></label>
                      <textarea 
                        required
                        value={formData.reason}
                        onChange={e => setFormData({ ...formData, reason: e.target.value })}
                        className="w-full min-h-[100px] p-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      ></textarea>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Academic Info */}
              {step === 3 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Academic Information</h2>
                    <p className="text-slate-600">Provide details regarding your academic status.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-900">Admission Year <span className="text-red-500">*</span></label>
                      <select 
                        value={formData.admissionYear} 
                        onChange={e => setFormData({ ...formData, admissionYear: e.target.value })}
                        className="w-full h-10 px-3 border border-slate-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                      >
                        <option value="2012">2012 E.C.</option>
                        <option value="2013">2013 E.C.</option>
                        <option value="2014">2014 E.C.</option>
                        <option value="2015">2015 E.C.</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-900">Expected Graduation Year</label>
                      <select 
                        value={formData.expectedGraduation} 
                        onChange={e => setFormData({ ...formData, expectedGraduation: e.target.value })}
                        className="w-full h-10 px-3 border border-slate-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                      >
                        <option value="2016">2016 E.C.</option>
                        <option value="2017">2017 E.C.</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-900">Current Semester <span className="text-red-500">*</span></label>
                      <select 
                        value={formData.currentSemester} 
                        onChange={e => setFormData({ ...formData, currentSemester: e.target.value })}
                        className="w-full h-10 px-3 border border-slate-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                      >
                        <option value="Semester I">Semester I</option>
                        <option value="Semester II">Semester II</option>
                        <option value="Summer">Summer</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-900">Latest CGPA</label>
                      <Input 
                        type="number" 
                        step="0.01" 
                        value={formData.cgpa} 
                        onChange={e => setFormData({ ...formData, cgpa: e.target.value })} 
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-sm font-medium text-slate-900">Academic Advisor Name</label>
                      <Input 
                        value={formData.advisorName} 
                        onChange={e => setFormData({ ...formData, advisorName: e.target.value })} 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Documents */}
              {step === 4 && (
                <div className="space-y-8 animate-in slide-in-from-right-4 fade-in">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Required Documents</h2>
                    <p className="text-slate-600">Attach student identification or supporting files.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 space-y-4">
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-sm text-blue-800">
                        <Info className="w-5 h-5 shrink-0 text-blue-600" />
                        <p>Accepted formats: JPG, PNG, PDF. Files are uploaded directly to the university cloud.</p>
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                      <label className="border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer bg-white h-48 block">
                        <UploadCloud className="w-10 h-10 text-blue-500 mb-3 mx-auto" />
                        <p className="text-base font-semibold text-slate-900">Click or browse to attach files</p>
                        <p className="text-sm text-slate-500 mt-1">Student ID Card, Profile Photo, Supporting letter</p>
                        <input type="file" multiple onChange={handleFileChange} className="hidden" />
                      </label>

                      {/* Uploaded Files Preview */}
                      {uploadedFiles.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold text-slate-900">Attached Files ({uploadedFiles.length})</h4>
                          {uploadedFiles.map((file, idx) => (
                            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                                  <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-900">{file.name}</p>
                                  <p className="text-xs text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                </div>
                              </div>
                              <button type="button" onClick={() => removeFile(idx)} className="p-2 text-slate-400 hover:text-red-500">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Review */}
              {step === 5 && (
                <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Review & Confirmation</h2>
                    <p className="text-slate-600">Please review all information before submitting your clearance request.</p>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                      <h3 className="font-semibold text-slate-900">Summary</h3>
                      <button type="button" onClick={() => setStep(1)} className="text-sm text-blue-600 font-medium hover:underline">Edit</button>
                    </div>
                    
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50/30">
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">Clearance Type</p>
                          <p className="font-medium text-slate-900 flex items-center capitalize">
                            <GraduationCap className="w-4 h-4 mr-2 text-blue-600" />
                            {clearanceType} Clearance
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">Student</p>
                          <p className="font-medium text-slate-900">{user?.name} ({user?.studentId})</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">Contact</p>
                          <p className="text-slate-900 text-sm">{formData.phone}</p>
                          <p className="text-slate-900 text-sm">{user?.email}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">Departments</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {['Library', 'Dormitory', 'Cafeteria', 'Bookstore', 'Department Head', 'Registrar'].map(dept => (
                              <span key={dept} className="bg-white border border-slate-200 px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 shadow-sm">{dept}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">Attached Files</p>
                          <p className="text-sm text-slate-800">{uploadedFiles.length} file(s) attached</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 border-t border-slate-200 bg-amber-50/50">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center mt-0.5">
                          <input type="checkbox" required className="peer sr-only" />
                          <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors flex items-center justify-center">
                            <CheckCircle2 className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100" />
                          </div>
                        </div>
                        <div className="text-sm text-slate-700">
                          <span className="font-semibold text-slate-900 block mb-0.5">Declaration of Truth</span>
                          I hereby declare that all the information provided is correct and complete.
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Navigation Footer */}
              <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={prevStep}
                  disabled={step === 1 || isSubmitting}
                  className={`${step === 1 ? 'invisible' : ''} text-slate-600`}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" /> Back
                </Button>

                {step < totalSteps ? (
                  <Button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700 shadow-sm px-6 text-white"
                  >
                    Continue <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    className="bg-emerald-600 hover:bg-emerald-700 shadow-sm px-8 text-white"
                    isLoading={isSubmitting}
                  >
                    Submit Clearance Request
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STEP 6: Success Page */}
      {step === 6 && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-10 text-center animate-in zoom-in-95 duration-500 max-w-2xl mx-auto my-12 relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Clearance Application Submitted!</h2>
            <p className="text-lg text-slate-600 mb-8">
              Your clearance request has been officially recorded in the MWU database and forwarded to all relevant departments.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-left mb-8 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Request Number</span>
                <span className="font-bold text-lg text-blue-900">{createdClearance?.requestId || "REQ-2026-8932"}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Clearance Type</span>
                <span className="font-semibold text-slate-900 capitalize">{createdClearance?.clearanceType || clearanceType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Status</span>
                <span className="inline-flex items-center rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-sm font-semibold text-amber-700">
                  <span className="flex h-2 w-2 rounded-full bg-amber-500 mr-2 animate-pulse"></span>
                  Pending Department Review
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="bg-white h-12 px-6" onClick={() => navigate('/student')}>
                Return to Dashboard
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-6 shadow-md" onClick={() => navigate('/student/clearance')}>
                <FileCheck2 className="w-5 h-5 mr-2" /> Track My Clearance
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
