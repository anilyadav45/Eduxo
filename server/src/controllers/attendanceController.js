import Attendance from "../models/Attendance.js";

// 👨‍🏫 Teacher marks attendance
export const markAttendance = async (req, res) => {
  try {
    const { subjectId, semesterId, date, records } = req.body;

    if (!subjectId || !semesterId || !date || !records) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const attendance = await Attendance.create({
      subject: subjectId,
      semester: semesterId,
      date,
      records,
      markedBy: req.user.id,
    });

    res.status(201).json({
      message: "Attendance marked successfully",
      attendance,
    });
  } catch (err) {
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
