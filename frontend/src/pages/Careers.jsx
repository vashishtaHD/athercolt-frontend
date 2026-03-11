import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Clock, ArrowRight, Send } from "lucide-react";
import { getDailyJobs, getCategories } from "../data/jobs";
import ApplicationModal from "../components/ApplicationModal";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.04, ease: "easeOut" },
  }),
};

export default function Careers() {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const dailyJobs = useMemo(() => getDailyJobs(10), []);
  const categories = useMemo(() => ["All", ...getCategories(dailyJobs)], [dailyJobs]);

  const filteredJobs = useMemo(() => {
    return dailyJobs.filter((job) => {
      const matchesCategory = filter === "All" || job.category === filter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        q === "" ||
        job.title.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        job.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [filter, searchQuery, dailyJobs]);

  const techCategories = ["Engineering", "DevOps & Cloud", "Data & AI"];
  const techJobs = useMemo(() => filteredJobs.filter(j => techCategories.includes(j.category)), [filteredJobs]);
  const nonTechJobs = useMemo(() => filteredJobs.filter(j => !techCategories.includes(j.category)), [filteredJobs]);

  const openModal = (job) => {
    setSelectedJob(job);
    setModalOpen(true);
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-white py-20 lg:py-24" data-testid="careers-hero">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end">
            <div>
              <p className="font-body text-xs font-bold tracking-[0.25em] uppercase text-blue-700 mb-4">
                Open Roles
              </p>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-slate-900 mb-5 leading-[1.05]">
                Find Your Next Role.
              </h1>
              <p className="font-body text-base sm:text-lg text-slate-500 max-w-lg leading-relaxed">
                We partner with top companies to fill high-impact positions across engineering, data, operations, and more.
              </p>
            </div>
            <div className="flex lg:justify-end">
              <a
                href="#contact-cta"
                data-testid="cant-find-role-cta"
                className="inline-flex items-center gap-3 bg-blue-700 text-white font-body text-xs font-semibold tracking-widest uppercase px-8 py-4 hover:bg-blue-800 transition-colors"
              >
                <Send size={14} />
                Can't Find Your Role? Let Us Know
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Filters + Listings */}
      <section className="bg-slate-50/70 py-16 lg:py-24" data-testid="careers-listings">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Filter Bar */}
          <div className="flex flex-col gap-5 mb-10">
            {/* Search */}
            <div className="relative max-w-md">
              <Search size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                data-testid="careers-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search roles, skills, or locations..."
                className="w-full border-b border-slate-200 bg-transparent pl-6 pr-0 py-3 font-body text-sm text-slate-900 focus:border-blue-600 focus:outline-none transition-colors"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  data-testid={`filter-${cat.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-')}`}
                  onClick={() => setFilter(cat)}
                  className={`font-body text-xs font-semibold tracking-wider px-4 py-2 transition-colors duration-200 border ${filter === cat
                    ? "bg-blue-700 text-white border-blue-700"
                    : "bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-700"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Job Count */}
          <p className="font-body text-xs text-slate-400 mb-6">
            Showing <span className="text-slate-700 font-semibold">{filteredJobs.length}</span> of {dailyJobs.length} role{dailyJobs.length !== 1 ? "s" : ""}
          </p>

          {/* Job Cards */}
          {filteredJobs.length === 0 ? (
            <div data-testid="no-results" className="text-center py-16">
              <p className="font-body text-base text-slate-400 mb-4">No matching roles found.</p>
              <a
                href="#contact-cta"
                className="inline-flex items-center gap-2 text-blue-700 font-body text-sm font-semibold hover:text-blue-800 transition-colors bg-blue-50 px-6 py-3"
              >
                Tell us what you're looking for <ArrowRight size={14} />
              </a>
            </div>
          ) : (
            <div className="space-y-16">
              {techJobs.length > 0 && (
                <div>
                  <h2 className="font-heading text-2xl text-slate-900 mb-6 border-b border-slate-200 pb-4">Tech Roles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {techJobs.map((job, i) => (
                      <motion.div
                        key={job.id}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        custom={i % 9}
                        whileHover={{ y: -4 }}
                        data-testid={`job-card-${job.id}`}
                        className="bg-white border border-slate-100 p-6 hover:border-blue-200 hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col"
                        onClick={() => openModal(job)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-heading text-lg text-slate-900 group-hover:text-blue-700 transition-colors leading-snug pr-4">
                            {job.title}
                          </h3>
                          <span className="font-body text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 bg-blue-50 text-blue-700 whitespace-nowrap flex-shrink-0">
                            {job.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                          <span className="flex items-center gap-1.5 font-body text-xs text-slate-400">
                            <MapPin size={12} /> {job.location}
                          </span>
                          <span className="flex items-center gap-1.5 font-body text-xs text-slate-400">
                            <Clock size={12} /> {job.type}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-5 h-full content-start">
                          {job.tags.map((tag) => (
                            <span
                              key={tag}
                              className="font-body text-[11px] font-medium text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-1"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <button
                          data-testid={`apply-button-${job.id}`}
                          className="inline-flex items-center gap-2 font-body text-xs font-semibold tracking-widest uppercase text-blue-700 group-hover:text-blue-800 transition-colors mt-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal(job);
                          }}
                        >
                          Apply Now <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {nonTechJobs.length > 0 && (
                <div>
                  <h2 className="font-heading text-2xl text-slate-900 mb-6 border-b border-slate-200 pb-4">Non-Tech Roles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {nonTechJobs.map((job, i) => (
                      <motion.div
                        key={job.id}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        custom={i % 9}
                        whileHover={{ y: -4 }}
                        data-testid={`job-card-${job.id}`}
                        className="bg-white border border-slate-100 p-6 hover:border-blue-200 hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col"
                        onClick={() => openModal(job)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-heading text-lg text-slate-900 group-hover:text-blue-700 transition-colors leading-snug pr-4">
                            {job.title}
                          </h3>
                          <span className="font-body text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 bg-blue-50 text-blue-700 whitespace-nowrap flex-shrink-0">
                            {job.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                          <span className="flex items-center gap-1.5 font-body text-xs text-slate-400">
                            <MapPin size={12} /> {job.location}
                          </span>
                          <span className="flex items-center gap-1.5 font-body text-xs text-slate-400">
                            <Clock size={12} /> {job.type}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-5 h-full content-start">
                          {job.tags.map((tag) => (
                            <span
                              key={tag}
                              className="font-body text-[11px] font-medium text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-1"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <button
                          data-testid={`apply-button-${job.id}`}
                          className="inline-flex items-center gap-2 font-body text-xs font-semibold tracking-widest uppercase text-blue-700 group-hover:text-blue-800 transition-colors mt-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal(job);
                          }}
                        >
                          Apply Now <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Can't Find Role CTA */}
      <section id="contact-cta" className="bg-blue-700 py-20 lg:py-24" data-testid="careers-contact-cta">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl text-white mb-4">Don't See the Right Fit?</h2>
          <p className="font-body text-base text-blue-100 max-w-lg mx-auto mb-10">
            Send us your profile and we'll match you with the right opportunity. New roles are added regularly.
          </p>
          <button
            data-testid="careers-bottom-apply-cta"
            onClick={() => {
              setSelectedJob({ title: "General Application", location: "Various", type: "Various" });
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-body text-xs font-semibold tracking-widest uppercase px-8 py-4 hover:bg-blue-50 transition-colors"
          >
            Submit Your Profile <ArrowRight size={14} />
          </button>
        </div>
      </section>

      <ApplicationModal
        job={selectedJob}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
