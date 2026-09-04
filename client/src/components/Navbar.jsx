import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "Company" },
  { to: "/technologies", label: "Technologies" },
  { to: "/solutions", label: "Solutions" },
  { to: "/products", label: "Products" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-ink/80 border-b border-white/10">
      <div className="container-x flex items-center justify-between h-16">
        <Link to="/" className="font-display font-bold text-lg tracking-tight">
          SENSORA
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `hover:text-accent transition-colors ${isActive ? "text-accent" : "text-white/80"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <Link to="/contact" className="hidden md:inline-block btn-primary !py-2 !px-5 text-sm">
          Build With Sensora
        </Link>

        <button className="md:hidden text-white" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-white/10 bg-ink px-6 py-4 flex flex-col gap-4 text-sm">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-white/80 hover:text-accent">
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
