import Attendance from "../models/Attendance.js";
import Note from "../models/Note.js";

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
import Timetable from "../models/Timetable.js";

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
