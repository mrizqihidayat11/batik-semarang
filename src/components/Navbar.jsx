import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, ScanLine, ArrowUpRight } from "lucide-react";
import Brand from "./Brand";
import ApiConnectionBar from "./ApiConnectionBar";
const links = [
  ["/", "Beranda"],
  ["/tentang", "Tentang"],
  ["/klasifikasi", "Klasifikasi"],
  ["/data-batik", "Data Batik"],
  ["/evaluasi", "Evaluasi Model"],
];
export default function Navbar({ connection }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-cream/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[88px] max-w-[1320px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-12">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          aria-label="Batik Semarang beranda"
        >
          <Brand />
        </Link>
        <nav
          aria-label="Navigasi utama"
          className="hidden items-center gap-7 lg:flex"
        >
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              end={to === "/"}
              to={to}
              className={({ isActive }) =>
                `relative py-8 text-[13px] font-medium transition hover:text-brown ${isActive ? "text-brown after:absolute after:bottom-5 after:left-1/2 after:h-1 after:w-1 after:rounded-full after:bg-brown" : "text-muted"}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <Link
          to="/klasifikasi"
          className="hidden items-center gap-2 rounded-lg bg-brown px-4 py-3 text-xs font-semibold text-white transition hover:bg-navy sm:inline-flex"
        >
          <ScanLine size={15} /> Coba Klasifikasi <ArrowUpRight size={15} />
        </Link>
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          className="rounded-lg p-2 lg:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav
          aria-label="Navigasi seluler"
          className="space-y-1 border-t border-line px-5 py-4 lg:hidden"
        >
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              end={to === "/"}
              onClick={() => setOpen(false)}
              to={to}
              className={({ isActive }) =>
                `block rounded-lg px-4 py-3 text-sm ${isActive ? "bg-brown text-white" : "hover:bg-white"}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      )}
      <ApiConnectionBar connection={connection} />
    </header>
  );
}
