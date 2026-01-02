import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
      required: true,
    },
    maxMarks: { type: Number, default: 100 },
    passMarks: { type: Number, default: 40 },
  },
  { timestamps: true }
);

export default mongoose.model("Exam", examSchema);
