import { Clearance } from "../models/Clearance.js";

// @desc    Verify certificate by certNumber or studentId
// @route   GET /api/public/verify/:query
// @access  Public
export const verifyCertificate = async (req, res) => {
  try {
    const { query } = req.params;
    const trimmed = query.trim();

    const clearance = await Clearance.findOne({
      $or: [
        { "certificate.certNumber": { $regex: new RegExp(`^${trimmed}$`, "i") } },
        { requestId: { $regex: new RegExp(`^${trimmed}$`, "i") } },
        { studentId: { $regex: new RegExp(`^${trimmed}$`, "i") } },
      ],
      status: "completed",
    });

    if (!clearance || !clearance.certificate || !clearance.certificate.isValid) {
      return res.status(404).json({
        success: false,
        isValid: false,
        message: "No valid clearance certificate found for this identifier.",
      });
    }

    return res.json({
      success: true,
      isValid: true,
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
        approvedByName: clearance.finalApproval.approvedByName,
        departmentApprovals: clearance.departmentApprovals.map((d) => ({
          name: d.departmentName,
          status: d.status,
          reviewedByName: d.reviewedByName,
          reviewedAt: d.reviewedAt,
        })),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
