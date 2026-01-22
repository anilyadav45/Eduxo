import Subject from "../models/Subject.js";
import Timetable from "../models/Timetable.js";

// Assign teacher to subject (Admin action)
import User from "../models/User.js";

export const assignTeacher = async (req, res) => {
  try {
    const { subjectId, teacherId } = req.body;

    const subject = await Subject.findById(subjectId).populate("semester");
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "TEACHER") {
      return res.status(400).json({ message: "Invalid teacher" });
    }

    // 🔒 COLLEGE ISOLATION CHECK
    if (
      String(subject.semester.college) !== String(req.user.college) ||
      String(teacher.college) !== String(req.user.college)
    ) {
      return res.status(403).json({ message: "Cross-college assignment blocked" });
    }

    subject.teacher = teacherId;
    await subject.save();

    res.json({ message: "Teacher assigned successfully" });
  } catch (err) {
    console.error("Assign teacher error:", err);
    res.status(500).json({ message: "Server error" });
  }
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

