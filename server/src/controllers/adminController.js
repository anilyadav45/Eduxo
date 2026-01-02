import College from "../models/College.js";
import Department from "../models/Department.js";
import Semester from "../models/Semester.js";
import Subject from "../models/Subject.js";

export const createCollege = async (req, res) => {
  const college = await College.create(req.body);
  res.status(201).json(college);
};

export const createDepartment = async (req, res) => {
  const department = await Department.create(req.body);
  res.status(201).json(department);
};

export const createSemester = async (req, res) => {
  const semester = await Semester.create(req.body);
  res.status(201).json(semester);
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
