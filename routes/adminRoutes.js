const express = require("express");
const {
  getAdmin,
  getAdmins,
  loginAdmin,
  registerAdmin,
  editAdminProfile,
  forgotPasswordAdmin,
  resetPasswordAdmin,
} = require("../controllers/adminController");
const { adminAuth } = require("../middlewares/authMiddlewares");
const router = express.Router();

// Route to get all admins (admin only)
router.get("/admins", adminAuth, getAdmins);

// Route to get the profile of the authenticated admin
router.get("/admin/profile", adminAuth, getAdmin);

// Route to register a new admin
router.post("/admin/register", adminAuth, registerAdmin);

// Route for admin login
router.post("/admin/login", loginAdmin);

// Route to handle forgot password functionality
router.post("/admin/forgotPassword", forgotPasswordAdmin);

// Route to reset the admin's password
router.post("/admin/resetPassword", resetPasswordAdmin);

// Route to edit the profile of the authenticated admin
router.put("/admin/profile", adminAuth, editAdminProfile);

module.exports = router;
