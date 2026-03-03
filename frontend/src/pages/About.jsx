import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Target, Zap, Shield, Heart, ArrowRight } from "lucide-react";

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

const VALUES = [
  { icon: Target, title: "Precision", desc: "Every solution is crafted with meticulous attention to detail and measurable outcomes." },
  { icon: Zap, title: "Velocity", desc: "We move fast without compromising quality. Speed to market is a competitive advantage." },
  { icon: Shield, title: "Integrity", desc: "Transparent communication, honest assessments, and commitments we always keep." },
  { icon: Heart, title: "Partnership", desc: "We succeed when our clients succeed. Every engagement is a long-term relationship." },
];

const STATS = [
  { value: "200+", label: "Engineers Placed" },
  { value: "50+", label: "Enterprise Clients" },
  { value: "98%", label: "Client Retention" },
  { value: "12", label: "Countries Served" },
];

const TEAM = [
  { name: "Marcus Chen", role: "CEO & Founder", img: "https://images.unsplash.com/photo-1769636929261-e913ed023c83?w=400&h=400&fit=crop&crop=face" },
  { name: "Sarah Mitchell", role: "VP of Engineering", img: "https://images.unsplash.com/photo-1769636929388-99eff95d3bf1?w=400&h=400&fit=crop&crop=face" },
  { name: "David Park", role: "Head of Talent", img: "https://images.unsplash.com/photo-1762522927402-f390672558d8?w=400&h=400&fit=crop&crop=face" },
  { name: "Elena Rodriguez", role: "Director of Operations", img: "https://images.unsplash.com/photo-1769636930047-4478f12cf430?w=400&h=400&fit=crop&crop=face" },
];

export default function About() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-white py-24 lg:py-32" data-testid="about-hero">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <p className="font-body text-xs font-bold tracking-[0.25em] uppercase text-blue-700 mb-4">About Athercolt</p>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-slate-900 mb-6 leading-[1.05]">
                The Team Behind the Teams.
              </h1>
              <p className="font-body text-base text-slate-500 leading-relaxed mb-8">
                Founded in 2019, Athercolt was born from a simple observation: the best technology companies are defined by the quality of their people and processes. We bridge the gap between engineering ambition and execution.
              </p>
              <p className="font-body text-sm text-slate-400 leading-relaxed">
                Today, we serve over 50 enterprise clients across 12 countries, providing both engineering services and elite talent acquisition that powers the next generation of technology products.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1690383922983-90d7a4658ef3?w=800&h=600&fit=crop"
                  alt="Athercolt team collaborating"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-blue-700 text-white p-6 hidden lg:block">
                <p className="font-heading text-3xl">6+</p>
                <p className="font-body text-xs tracking-wider uppercase mt-1">Years of Excellence</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        className="bg-slate-950 py-16 lg:py-20"
        data-testid="stats-section"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`} className="text-center">
                <p className="font-heading text-4xl lg:text-5xl text-white mb-2">{stat.value}</p>
                <p className="font-body text-xs font-semibold tracking-widest uppercase text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Values */}
      <section className="bg-white py-24 lg:py-32" data-testid="values-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <p className="font-body text-xs font-bold tracking-[0.25em] uppercase text-blue-700 mb-4">Our Values</p>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-slate-900">What Drives Us</h2>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {VALUES.map((val, i) => (
              <motion.div
                key={val.title}
                variants={fadeUp}
                custom={i}
                data-testid={`value-card-${i}`}
                whileHover={{ y: -4 }}
                className="border border-slate-100 p-8 hover:border-blue-200 hover:shadow-lg transition-all duration-300 bg-white"
              >
                <val.icon size={28} className="text-blue-700 mb-5" strokeWidth={1.5} />
                <h4 className="font-heading text-xl text-slate-900 mb-3">{val.title}</h4>
                <p className="font-body text-xs text-slate-500 leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-slate-50/70 py-24 lg:py-32" data-testid="team-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <p className="font-body text-xs font-bold tracking-[0.25em] uppercase text-blue-700 mb-4">Leadership</p>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-slate-900">Meet Our Team</h2>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                variants={fadeUp}
                custom={i}
                data-testid={`team-member-${i}`}
                whileHover={{ y: -4 }}
                className="bg-white border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="aspect-square bg-slate-100">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div className="p-6">
                  <h4 className="font-heading text-lg text-slate-900">{member.name}</h4>
                  <p className="font-body text-xs text-slate-500 mt-1">{member.role}</p>
                </div>
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
        data-testid="about-cta"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl text-white mb-6">Join the Athercolt Team</h2>
          <p className="font-body text-base text-blue-100 max-w-lg mx-auto mb-10">
            We're always looking for exceptional people who want to make an impact.
          </p>
          <Link
            to="/careers"
            data-testid="about-cta-careers"
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-body text-xs font-semibold tracking-widest uppercase px-8 py-4 hover:bg-blue-50 transition-colors"
          >
            View Open Roles <ArrowRight size={14} />
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
