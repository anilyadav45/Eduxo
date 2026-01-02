import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/dashboard-stats").then((res) => {
      setStats(res.data);
    });
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <h3>Users</h3>
      <p>Students: {stats.users.students}</p>
      <p>Teachers: {stats.users.teachers}</p>

      <h3>Academics</h3>
      <p>Total Exams: {stats.academics.totalExams}</p>
      <p>Average Attendance: {stats.academics.avgAttendance}%</p>

      <h3>Results</h3>
      <p>Pass: {stats.academics.results.pass}</p>
      <p>Fail: {stats.academics.results.fail}</p>
    </div>
  );
}
