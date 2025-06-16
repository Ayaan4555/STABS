const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  getPendingStudents,
  approveStudent,
  addTeacher,
  getTeachers,
  updateTeacher,
  deleteTeacher,
} = require("../controllers/adminController");
const { getAllApprovedStudents } = require("../controllers/adminController");

const router = express.Router();

router.get("/students", protect, adminOnly, getPendingStudents , getAllApprovedStudents);
router.put("/students/:id/approve", protect, adminOnly, approveStudent);

router.post("/teachers", protect, adminOnly, addTeacher);
router.get("/teachers", protect, adminOnly, getTeachers);
router.put("/teachers/:id", protect, adminOnly, updateTeacher);
router.delete("/teachers/:id", protect, adminOnly, deleteTeacher);

module.exports = router;
