import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },

    // Targeting
    roles: {
      type: [String],
      enum: ["STUDENT", "TEACHER", "COLLEGE_ADMIN"],
      default: [],
    },
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
      default: null,
    },

    // Read tracking
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
