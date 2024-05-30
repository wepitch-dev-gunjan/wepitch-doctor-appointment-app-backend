const express = require("express");
const {
  getDoctor,
  getDoctors,
  registerDoctor,
  editDoctorProfile,
  getDoctorAppointments,
  addAvailabilitySlot,
  removeAvailabilitySlot,
  getDoctorReviews,
  respondToReview,
  loginDoctor,
  forgotPasswordDoctor,
  resetPasswordDoctor
} = require("../controllers/doctorController");
const { adminAuth, doctorAuth } = require("../middlewares/authMiddlewares");
const router = express.Router();

router.get("/doctors", adminAuth, getDoctors);
router.get("/doctor/profile", doctorAuth, getDoctor);
router.get("/doctor/appointments", doctorAuth, getDoctorAppointments);
router.get("/doctor/reviews", doctorAuth, getDoctorReviews);

router.post("/doctor/register", registerDoctor);
router.post("/doctor/login", loginDoctor);
router.post("/doctor/forgotPassword", forgotPasswordDoctor);
router.post("/doctor/resetPassword", resetPasswordDoctor);

router.put("/doctor/profile", doctorAuth, editDoctorProfile);
router.put("/doctor/availability", doctorAuth, addAvailabilitySlot);
router.delete("/doctor/availability", doctorAuth, removeAvailabilitySlot);
router.put("/doctor/review/respond", doctorAuth, respondToReview);

module.exports = router;
