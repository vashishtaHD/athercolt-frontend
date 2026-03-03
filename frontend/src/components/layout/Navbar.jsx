import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { path: "/", label: "Home" },
  { path: "/services", label: "Services" },
  { path: "/about", label: "About" },
  { path: "/careers", label: "Careers" },
  { path: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav data-testid="navbar" className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-20">
        <Link to="/" data-testid="navbar-logo" className="flex items-center gap-2 font-heading text-xl tracking-tight text-slate-900">
          <img src="/athercolt-logo.png" alt="Aether Colt Logo" className="h-8 w-auto mix-blend-multiply" />
          Aether Colt
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              data-testid={`nav-link-${link.label.toLowerCase()}`}
              className={`font-body text-sm font-semibold tracking-wide uppercase transition-colors duration-200 ${location.pathname === link.path
                  ? "text-blue-700"
                  : "text-slate-500 hover:text-slate-900"
                }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/contact"
            data-testid="nav-cta-button"
            className="bg-blue-700 text-white font-body text-xs font-semibold tracking-widest uppercase px-7 py-3 hover:bg-blue-800 transition-colors duration-200"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          data-testid="mobile-menu-toggle"
          className="md:hidden p-2 text-slate-700"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  data-testid={`mobile-nav-${link.label.toLowerCase()}`}
                  onClick={() => setMobileOpen(false)}
                  className={`font-body text-sm font-semibold tracking-wide uppercase ${location.pathname === link.path
                      ? "text-blue-700"
                      : "text-slate-500"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/contact"
                data-testid="mobile-nav-cta"
                onClick={() => setMobileOpen(false)}
                className="bg-blue-700 text-white text-center font-body text-xs font-semibold tracking-widest uppercase px-7 py-3 mt-2"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
