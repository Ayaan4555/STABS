const User = require("../models/userModel");
const Appointment = require("../models/appointmentModel");

// 1. Get all approved teachers
const getAllTeachers = async (req, res) => {
  const teachers = await User.find({ role: "teacher", isApproved: true }).select(
    "-password"
  );
  res.json(teachers);
};

// 2. Book an appointment
const bookAppointment = async (req, res) => {
  try {
    const { teacherId, date, time, message } = req.body;

    // Validate required fields
    if (!teacherId || !date || !time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Debug logs
    console.log("Booking Request:", { teacherId, date, time, message });
    console.log("User from token:", req.user);

    // Create appointment
    const appointment = await Appointment.create({
      student: req.user._id,
      teacher: teacherId,
      date,
      time,
      message,
    });

    res.status(201).json({ message: "Appointment booked", appointment });
  } catch (error) {
    console.error("❌ Error booking appointment:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// 3. Get all appointments for the logged-in student
const getMyAppointments = async (req, res) => {
  const appointments = await Appointment.find({ student: req.user._id })
    .populate("teacher", "name email")
    .sort({ createdAt: -1 });

  res.json(appointments);
};

// 4. Cancel an appointment
const cancelAppointment = async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment || appointment.student.toString() !== req.user._id.toString()) {
    return res.status(404).json({ message: "Appointment not found or unauthorized" });
  }

  appointment.status = "cancelled";
  await appointment.save();

  res.json({ message: "Appointment cancelled" });
};

const getAllApprovedStudents = async (req, res) => {
  const students = await User.find({ role: "student", isApproved: true }).select("name email");
  res.json(students);
};

module.exports = {
  getAllTeachers,
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
  getAllApprovedStudents,
};