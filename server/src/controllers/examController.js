import Exam from "../models/Exam.js";
import Result from "../models/Result.js";

// Admin: create exam
export const createExam = async (req, res) => {
  const exam = await Exam.create(req.body);
  res.status(201).json(exam);
};

// Teacher/Admin: enter marks
export const enterMarks = async (req, res) => {
  const { examId, studentId, marks } = req.body;

  const exam = await Exam.findById(examId);
  if (!exam) {
    return res.status(404).json({ message: "Exam not found" });
  }

  const status = marks >= exam.passMarks ? "PASS" : "FAIL";

  const result = await Result.create({
    exam: examId,
    student: studentId,
    marks,
    status,
  });

  res.json({ message: "Marks entered", result });
};

// Student: view results
export const getStudentResults = async (req, res) => {
  const results = await Result.find({ student: req.user._id })
    .populate({
      path: "exam",
      populate: { path: "subject", select: "name" },
    })
    .select("marks status exam");

  res.json(results);
};
