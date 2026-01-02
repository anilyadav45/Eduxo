import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Today() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    api.get("/timetable/teacher/today").then(res => {
      setClasses(res.data);
    });
  }, []);

  return (
    <div>
      <h1>Today's Classes</h1>
      {classes.map((c) => (
        <div key={c._id}>
          {c.startTime} - {c.endTime} | {c.subject.name}
        </div>
      ))}
    </div>
  );
}
