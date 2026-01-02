import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Notes() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    api.get("/notes").then((res) => setNotes(res.data));
  }, []);

  return (
    <div>
      <h1>Notes</h1>
      {notes.map((n) => (
        <div key={n._id}>
          <p>{n.title} — {n.subject.name}</p>
          <a href={`http://localhost:5050${n.fileUrl}`} target="_blank">
            Download
          </a>
        </div>
      ))}
    </div>
  );
}
