import api from "./api";
import { ClearanceRequest } from "./clearanceService";

export interface OfficerDashboardData {
  success: boolean;
  stats: {
    department: string;
    pendingCount: number;
    approvedCount: number;
    rejectedCount: number;
    holdCount: number;
    totalAssigned: number;
    approvalRate: number;
    avgTurnaroundHours: number;
  };
  recentRequests: Array<{
    _id: string;
    requestId: string;
    studentName: string;
    studentId: string;
    department: string;
    clearanceType: string;
    status: string;
    submittedAt: string;
    reviewedAt?: string;
  }>;
}

export interface OfficerQueueItem {
  _id: string;
  requestId: string;
  student: string;
  studentName: string;
  studentId: string;
  department: string;
  college: string;
  program: string;
  clearanceType: string;
  reason?: string;
  documents: Array<{ name: string; url: string; fileSize?: string }>;
  departmentStatus: "pending" | "approved" | "rejected" | "hold" | "not_started";
  itemsChecked: Array<{ name: string; status: string; remarks?: string }>;
  remarks?: string;
  rejectionReason?: string;
  reviewedAt?: string;
  reviewedByName?: string;
  submittedAt: string;
  contactDetails?: { phone?: string; email?: string };
  academicDetails?: { cgpa?: number; advisorName?: string };
}

export const officerService = {
  async getDashboard(): Promise<OfficerDashboardData> {
    return api.get<OfficerDashboardData>("/officer/dashboard");
  },

  async getQueue(status: "pending" | "approved" | "rejected" | "all" = "all"): Promise<{
    success: boolean;
    count: number;
    requests: OfficerQueueItem[];
  }> {
    return api.get("/officer/queue", { status });
  },

  async reviewClearance(
    id: string,
    data: {
      action: "approve" | "reject" | "hold";
      remarks?: string;
      rejectionReason?: string;
      itemsChecked?: Array<{ name: string; status: string; remarks?: string }>;
    }
  ): Promise<{ success: boolean; message: string; clearance: ClearanceRequest }> {
    return api.put(`/officer/clearances/${id}/review`, data);
  },

  async getStudents(search?: string): Promise<{ success: boolean; students: any[] }> {
    return api.get("/officer/students", { search });
  },
};
