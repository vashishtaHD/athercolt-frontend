import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from "gsap";
import {
  Cloud, BrainCircuit, Container, Code2,
  UserSearch, Briefcase, FileCheck, Users,
  ArrowRight, Search, Rocket, Scale
} from "lucide-react";

const SERVICES = [
  { icon: Cloud, title: "Cloud Engineering", desc: "Scalable cloud architectures on AWS, Azure, and GCP." },
  { icon: BrainCircuit, title: "AI & Data", desc: "ML pipelines, analytics, and intelligent automation." },
  { icon: Container, title: "DevOps & Platform", desc: "CI/CD, Kubernetes, and infrastructure as code." },
  { icon: Code2, title: "Custom Software", desc: "Full-stack applications tailored to your needs." },
];

const TALENT = [
  { icon: UserSearch, title: "Technical Screening", desc: "Rigorous vetting for engineering excellence." },
  { icon: Briefcase, title: "Executive Search", desc: "C-suite and VP-level tech leadership." },
  { icon: FileCheck, title: "Contract & Full-Time", desc: "Flexible engagement models for any scale." },
  { icon: Users, title: "Embedded Hiring", desc: "On-site teams integrated with your culture." },
];

const STEPS = [
  { num: "01", icon: Search, title: "Discover", desc: "Deep analysis of your technical requirements and talent needs." },
  { num: "02", icon: Code2, title: "Build", desc: "Engineering solutions and candidate pipelines tailored to you." },
  { num: "03", icon: Rocket, title: "Deploy", desc: "Launch production-ready systems and onboard elite talent." },
  { num: "04", icon: Scale, title: "Scale", desc: "Grow your team and technology in lockstep." },
];

const LOGOS = ["Stripe", "Vercel", "Linear", "Notion", "Figma", "Supabase"];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: "easeOut" },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Home() {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-hero-animate]", {
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
      });
      gsap.from("[data-hero-image]", {
        scale: 1.08,
        opacity: 0,
        duration: 1.2,
        delay: 0.3,
        ease: "power2.out",
      });
    }, heroRef.current);
    return () => ctx.revert();
  }, []);

  return (
    <div className="pt-20">
      {/* ========== HERO ========== */}
      <section ref={heroRef} className="relative overflow-hidden bg-white" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Text */}
            <div className="order-2 lg:order-1">
              <p data-hero-animate className="font-body text-xs font-bold tracking-[0.25em] uppercase text-blue-700 mb-6">
                Engineering Services &middot; Talent Recruitment
              </p>
              <h1 data-hero-animate data-testid="hero-headline" className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.02] text-slate-900 mb-8">
                Building High-Performance Tech Teams.
              </h1>
              <p data-hero-animate data-testid="hero-subtext" className="font-body text-base sm:text-lg text-slate-500 leading-relaxed max-w-md mb-10">
                We deliver world-class engineering services and recruit the talent to scale them.
              </p>
              <div data-hero-animate className="flex flex-wrap gap-4">
                <Link
                  to="/careers"
                  data-testid="hero-cta-hire"
                  className="bg-blue-700 text-white font-body text-xs font-semibold tracking-widest uppercase px-8 py-4 hover:bg-blue-800 transition-colors duration-200 inline-flex items-center gap-2"
                >
                  Hire Talent <ArrowRight size={14} />
                </Link>
                <Link
                  to="/services"
                  data-testid="hero-cta-services"
                  className="border border-slate-300 text-slate-700 font-body text-xs font-semibold tracking-widest uppercase px-8 py-4 hover:border-blue-700 hover:text-blue-700 transition-colors duration-200"
                >
                  Explore Services
                </Link>
              </div>

              {/* Mini Stats */}
              <div data-hero-animate className="flex gap-10 mt-14 pt-10 border-t border-slate-100">
                {[
                  { val: "200+", label: "Engineers Placed" },
                  { val: "98%", label: "Client Retention" },
                  { val: "50+", label: "Enterprise Clients" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="font-heading text-2xl lg:text-3xl text-slate-900">{s.val}</p>
                    <p className="font-body text-[11px] text-slate-400 tracking-wider uppercase mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Image */}
            <div className="order-1 lg:order-2 relative">
              <div data-hero-image className="relative">
                <div className="aspect-[4/3] overflow-hidden bg-slate-50">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80"
                    alt="Aether Colt - High performance engineering"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Accent overlay block */}
                <div className="absolute -bottom-4 -left-4 w-28 h-28 bg-blue-700 hidden lg:flex items-end justify-start p-4">
                  <span className="font-body text-[10px] font-bold tracking-widest uppercase text-white/80 leading-tight">
                    Since<br />2019
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SERVICES + RECRUITMENT SPLIT ========== */}
      <section className="bg-slate-50/70 py-24 lg:py-32" data-testid="services-recruitment-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <p className="font-body text-xs font-bold tracking-[0.25em] uppercase text-blue-700 mb-4">What We Do</p>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-slate-900">Services & Talent</h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Tech Services */}
            <div>
              <motion.h3
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp}
                className="font-heading text-2xl text-slate-900 mb-8"
              >Tech Services</motion.h3>
              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
                variants={staggerContainer}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {SERVICES.map((s, i) => (
                  <motion.div
                    key={s.title}
                    variants={fadeUp}
                    custom={i}
                    data-testid={`service-card-${i}`}
                    whileHover={{ y: -4 }}
                    className="bg-white border border-slate-100 p-6 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
                  >
                    <s.icon size={24} className="text-blue-700 mb-4" strokeWidth={1.5} />
                    <h4 className="font-body text-sm font-bold text-slate-900 mb-2">{s.title}</h4>
                    <p className="font-body text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Talent Recruitment */}
            <div>
              <motion.h3
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp}
                className="font-heading text-2xl text-slate-900 mb-8"
              >Talent Recruitment</motion.h3>
              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
                variants={staggerContainer}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {TALENT.map((t, i) => (
                  <motion.div
                    key={t.title}
                    variants={fadeUp}
                    custom={i}
                    data-testid={`talent-card-${i}`}
                    whileHover={{ y: -4 }}
                    className="bg-white border border-slate-100 p-6 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
                  >
                    <t.icon size={24} className="text-blue-700 mb-4" strokeWidth={1.5} />
                    <h4 className="font-body text-sm font-bold text-slate-900 mb-2">{t.title}</h4>
                    <p className="font-body text-xs text-slate-500 leading-relaxed">{t.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURED IMAGE BREAK ========== */}
      <section className="bg-white py-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="aspect-[21/7] overflow-hidden bg-slate-100"
          >
            <img
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80"
              alt="Aether Colt workspace"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* ========== PROCESS SECTION ========== */}
      <section className="bg-white py-24 lg:py-32" data-testid="process-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <p className="font-body text-xs font-bold tracking-[0.25em] uppercase text-blue-700 mb-4">Our Process</p>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-slate-900">How We Work</h2>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                variants={fadeUp}
                custom={i}
                data-testid={`process-step-${i}`}
                whileHover={{ y: -4 }}
                className="relative p-8 border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 bg-white group"
              >
                <div className="w-12 h-12 bg-blue-700 text-white flex items-center justify-center font-body text-sm font-bold mb-6 group-hover:bg-blue-800 transition-colors">
                  {step.num}
                </div>
                <step.icon size={20} className="text-blue-600/40 mb-3" strokeWidth={1.5} />
                <h4 className="font-heading text-xl text-slate-900 mb-3">{step.title}</h4>
                <p className="font-body text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-slate-200" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== TRUST STRIP ========== */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        className="bg-slate-50/70 py-16 lg:py-20"
        data-testid="trust-section"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="font-body text-xs font-bold tracking-[0.25em] uppercase text-slate-400 text-center mb-10">
            Trusted by leading teams
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 lg:gap-16">
            {LOGOS.map((logo) => (
              <motion.span
                key={logo}
                data-testid={`trust-logo-${logo.toLowerCase()}`}
                className="font-body text-xl font-bold text-slate-300 cursor-default select-none"
                whileHover={{ color: "#1D4ED8" }}
                transition={{ duration: 0.2 }}
              >
                {logo}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ========== CTA SECTION ========== */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={fadeUp}
        className="bg-blue-700 py-20 lg:py-24"
        data-testid="cta-section"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-white mb-6">Ready to Scale?</h2>
          <p className="font-body text-base text-blue-100 max-w-lg mx-auto mb-10">
            Whether you need engineering services or elite talent, we're here to help you grow.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              data-testid="cta-contact-button"
              className="bg-white text-blue-700 font-body text-xs font-semibold tracking-widest uppercase px-8 py-4 hover:bg-blue-50 transition-colors duration-200"
            >
              Contact Us
            </Link>
            <Link
              to="/careers"
              data-testid="cta-careers-button"
              className="border border-white/30 text-white font-body text-xs font-semibold tracking-widest uppercase px-8 py-4 hover:bg-white/10 transition-colors duration-200"
            >
              View Open Roles
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
