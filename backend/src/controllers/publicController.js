import { Clearance } from "../models/Clearance.js";
import { Department } from "../models/Department.js";

// University Academic Structure Data
export const MWU_COLLEGES_STRUCTURE = [
  {
    college: "College of Computing and Informatics",
    departments: [
      "Computer Science",
      "Information Technology",
      "Information Systems",
      "Software Engineering"
    ]
  },
  {
    college: "College of Engineering",
    departments: [
      "Civil Engineering",
      "Electrical and Computer Engineering",
      "Mechanical Engineering",
      "Construction Technology and Management",
      "Hydraulic and Water Resources Engineering"
    ]
  },
  {
    college: "College of Health Sciences & Medicine",
    departments: [
      "Medicine",
      "Public Health",
      "Nursing",
      "Midwifery",
      "Pharmacy",
      "Medical Laboratory Science"
    ]
  },
  {
    college: "College of Business and Economics",
    departments: [
      "Accounting and Finance",
      "Economics",
      "Management",
      "Public Administration",
      "Marketing Management"
    ]
  },
  {
    college: "College of Natural and Computational Sciences",
    departments: [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "Statistics",
      "Biotechnology"
    ]
  },
  {
    college: "College of Social Sciences and Humanities",
    departments: [
      "English Language and Literature",
      "Afan Oromo and Literature",
      "Amharic Language and Literature",
      "Sociology",
      "Geography and Environmental Studies",
      "History and Heritage Management"
    ]
  },
  {
    college: "College of Agriculture and Natural Resources",
    departments: [
      "Plant Science",
      "Animal Science",
      "Natural Resource Management",
      "Agricultural Economics",
      "Horticulture"
    ]
  },
  {
    college: "School of Law",
    departments: [
      "Law (LL.B)"
    ]
  },
  {
    college: "College of Education and Behavioral Sciences",
    departments: [
      "Educational Planning and Management",
      "Psychology",
      "Special Needs Education"
    ]
  }
];

export const MWU_PROGRAMS = [
  "Undergraduate Regular",
  "Undergraduate Extension (Evening)",
  "Undergraduate Weekend",
  "Undergraduate Summer (Kiremt)",
  "Postgraduate Regular (Master's)",
  "Postgraduate Weekend (Master's)",
  "Postgraduate Summer (Master's)",
  "Doctoral Program (PhD)"
];

export const MWU_FAQS = [
  {
    category: "General Clearance",
    questions: [
      {
        q: "What is the Madda Walabu University (MWU) e-Clearance system?",
        a: "MWU e-Clearance is the official university web portal that digitizes student and staff clearance workflows. It eliminates the manual paper clearance form by letting students submit clearance online and tracking real-time approvals across all university departments (Library, Dormitory, Cafeteria, Department Head, Bookstore, and Registrar)."
      },
      {
        q: "Who is eligible to apply for digital clearance?",
        a: "All undergraduate, postgraduate, extension, weekend, and summer students who are graduating, withdrawing, transferring, or completing academic requirements at Madda Walabu University are eligible to apply."
      },
      {
        q: "How long does the digital clearance process take?",
        a: "Once submitted, department officers typically review pending clearance requests within 24 to 72 hours. Once all departments approve, the Registrar conducts the final sign-off and generates the digital certificate immediately."
      }
    ]
  },
  {
    category: "Student Applications & Requirements",
    questions: [
      {
        q: "What clearance types are supported?",
        a: "The system supports: 1) Graduation Clearance, 2) Withdrawal Clearance, 3) Program / University Transfer Clearance, 4) Academic Dismissal Clearance, and 5) Staff Tenure Clearance."
      },
      {
        q: "What happens if a department rejects or places a hold on my clearance?",
        a: "If a department (e.g. Library or Dormitory) rejects or holds your clearance, the portal displays the exact rejection reason (e.g. unreturned books, dormitory keys, or uncollected property). You can resolve the issue with the respective officer and your clearance status will be updated immediately."
      },
      {
        q: "Can I cancel or edit my clearance application after submitting?",
        a: "You can cancel a pending clearance request from your 'My Clearance' dashboard as long as it has not yet received final Registrar sign-off."
      }
    ]
  },
  {
    category: "Certificates & Verification",
    questions: [
      {
        q: "How do I download my official clearance certificate?",
        a: "Once your clearance status reaches 'COMPLETED', you can view, print, or download your official digital certificate from the 'Certificate' tab in your student portal."
      },
      {
        q: "How can employers or external institutions verify my clearance certificate?",
        a: "Every certificate contains a unique Certificate Number (e.g., MWU-CLR-2026-XXXX) and a cryptographic QR code. Anyone can verify its authenticity in real time by visiting the public '/verify' page on this portal."
      }
    ]
  }
];

// @desc    Get Academic Colleges, Departments & Programs
// @route   GET /api/public/colleges-departments
// @access  Public
export const getCollegesAndDepartments = async (req, res) => {
  try {
    const dbDepts = await Department.find({ isActive: true }).select("name code");
    return res.json({
      success: true,
      colleges: MWU_COLLEGES_STRUCTURE,
      programs: MWU_PROGRAMS,
      clearanceDesks: dbDepts,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get FAQ items
// @route   GET /api/public/faqs
// @access  Public
export const getFaqs = async (req, res) => {
  try {
    return res.json({
      success: true,
      faqs: MWU_FAQS,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get public stats for landing page
// @route   GET /api/public/stats
// @access  Public
export const getPublicStats = async (req, res) => {
  try {
    const [completedCount, deptCount, totalStudents] = await Promise.all([
      Clearance.countDocuments({ status: "completed" }),
      Department.countDocuments({ isActive: true }),
      Clearance.countDocuments(),
    ]);

    return res.json({
      success: true,
      stats: {
        studentsCleared: completedCount > 0 ? `${completedCount}` : "1+",
        departmentsCount: deptCount > 0 ? `${deptCount}` : "6",
        totalApplications: totalStudents,
        averageApprovalTime: "24hr",
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify certificate by certNumber or studentId or requestId
// @route   GET /api/public/verify/:query
// @access  Public
export const verifyCertificate = async (req, res) => {
  try {
    const { query } = req.params;
    if (!query || !query.trim()) {
      return res.status(400).json({ success: false, isValid: false, valid: false, message: "Query parameter is required." });
    }

    const trimmed = query.trim();
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const escaped = escapeRegex(trimmed);

    // Search by Certificate Number, Request ID, Student ID, or Student Name
    const clearance = await Clearance.findOne({
      $or: [
        { "certificate.certNumber": { $regex: new RegExp(escaped, "i") } },
        { requestId: { $regex: new RegExp(`^${escaped}$`, "i") } },
        { studentId: { $regex: new RegExp(`^${escaped}$`, "i") } },
        { studentName: { $regex: new RegExp(escaped, "i") } },
      ],
      status: "completed",
    });

    if (!clearance || !clearance.certificate || !clearance.certificate.isValid) {
      return res.status(404).json({
        success: false,
        isValid: false,
        valid: false,
        message: `No active certified clearance found matching "${trimmed}".`,
      });
    }

    return res.json({
      success: true,
      isValid: true,
      valid: true,
      certificate: {
        certNumber: clearance.certificate.certNumber,
        requestId: clearance.requestId,
        studentName: clearance.studentName,
        studentId: clearance.studentId,
        department: clearance.department,
        college: clearance.college,
        program: clearance.program,
        clearanceType: clearance.clearanceType,
        issuedAt: clearance.certificate.issuedAt,
        blockchainHash: clearance.certificate.blockchainHash,
        qrCode: clearance.certificate.qrCode,
        approvedByName: clearance.finalApproval?.approvedByName || "Registrar Office",
        departmentApprovals: (clearance.departmentApprovals || []).map((d) => ({
          name: d.departmentName,
          status: d.status,
          reviewedByName: d.reviewedByName,
          reviewedAt: d.reviewedAt,
        })),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, isValid: false, valid: false, message: error.message });
  }
};
