import dns from "dns";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { User } from "../models/User.js";
import { Department } from "../models/Department.js";
import { Workflow } from "../models/Workflow.js";
import { Clearance } from "../models/Clearance.js";
import { AuditLog } from "../models/AuditLog.js";

// Fix Windows SRV resolution
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (e) {
  console.warn("DNS warning:", e.message);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });

export const seedDatabase = async () => {
  try {
    console.log("🌱 Checking and seeding initial database data...");

    // 1. Seed Registrar Admin
    let registrar = await User.findOne({ role: "registrar" });
    if (!registrar) {
      registrar = await User.create({
        name: "Registrar Admin",
        email: "registrar@mwu.edu.et",
        password: "Admin@12345",
        role: "registrar",
        staffId: "ADM/001",
        department: "Registrar",
        college: "Central Administration",
        phone: "+251 91 100 0001",
        status: "Active",
      });
      console.log("👤 Created Registrar Admin account: registrar@mwu.edu.et");
    }

    // 2. Seed Department Officers
    const officersData = [
      {
        name: "Sarah Officer",
        email: "library@mwu.edu.et",
        password: "Officer@12345",
        role: "officer",
        staffId: "EMP/001",
        department: "Library",
        phone: "+251 91 200 0001",
      },
      {
        name: "Dawit Dormitory",
        email: "dormitory@mwu.edu.et",
        password: "Officer@12345",
        role: "officer",
        staffId: "EMP/002",
        department: "Dormitory",
        phone: "+251 91 200 0002",
      },
      {
        name: "Almaz Cafeteria",
        email: "cafeteria@mwu.edu.et",
        password: "Officer@12345",
        role: "officer",
        staffId: "EMP/003",
        department: "Cafeteria",
        phone: "+251 91 200 0003",
      },
      {
        name: "Tadesse Bookstore",
        email: "bookstore@mwu.edu.et",
        password: "Officer@12345",
        role: "officer",
        staffId: "EMP/004",
        department: "Bookstore",
        phone: "+251 91 200 0004",
      },
      {
        name: "Dr. Abebe Kebede",
        email: "cs_head@mwu.edu.et",
        password: "Officer@12345",
        role: "officer",
        staffId: "EMP/042",
        department: "Department Head",
        college: "College of Computing",
        phone: "+251 91 200 0005",
      },
    ];

    const officerMap = {};
    for (const off of officersData) {
      let existingOfficer = await User.findOne({ email: off.email });
      if (!existingOfficer) {
        existingOfficer = await User.create(off);
        console.log(`👤 Created Officer: ${off.name} (${off.department})`);
      }
      officerMap[off.department] = existingOfficer._id;
    }

    // 3. Seed Students
    let student1 = await User.findOne({ studentId: "UGR/1234/12" });
    if (!student1) {
      student1 = await User.create({
        name: "John Doe",
        email: "student@mwu.edu.et",
        password: "Student@12345",
        role: "student",
        studentId: "UGR/1234/12",
        department: "Computer Science",
        college: "College of Computing",
        program: "Undergraduate Regular",
        phone: "+251 91 234 5678",
        status: "Active",
        academicInfo: {
          admissionYear: "2013",
          expectedGraduation: "2017",
          currentSemester: "Semester II",
          cgpa: 3.82,
          advisor: "Dr. Abebe Kebede",
        },
        emergencyContact: {
          name: "Abebe Kebede",
          phone: "+251 92 111 2233",
          address: "Robe Town, Kebele 02",
        },
      });
      console.log("🎓 Created Student account: student@mwu.edu.et (UGR/1234/12)");
    }

    let student2 = await User.findOne({ studentId: "UGR/5533/11" });
    if (!student2) {
      student2 = await User.create({
        name: "Betelhem Alemu",
        email: "betelhem@mwu.edu.et",
        password: "Student@12345",
        role: "student",
        studentId: "UGR/5533/11",
        department: "Information Systems",
        college: "College of Computing",
        program: "Undergraduate Regular",
        phone: "+251 94 555 6677",
        status: "Active",
      });
    }

    // 4. Seed Departments
    const departmentsData = [
      {
        name: "Library",
        code: "LIB",
        category: "service",
        description: "Library book returns and overdue fine clearance",
        contactEmail: "library@mwu.edu.et",
        officeLocation: "Main Library, 1st Floor",
        phone: "+251 22 665 1101",
        headOfficer: officerMap["Library"],
        averageProcessingHours: 12,
      },
      {
        name: "Dormitory",
        code: "DORM",
        category: "facility",
        description: "Dormitory key return and room inspection",
        contactEmail: "dormitory@mwu.edu.et",
        officeLocation: "Block 14 Office",
        phone: "+251 22 665 1102",
        headOfficer: officerMap["Dormitory"],
        averageProcessingHours: 24,
      },
      {
        name: "Cafeteria",
        code: "CAFE",
        category: "service",
        description: "Meal card handover and student dining clearance",
        contactEmail: "cafeteria@mwu.edu.et",
        officeLocation: "Student Cafeteria Building",
        phone: "+251 22 665 1103",
        headOfficer: officerMap["Cafeteria"],
        averageProcessingHours: 6,
      },
      {
        name: "Bookstore",
        code: "BOOK",
        category: "service",
        description: "Textbook return and rental inventory",
        contactEmail: "bookstore@mwu.edu.et",
        officeLocation: "Student Center, Room 102",
        phone: "+251 22 665 1104",
        headOfficer: officerMap["Bookstore"],
        averageProcessingHours: 18,
      },
      {
        name: "Department Head",
        code: "DEPT",
        category: "academic",
        description: "Academic department clearance and project submission",
        contactEmail: "cs_head@mwu.edu.et",
        officeLocation: "Computing Building, 3rd Floor",
        phone: "+251 22 665 1105",
        headOfficer: officerMap["Department Head"],
        averageProcessingHours: 36,
      },
      {
        name: "Registrar",
        code: "REG",
        category: "administrative",
        description: "Final transcript verification and clearance certificate issuance",
        contactEmail: "registrar@mwu.edu.et",
        officeLocation: "Administration Building, Room 101",
        phone: "+251 22 665 1000",
        headOfficer: registrar._id,
        averageProcessingHours: 24,
      },
    ];

    for (const d of departmentsData) {
      const exists = await Department.findOne({ code: d.code });
      if (!exists) {
        await Department.create(d);
      }
    }
    console.log("🏢 Seeded university departments.");

    // 5. Seed Workflows
    const workflowsData = [
      {
        clearanceType: "graduation",
        title: "Graduation Clearance Workflow",
        description:
          "Standard graduation clearance sequence required for graduating undergraduate and postgraduate students.",
        steps: [
          {
            stepNumber: 1,
            departmentName: "Library",
            departmentCode: "LIB",
            instructions: "Return all borrowed books and pay any outstanding fines.",
            requiredChecklist: [
              { item: "No Overdue Books", isMandatory: true },
              { item: "Library ID Surrendered", isMandatory: true },
            ],
          },
          {
            stepNumber: 2,
            departmentName: "Dormitory",
            departmentCode: "DORM",
            instructions: "Hand over room key and undergo room inventory inspection.",
            requiredChecklist: [
              { item: "Room Key Returned", isMandatory: true },
              { item: "Mattress & Furniture Checked", isMandatory: true },
            ],
          },
          {
            stepNumber: 3,
            departmentName: "Cafeteria",
            departmentCode: "CAFE",
            instructions: "Surrender meal card.",
            requiredChecklist: [
              { item: "Non-cafe / Cafe Coupon Checked", isMandatory: true },
            ],
          },
          {
            stepNumber: 4,
            departmentName: "Bookstore",
            departmentCode: "BOOK",
            instructions: "Return departmental textbooks.",
            requiredChecklist: [
              { item: "All Textbooks Returned", isMandatory: true },
            ],
          },
          {
            stepNumber: 5,
            departmentName: "Department Head",
            departmentCode: "DEPT",
            instructions: "Submit final approved thesis/project copy and lab clearance.",
            requiredChecklist: [
              { item: "Final Project / Thesis Approved", isMandatory: true },
              { item: "Lab Equipment Returned", isMandatory: true },
            ],
          },
          {
            stepNumber: 6,
            departmentName: "Registrar",
            departmentCode: "REG",
            instructions: "Final grade audit, transcript release, and digital certificate issue.",
            requiredChecklist: [
              { item: "Grade Records Verified", isMandatory: true },
              { item: "Student ID Returned", isMandatory: true },
            ],
          },
        ],
      },
      {
        clearanceType: "withdrawal",
        title: "Withdrawal Clearance Workflow",
        description: "For students officially withdrawing from the university before completion.",
        steps: [
          { stepNumber: 1, departmentName: "Library", departmentCode: "LIB", requiredChecklist: [{ item: "Books Returned", isMandatory: true }] },
          { stepNumber: 2, departmentName: "Dormitory", departmentCode: "DORM", requiredChecklist: [{ item: "Key Returned", isMandatory: true }] },
          { stepNumber: 3, departmentName: "Department Head", departmentCode: "DEPT", requiredChecklist: [{ item: "Advisor Approved", isMandatory: true }] },
          { stepNumber: 4, departmentName: "Registrar", departmentCode: "REG", requiredChecklist: [{ item: "Withdrawal Registered", isMandatory: true }] },
        ],
      },
      {
        clearanceType: "transfer",
        title: "Transfer Clearance Workflow",
        description: "For students transferring to another university or program.",
        steps: [
          { stepNumber: 1, departmentName: "Library", departmentCode: "LIB", requiredChecklist: [{ item: "No Dues", isMandatory: true }] },
          { stepNumber: 2, departmentName: "Department Head", departmentCode: "DEPT", requiredChecklist: [{ item: "Transfer Endorsed", isMandatory: true }] },
          { stepNumber: 3, departmentName: "Registrar", departmentCode: "REG", requiredChecklist: [{ item: "Official Transcript Packaged", isMandatory: true }] },
        ],
      },
    ];

    for (const wf of workflowsData) {
      const exists = await Workflow.findOne({ clearanceType: wf.clearanceType });
      if (!exists) {
        await Workflow.create(wf);
      }
    }
    console.log("🔄 Seeded clearance workflow definitions.");

    // 6. Seed Sample Initial Clearance for Student 1
    const sampleClearanceExists = await Clearance.findOne({ student: student1._id });
    if (!sampleClearanceExists) {
      await Clearance.create({
        requestId: "REQ-2026-8932",
        student: student1._id,
        studentName: student1.name,
        studentId: student1.studentId,
        department: student1.department,
        college: student1.college,
        program: student1.program,
        clearanceType: "graduation",
        reason: "Graduating Batch of 2017 E.C. Computer Science degree clearance.",
        contactDetails: {
          phone: student1.phone,
          email: student1.email,
          emergencyContactName: "Abebe Kebede",
          emergencyPhone: "+251 92 111 2233",
          currentAddress: "Robe, Kebele 02",
        },
        academicDetails: student1.academicInfo,
        documents: [
          {
            name: "Student_ID_Scanned.jpg",
            url: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop",
            fileSize: "1.2 MB",
            fileType: "image/jpeg",
          },
          {
            name: "Profile_Photo_Recent.png",
            url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop",
            fileSize: "2.4 MB",
            fileType: "image/png",
          },
        ],
        departmentApprovals: [
          {
            departmentName: "Library",
            departmentCode: "LIB",
            status: "pending",
            itemsChecked: [
              { name: "No Overdue Books", status: "pending", remarks: "" },
              { name: "Library ID Surrendered", status: "pending", remarks: "" },
            ],
          },
          {
            departmentName: "Dormitory",
            departmentCode: "DORM",
            status: "pending",
            itemsChecked: [
              { name: "Room Key Returned", status: "pending", remarks: "" },
              { name: "Mattress & Furniture Checked", status: "pending", remarks: "" },
            ],
          },
          {
            departmentName: "Cafeteria",
            departmentCode: "CAFE",
            status: "pending",
            itemsChecked: [
              { name: "Non-cafe / Cafe Coupon Checked", status: "pending", remarks: "" },
            ],
          },
          {
            departmentName: "Bookstore",
            departmentCode: "BOOK",
            status: "pending",
            itemsChecked: [
              { name: "All Textbooks Returned", status: "pending", remarks: "" },
            ],
          },
          {
            departmentName: "Department Head",
            departmentCode: "DEPT",
            status: "pending",
            itemsChecked: [
              { name: "Final Project / Thesis Approved", status: "pending", remarks: "" },
            ],
          },
          {
            departmentName: "Registrar",
            departmentCode: "REG",
            status: "pending",
            itemsChecked: [
              { name: "Grade Records Verified", status: "pending", remarks: "" },
            ],
          },
        ],
        status: "pending",
        auditTrail: [
          {
            action: "CLEARANCE_SUBMITTED",
            performedBy: student1.name,
            role: "student",
            details: "Initial graduation clearance request created.",
          },
        ],
      });
      console.log("📄 Created sample clearance REQ-2026-8932 for John Doe.");
    }

    console.log("✅ Database seeding complete!");
  } catch (error) {
    console.error("❌ Seed Error:", error);
  }
};

// If run directly
if (process.argv[1]?.includes("seed.js")) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
      console.log("Connected to MongoDB Atlas.");
      await seedDatabase();
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
