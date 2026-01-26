import Attendance from "../models/Attendance.js";

// 👨‍🏫 Teacher marks attendance
import Subject from "../models/Subject.js";
import Semester from "../models/Semester.js";
import Department from "../models/Department.js";
import User from "../models/User.js";



export const markAttendance = async (req, res) => {
  try {
    const { subjectId, semesterId, date, records } = req.body;
    const teacherId = req.user.id;

    const subject = await Subject.findById(subjectId).populate({
      path: "semester",
      populate: {
        path: "department",
        populate: { path: "college" },
      },
    });

    if (!subject) {
      return res.status(400).json({ message: "Invalid subject" });
    }

    // ✅ teacher check
    if (!subject.teacher || subject.teacher.toString() !== teacherId.toString()) {
      return res
        .status(403)
        .json({ message: "Teacher not assigned to subject" });
    }

    const semester = await Semester.findById(semesterId).populate({
      path: "department",
      populate: { path: "college" },
    });

    if (!semester) {
      return res.status(400).json({ message: "Invalid semester" });
    }

    // ✅ college isolation
    if (
      semester.department.college._id.toString() !==
      req.user.college.toString()
    ) {
      return res.status(403).json({ message: "Cross-college access blocked" });
    }

    for (const r of records) {
      const student = await User.findById(r.student);
      if (!student || student.role !== "STUDENT") {
        return res.status(400).json({ message: "Invalid student" });
      }
      if (student.college.toString() !== req.user.college.toString()) {
        return res.status(403).json({ message: "Student from another college" });
      }
    }

    const attendance = await Attendance.create({
      subject: subjectId,
      semester: semesterId,
      date,
      records,
      markedBy: teacherId,
    });

    res.json({ message: "Attendance marked successfully", attendance });
  } catch (err) {
    console.error("Mark attendance error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// 👨‍🎓 Student views own attendance

export const getMyAttendance = async (req, res) => {
  try {
    const studentId = req.user.id;

    const student = await User.findById(studentId);
    if (!student || !student.semester) {
      return res
        .status(400)
        .json({ message: "Student not assigned to semester" });
    }

    const attendance = await Attendance.find({
      "records.student": studentId,
      semester: student.semester,
    })
      .populate("subject", "name")
      .sort({ date: -1 });

    // return only this student's record
    const formatted = attendance.map((a) => {
      const record = a.records.find(
        (r) => r.student.toString() === studentId.toString()
      );

      return {
        _id: a._id,
        subject: a.subject.name,
        date: a.date,
        status: record?.status || "ABSENT",
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error("Student attendance error:", err);
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
