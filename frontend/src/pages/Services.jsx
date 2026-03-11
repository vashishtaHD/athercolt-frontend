import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Cloud, BrainCircuit, Container, Code2,
  ArrowRight, Server, Database, Shield,
  Cpu, BarChart3, GitBranch, Layers,
  UserSearch, Briefcase, FileCheck, Users
} from "lucide-react";

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
  visible: { transition: { staggerChildren: 0.12 } },
};

const SERVICES_DETAIL = [
  {
    icon: Cloud,
    title: "Cloud Engineering",
    desc: "We architect, migrate, and optimize cloud infrastructure to ensure performance, reliability, and cost efficiency at any scale.",
    features: [
      { icon: Server, label: "Multi-cloud strategy" },
      { icon: Shield, label: "Security-first architecture" },
      { icon: BarChart3, label: "Cost optimization" },
      { icon: Layers, label: "Serverless & containers" },
    ],
  },
  {
    icon: BrainCircuit,
    title: "AI & Data",
    desc: "From data pipelines to production ML models, we turn your data into actionable intelligence and competitive advantage.",
    features: [
      { icon: Cpu, label: "ML model development" },
      { icon: Database, label: "Data pipeline engineering" },
      { icon: BarChart3, label: "Analytics & BI" },
      { icon: BrainCircuit, label: "LLM integration" },
    ],
  },
  {
    icon: Container,
    title: "DevOps & Platform",
    desc: "Accelerate delivery with robust CI/CD pipelines, infrastructure as code, and platform engineering that scales with your team.",
    features: [
      { icon: GitBranch, label: "CI/CD pipelines" },
      { icon: Container, label: "Kubernetes orchestration" },
      { icon: Layers, label: "Infrastructure as code" },
      { icon: Shield, label: "Security automation" },
    ],
  },
  {
    icon: Code2,
    title: "Custom Software",
    desc: "Full-stack application development from concept to launch. We build performant, maintainable software tailored to your business.",
    features: [
      { icon: Code2, label: "Full-stack development" },
      { icon: Cpu, label: "API design & integration" },
      { icon: Database, label: "Database architecture" },
      { icon: Server, label: "Performance optimization" },
    ],
  },
];

const RECRUITMENT = [
  {
    icon: UserSearch,
    title: "Technical Screening",
    desc: "Rigorous multi-stage vetting including live coding assessments, system design interviews, and culture fit evaluation.",
  },
  {
    icon: Briefcase,
    title: "Executive Search",
    desc: "C-suite and VP-level technology leadership placement. We find the leaders who shape engineering culture.",
  },
  {
    icon: FileCheck,
    title: "Contract & Full-Time",
    desc: "Flexible engagement models. Whether you need a team for 3 months or are hiring permanent staff, we deliver.",
  },
  {
    icon: Users,
    title: "Diversity Hiring",
    desc: "Building inclusive teams that reflect your values",
  },
];

export default function Services() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-white py-24 lg:py-32" data-testid="services-hero">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="font-body text-xs font-bold tracking-[0.25em] uppercase text-blue-700 mb-4">Our Expertise</p>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-slate-900 mb-6 max-w-3xl">
              Engineering Excellence, Delivered.
            </h1>
            <p className="font-body text-base sm:text-lg text-slate-500 max-w-2xl leading-relaxed">
              From cloud infrastructure to AI systems, we provide the services and talent that power modern technology companies.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Engineering Services Detail */}
      <section className="bg-slate-50/70 py-24 lg:py-32" data-testid="engineering-services-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="mb-16"
          >
            <p className="font-body text-xs font-bold tracking-[0.25em] uppercase text-blue-700 mb-4">Engineering Services</p>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-slate-900">What We Build</h2>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="space-y-8"
          >
            {SERVICES_DETAIL.map((service, idx) => (
              <motion.div
                key={service.title}
                variants={fadeUp}
                custom={idx}
                data-testid={`service-detail-${idx}`}
                whileHover={{ y: -2 }}
                className="bg-white border border-slate-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                  <div className="p-8 lg:p-12 lg:col-span-2">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-blue-700/5 flex items-center justify-center">
                        <service.icon size={24} className="text-blue-700" strokeWidth={1.5} />
                      </div>
                      <h3 className="font-heading text-2xl text-slate-900">{service.title}</h3>
                    </div>
                    <p className="font-body text-sm text-slate-500 leading-relaxed max-w-lg">{service.desc}</p>
                  </div>
                  <div className="p-8 lg:p-12 bg-slate-50/50 border-t lg:border-t-0 lg:border-l border-slate-100">
                    <div className="space-y-4">
                      {service.features.map((f) => (
                        <div key={f.label} className="flex items-center gap-3">
                          <f.icon size={16} className="text-blue-600/60" strokeWidth={1.5} />
                          <span className="font-body text-sm text-slate-600">{f.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Talent Recruitment */}
      <section className="bg-white py-24 lg:py-32" data-testid="recruitment-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="mb-16"
          >
            <p className="font-body text-xs font-bold tracking-[0.25em] uppercase text-blue-700 mb-4">Talent Recruitment</p>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-slate-900">How We Hire</h2>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {RECRUITMENT.map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                custom={i}
                data-testid={`recruitment-card-${i}`}
                whileHover={{ y: -4 }}
                className="bg-white border border-slate-100 p-8 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
              >
                <item.icon size={28} className="text-blue-700 mb-5" strokeWidth={1.5} />
                <h4 className="font-heading text-xl text-slate-900 mb-3">{item.title}</h4>
                <p className="font-body text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true }}
        variants={fadeUp}
        className="bg-blue-700 py-20 lg:py-24"
        data-testid="services-cta"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl text-white mb-6">Let's Build Together</h2>
          <p className="font-body text-base text-blue-100 max-w-lg mx-auto mb-10">
            Tell us about your project. We'll assemble the right team and technology to make it happen.
          </p>
          <Link
            to="/contact"
            data-testid="services-cta-button"
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-body text-xs font-semibold tracking-widest uppercase px-8 py-4 hover:bg-blue-50 transition-colors"
          >
            Start a Conversation <ArrowRight size={14} />
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
