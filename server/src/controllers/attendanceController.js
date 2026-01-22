import Attendance from "../models/Attendance.js";

// 👨‍🏫 Teacher marks attendance
import Subject from "../models/Subject.js";
import Semester from "../models/Semester.js";
import User from "../models/User.js";

export const markAttendance = async (req, res) => {
  try {
    const { subjectId, semesterId, date, records } = req.body;

    if (!subjectId || !semesterId || !date || !records?.length) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Get subject + semester
    const subject = await Subject.findById(subjectId).populate({
      path: "semester",
      populate: { path: "department", populate: { path: "college" } }
    });

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const semester = await Semester.findById(semesterId).populate({
      path: "department",
      populate: { path: "college" }
    });

    if (!semester) {
      return res.status(404).json({ message: "Semester not found" });
    }

    // ✅ Teacher must belong to same college
    if (String(req.user.college) !== String(semester.department.college)) {
      return res.status(403).json({ message: "Cross-college access blocked" });
    }

    // ✅ Subject must belong to same semester
    if (String(subject.semester._id) !== String(semesterId)) {
      return res.status(400).json({ message: "Subject not part of this semester" });
    }

    // ✅ Validate each student
    for (const r of records) {
      const student = await User.findById(r.student);
      if (!student || student.role !== "STUDENT") {
        return res.status(400).json({ message: "Invalid student in records" });
      }

      if (String(student.college) !== String(req.user.college)) {
        return res.status(403).json({ message: "Student from another college blocked" });
      }

      if (String(student.semester) !== String(semesterId)) {
        return res.status(400).json({ message: "Student not in this semester" });
      }
    }

    const attendance = await Attendance.create({
      subject: subjectId,
      semester: semesterId,
      date,
      records,
      markedBy: req.user.id,
    });

    res.json({ message: "Attendance marked successfully", attendance });

  } catch (err) {
    console.error("Attendance error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 👨‍🎓 Student views own attendance
export const getMyAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({
      "records.student": req.user.id,
    })
      .populate("subject", "name")
      .populate("semester", "name")
      .sort({ date: -1 });

    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


//
// 👨‍🎓 Student: attendance percentage (subject-wise + overall)
export const getAttendanceStats = async (req, res) => {
  try {
    const studentId = req.user._id;

    const records = await Attendance.find({
      "records.student": studentId,
    }).populate("subject", "name");

    let totalClasses = 0;
    let presentClasses = 0;

    const subjectStats = {};

    records.forEach((att) => {
      const subjectId = att.subject?._id?.toString();
      const subjectName = att.subject?.name || "Unknown";

      const record = att.records.find(
        (r) => r.student.toString() === studentId.toString()
      );

      if (!record) return;

      totalClasses++;

      if (record.status === "PRESENT") presentClasses++;

      if (!subjectStats[subjectId]) {
        subjectStats[subjectId] = {
          subject: subjectName,
          total: 0,
          present: 0,
        };
      }

      subjectStats[subjectId].total++;
      if (record.status === "PRESENT") {
        subjectStats[subjectId].present++;
      }
    });

    const subjectWise = Object.values(subjectStats).map((s) => ({
      subject: s.subject,
      percentage: s.total
        ? Math.round((s.present / s.total) * 100)
        : 0,
    }));

    const overallPercentage = totalClasses
      ? Math.round((presentClasses / totalClasses) * 100)
      : 0;

    res.json({
      overallPercentage,
      eligible: overallPercentage >= 75,
      subjectWise,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
