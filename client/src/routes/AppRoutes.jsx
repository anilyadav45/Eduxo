import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import AdminHome from "../pages/admin/AdminHome";
import TeacherHome from "../pages/teacher/TeacherHome";
import StudentHome from "../pages/student/StudentHome";
import ProtectedRoute from "../routes/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["COLLEGE_ADMIN"]}>
            <AdminHome />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRoles={["TEACHER"]}>
            <TeacherHome />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <StudentHome />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
