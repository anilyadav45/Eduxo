import mongoose from "mongoose";

const semesterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g. Sem 1
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Semester", semesterSchema);
