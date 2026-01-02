import Timetable from "../models/Timetable.js";

// 👨‍💼 Admin creates timetable entry
export const createTimetable = async (req, res) => {
  try {
    const entry = await Timetable.create(req.body);
    res.status(201).json(entry);
  } catch (err) {
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
