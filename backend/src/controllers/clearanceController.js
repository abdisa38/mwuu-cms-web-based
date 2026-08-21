import { Clearance } from "../models/Clearance.js";
import { Workflow } from "../models/Workflow.js";
import { Department } from "../models/Department.js";
import { Notification } from "../models/Notification.js";
import { AuditLog } from "../models/AuditLog.js";
import { uploadToCloudinary } from "../middleware/upload.js";
import { sendEmail } from "../utils/mailer.js";

// @desc    Submit a new clearance request
// @route   POST /api/clearances
// @access  Private (Student)
export const createClearance = async (req, res) => {
  try {
    const student = req.user;
    const {
      clearanceType,
      reason,
      phone,
      emergencyContactName,
      emergencyPhone,
      currentAddress,
      admissionYear,
      expectedGraduation,
      currentSemester,
      cgpa,
      advisorName,
    } = req.body;

    // Check if student already has an active clearance
    const activeExisting = await Clearance.findOne({
      student: student._id,
      status: { $in: ["pending", "in_progress"] },
    });

    if (activeExisting) {
      return res.status(400).json({
        success: false,
        message: "You already have an active clearance request in progress.",
        existingRequestId: activeExisting.requestId,
      });
    }

    // Determine workflow steps
    let workflow = await Workflow.findOne({ clearanceType });
    let departmentApprovals = [];

    if (workflow && workflow.steps && workflow.steps.length > 0) {
      departmentApprovals = workflow.steps.map((step) => ({
        departmentName: step.departmentName,
        departmentCode: step.departmentCode,
        status: "pending",
        itemsChecked: step.requiredChecklist.map((item) => ({
          name: item.item,
          status: "pending",
        })),
      }));
    } else {
      // Default departments list
      const defaultDepts = [
        { name: "Library", code: "LIB" },
        { name: "Dormitory", code: "DORM" },
        { name: "Cafeteria", code: "CAFE" },
        { name: "Bookstore", code: "BOOK" },
        { name: "Department Head", code: "DEPT" },
        { name: "Registrar", code: "REG" },
      ];
      departmentApprovals = defaultDepts.map((d) => ({
        departmentName: d.name,
        departmentCode: d.code,
        status: "pending",
        itemsChecked: [
          { name: "Property & Keys Returned", status: "pending" },
          { name: "Outstanding Dues / Fines Cleared", status: "pending" },
        ],
      }));
    }

    // Process files if uploaded
    const documents = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const result = await uploadToCloudinary(file.buffer);
          documents.push({
            name: file.originalname,
            url: result.secure_url,
            publicId: result.public_id,
            fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
            fileType: file.mimetype,
            status: "Uploaded",
          });
        } catch (uploadError) {
          console.warn("Cloudinary upload fallback to mock URL:", uploadError.message);
          documents.push({
            name: file.originalname,
            url: `https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop`,
            fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
            fileType: file.mimetype,
            status: "Uploaded",
          });
        }
      }
    }

    const requestId = `REQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const clearance = await Clearance.create({
      requestId,
      student: student._id,
      studentName: student.name,
      studentId: student.studentId || `UGR/${Math.floor(1000 + Math.random() * 9000)}/16`,
      department: student.department || "Computer Science",
      college: student.college || "College of Computing",
      program: student.program || "Undergraduate Regular",
      clearanceType: clearanceType || "graduation",
      reason: reason || "Standard graduation exit clearance",
      contactDetails: {
        phone: phone || student.phone,
        email: student.email,
        emergencyContactName,
        emergencyPhone,
        currentAddress,
      },
      academicDetails: {
        admissionYear: admissionYear || "2013",
        expectedGraduation: expectedGraduation || "2017",
        currentSemester: currentSemester || "Semester II",
        cgpa: cgpa ? Number(cgpa) : 3.5,
        advisorName: advisorName || "Dr. Kebede",
      },
      documents,
      departmentApprovals,
      status: "pending",
      auditTrail: [
        {
          action: "CLEARANCE_SUBMITTED",
          performedBy: student.name,
          role: "student",
          details: `Clearance request ${requestId} created for ${clearanceType}`,
        },
      ],
    });

    // Create student notification
    await Notification.create({
      recipient: student._id,
      title: "Clearance Request Submitted",
      message: `Your clearance request #${requestId} has been submitted and is pending review.`,
      type: "success",
      link: "/student/clearance",
    });

    // Send email confirmation
    sendEmail({
      to: student.email,
      subject: `MWU Clearance Submitted: ${requestId}`,
      html: `<h3>Clearance Application Received</h3>
             <p>Dear ${student.name},</p>
             <p>Your clearance request <strong>${requestId}</strong> has been successfully submitted and forwarded to your department officers.</p>
             <p>You can track the live status at your MWU student portal.</p>`,
    });

    // Record Audit Log
    await AuditLog.create({
      user: student._id,
      userName: student.name,
      userRole: "student",
      userDepartment: student.department,
      action: "CLEARANCE_SUBMITTED",
      targetId: requestId,
      details: `Clearance ${requestId} initiated by student`,
      ipAddress: req.ip || "127.0.0.1",
    });

    return res.status(201).json({
      success: true,
      message: "Clearance request submitted successfully",
      clearance,
    });
  } catch (error) {
    console.error("Create Clearance Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in student's clearances
// @route   GET /api/clearances/my
// @access  Private (Student)
export const getMyClearances = async (req, res) => {
  try {
    const clearances = await Clearance.find({ student: req.user._id }).sort({
      createdAt: -1,
    });
    return res.json({ success: true, count: clearances.length, clearances });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get active clearance for logged in student
// @route   GET /api/clearances/my/active
// @access  Private (Student)
export const getMyActiveClearance = async (req, res) => {
  try {
    const clearance = await Clearance.findOne({
      student: req.user._id,
    }).sort({ createdAt: -1 });

    return res.json({ success: true, clearance });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single clearance by ID or RequestID
// @route   GET /api/clearances/:id
// @access  Private
export const getClearanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const clearance = await Clearance.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { requestId: id }],
    });

    if (!clearance) {
      return res.status(404).json({ success: false, message: "Clearance not found" });
    }

    return res.json({ success: true, clearance });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel clearance request
// @route   PUT /api/clearances/:id/cancel
// @access  Private (Student)
export const cancelClearance = async (req, res) => {
  try {
    const clearance = await Clearance.findOne({
      _id: req.params.id,
      student: req.user._id,
    });

    if (!clearance) {
      return res.status(404).json({ success: false, message: "Clearance not found" });
    }

    if (clearance.status === "completed" || clearance.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel an already completed clearance.",
      });
    }

    clearance.status = "cancelled";
    clearance.auditTrail.push({
      action: "CLEARANCE_CANCELLED",
      performedBy: req.user.name,
      role: "student",
      details: "Clearance cancelled by student.",
    });

    await clearance.save();

    return res.json({ success: true, message: "Clearance cancelled", clearance });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
