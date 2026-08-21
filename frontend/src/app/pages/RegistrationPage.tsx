import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { ArrowLeft, ArrowRight, Check, ChevronDown, GraduationCap, Building2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { publicService, CollegeDepartmentItem } from "../services/publicService";
import { toast } from "sonner";

export function RegistrationPage() {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  const [collegesList, setCollegesList] = useState<CollegeDepartmentItem[]>([]);
  const [programsList, setProgramsList] = useState<string[]>([]);

  // Form State - Clean Real Defaults
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    studentId: "",
    college: "",
    department: "",
    program: "Undergraduate Regular",
    password: "",
    confirmPassword: "",
  });

  // Fetch real university colleges & departments
  useEffect(() => {
    publicService.getCollegesAndDepartments()
      .then((res) => {
        if (res.colleges && res.colleges.length > 0) {
          setCollegesList(res.colleges);
          const firstCollege = res.colleges[0];
          setFormData((prev) => ({
            ...prev,
            college: prev.college || firstCollege.college,
            department: prev.department || firstCollege.departments[0] || "",
          }));
        }
        if (res.programs && res.programs.length > 0) {
          setProgramsList(res.programs);
        }
      })
      .catch((err) => {
        console.error("Failed to load academic structure:", err);
      });
  }, []);

  const currentCollege = collegesList.find((c) => c.college === formData.college);
  const availableDepartments = currentCollege?.departments || [];

  const handleCollegeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCollegeName = e.target.value;
    const foundCollege = collegesList.find((c) => c.college === selectedCollegeName);
    setFormData({
      ...formData,
      college: selectedCollegeName,
      department: foundCollege?.departments[0] || "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
        toast.error("Please fill in all required personal details.");
        return;
      }
    } else if (step === 2) {
      if (!formData.studentId.trim() || !formData.college || !formData.department) {
        toast.error("Please provide your Student ID, College, and Department.");
        return;
      }
    } else if (step === 3) {
      if (!formData.password || formData.password.length < 6) {
        toast.error("Password must be at least 6 characters long.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
    }
    setStep(Math.min(step + 1, totalSteps));
  };

  const prevStep = () => setStep(Math.max(step - 1, 1));

  const handleComplete = async () => {
    setLoading(true);
    try {
      const payload = {
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        studentId: formData.studentId.trim().toUpperCase(),
        college: formData.college,
        department: formData.department,
        program: formData.program,
        phone: formData.phone.trim(),
      };

      const user = await register(payload);
      toast.success(`Account registered successfully! Welcome ${user.name}`);
      navigate("/student");
    } catch (err: any) {
      toast.error(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center py-12 px-4 bg-slate-50">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Progress Header */}
          <div className="border-b border-slate-200 px-8 py-6 bg-slate-50/50">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Create Student Account</h1>
            <p className="text-slate-500 text-sm mb-6">Complete your registration with real university records to begin digital clearance.</p>
            
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 rounded-full" />
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
              />
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i}
                  className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    i < step ? "bg-blue-600 text-white" : 
                    i === step ? "bg-white border-2 border-blue-600 text-blue-600" : 
                    "bg-white border-2 border-slate-200 text-slate-400"
                  }`}
                >
                  {i < step ? <Check className="w-4 h-4" /> : i}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs font-medium text-slate-400 px-1">
              <span className={step >= 1 ? "text-slate-900 font-semibold" : ""}>Personal</span>
              <span className={step >= 2 ? "text-slate-900 font-semibold" : ""}>Academic</span>
              <span className={step >= 3 ? "text-slate-900 font-semibold" : ""}>Security</span>
              <span className={step >= 4 ? "text-slate-900 font-semibold" : ""}>Finish</span>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Personal Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <label className="text-sm font-medium text-slate-900">First Name <span className="text-red-500">*</span></label>
                    <Input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="e.g. Bayya" required />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <label className="text-sm font-medium text-slate-900">Last / Father Name <span className="text-red-500">*</span></label>
                    <Input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="e.g. Awel" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">University / Personal Email <span className="text-red-500">*</span></label>
                  <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="e.g. student@mwu.edu.et" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">Phone Number <span className="text-red-500">*</span></label>
                  <Input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g. 0912345678" required />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Academic Information</h2>
                <p className="text-xs text-slate-500 mb-4">Select your registered faculty and department from the university records.</p>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">Student ID Number <span className="text-red-500">*</span></label>
                  <Input name="studentId" value={formData.studentId} onChange={handleChange} placeholder="e.g. Ugr/51234/15" required />
                </div>

                {/* College / Faculty Dropdown with Dropdown Icon */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">College / Faculty <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select
                      name="college"
                      value={formData.college}
                      onChange={handleCollegeChange}
                      required
                      className="w-full h-11 pl-3 pr-10 border border-slate-300 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-slate-900 shadow-sm cursor-pointer"
                    >
                      {collegesList.map((col) => (
                        <option key={col.college} value={col.college}>
                          {col.college}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Department Dropdown with Dropdown Icon */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">Department <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                      className="w-full h-11 pl-3 pr-10 border border-slate-300 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-slate-900 shadow-sm cursor-pointer"
                    >
                      {availableDepartments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Program Selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">Academic Program <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select
                      name="program"
                      value={formData.program}
                      onChange={handleChange}
                      required
                      className="w-full h-11 pl-3 pr-10 border border-slate-300 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-slate-900 shadow-sm cursor-pointer"
                    >
                      {(programsList.length > 0 ? programsList : [
                        "Undergraduate Regular",
                        "Undergraduate Extension (Evening)",
                        "Undergraduate Weekend",
                        "Undergraduate Summer (Kiremt)",
                        "Postgraduate Regular (Master's)",
                        "Postgraduate Weekend (Master's)",
                        "Doctoral Program (PhD)"
                      ]).map((prog) => (
                        <option key={prog} value={prog}>
                          {prog}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Security Password</h2>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">Password <span className="text-red-500">*</span></label>
                  <Input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">Confirm Password <span className="text-red-500">*</span></label>
                  <Input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" required />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Review & Confirm</h2>
                <p className="text-sm text-slate-500 mb-4">Confirm your details below to create your official MWU clearance account.</p>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-sm space-y-3 text-slate-700">
                  <p><strong>Full Name:</strong> {formData.firstName} {formData.lastName}</p>
                  <p><strong>Email Address:</strong> {formData.email}</p>
                  <p><strong>Phone Number:</strong> {formData.phone}</p>
                  <p><strong>Student ID:</strong> {formData.studentId}</p>
                  <p><strong>College / Faculty:</strong> {formData.college}</p>
                  <p><strong>Department:</strong> {formData.department}</p>
                  <p><strong>Academic Program:</strong> {formData.program}</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="border-t border-slate-200 px-8 py-6 bg-slate-50/50 flex justify-between items-center">
            {step > 1 ? (
              <Button variant="ghost" onClick={prevStep} className="text-slate-600">
                Previous
              </Button>
            ) : (
              <div />
            )}
            
            {step < totalSteps ? (
              <Button onClick={nextStep} className="bg-blue-600 text-white hover:bg-blue-700 ml-auto">
                Next Step
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleComplete} isLoading={loading} className="bg-emerald-600 text-white hover:bg-emerald-700 ml-auto">
                Complete Registration
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
