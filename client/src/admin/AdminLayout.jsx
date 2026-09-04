import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/content/technology", label: "Technologies" },
  { to: "/admin/content/solution", label: "Solutions" },
  { to: "/admin/content/product", label: "Products" },
  { to: "/admin/content/project", label: "Projects" },
  { to: "/admin/content/research", label: "R&D" },
  { to: "/admin/content/career", label: "Careers" },
  { to: "/admin/sections", label: "Homepage / Text" },
  { to: "/admin/submissions", label: "Contact Leads" },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-ink text-white">
      <aside className="w-64 border-r border-white/10 flex flex-col shrink-0">
        <div className="px-6 py-5 border-b border-white/10">
          <div className="font-display font-bold">SENSORA<span className="text-accent">.</span></div>
          <div className="text-xs text-white/40 mt-1">Admin Panel</div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive ? "bg-accent text-ink font-semibold" : "text-white/70 hover:bg-white/5"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-white/10">
          <div className="text-sm text-white/70 mb-2 truncate">{admin?.username}</div>
          <button onClick={logout} className="text-xs text-white/50 hover:text-accent">
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
