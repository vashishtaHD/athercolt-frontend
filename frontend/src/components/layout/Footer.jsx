import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const FOOTER_COLS = [
  {
    title: "Services",
    links: [
      { label: "Cloud Engineering", path: "/services" },
      { label: "AI & Data", path: "/services" },
      { label: "DevOps & Platform", path: "/services" },
      { label: "Custom Software", path: "/services" },
    ],
  },
  {
    title: "Talent",
    links: [
      { label: "Technical Screening", path: "/services" },
      { label: "Executive Search", path: "/services" },
      { label: "Contract Staffing", path: "/careers" },
      { label: "Full-Time Hiring", path: "/careers" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", path: "/about" },
      { label: "Careers", path: "/careers" },
      { label: "Contact", path: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer data-testid="footer" className="bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <img src="/athercolt-logo-white.png" alt="Aether Colt Logo" className="h-16 w-auto" />
            </Link>
            <p className="font-body text-slate-400 text-sm leading-relaxed mt-6 max-w-sm">
              Building high-performance tech teams through world-class engineering services and elite talent recruitment.
            </p>
            <a
              href="mailto:hello@aethercolt.com"
              data-testid="footer-email"
              className="inline-flex items-center gap-2 text-blue-400 font-body text-sm font-semibold mt-6 hover:text-blue-300 transition-colors"
            >
              hello@aethercolt.com <ArrowUpRight size={14} />
            </a>
          </div>

          {/* Link Columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <h4 className="font-body text-xs font-bold tracking-widest uppercase text-slate-400 mb-6">
                {col.title}
              </h4>
              <ul className="space-y-4">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                      className="font-body text-sm text-slate-300 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Aether Colt. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" data-testid="footer-privacy" className="font-body text-xs text-slate-500 hover:text-slate-300 transition-colors">Privacy</a>
            <a href="#" data-testid="footer-terms" className="font-body text-xs text-slate-500 hover:text-slate-300 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
