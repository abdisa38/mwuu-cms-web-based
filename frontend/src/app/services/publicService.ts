import api from "./api";

export interface CollegeDepartmentItem {
  college: string;
  departments: string[];
}

export interface FaqCategory {
  category: string;
  questions: Array<{
    q: string;
    a: string;
  }>;
}

export interface VerifiedCertificateData {
  certNumber: string;
  requestId: string;
  studentName: string;
  studentId: string;
  department: string;
  college: string;
  program: string;
  clearanceType: string;
  issuedAt: string;
  blockchainHash: string;
  qrCode?: string;
  approvedByName?: string;
  departmentApprovals: Array<{
    name: string;
    status: string;
    reviewedByName?: string;
    reviewedAt?: string;
  }>;
}

export const publicService = {
  async getCollegesAndDepartments(): Promise<{
    success: boolean;
    colleges: CollegeDepartmentItem[];
    programs: string[];
    clearanceDesks?: Array<{ name: string; code: string }>;
  }> {
    return api.get("/public/colleges-departments");
  },

  async getFaqs(): Promise<{
    success: boolean;
    faqs: FaqCategory[];
  }> {
    return api.get("/public/faqs");
  },

  async verifyCertificate(query: string): Promise<{
    success: boolean;
    isValid: boolean;
    certificate?: VerifiedCertificateData;
    message?: string;
  }> {
    return api.get(`/public/verify/${encodeURIComponent(query.trim())}`);
  },
};
