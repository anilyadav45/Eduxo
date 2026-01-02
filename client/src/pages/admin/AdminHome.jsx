import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminHome() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">
        Welcome, {user?.name}
      </h1>

      <button
        onClick={handleLogout}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
