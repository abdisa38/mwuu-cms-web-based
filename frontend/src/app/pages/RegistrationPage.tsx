import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { ArrowLeft, ArrowRight, Check, UploadCloud } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export function RegistrationPage() {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    studentId: "",
    college: "College of Computing",
    department: "Computer Science",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email) {
        toast.error("Please fill in all personal details.");
        return;
      }
    } else if (step === 2) {
      if (!formData.studentId || !formData.department) {
        toast.error("Please provide your student ID and department.");
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
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
        studentId: formData.studentId,
        department: formData.department,
        college: formData.college,
        phone: formData.phone,
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
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Create an account</h1>
            <p className="text-slate-500 text-sm mb-6">Complete your registration to start the clearance process.</p>
            
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
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Personal Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <label className="text-sm font-medium text-slate-900">First Name <span className="text-red-500">*</span></label>
                    <Input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" required />
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <label className="text-sm font-medium text-slate-900">Last Name <span className="text-red-500">*</span></label>
                    <Input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">Personal Email <span className="text-red-500">*</span></label>
                  <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john.doe@example.com" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">Phone Number</label>
                  <Input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+251 91 234 5678" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Academic Information</h2>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">Student ID <span className="text-red-500">*</span></label>
                  <Input name="studentId" value={formData.studentId} onChange={handleChange} placeholder="e.g. UGR/1234/12" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">College / Faculty</label>
                  <Input name="college" value={formData.college} onChange={handleChange} placeholder="College of Computing" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">Department <span className="text-red-500">*</span></label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Systems">Information Systems</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Medicine">Medicine & Health Science</option>
                  </select>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Security</h2>
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
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Review & Submit</h2>
                <p className="text-sm text-slate-500 mb-4">Confirm your details below to create your student clearance account.</p>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm space-y-2 text-slate-700">
                  <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                  <p><strong>Email:</strong> {formData.email}</p>
                  <p><strong>Student ID:</strong> {formData.studentId}</p>
                  <p><strong>Department:</strong> {formData.department} ({formData.college})</p>
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
              <Button onClick={nextStep} className="bg-slate-900 text-white hover:bg-slate-800 ml-auto">
                Next Step
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleComplete} isLoading={loading} className="bg-blue-600 text-white hover:bg-blue-700 ml-auto">
                Complete Registration
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
