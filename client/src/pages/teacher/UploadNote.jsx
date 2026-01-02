import { useState } from "react";
import api from "../../api/axios";

export default function UploadNote() {
  const [file, setFile] = useState(null);

  const upload = async () => {
    const formData = new FormData();
    formData.append("title", "Sample Notes");
    formData.append("subjectId", "SUBJECT_ID");
    formData.append("semesterId", "SEMESTER_ID");
    formData.append("file", file);

    await api.post("/notes/upload", formData);
    alert("Uploaded");
  };

  return (
    <div>
      <h1>Upload Notes</h1>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={upload}>Upload</button>
    </div>
  );
}
