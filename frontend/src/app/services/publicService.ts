import api from "./api";

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
  async verifyCertificate(query: string): Promise<{
    success: boolean;
    isValid: boolean;
    certificate?: VerifiedCertificateData;
    message?: string;
  }> {
    return api.get(`/public/verify/${encodeURIComponent(query.trim())}`);
  },
};
