import api from "./api";
import { ClearanceRequest } from "./clearanceService";
import { UserProfile } from "./authService";

export interface RegistrarDashboardStats {
  totalStudents: number;
  totalOfficers: number;
  totalDepartments: number;
  totalClearances: number;
  pendingClearances: number;
  readyForFinalApproval: number;
  completedClearances: number;
  rejectedClearances: number;
  approvalRate: number;
  averageProcessingDays: number;
}

export interface RegistrarDashboardData {
  success: boolean;
  stats: RegistrarDashboardStats;
  charts: {
    byType: Array<{ name: string; count: number }>;
  };
  recentRequests: ClearanceRequest[];
  recentActivities: Array<{
    _id: string;
    userName: string;
    userRole: string;
    userDepartment?: string;
    action: string;
    targetId?: string;
    details?: string;
    createdAt: string;
  }>;
  departmentPerformance: Array<{
    name: string;
    code: string;
    approved: number;
    pending: number;
    avgHours: number;
  }>;
}

export interface DepartmentItem {
  _id: string;
  name: string;
  code: string;
  category: string;
  description?: string;
  contactEmail?: string;
  officeLocation?: string;
  phone?: string;
  headOfficer?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  isActive: boolean;
  averageProcessingHours: number;
}

export interface WorkflowItem {
  _id: string;
  clearanceType: string;
  title: string;
  description?: string;
  isActive: boolean;
  targetAudience?: string;
  steps: Array<{
    stepNumber: number;
    departmentName: string;
    departmentCode: string;
    isRequired: boolean;
    instructions?: string;
    requiredChecklist: Array<{ item: string; isMandatory: boolean }>;
  }>;
}

export const registrarService = {
  async getDashboard(): Promise<RegistrarDashboardData> {
    return api.get<RegistrarDashboardData>("/registrar/dashboard");
  },

  async getAllClearances(params?: {
    status?: string;
    type?: string;
    search?: string;
  }): Promise<{ success: boolean; count: number; clearances: ClearanceRequest[] }> {
    return api.get("/registrar/clearances", params);
  },

  async finalApprove(id: string, remarks?: string): Promise<{ success: boolean; clearance: ClearanceRequest }> {
    return api.put(`/registrar/clearances/${id}/final-approve`, { remarks });
  },

  async rejectClearance(id: string, reason: string): Promise<{ success: boolean; clearance: ClearanceRequest }> {
    return api.put(`/registrar/clearances/${id}/reject`, { reason });
  },

  async getCertificates(): Promise<{ success: boolean; certificates: any[] }> {
    return api.get("/registrar/certificates");
  },

  // Users
  async getUsers(params?: { role?: string; search?: string }): Promise<{ success: boolean; count: number; users: UserProfile[] }> {
    return api.get("/registrar/users", params);
  },

  async createUser(data: any): Promise<{ success: boolean; user: UserProfile }> {
    return api.post("/registrar/users", data);
  },

  async updateUser(id: string, data: any): Promise<{ success: boolean; user: UserProfile }> {
    return api.put(`/registrar/users/${id}`, data);
  },

  async deleteUser(id: string): Promise<{ success: boolean; message: string }> {
    return api.delete(`/registrar/users/${id}`);
  },

  // Departments
  async getDepartments(): Promise<{ success: boolean; departments: DepartmentItem[] }> {
    return api.get("/registrar/departments");
  },

  async createDepartment(data: any): Promise<{ success: boolean; department: DepartmentItem }> {
    return api.post("/registrar/departments", data);
  },

  async updateDepartment(id: string, data: any): Promise<{ success: boolean; department: DepartmentItem }> {
    return api.put(`/registrar/departments/${id}`, data);
  },

  async deleteDepartment(id: string): Promise<{ success: boolean; message: string }> {
    return api.delete(`/registrar/departments/${id}`);
  },

  // Workflows
  async getWorkflows(): Promise<{ success: boolean; workflows: WorkflowItem[] }> {
    return api.get("/registrar/workflows");
  },

  async saveWorkflow(data: any): Promise<{ success: boolean; workflow: WorkflowItem }> {
    return api.post("/registrar/workflows", data);
  },

  // Audit logs
  async getAuditLogs(params?: { action?: string; search?: string }): Promise<{ success: boolean; count: number; logs: any[] }> {
    return api.get("/registrar/audit-logs", params);
  },
};
