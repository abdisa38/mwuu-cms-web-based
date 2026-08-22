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
    console.log("[SEED] Checking and seeding initial database data...");

    // 1. Seed Registrar Admin
    let registrar = await User.findOne({ email: "registrar@mwu.edu.et" });
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
      console.log("[SEED] Created Registrar Admin account: registrar@mwu.edu.et");
    }

    // 2. Seed Department Officers & Department Heads
    const officersData = [
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
    ];

    const officerMap = {};
    for (const off of officersData) {
      let existingOfficer = await User.findOne({ email: off.email });
      if (!existingOfficer) {
        existingOfficer = await User.create(off);
        console.log(`[SEED] Created Officer: ${off.name} (${off.department})`);
      }
      officerMap[off.department] = existingOfficer._id;
    }

    // 3. Seed Students
    let student1 = await User.findOne({ email: "student@mwu.edu.et" });
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
      console.log("[SEED] Created Student account: student@mwu.edu.et (UGR/1234/12)");
    }

    // 4. Seed Standard Departments
    const standardDepartments = [
      {
        name: "Department Head",
        code: "DEPT",
        category: "academic",
        description: "Academic department clearance and project submission sign-off",
        orderIndex: 1,
      },
      {
        name: "Library",
        code: "LIB",
        category: "administrative",
        description: "Library book return and dues clearance",
        orderIndex: 2,
      },
      {
        name: "Dormitory",
        code: "DORM",
        category: "administrative",
        description: "Dormitory key return and room inspection",
        orderIndex: 3,
      },
      {
        name: "Cafeteria",
        code: "CAFE",
        category: "services",
        description: "Meal card surrender and cafeteria dues clearance",
        orderIndex: 4,
      },
      {
        name: "Bookstore",
        code: "BOOK",
        category: "services",
        description: "Textbook return and bookstore clearance",
        orderIndex: 5,
      },
      {
        name: "Registrar",
        code: "REG",
        category: "administrative",
        description: "Final academic records verification and certificate release",
        orderIndex: 6,
      },
    ];

    // Clean up any test departments
    await Department.deleteMany({ name: { $regex: /5246436|Departmen head/i } });

    for (const d of standardDepartments) {
      const exists = await Department.findOne({ code: d.code });
      if (!exists) {
        await Department.create(d);
      }
    }
    console.log("[SEED] Seeded official university departments.");

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
            departmentName: "Department Head",
            departmentCode: "DEPT",
            instructions: "Submit final approved thesis/project copy and academic clearance.",
            requiredChecklist: [
              { item: "Final Project / Thesis Approved", isMandatory: true },
              { item: "Lab Equipment Returned", isMandatory: true },
            ],
          },
          {
            stepNumber: 2,
            departmentName: "Library",
            departmentCode: "LIB",
            instructions: "Return all borrowed books and pay any outstanding fines.",
            requiredChecklist: [
              { item: "No Overdue Books", isMandatory: true },
              { item: "Library ID Surrendered", isMandatory: true },
            ],
          },
          {
            stepNumber: 3,
            departmentName: "Dormitory",
            departmentCode: "DORM",
            instructions: "Hand over room key and undergo room inventory inspection.",
            requiredChecklist: [
              { item: "Room Key Returned", isMandatory: true },
              { item: "Mattress & Furniture Checked", isMandatory: true },
            ],
          },
          {
            stepNumber: 4,
            departmentName: "Cafeteria",
            departmentCode: "CAFE",
            instructions: "Surrender meal card.",
            requiredChecklist: [
              { item: "Non-cafe / Cafe Coupon Checked", isMandatory: true },
            ],
          },
          {
            stepNumber: 5,
            departmentName: "Bookstore",
            departmentCode: "BOOK",
            instructions: "Return departmental textbooks.",
            requiredChecklist: [
              { item: "All Textbooks Returned", isMandatory: true },
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
    ];

    for (const wf of workflowsData) {
      const exists = await Workflow.findOne({ clearanceType: wf.clearanceType });
      if (!exists) {
        await Workflow.create(wf);
      }
    }

    console.log("[SEED] Database verification and seeding complete!");
  } catch (error) {
    console.error("[SEED ERROR]", error);
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
