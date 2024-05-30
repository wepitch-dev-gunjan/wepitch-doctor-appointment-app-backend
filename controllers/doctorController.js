const Doctor = require("../models/Doctor");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { JWT_SECRET } = process.env;
const { validationResult } = require("express-validator");

// Route to register a doctor
exports.registerDoctor = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, specialization } = req.body;
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) return res.status(400).json({ error: "Doctor already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newDoctor = new Doctor({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      specialization,
    });

    await newDoctor.save();
    res.json({ message: "Doctor registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Route to login a doctor
exports.loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.status(400).json({ error: "Doctor does not exist" });

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ doctor_id: doctor._id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Route to get a doctor's profile
exports.getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.doctor._id);
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });
    res.json(doctor);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Route to edit a doctor's profile
exports.editDoctorProfile = async (req, res) => {
  try {
    const updates = req.body;
    const doctor = await Doctor.findByIdAndUpdate(req.doctor._id, updates, { new: true });
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });
    res.json({ message: "Profile updated successfully", doctor });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Route to get a doctor's appointments
exports.getDoctorAppointments = async (req, res) => {
  try {
    // Assuming there's an Appointment model
    const appointments = await Appointment.find({ doctor: req.doctor._id });
    res.json(appointments);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Route to add availability slot for a doctor
exports.addAvailabilitySlot = async (req, res) => {
  try {
    const { day, startTime, endTime } = req.body;
    const doctor = await Doctor.findById(req.doctor._id);
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });

    doctor.availableSlots.push({ day, startTime, endTime });
    await doctor.save();
    res.json({ message: "Availability slot added successfully", availableSlots: doctor.availableSlots });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Route to remove availability slot for a doctor
exports.removeAvailabilitySlot = async (req, res) => {
  try {
    const { slotId } = req.body;
    const doctor = await Doctor.findById(req.doctor._id);
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });

    doctor.availableSlots = doctor.availableSlots.filter(slot => slot._id.toString() !== slotId);
    await doctor.save();
    res.json({ message: "Availability slot removed successfully", availableSlots: doctor.availableSlots });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Route to get a doctor's reviews
exports.getDoctorReviews = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.doctor._id);
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });
    res.json(doctor.reviews);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Route to respond to a review
exports.respondToReview = async (req, res) => {
  try {
    const { reviewId, response } = req.body;
    const doctor = await Doctor.findById(req.doctor._id);
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });

    const review = doctor.reviews.id(reviewId);
    if (!review) return res.status(404).json({ error: "Review not found" });

    review.response = response;
    await doctor.save();
    res.json({ message: "Response added successfully", reviews: doctor.reviews });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Route to handle password reset
exports.forgotPasswordDoctor = async (req, res) => {
  // Logic for sending password reset email to doctor
};

exports.resetPasswordDoctor = async (req, res) => {
  // Logic for resetting doctor's password
};

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};