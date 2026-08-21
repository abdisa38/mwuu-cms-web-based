import api from "./api";

export interface DepartmentApproval {
  _id?: string;
  departmentName: string;
  departmentCode: string;
  status: "pending" | "approved" | "rejected" | "hold" | "not_started";
  reviewedBy?: string;
  reviewedByName?: string;
  reviewedAt?: string;
  remarks?: string;
  rejectionReason?: string;
  itemsChecked?: Array<{
    name: string;
    status: string;
    remarks?: string;
  }>;
}

export interface ClearanceDocument {
  _id?: string;
  name: string;
  url: string;
  publicId?: string;
  fileSize: string;
  fileType: string;
  status: string;
  uploadedAt: string;
}

export interface ClearanceRequest {
  _id: string;
  requestId: string;
  student: string;
  studentName: string;
  studentId: string;
  department: string;
  college: string;
  program: string;
  clearanceType: "graduation" | "withdrawal" | "transfer" | "dismissal" | "staff";
  reason?: string;
  contactDetails: {
    phone?: string;
    email?: string;
    emergencyContactName?: string;
    emergencyPhone?: string;
    currentAddress?: string;
  };
  academicDetails: {
    admissionYear?: string;
    expectedGraduation?: string;
    currentSemester?: string;
    cgpa?: number;
    advisorName?: string;
  };
  documents: ClearanceDocument[];
  departmentApprovals: DepartmentApproval[];
  status: "pending" | "in_progress" | "approved" | "rejected" | "completed" | "cancelled";
  finalApproval?: {
    approvedBy?: string;
    approvedByName?: string;
    approvedAt?: string;
    remarks?: string;
  };
  certificate?: {
    certNumber?: string;
    qrCode?: string;
    issuedAt?: string;
    blockchainHash?: string;
    isValid?: boolean;
  };
  auditTrail?: Array<{
    action: string;
    performedBy: string;
    role: string;
    timestamp: string;
    details?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export const clearanceService = {
  async submitClearance(formData: FormData): Promise<{ success: boolean; clearance: ClearanceRequest }> {
    return api.post<{ success: boolean; clearance: ClearanceRequest }>("/clearances", formData, true);
  },

  async getMyClearances(): Promise<{ success: boolean; count: number; clearances: ClearanceRequest[] }> {
    return api.get<{ success: boolean; count: number; clearances: ClearanceRequest[] }>("/clearances/my");
  },

  async getMyActiveClearance(): Promise<{ success: boolean; clearance: ClearanceRequest | null }> {
    return api.get<{ success: boolean; clearance: ClearanceRequest | null }>("/clearances/my/active");
  },

  async getClearanceById(id: string): Promise<{ success: boolean; clearance: ClearanceRequest }> {
    return api.get<{ success: boolean; clearance: ClearanceRequest }>(`/clearances/${id}`);
  },

  async cancelClearance(id: string): Promise<{ success: boolean; message: string; clearance: ClearanceRequest }> {
    return api.put<{ success: boolean; message: string; clearance: ClearanceRequest }>(`/clearances/${id}/cancel`);
  },
};
