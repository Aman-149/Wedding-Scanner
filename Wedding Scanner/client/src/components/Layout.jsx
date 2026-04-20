import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/", label: "Upload Guests" },
  { to: "/qrcodes", label: "QR Codes" },
  { to: "/scanner", label: "Scanner" },
  { to: "/dashboard", label: "Dashboard" },
];

function Layout() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">Wedding QR Guest Manager</h1>
          <nav className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
