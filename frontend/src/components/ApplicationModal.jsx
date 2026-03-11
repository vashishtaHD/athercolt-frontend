import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, CheckCircle, Loader2 } from "lucide-react";

export default function ApplicationModal({ job, isOpen, onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    willingToRelocate: "",
    sponsorshipRequired: "",
    visaStatus: "",
    linkedin: ""
  });
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  }, []);

  const handleFileSelect = (e) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (job?.title) {
        formData.append("jobTitle", job.title);
      }
      if (file) {
        formData.append("resume", file);
      }

      // Ensure the worker is configured to accept POST at this endpoint
      const response = await fetch("/api/applications", {
        method: "POST",
        body: formData, // fetch will set the correct multipart/form-data boundary
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
      alert("Failed to submit application. Please try again.");
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setForm({
        name: "", email: "", phone: "", location: "", willingToRelocate: "", sponsorshipRequired: "", visaStatus: "", linkedin: ""
      });
      setFile(null);
      setSubmitting(false);
      setSubmitted(false);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          data-testid="application-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4"
          onClick={handleClose}
        >
          <motion.div
            data-testid="application-modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-white w-full max-w-lg border border-slate-200 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 pt-8 pb-4 shrink-0 bg-white z-10">
              <div>
                <p className="font-body text-xs font-bold tracking-widest uppercase text-blue-600 mb-1">Apply Now</p>
                <h3 className="font-heading text-2xl text-slate-900">{job?.title}</h3>
                <p className="font-body text-sm text-slate-400 mt-1">{job?.location} &middot; {job?.type}</p>
              </div>
              <button
                data-testid="modal-close-button"
                onClick={handleClose}
                className="p-2 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content box - Scrollable */}
            <div className="px-8 pb-8 overflow-y-auto custom-scrollbar">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 bg-blue-50 flex items-center justify-center mb-4">
                    <CheckCircle size={32} className="text-blue-600" />
                  </div>
                  <h4 className="font-heading text-xl text-slate-900 mb-2">Application Submitted</h4>
                  <p className="font-body text-sm text-slate-500 mb-6">We'll review your profile and get back to you shortly.</p>
                  <button
                    data-testid="modal-done-button"
                    onClick={handleClose}
                    className="bg-blue-600 text-white font-body text-xs font-semibold tracking-widest uppercase px-8 py-3 hover:bg-blue-700 transition-colors"
                  >
                    Done
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 mt-2">
                  <div className="grid grid-cols-2 gap-5">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="font-body text-[10px] font-bold tracking-widest uppercase text-slate-500 block mb-2">Full Name <span className="text-blue-600">*</span></label>
                      <input
                        data-testid="input-name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full border-b border-slate-200 bg-transparent px-0 py-2 font-body text-sm text-slate-900 focus:border-blue-600 focus:outline-none transition-colors"
                        placeholder="Jane Doe"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="font-body text-[10px] font-bold tracking-widest uppercase text-slate-500 block mb-2">Email <span className="text-blue-600">*</span></label>
                      <input
                        data-testid="input-email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full border-b border-slate-200 bg-transparent px-0 py-2 font-body text-sm text-slate-900 focus:border-blue-600 focus:outline-none transition-colors"
                        placeholder="jane@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="font-body text-[10px] font-bold tracking-widest uppercase text-slate-500 block mb-2">Phone Number <span className="text-blue-600">*</span></label>
                      <input
                        data-testid="input-phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        className="w-full border-b border-slate-200 bg-transparent px-0 py-2 font-body text-sm text-slate-900 focus:border-blue-600 focus:outline-none transition-colors"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="font-body text-[10px] font-bold tracking-widest uppercase text-slate-500 block mb-2">Current Location <span className="text-blue-600">*</span></label>
                      <input
                        data-testid="input-location"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        required
                        className="w-full border-b border-slate-200 bg-transparent px-0 py-2 font-body text-sm text-slate-900 focus:border-blue-600 focus:outline-none transition-colors"
                        placeholder="City, State"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="font-body text-[10px] font-bold tracking-widest uppercase text-slate-500 block mb-3">Willing to Relocate? <span className="text-blue-600">*</span></label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="willingToRelocate" value="Yes" required onChange={handleChange} className="accent-blue-600 w-4 h-4 cursor-pointer" />
                          <span className="font-body text-sm text-slate-700">Yes</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="willingToRelocate" value="No" required onChange={handleChange} className="accent-blue-600 w-4 h-4 cursor-pointer" />
                          <span className="font-body text-sm text-slate-700">No</span>
                        </label>
                      </div>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="font-body text-[10px] font-bold tracking-widest uppercase text-slate-500 block mb-3">Sponsorship Required? <span className="text-blue-600">*</span></label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="sponsorshipRequired" value="Yes" required onChange={handleChange} className="accent-blue-600 w-4 h-4 cursor-pointer" />
                          <span className="font-body text-sm text-slate-700">Yes</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="sponsorshipRequired" value="No" required onChange={handleChange} className="accent-blue-600 w-4 h-4 cursor-pointer" />
                          <span className="font-body text-sm text-slate-700">No</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="font-body text-[10px] font-bold tracking-widest uppercase text-slate-500 block mb-2">Visa Status <span className="text-blue-600">*</span></label>
                      <input
                        data-testid="input-visa"
                        name="visaStatus"
                        value={form.visaStatus}
                        onChange={handleChange}
                        required
                        className="w-full border-b border-slate-200 bg-transparent px-0 py-2 font-body text-sm text-slate-900 focus:border-blue-600 focus:outline-none transition-colors"
                        placeholder="US Citizen / GC / etc."
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="font-body text-[10px] font-bold tracking-widest uppercase text-slate-500 block mb-2">LinkedIn Profile</label>
                      <input
                        data-testid="input-linkedin"
                        name="linkedin"
                        value={form.linkedin}
                        onChange={handleChange}
                        className="w-full border-b border-slate-200 bg-transparent px-0 py-2 font-body text-sm text-slate-900 focus:border-blue-600 focus:outline-none transition-colors"
                        placeholder="linkedin.com/in/janedoe"
                      />
                    </div>
                  </div>

                  {/* Resume Upload */}
                  <div>
                    <label className="font-body text-[10px] font-bold tracking-widest uppercase text-slate-500 block mb-2">Resume <span className="text-blue-600">*</span></label>
                    <div
                      data-testid="resume-dropzone"
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${dragActive ? "border-blue-600 bg-blue-50/50" : "border-slate-200 hover:border-slate-300"
                        }`}
                    >
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="resume-upload"
                      />
                      <label htmlFor="resume-upload" className="cursor-pointer block">
                        <Upload size={20} className="mx-auto text-slate-400 mb-2" />
                        {file ? (
                          <p className="font-body text-sm text-blue-600 font-semibold">{file.name}</p>
                        ) : (
                          <>
                            <p className="font-body text-sm text-slate-500">
                              Drag & drop or <span className="text-blue-600 font-semibold">browse</span>
                            </p>
                            <p className="font-body text-xs text-slate-400 mt-1">PDF, DOC up to 10MB</p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="pt-2 sticky bottom-0 bg-white">
                    <button
                      data-testid="submit-application-button"
                      type="submit"
                      disabled={submitting || !file}
                      className="w-full bg-blue-600 text-white font-body text-xs font-semibold tracking-widest uppercase px-8 py-4 hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </button>
                    {!file && <p className="text-center text-red-500 text-[10px] mt-2 font-body tracking-wider uppercase">Resume is required</p>}
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
