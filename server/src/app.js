
import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import timetableRoutes from "./routes/timetableRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import helmet from "helmet";
import { apiLimiter } from "./middleware/rateLimit.js";
import healthRoutes from "./routes/healthRoutes.js";



const app = express();

// app.use(cors()); //for dev level
// for prod level
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://yourdomain.com"]
        : ["http://localhost:5173"],
    credentials: true,
  })
);


app.use(express.json());
app.get("/ping", (req, res) => {
  res.send("pong");
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/test", testRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/notes", noteRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/users", userRoutes);

app.use("/api/exams", examRoutes);

app.use("/api/notifications", notificationRoutes);


app.use(errorHandler);
app.use(helmet());

app.use("/api", apiLimiter);


app.use("/api", healthRoutes);





export default app;
