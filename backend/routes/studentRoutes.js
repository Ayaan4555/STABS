const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getAllTeachers,
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
  getAllApprovedStudents,
} = require("../controllers/studentController");

const router = express.Router();

router.get("/teachers", protect, getAllTeachers);
router.post("/appointments", protect, bookAppointment);
router.get("/appointments", protect, getMyAppointments);
router.put("/appointments/:id/cancel", protect, cancelAppointment);
router.get("/all-students", protect, getAllApprovedStudents);

module.exports = router;