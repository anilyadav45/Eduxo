import Subject from "../models/Subject.js";
import Timetable from "../models/Timetable.js";

// Assign teacher to subject (Admin action)
export const assignTeacher = async (req, res) => {
  const { subjectId, teacherId } = req.body;

  const subject = await Subject.findById(subjectId);
  subject.teacher = teacherId;
  await subject.save();

  res.json({ message: "Teacher assigned successfully" });
};

// Get today's timetable for logged-in teacher
export const getTodayClasses = async (req, res) => {
  const day = new Date()
    .toLocaleString("en-US", { weekday: "long" })
    .toUpperCase();

  const classes = await Timetable.find({
    day,
    teacher: req.user.id,
  })
    .populate("subject", "name")
    .populate("semester", "name")
    .sort({ startTime: 1 });

  res.json(classes);
};

export const getTeacherDashboard = async (req, res) => {
  const day = new Date()
    .toLocaleString("en-US", { weekday: "long" })
    .toUpperCase();

  const todayClasses = await Timetable.find({
    day,
    teacher: req.user.id,
  })
    .populate("subject", "name")
    .populate("semester", "name")
    .sort({ startTime: 1 });

  const subjects = await Subject.find({
    teacher: req.user.id,
  }).select("name");

  res.json({
    subjects,
    todayClasses,
  });
};

