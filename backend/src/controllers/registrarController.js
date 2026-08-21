import QRCode from "qrcode";
import crypto from "crypto";
import { Clearance } from "../models/Clearance.js";
import { User } from "../models/User.js";
import { Department } from "../models/Department.js";
import { Workflow } from "../models/Workflow.js";
import { Notification } from "../models/Notification.js";
import { AuditLog } from "../models/AuditLog.js";
import { sendEmail } from "../utils/mailer.js";

// @desc    Get executive registrar dashboard metrics
// @route   GET /api/registrar/dashboard
// @access  Private (Registrar)
export const getRegistrarDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalOfficers = await User.countDocuments({ role: "officer" });
    const totalDepartments = await Department.countDocuments({ isActive: true });

    const totalClearances = await Clearance.countDocuments();
    const pendingClearances = await Clearance.countDocuments({
      status: { $in: ["pending", "in_progress"] },
    });
    const readyForFinalApproval = await Clearance.countDocuments({ status: "approved" });
    const completedClearances = await Clearance.countDocuments({ status: "completed" });
    const rejectedClearances = await Clearance.countDocuments({ status: "rejected" });

    // Clearance Type Breakdown
    const typeGraduation = await Clearance.countDocuments({ clearanceType: "graduation" });
    const typeWithdrawal = await Clearance.countDocuments({ clearanceType: "withdrawal" });
    const typeTransfer = await Clearance.countDocuments({ clearanceType: "transfer" });
    const typeDismissal = await Clearance.countDocuments({ clearanceType: "dismissal" });
    const typeStaff = await Clearance.countDocuments({ clearanceType: "staff" });

    // Recent Clearances
    const recentRequests = await Clearance.find().sort({ createdAt: -1 }).limit(8);

    // Recent Audit Activities
    const recentActivities = await AuditLog.find().sort({ createdAt: -1 }).limit(10);

    // Department Performance
    const departments = await Department.find({ isActive: true });
    const departmentPerformance = await Promise.all(
      departments.map(async (dept) => {
        const approvedCount = await Clearance.countDocuments({
          "departmentApprovals.departmentName": dept.name,
          "departmentApprovals.status": "approved",
        });
        const pendingCount = await Clearance.countDocuments({
          "departmentApprovals.departmentName": dept.name,
          "departmentApprovals.status": "pending",
        });
        return {
          name: dept.name,
          code: dept.code,
          approved: approvedCount,
          pending: pendingCount,
          avgHours: dept.averageProcessingHours || 24,
        };
      })
    );

    return res.json({
      success: true,
      stats: {
        totalStudents,
        totalOfficers,
        totalDepartments,
        totalClearances,
        pendingClearances,
        readyForFinalApproval,
        completedClearances,
        rejectedClearances,
        approvalRate:
          totalClearances > 0
            ? Math.round((completedClearances / totalClearances) * 100)
            : 100,
        averageProcessingDays: 3.2,
      },
      charts: {
        byType: [
          { name: "Graduation", count: typeGraduation },
          { name: "Withdrawal", count: typeWithdrawal },
          { name: "Transfer", count: typeTransfer },
          { name: "Dismissal", count: typeDismissal },
          { name: "Staff", count: typeStaff },
        ],
      },
      recentRequests,
      recentActivities,
      departmentPerformance,
    });
  } catch (error) {
    console.error("Registrar Dashboard Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all clearances with filters
// @route   GET /api/registrar/clearances
// @access  Private (Registrar)
export const getAllClearances = async (req, res) => {
  try {
    const { status, type, search } = req.query;
    const query = {};

    if (status && status !== "all") {
      query.status = status;
    }
    if (type && type !== "all") {
      query.clearanceType = type;
    }
    if (search) {
      query.$or = [
        { studentName: { $regex: search, $options: "i" } },
        { studentId: { $regex: search, $options: "i" } },
        { requestId: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
      ];
    }

    const clearances = await Clearance.find(query).sort({ createdAt: -1 });

    return res.json({ success: true, count: clearances.length, clearances });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Final registrar approval & certificate generation
// @route   PUT /api/registrar/clearances/:id/final-approve
// @access  Private (Registrar)
export const finalApproveClearance = async (req, res) => {
  try {
    const { id } = req.params;
    const { remarks } = req.body;
    const registrar = req.user;

    const clearance = await Clearance.findById(id);
    if (!clearance) {
      return res.status(404).json({ success: false, message: "Clearance not found" });
    }

    const certNumber = `MWU-CLR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const blockchainHash = `0x${crypto.randomBytes(20).toString("hex")}`;

    // Generate QR Code
    const verifyUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/verify?cert=${certNumber}`;
    const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, { width: 250, margin: 2 });

    clearance.status = "completed";
    clearance.finalApproval = {
      approvedBy: registrar._id,
      approvedByName: registrar.name,
      approvedAt: new Date(),
      remarks: remarks || "Officially verified and approved by University Registrar.",
    };
    clearance.certificate = {
      certNumber,
      qrCode: qrCodeDataUrl,
      issuedAt: new Date(),
      blockchainHash,
      isValid: true,
    };

    clearance.auditTrail.push({
      action: "FINAL_REGISTRAR_APPROVAL",
      performedBy: registrar.name,
      role: "registrar",
      details: `Clearance finalized and Certificate #${certNumber} generated.`,
    });

    await clearance.save();

    // Create student notification
    await Notification.create({
      recipient: clearance.student,
      title: "🎉 Clearance Completed & Certificate Issued!",
      message: `Congratulations! Your university clearance is complete. Certificate #${certNumber} has been issued.`,
      type: "success",
      link: "/student/certificate",
    });

    // Send email to student
    sendEmail({
      to: clearance.contactDetails.email,
      subject: `MWU Clearance Completed - Certificate #${certNumber}`,
      html: `<h2>Official Clearance Certificate Issued</h2>
             <p>Dear ${clearance.studentName},</p>
             <p>Your exit clearance at Madda Walabu University has received final approval from the Office of the Registrar.</p>
             <p><strong>Certificate Number:</strong> ${certNumber}</p>
             <p>You can now download and print your official signed certificate from your student portal or verify it anytime at our public portal.</p>`,
    });

    // Record audit log
    await AuditLog.create({
      user: registrar._id,
      userName: registrar.name,
      userRole: "registrar",
      action: "CLEARANCE_COMPLETED",
      targetId: clearance.requestId,
      details: `Certificate ${certNumber} issued to student ${clearance.studentName} (${clearance.studentId})`,
      ipAddress: req.ip || "127.0.0.1",
    });

    return res.json({
      success: true,
      message: "Clearance approved and certificate generated successfully",
      clearance,
    });
  } catch (error) {
    console.error("Final Approve Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject clearance by registrar
// @route   PUT /api/registrar/clearances/:id/reject
// @access  Private (Registrar)
export const rejectClearance = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, remarks } = req.body;
    const registrar = req.user;

    const clearance = await Clearance.findById(id);
    if (!clearance) {
      return res.status(404).json({ success: false, message: "Clearance not found" });
    }

    clearance.status = "rejected";
    clearance.auditTrail.push({
      action: "REGISTRAR_REJECTED",
      performedBy: registrar.name,
      role: "registrar",
      details: `Registrar rejected clearance: ${reason || remarks || "Requirements not met"}`,
    });

    await clearance.save();

    await Notification.create({
      recipient: clearance.student,
      title: "Clearance Application Rejected",
      message: `Your clearance application was rejected by the Registrar. Reason: ${reason || remarks}`,
      type: "error",
      link: "/student/clearance",
    });

    return res.json({ success: true, message: "Clearance rejected", clearance });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all generated certificates
// @route   GET /api/registrar/certificates
// @access  Private (Registrar)
export const getCertificates = async (req, res) => {
  try {
    const clearances = await Clearance.find({
      status: "completed",
      "certificate.certNumber": { $exists: true },
    }).sort({ "certificate.issuedAt": -1 });

    const certificates = clearances.map((c) => ({
      _id: c._id,
      certNumber: c.certificate.certNumber,
      requestId: c.requestId,
      studentName: c.studentName,
      studentId: c.studentId,
      department: c.department,
      clearanceType: c.clearanceType,
      issuedAt: c.certificate.issuedAt,
      blockchainHash: c.certificate.blockchainHash,
      qrCode: c.certificate.qrCode,
      status: c.certificate.isValid ? "Valid" : "Revoked",
    }));

    return res.json({ success: true, certificates });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get users list
// @route   GET /api/registrar/users
// @access  Private (Registrar)
export const getUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    const query = {};

    if (role && role !== "all") {
      query.role = role;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { studentId: { $regex: search, $options: "i" } },
        { staffId: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query).select("-password").sort({ createdAt: -1 });

    return res.json({ success: true, count: users.length, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new user by registrar/admin
// @route   POST /api/registrar/users
// @access  Private (Registrar)
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, department, college, studentId, staffId, phone } =
      req.body;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: "User email already exists" });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: password || "Mwu@12345",
      role: role || "student",
      department: department || "General",
      college: college || "College of Computing",
      studentId: studentId || (role === "student" ? `UGR/${Math.floor(1000 + Math.random() * 9000)}/16` : undefined),
      staffId: staffId || (role !== "student" ? `EMP/${Math.floor(100 + Math.random() * 900)}` : undefined),
      phone: phone || "",
      status: "Active",
    });

    await AuditLog.create({
      user: req.user._id,
      userName: req.user.name,
      userRole: "registrar",
      action: "USER_CREATED",
      details: `Created new user ${user.name} with role ${user.role}`,
      ipAddress: req.ip || "127.0.0.1",
    });

    return res.status(201).json({ success: true, message: "User created successfully", user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/registrar/users/:id
// @access  Private (Registrar)
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { name, email, role, department, status, phone } = req.body;
    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (role) user.role = role;
    if (department) user.department = department;
    if (status) user.status = status;
    if (phone) user.phone = phone;

    await user.save();

    return res.json({ success: true, message: "User updated successfully", user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete or deactivate user
// @route   DELETE /api/registrar/users/:id
// @access  Private (Registrar)
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get departments
// @route   GET /api/registrar/departments
// @access  Private (Registrar, Officer)
export const getStaffDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate("headOfficer", "name email phone");
    return res.json({ success: true, departments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create department
// @route   POST /api/registrar/departments
// @access  Private (Registrar)
export const createDepartment = async (req, res) => {
  try {
    const { name, code, category, description, contactEmail, officeLocation, phone, headOfficer } =
      req.body;

    const department = await Department.create({
      name,
      code,
      category,
      description,
      contactEmail,
      officeLocation,
      phone,
      headOfficer: headOfficer || undefined,
    });

    return res.status(201).json({ success: true, department });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update department
// @route   PUT /api/registrar/departments/:id
// @access  Private (Registrar)
export const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.json({ success: true, department });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete department
// @route   DELETE /api/registrar/departments/:id
// @access  Private (Registrar)
export const deleteDepartment = async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: "Department deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get workflows
// @route   GET /api/registrar/workflows
// @access  Private (Registrar, Student)
export const getWorkflows = async (req, res) => {
  try {
    const workflows = await Workflow.find();
    return res.json({ success: true, workflows });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Save/Update workflow
// @route   POST /api/registrar/workflows
// @access  Private (Registrar)
export const saveWorkflow = async (req, res) => {
  try {
    const { clearanceType, title, description, steps, requiredDocuments } = req.body;
    let workflow = await Workflow.findOne({ clearanceType });

    if (workflow) {
      workflow.title = title || workflow.title;
      workflow.description = description || workflow.description;
      if (steps) workflow.steps = steps;
      if (requiredDocuments) workflow.requiredDocuments = requiredDocuments;
      await workflow.save();
    } else {
      workflow = await Workflow.create(req.body);
    }

    return res.json({ success: true, message: "Workflow saved successfully", workflow });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get audit logs
// @route   GET /api/registrar/audit-logs
// @access  Private (Registrar)
export const getAuditLogs = async (req, res) => {
  try {
    const { action, search } = req.query;
    const query = {};

    if (action && action !== "all") query.action = action;
    if (search) {
      query.$or = [
        { userName: { $regex: search, $options: "i" } },
        { userDepartment: { $regex: search, $options: "i" } },
        { action: { $regex: search, $options: "i" } },
        { targetId: { $regex: search, $options: "i" } },
      ];
    }

    const logs = await AuditLog.find(query).sort({ createdAt: -1 }).limit(100);

    return res.json({ success: true, count: logs.length, logs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
