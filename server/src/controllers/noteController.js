import Note from "../models/Note.js";

// 👨‍🏫 Upload notes (Teacher)
import Subject from "../models/Subject.js";
import Semester from "../models/Semester.js";
export const uploadNote = async (req, res) => {
  try {
    const { title, subjectId, semesterId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File required" });
    }

    const teacherId = req.user.id;

    const subject = await Subject.findById(subjectId)
      .populate({
        path: "semester",
        populate: { path: "department", populate: { path: "college" } }
      });

    if (!subject) {
      return res.status(400).json({ message: "Invalid subject" });
    }

    // ✅ must match semester
    if (subject.semester._id.toString() !== semesterId) {
      return res.status(403).json({ message: "Subject not in this semester" });
    }

    // ✅ teacher must be assigned to subject
    if (!subject.teacher || subject.teacher.toString() !== teacherId) {
      return res.status(403).json({ message: "You are not assigned to this subject" });
    }

    // ✅ college isolation
    if (
      subject.semester.department.college._id.toString() !==
      req.user.college.toString()
    ) {
      return res.status(403).json({ message: "Cross-college upload blocked" });
    }

    const note = await Note.create({
      title,
      subject: subjectId,
      semester: semesterId,
      fileUrl: `/uploads/notes/${req.file.filename}`,
      uploadedBy: teacherId,
    });

    res.status(201).json({
      message: "Note uploaded successfully",
      note,
    });

  } catch (err) {
    console.error("Upload note error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// 👨‍🎓 Student views notes
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find()
      .populate("subject", "name")
      .populate("semester", "name")
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
