export default function Sidebar({ role }) {
  return (
    <aside className="w-64 bg-white border-r hidden md:block">
      <div className="p-4 font-bold text-xl">EduXo</div>

      <nav className="p-2 space-y-2 text-sm">
        <p className="p-2 rounded hover:bg-slate-100">Dashboard</p>
        <p className="p-2 rounded hover:bg-slate-100">Attendance</p>
        <p className="p-2 rounded hover:bg-slate-100">Notes</p>
      </nav>
    </aside>
  );
}
