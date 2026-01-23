import Attendance from "../models/Attendance.js";
import Note from "../models/Note.js";

import User from "../models/User.js";
import Semester from "../models/Semester.js";
import Subject from "../models/Subject.js";
import Timetable from "../models/Timetable.js";

export const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user.id;

    // 1. Get student
    const student = await User.findById(studentId).populate("semester");
    if (!student || student.role !== "STUDENT") {
      return res.status(403).json({ message: "Not a student" });
    }

    if (!student.semester) {
      return res.status(400).json({ message: "Student not assigned to semester" });
    }

    // 2. Subjects of semester
    const subjects = await Subject.find({
      semester: student.semester._id,
    }).select("name");

    // 3. Timetable of semester
    const timetable = await Timetable.find({
      semester: student.semester._id,
    })
      .populate("subject", "name")
      .populate("teacher", "name")
      .sort({ day: 1, startTime: 1 });

    res.json({
      semester: student.semester,
      subjects,
      timetable,
    });
  } catch (err) {
    console.error("Student dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getAttendance = async (req, res) => {
  const studentId = req.user.id;
//track attendence here
  const attendanceRecords = await Attendance.find({
    "records.student": studentId
  }).populate("subject");

  const result = attendanceRecords.map((att) => {
    const total = att.records.length;
    const present = att.records.filter(
      (r) =>
        r.student.toString() === studentId &&
        r.status === "PRESENT"
    ).length;

    return {
      subject: att.subject.name,
      totalClasses: total,
      present,
      percentage:
        total === 0 ? 0 : Math.round((present / total) * 100)
    };
  });

  res.json(result);
};
//to get notes 
export const getNotes = async (req, res) => {
  const notes = await Note.find().populate("subject", "name");
  res.json(notes);
};


// to fetch today routein

export const getTodayRoutine = async (req, res) => {
  const day = new Date()
    .toLocaleString("en-US", { weekday: "long" })
    .toUpperCase();

  const routine = await Timetable.find({
    day,
    semester: req.user.semester
  })
    .populate("subject", "name")
    .populate("teacher", "name")
    .sort({ startTime: 1 });

  res.json(routine);
};
