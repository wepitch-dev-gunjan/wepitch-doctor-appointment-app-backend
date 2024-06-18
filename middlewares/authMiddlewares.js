const jwt = require("jsonwebtoken");
const Doctor = require("../models/Doctor");
const User = require("../models/User");
require("dotenv").config();
const { JWT_SECRET } = process.env;

// Middleware to authenticate doctor
exports.doctorAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    const decoded = jwt.verify(token, JWT_SECRET);
    const doctor = await Doctor.findById(decoded.doctor_id);
    if (!doctor) return res.status(401).json({ error: "Access denied. Invalid token." });

    req.doctor = doctor;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.userAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.user_id);
    if (!user) return res.status(401).json({ error: "Access denied. Invalid token." });

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Middleware to authorize admin
exports.adminAuth = async (req, res, next) => {
  try {
    let token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });
    token = token.replace("Bearer ", "");

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "admin") return res.status(403).json({ error: "Access denied. Insufficient permissions." });

    next();
  } catch (error) {
    console.error("Authorization error:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
