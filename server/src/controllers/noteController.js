import Note from "../models/Note.js";

// 👨‍🏫 Upload notes (Teacher)
import Subject from "../models/Subject.js";
import Semester from "../models/Semester.js";

export const uploadNote = async (req, res) => {
  try {
    const { title, subjectId, semesterId } = req.body;

    if (!req.file || !title || !subjectId || !semesterId) {
      return res.status(400).json({ message: "All fields are required" });
    }

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

    // 🔒 College isolation
    if (String(req.user.college) !== String(semester.department.college)) {
      return res.status(403).json({ message: "Cross-college upload blocked" });
    }

    if (String(subject.semester._id) !== String(semesterId)) {
      return res.status(400).json({ message: "Subject not part of this semester" });
    }

    const note = await Note.create({
      title,
      subject: subjectId,
      semester: semesterId,
      fileUrl: `/uploads/notes/${req.file.filename}`,
      uploadedBy: req.user.id,
    });

    res.json({ message: "Note uploaded successfully", note });

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
