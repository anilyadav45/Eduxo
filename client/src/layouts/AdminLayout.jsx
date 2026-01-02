import Sidebar from "../components/Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="ADMIN" />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
