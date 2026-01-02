import Note from "../models/Note.js";

// 👨‍🏫 Upload notes (Teacher)
export const uploadNote = async (req, res) => {
  try {
    const { title, subjectId, semesterId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "PDF file required" });
    }

    const note = await Note.create({
      title,
      subject: subjectId,
      semester: semesterId,
      fileUrl: `/uploads/notes/${req.file.filename}`,
      uploadedBy: req.user.id,
    });

    res.status(201).json({
      message: "Note uploaded successfully",
      note,
    });
  } catch (err) {
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
