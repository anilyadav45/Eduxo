import Timetable from "../models/Timetable.js";

// 👨‍💼 Admin creates timetable entry

import Subject from "../models/Subject.js";
import Semester from "../models/Semester.js";
import User from "../models/User.js";

export const createTimetable = async (req, res) => {
  try {
    const { subject, semester, teacher, day, startTime, endTime } = req.body;

    // 1. Validate semester
    const sem = await Semester.findById(semester);
    if (!sem) return res.status(404).json({ message: "Semester not found" });

    if (String(sem.college) !== String(req.user.college)) {
      return res.status(403).json({ message: "Cross-college semester blocked" });
    }

    // 2. Validate subject
    const sub = await Subject.findById(subject).populate("semester");
    if (!sub) return res.status(404).json({ message: "Subject not found" });

    if (String(sub.semester._id) !== String(semester)) {
      return res.status(400).json({ message: "Subject not in semester" });
    }

    // 3. Validate teacher
    const teach = await User.findById(teacher);
    if (!teach || teach.role !== "TEACHER") {
      return res.status(400).json({ message: "Invalid teacher" });
    }

    if (String(teach.college) !== String(req.user.college)) {
      return res.status(403).json({ message: "Cross-college teacher blocked" });
    }

    // 4. Teacher must be assigned to subject
    if (String(sub.teacher) !== String(teacher)) {
      return res.status(400).json({ message: "Teacher not assigned to subject" });
    }

    const timetable = await Timetable.create({
      subject,
      semester,
      teacher,
      day,
      startTime,
      endTime,
    });

    res.status(201).json(timetable);
  } catch (err) {
    console.error("Create timetable error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



// 👨‍🏫 Teacher – today's classes
export const getTeacherToday = async (req, res) => {
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

// 👨‍🎓 Student – today's routine
export const getStudentToday = async (req, res) => {
  const day = new Date()
    .toLocaleString("en-US", { weekday: "long" })
    .toUpperCase();

  const classes = await Timetable.find({
    day,
    semester: req.user.semester, // future-proof
  })
    .populate("subject", "name")
    .populate("teacher", "name")
    .sort({ startTime: 1 });

  res.json(classes);
};
