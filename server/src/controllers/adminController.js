import College from "../models/College.js";
import Department from "../models/Department.js";
import Semester from "../models/Semester.js";
import Subject from "../models/Subject.js";
const generateCollegeCode = (name) => {
  return name
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 6);
};

export const createCollege = async (req, res) => {
  try {
    const { name, address } = req.body;

    if (!name || !address) {
      return res.status(400).json({ message: "Name and address required" });
    }

    const existing = await College.findOne({ name });
    if (existing) {
      return res.status(409).json({ message: "College already exists" });
    }

    const code = generateCollegeCode(name);

    const college = await College.create({
      name,
      address,
      code,
      isActive: true,
      createdBy: req.user.id
    });

    res.status(201).json(college);
  } catch (err) {
    console.error("Create college error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};



export const createDepartment = async (req, res) => {
  const department = await Department.create(req.body);
  res.status(201).json(department);
};

// import Department from "../models/Department.js";
// import Semester from "../models/Semester.js";

export const createSemester = async (req, res) => {
  try {
    const { name, department } = req.body;

    if (!name || !department) {
      return res.status(400).json({ message: "Name and department required" });
    }

    const deptExists = await Department.findById(department);
    if (!deptExists) {
      return res.status(400).json({ message: "Invalid department ID" });
    }

    const semester = await Semester.create({
      name,
      department,
    });

    res.status(201).json(semester);
  } catch (err) {
    console.error("Create semester error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};


export const createSubject = async (req, res) => {
  const subject = await Subject.create(req.body);
  res.status(201).json(subject);
};


import User from "../models/User.js";

export const assignStudentSemester = async (req, res) => {
  const { studentId, semesterId } = req.body;

  const student = await User.findById(studentId);
  if (!student || student.role !== "STUDENT") {
    return res.status(400).json({ message: "Invalid student" });
  }

  student.semester = semesterId;
  await student.save();

  res.json({ message: "Student assigned to semester" });
};
