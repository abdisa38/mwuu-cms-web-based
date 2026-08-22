import { Clearance } from "../models/Clearance.js";
import { User } from "../models/User.js";
import { Notification } from "../models/Notification.js";
import { AuditLog } from "../models/AuditLog.js";
import { sendEmail } from "../utils/mailer.js";

// Helper to determine officer's department matching filter
const getOfficerDeptRegex = (user) => {
  const dept = user.department || "Library";
  if (dept.toLowerCase().includes("head") || dept.toLowerCase().includes("dept")) {
    return new RegExp("^(Department Head|DEPT)$", "i");
  }
  return new RegExp(`^${dept}$`, "i");
};

// @desc    Get officer dashboard metrics
// @route   GET /api/officer/dashboard
// @access  Private (Officer, Registrar)
export const getOfficerDashboard = async (req, res) => {
  try {
    const dept = req.user.department || "Library";
    const deptRegex = getOfficerDeptRegex(req.user);

    const allClearances = await Clearance.find({
      "departmentApprovals.departmentName": { $regex: deptRegex },
    });

    let pendingCount = 0;
    let approvedCount = 0;
    let rejectedCount = 0;
    let holdCount = 0;

    const recentRequests = [];

    allClearances.forEach((clr) => {
      const deptAppr = clr.departmentApprovals.find(
        (a) => deptRegex.test(a.departmentName)
      );
      if (deptAppr) {
        if (deptAppr.status === "pending") pendingCount++;
        else if (deptAppr.status === "approved") approvedCount++;
        else if (deptAppr.status === "rejected") rejectedCount++;
        else if (deptAppr.status === "hold") holdCount++;

        recentRequests.push({
          _id: clr._id,
          requestId: clr.requestId,
          studentName: clr.studentName,
          studentId: clr.studentId,
          department: clr.department,
          clearanceType: clr.clearanceType,
          status: deptAppr.status,
          submittedAt: clr.createdAt,
          reviewedAt: deptAppr.reviewedAt,
        });
      }
    });

    // Sort recent requests
    recentRequests.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    const totalProcessed = approvedCount + rejectedCount;
    const approvalRate =
      totalProcessed > 0 ? Math.round((approvedCount / totalProcessed) * 100) : 100;

    return res.json({
      success: true,
      stats: {
        department: dept,
        pendingCount,
        approvedCount,
        rejectedCount,
        holdCount,
        totalAssigned: allClearances.length,
        approvalRate,
        avgTurnaroundHours: 18.5,
      },
      recentRequests: recentRequests.slice(0, 10),
    });
  } catch (error) {
    console.error("Officer Dashboard Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get department clearance queue (pending, approved, rejected)
// @route   GET /api/officer/queue
// @access  Private (Officer)
export const getDepartmentQueue = async (req, res) => {
  try {
    const dept = req.user.department || "Library";
    const deptRegex = getOfficerDeptRegex(req.user);
    const { status } = req.query; // pending, approved, rejected, or all

    const query = {
      "departmentApprovals.departmentName": { $regex: deptRegex },
    };

    if (status && status !== "all") {
      query["departmentApprovals"] = {
        $elemMatch: {
          departmentName: { $regex: deptRegex },
          status: status,
        },
      };
    }

    const clearances = await Clearance.find(query).sort({ createdAt: -1 });

    const formattedList = clearances.map((clr) => {
      const deptAppr = clr.departmentApprovals.find(
        (a) => deptRegex.test(a.departmentName)
      );
      return {
        _id: clr._id,
        requestId: clr.requestId,
        student: clr.student,
        studentName: clr.studentName,
        studentId: clr.studentId,
        department: clr.department,
        college: clr.college,
        program: clr.program,
        clearanceType: clr.clearanceType,
        reason: clr.reason,
        documents: clr.documents,
        departmentStatus: deptAppr ? deptAppr.status : "pending",
        itemsChecked: deptAppr ? deptAppr.itemsChecked : [],
        remarks: deptAppr ? deptAppr.remarks : "",
        rejectionReason: deptAppr ? deptAppr.rejectionReason : "",
        reviewedAt: deptAppr ? deptAppr.reviewedAt : null,
        reviewedByName: deptAppr ? deptAppr.reviewedByName : "",
        submittedAt: clr.createdAt,
        contactDetails: clr.contactDetails,
        academicDetails: clr.academicDetails,
      };
    });

    return res.json({
      success: true,
      count: formattedList.length,
      requests: formattedList,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Review clearance (Approve, Reject, or Hold)
// @route   PUT /api/officer/clearances/:id/review
// @access  Private (Officer)
export const reviewClearance = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, remarks, rejectionReason, itemsChecked } = req.body; // action: 'approve' | 'reject' | 'hold'
    const officer = req.user;
    const dept = officer.department || "Library";
    const deptRegex = getOfficerDeptRegex(officer);

    const clearance = await Clearance.findById(id);
    if (!clearance) {
      return res.status(404).json({ success: false, message: "Clearance request not found" });
    }

    const deptApprIndex = clearance.departmentApprovals.findIndex(
      (a) => deptRegex.test(a.departmentName)
    );

    if (deptApprIndex === -1) {
      return res.status(400).json({
        success: false,
        message: `Department '${dept}' is not an active reviewer for this clearance request.`,
      });
    }

    const newStatus =
      action === "approve" ? "approved" : action === "reject" ? "rejected" : "hold";

    clearance.departmentApprovals[deptApprIndex].status = newStatus;
    clearance.departmentApprovals[deptApprIndex].reviewedBy = officer._id;
    clearance.departmentApprovals[deptApprIndex].reviewedByName = officer.name;
    clearance.departmentApprovals[deptApprIndex].reviewedAt = new Date();
    clearance.departmentApprovals[deptApprIndex].remarks = remarks || "";
    if (action === "reject") {
      clearance.departmentApprovals[deptApprIndex].rejectionReason =
        rejectionReason || "Requirements not fulfilled.";
    }
    if (itemsChecked && Array.isArray(itemsChecked)) {
      clearance.departmentApprovals[deptApprIndex].itemsChecked = itemsChecked;
    }

    // Check if all non-registrar departments are approved
    const nonRegistrarApprovals = clearance.departmentApprovals.filter(
      (a) => !a.departmentName.toLowerCase().includes("reg")
    );
    const allNonRegistrarApproved =
      nonRegistrarApprovals.length > 0 &&
      nonRegistrarApprovals.every((a) => a.status === "approved");

    const registrarApproval = clearance.departmentApprovals.find((a) =>
      a.departmentName.toLowerCase().includes("reg")
    );

    // Check overall clearance status
    const allApproved = clearance.departmentApprovals.every(
      (a) => a.status === "approved"
    );
    const anyRejected = clearance.departmentApprovals.some(
      (a) => a.status === "rejected"
    );

    if (anyRejected) {
      clearance.status = "rejected";
    } else if (allApproved) {
      clearance.status = "approved";
    } else {
      clearance.status = "in_progress";
    }

    // Audit Trail
    clearance.auditTrail.push({
      action: `DEPARTMENT_${newStatus.toUpperCase()}`,
      performedBy: officer.name,
      role: `officer (${dept})`,
      details: `${dept} department ${newStatus} request ${clearance.requestId}. Remarks: ${remarks || "None"}`,
    });

    await clearance.save();

    // Create student notification for this department action
    await Notification.create({
      recipient: clearance.student,
      title: `${dept} Clearance ${newStatus.toUpperCase()}`,
      message:
        action === "approve"
          ? `Your clearance for ${dept} has been approved by ${officer.name}.`
          : `Your clearance for ${dept} was ${newStatus}. Reason: ${rejectionReason || remarks || "See remarks."}`,
      type: action === "approve" ? "success" : "warning",
      link: "/student/clearance",
    });

    // AUTO-ANNOUNCE TO REGISTRAR IF ALL OTHER DEPARTMENTS HAVE APPROVED!
    if (action === "approve" && allNonRegistrarApproved && (!registrarApproval || registrarApproval.status === "pending")) {
      await Notification.create({
        recipientDepartment: "Registrar",
        recipientRole: "registrar",
        title: `All Departments Approved: ${clearance.requestId}`,
        message: `Clearance request ${clearance.requestId} for student ${clearance.studentName} (${clearance.studentId} - ${clearance.department}) has been approved by all 5 department checkpoints. Awaiting Final Registrar Sign-off & Certificate Issuance.`,
        type: "info",
        link: "/registrar/final-approvals",
      });

      await Notification.create({
        recipient: clearance.student,
        title: `All Department Checkpoints Cleared!`,
        message: `All university department clearance checkpoints have approved your request. It is now awaiting final Registrar verification and digital certificate release.`,
        type: "success",
        link: "/student/clearance",
      });
    }

    // Record system audit log
    await AuditLog.create({
      user: officer._id,
      userName: officer.name,
      userRole: "officer",
      userDepartment: dept,
      action: `CLEARANCE_DEPT_${newStatus.toUpperCase()}`,
      targetId: clearance.requestId,
      details: `Officer reviewed and set status to ${newStatus}`,
      ipAddress: req.ip || "127.0.0.1",
    });

    return res.json({
      success: true,
      message: `Clearance successfully marked as ${newStatus}`,
      clearance,
    });
  } catch (error) {
    console.error("Review Clearance Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get student database with department status
// @route   GET /api/officer/students
// @access  Private (Officer, Registrar)
export const getStudentDirectory = async (req, res) => {
  try {
    const { search } = req.query;
    const query = { role: "student" };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { studentId: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
      ];
    }

    const students = await User.find(query).select("-password").sort({ createdAt: -1 });

    // Attach latest clearance info
    const studentsWithClearance = await Promise.all(
      students.map(async (student) => {
        const latestClearance = await Clearance.findOne({
          student: student._id,
        }).sort({ createdAt: -1 });

        return {
          ...student.toObject(),
          activeClearance: latestClearance
            ? {
                requestId: latestClearance.requestId,
                status: latestClearance.status,
                clearanceType: latestClearance.clearanceType,
                createdAt: latestClearance.createdAt,
              }
            : null,
        };
      })
    );

    return res.json({ success: true, students: studentsWithClearance });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
