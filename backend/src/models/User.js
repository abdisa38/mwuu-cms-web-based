import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["student", "officer", "registrar", "admin"],
      default: "student",
    },
    studentId: {
      type: String,
      trim: true,
      sparse: true,
    },
    staffId: {
      type: String,
      trim: true,
      sparse: true,
    },
    department: {
      type: String,
      trim: true,
      default: "General",
    },
    college: {
      type: String,
      trim: true,
      default: "College of Computing",
    },
    program: {
      type: String,
      trim: true,
      default: "Undergraduate Regular",
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },
    academicInfo: {
      admissionYear: { type: String, default: "2013" },
      expectedGraduation: { type: String, default: "2017" },
      currentSemester: { type: String, default: "Semester II" },
      cgpa: { type: Number, default: 3.5 },
      advisor: { type: String, default: "Dr. Kebede" },
    },
    emergencyContact: {
      name: { type: String, default: "" },
      phone: { type: String, default: "" },
      address: { type: String, default: "" },
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model("User", userSchema);
