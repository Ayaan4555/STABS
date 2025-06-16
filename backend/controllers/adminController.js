const User = require("../models/userModel");

// GET pending students
const getPendingStudents = async (req, res) => {
  const students = await User.find({ role: "student", isApproved: false });
  res.json(students);
};

// APPROVE student by ID
const approveStudent = async (req, res) => {
  const student = await User.findById(req.params.id);
  if (!student || student.role !== "student") {
    return res.status(404).json({ message: "Student not found" });
  }
  student.isApproved = true;
  await student.save();
  res.json({ message: "Student approved" });
};

const getAllApprovedStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student", isApproved: true }).select("name _id");
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch students" });
  }
};



// ADD teacher
const addTeacher = async (req, res) => {
  const { name, email, password, department, subject } = req.body;

  const existing = await User.findOne({ email });
  if (existing)
    return res.status(400).json({ message: "Teacher already exists" });

  const hashed = await require("bcryptjs").hash(password, 10);
  const teacher = await User.create({
    name,
    email,
    password: hashed,
    role: "teacher",
    isApproved: true,
    department,
    subject,
  });

  res.status(201).json({ message: "Teacher added", id: teacher._id });
};

// GET all teachers
const getTeachers = async (req, res) => {
  const teachers = await User.find({ role: "teacher" });
  res.json(teachers);
};

// UPDATE teacher
const updateTeacher = async (req, res) => {
  const { name, department, subject } = req.body;
  const teacher = await User.findById(req.params.id);

  if (!teacher || teacher.role !== "teacher") {
    return res.status(404).json({ message: "Teacher not found" });
  }

  teacher.name = name || teacher.name;
  teacher.department = department || teacher.department;
  teacher.subject = subject || teacher.subject;
  await teacher.save();

  res.json({ message: "Teacher updated" });
};

// DELETE teacher
const deleteTeacher = async (req, res) => {
  const teacher = await User.findById(req.params.id);
  if (!teacher || teacher.role !== "teacher") {
    return res.status(404).json({ message: "Teacher not found" });
  }

  await teacher.deleteOne();
  res.json({ message: "Teacher deleted" });
};

module.exports = {
  getPendingStudents,
  approveStudent,
  addTeacher,
  getTeachers,
  updateTeacher,
  deleteTeacher,
  getAllApprovedStudents,
};
