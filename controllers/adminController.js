const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
require("dotenv").config();
const { JWT_SECRET } = process.env;

// Controller to get all admins (admin only)
exports.getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to get a single admin profile
exports.getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user._id);
    if (!admin) return res.status(404).json({ error: "Admin not found" });
    res.json(admin);
  } catch (error) {
    console.error("Error fetching admin:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to register a new admin
exports.registerAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber } = req.body;
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) return res.status(400).json({ error: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    await newAdmin.save();
    res.json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Error registering admin:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller for admin login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign({ user_id: admin._id, role: admin.role }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to edit admin profile
exports.editAdminProfile = async (req, res) => {
  try {
    const updates = req.body;
    const admin = await Admin.findByIdAndUpdate(req.user._id, updates, { new: true });
    if (!admin) return res.status(404).json({ error: "Admin not found" });
    res.json({ message: "Profile updated successfully", admin });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller for forgot password
exports.forgotPasswordAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ error: "Admin not found" });

    const token = jwt.sign({ user_id: admin._id }, JWT_SECRET, { expiresIn: "1h" });
    admin.resetPasswordToken = token;
    admin.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await admin.save();

    // Send email with the token
    // await transporter.sendMail({
    //   to: admin.email,
    //   from: "no-reply@example.com",
    //   subject: "Password Reset",
    //   html: `<p>You requested for a password reset</p>
    //          <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to reset password</p>`
    // });

    res.json({ message: "Password reset token sent to email" });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to reset admin password
exports.resetPasswordAdmin = async (req, res) => {
  try {
    const { token } = req.query;
    const { newPassword, confirmNewPassword } = req.body;
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(decoded.user_id);
    if (!admin || admin.resetPasswordExpires < Date.now()) return res.status(400).json({ error: "Password reset token is invalid or has expired" });

    admin.password = await bcrypt.hash(newPassword, 10);
    admin.resetPasswordToken = "";
    admin.resetPasswordExpires = null;
    await admin.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
