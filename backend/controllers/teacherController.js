const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel");

// GET appointments for logged-in teacher
const getTeacherAppointments = async (req, res) => {
  const appointments = await Appointment.find({ teacher: req.user._id })
    .populate("student", "name email")
    .sort({ createdAt: -1 });

  res.json(appointments);
};

// PUT update appointment status
const updateAppointmentStatus = async (req, res) => {
  const { status } = req.body;

  if (!["approved", "cancelled"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found" });
  }

  // Only allow the teacher who owns this appointment
  if (appointment.teacher.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  appointment.status = status;
  await appointment.save();

  res.json({ message: `Appointment ${status}` });
};

// POST teacher creates appointment with student
const createAppointmentByTeacher = async (req, res) => {
  const { studentId, date, time, message } = req.body;

  if (!studentId || !date || !time || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const student = await User.findById(studentId);
  if (!student || student.role !== "student") {
    return res.status(400).json({ message: "Invalid student ID" });
  }

  const appointment = await Appointment.create({
    student: studentId,
    teacher: req.user._id,
    date,
    time,
    message,
    status: "approved", // since teacher is initiating
  });

  res.status(201).json({ message: "Appointment created", appointment });
};

module.exports = {
  getTeacherAppointments,
  updateAppointmentStatus,
  createAppointmentByTeacher,
};
