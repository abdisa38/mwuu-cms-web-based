import api from "./api";

export interface UserProfile {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: "student" | "officer" | "registrar" | "admin";
  studentId?: string;
  staffId?: string;
  department?: string;
  college?: string;
  program?: string;
  phone?: string;
  avatar?: string;
  status?: string;
  academicInfo?: {
    admissionYear?: string;
    expectedGraduation?: string;
    currentSemester?: string;
    cgpa?: number;
    advisor?: string;
  };
  emergencyContact?: {
    name?: string;
    phone?: string;
    address?: string;
  };
  lastLogin?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token: string;
  user: UserProfile;
}

export const authService = {
  async login(identifier: string, password: string): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>("/auth/login", { identifier, password });
    if (res.token) {
      localStorage.setItem("mwu_token", res.token);
      localStorage.setItem("mwu_user", JSON.stringify(res.user));
    }
    return res;
  },

  async register(data: {
    name: string;
    email: string;
    password: string;
    studentId?: string;
    department?: string;
    college?: string;
    phone?: string;
    program?: string;
  }): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>("/auth/register", data);
    if (res.token) {
      localStorage.setItem("mwu_token", res.token);
      localStorage.setItem("mwu_user", JSON.stringify(res.user));
    }
    return res;
  },

  async getMe(): Promise<{ success: boolean; user: UserProfile }> {
    const res = await api.get<{ success: boolean; user: UserProfile }>("/auth/me");
    if (res.user) {
      localStorage.setItem("mwu_user", JSON.stringify(res.user));
    }
    return res;
  },

  async updateProfile(data: Partial<UserProfile>): Promise<{ success: boolean; user: UserProfile }> {
    const res = await api.put<{ success: boolean; user: UserProfile }>("/auth/profile", data);
    if (res.user) {
      localStorage.setItem("mwu_user", JSON.stringify(res.user));
    }
    return res;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return api.put("/auth/change-password", { currentPassword, newPassword });
  },

  logout(): void {
    localStorage.removeItem("mwu_token");
    localStorage.removeItem("mwu_user");
  },

  getCurrentUser(): UserProfile | null {
    const stored = localStorage.getItem("mwu_user");
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },

  getToken(): string | null {
    return localStorage.getItem("mwu_token");
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("mwu_token");
  },
};
