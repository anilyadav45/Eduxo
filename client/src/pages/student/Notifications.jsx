import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Notifications() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/notifications/my").then((res) => {
      setItems(res.data);
    });
  }, []);

  const markRead = (id) => {
    api.patch(`/notifications/read/${id}`).then(() => {
      setItems((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read: true } : n
        )
      );
    });
  };

  return (
    <div>
      <h1>Notifications</h1>

      {items.map((n) => (
        <div key={n.id}>
          <b>{n.title}</b>
          {!n.read && (
            <button onClick={() => markRead(n.id)}>
              Mark Read
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
