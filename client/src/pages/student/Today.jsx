import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Today() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    api.get("/timetable/student/today").then(res => {
      setClasses(res.data);
    });
  }, []);

  return (
    <div>
      <h1>Today's Routine</h1>
      {classes.map((c) => (
        <div key={c._id}>
          {c.startTime} - {c.endTime} | {c.subject.name} ({c.teacher.name})
        </div>
      ))}
    </div>
  );
}
