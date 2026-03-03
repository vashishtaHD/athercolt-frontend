import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, ArrowRight, CheckCircle, Loader2 } from "lucide-react";

const CONTACT_INFO = [
  { icon: Mail, label: "hello@athercolt.com", href: "mailto:hello@athercolt.com" },
  { icon: Phone, label: "+1 (555) 847-2930", href: "tel:+15558472930" },
  { icon: MapPin, label: "350 Fifth Avenue, New York, NY 10118", href: "#" },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const apiUrl = import.meta.env.VITE_CONTACT_API_URL || "/api/contact";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        setSubmitting(false);
        setSubmitted(true);
      } else {
        throw new Error("Failed to submit");
      }
    } catch (error) {
      console.error(error);
      setSubmitting(false);
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-white py-24 lg:py-28" data-testid="contact-hero">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="font-body text-xs font-bold tracking-[0.25em] uppercase text-blue-700 mb-4">Contact Us</p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-slate-900 mb-6">
            Let's Start a Conversation.
          </h1>
          <p className="font-body text-base sm:text-lg text-slate-500 max-w-2xl leading-relaxed">
            Whether you're looking for engineering services, talent recruitment, or a strategic partnership, we'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="bg-slate-50/70 py-24 lg:py-32" data-testid="contact-form-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-white border border-slate-100 p-8 lg:p-12">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-16 text-center"
                  >
                    <div className="w-16 h-16 bg-green-50 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32} className="text-green-600" />
                    </div>
                    <h3 className="font-heading text-2xl text-slate-900 mb-2">Message Sent</h3>
                    <p className="font-body text-sm text-slate-500 mb-6">We'll get back to you within 24 hours.</p>
                    <button
                      data-testid="contact-reset-button"
                      onClick={() => {
                        setSubmitted(false);
                        setForm({ name: "", email: "", company: "", message: "" });
                      }}
                      className="font-body text-xs font-semibold tracking-widest uppercase text-blue-700 hover:text-blue-800 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="font-body text-xs font-bold tracking-wider uppercase text-slate-500 block mb-2">Full Name</label>
                        <input
                          data-testid="contact-input-name"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          className="w-full border-b border-slate-200 bg-transparent px-0 py-3 font-body text-sm text-slate-900 focus:border-blue-600 focus:outline-none transition-colors"
                          placeholder="Jane Doe"
                        />
                      </div>
                      <div>
                        <label className="font-body text-xs font-bold tracking-wider uppercase text-slate-500 block mb-2">Email</label>
                        <input
                          data-testid="contact-input-email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          className="w-full border-b border-slate-200 bg-transparent px-0 py-3 font-body text-sm text-slate-900 focus:border-blue-600 focus:outline-none transition-colors"
                          placeholder="jane@company.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-body text-xs font-bold tracking-wider uppercase text-slate-500 block mb-2">Company</label>
                      <input
                        data-testid="contact-input-company"
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        className="w-full border-b border-slate-200 bg-transparent px-0 py-3 font-body text-sm text-slate-900 focus:border-blue-600 focus:outline-none transition-colors"
                        placeholder="Acme Corp"
                      />
                    </div>
                    <div>
                      <label className="font-body text-xs font-bold tracking-wider uppercase text-slate-500 block mb-2">Message</label>
                      <textarea
                        data-testid="contact-input-message"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full border-b border-slate-200 bg-transparent px-0 py-3 font-body text-sm text-slate-900 focus:border-blue-600 focus:outline-none transition-colors resize-none"
                        placeholder="Tell us about your project or hiring needs..."
                      />
                    </div>
                    <button
                      data-testid="contact-submit-button"
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center gap-2 bg-blue-700 text-white font-body text-xs font-semibold tracking-widest uppercase px-8 py-4 hover:bg-blue-800 transition-colors disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2">
              <div className="space-y-8">
                <div>
                  <h3 className="font-heading text-2xl text-slate-900 mb-6">Get in Touch</h3>
                  <p className="font-body text-sm text-slate-500 leading-relaxed">
                    Our team is available Monday through Friday, 9am to 6pm EST. We typically respond within 24 hours.
                  </p>
                </div>

                <div className="space-y-5">
                  {CONTACT_INFO.map((info) => (
                    <a
                      key={info.label}
                      href={info.href}
                      data-testid={`contact-info-${info.label.substring(0, 10).toLowerCase().replace(/\s+/g, '-')}`}
                      className="flex items-center gap-4 group"
                    >
                      <div className="w-10 h-10 bg-blue-700/5 flex items-center justify-center flex-shrink-0">
                        <info.icon size={18} className="text-blue-700" strokeWidth={1.5} />
                      </div>
                      <span className="font-body text-sm text-slate-600 group-hover:text-blue-700 transition-colors">
                        {info.label}
                      </span>
                    </a>
                  ))}
                </div>

                {/* Map placeholder */}
                <div className="aspect-[4/3] bg-slate-100 border border-slate-200 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin size={32} className="text-slate-300 mx-auto mb-2" />
                    <p className="font-body text-xs text-slate-400">New York, NY</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
