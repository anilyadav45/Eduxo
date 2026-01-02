import User from "../models/User.js";
import Attendance from "../models/Attendance.js";
import Exam from "../models/Exam.js";
import Result from "../models/Result.js";

export const getAdminDashboardStats = async (req, res) => {
  try {
    // Users
    const totalStudents = await User.countDocuments({ role: "STUDENT" });
    const totalTeachers = await User.countDocuments({ role: "TEACHER" });

    // Exams
    const totalExams = await Exam.countDocuments();

    // Attendance aggregation
    const attendanceRecords = await Attendance.find();

    let totalMarks = 0;
    let presentMarks = 0;

    attendanceRecords.forEach((a) => {
      a.records.forEach((r) => {
        totalMarks++;
        if (r.status === "PRESENT") presentMarks++;
      });
    });

    const avgAttendance = totalMarks
      ? Math.round((presentMarks / totalMarks) * 100)
      : 0;

    // Results aggregation
    const passCount = await Result.countDocuments({ status: "PASS" });
    const failCount = await Result.countDocuments({ status: "FAIL" });

    res.json({
      users: {
        students: totalStudents,
        teachers: totalTeachers,
      },
      academics: {
        totalExams,
        avgAttendance,
        results: {
          pass: passCount,
          fail: failCount,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
