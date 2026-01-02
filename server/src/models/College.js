import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, unique: true },
    address: String,
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("College", collegeSchema);
