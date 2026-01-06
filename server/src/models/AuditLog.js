import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    role: String,
    action: {
      type: String,
      required: true,
    },
    entity: String,
    entityId: mongoose.Schema.Types.ObjectId,
    metadata: Object,
    ip: String,
  },
  { timestamps: true }
);

export default mongoose.model("AuditLog", auditLogSchema);
