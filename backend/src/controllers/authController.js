import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { AuditLog } from "../models/AuditLog.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
};

// @desc    Register a new student / user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, studentId, department, college, phone, program } =
      req.body;

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    if (studentId) {
      const studentIdExists = await User.findOne({ studentId });
      if (studentIdExists) {
        return res.status(400).json({ success: false, message: "Student ID already registered" });
      }
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: "student",
      studentId: studentId || `UGR/${Math.floor(1000 + Math.random() * 9000)}/16`,
      department: department || "Computer Science",
      college: college || "College of Computing",
      phone: phone || "",
      program: program || "Undergraduate Regular",
    });

    await AuditLog.create({
      user: user._id,
      userName: user.name,
      userRole: user.role,
      userDepartment: user.department,
      action: "STUDENT_REGISTERED",
      details: `New student account registered with ID ${user.studentId}`,
      ipAddress: req.ip || "127.0.0.1",
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        department: user.department,
        college: user.college,
        program: user.program,
        phone: user.phone,
        avatar: user.avatar,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be email or studentId or staffId

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide credentials" });
    }

    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase().trim() },
        { studentId: identifier.trim() },
        { staffId: identifier.trim() },
      ],
    });

    if (!user || !(await user.matchPassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email, ID or password" });
    }

    if (user.status === "Suspended") {
      return res.status(403).json({
        success: false,
        message: "Your account is suspended. Please contact the Registrar.",
      });
    }

    user.lastLogin = new Date();
    await user.save();

    await AuditLog.create({
      user: user._id,
      userName: user.name,
      userRole: user.role,
      userDepartment: user.department,
      action: "USER_LOGIN",
      details: `${user.role.toUpperCase()} ${user.name} logged in successfully`,
      ipAddress: req.ip || "127.0.0.1",
    });

    const token = generateToken(user._id);

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        staffId: user.staffId,
        department: user.department,
        college: user.college,
        program: user.program,
        phone: user.phone,
        avatar: user.avatar,
        status: user.status,
        academicInfo: user.academicInfo,
        emergencyContact: user.emergencyContact,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    return res.json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { name, phone, emergencyContact, academicInfo, avatar } = req.body;
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;
    if (emergencyContact) user.emergencyContact = { ...user.emergencyContact, ...emergencyContact };
    if (academicInfo) user.academicInfo = { ...user.academicInfo, ...academicInfo };

    await user.save();

    return res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ success: false, message: "Incorrect current password" });
    }

    user.password = newPassword;
    await user.save();

    return res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
