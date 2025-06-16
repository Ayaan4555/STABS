const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getTeacherAppointments,
  updateAppointmentStatus,
  createAppointmentByTeacher,
} = require("../controllers/teacherController");

const router = express.Router();

router.get("/appointments", protect, getTeacherAppointments);
router.put("/appointments/:id/status", protect, updateAppointmentStatus);
router.post("/appointments", protect, createAppointmentByTeacher);

module.exports = router;
