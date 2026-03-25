"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Send, CheckCircle, Loader2, AlertCircle } from "lucide-react";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  description: string;
  expectedStartDate: string;
  howFoundUs: string;
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  description: "",
  expectedStartDate: "",
  howFoundUs: "",
};

const howFoundUsOptions = [
  "Google Search",
  "Instagram",
  "Facebook",
  "Nextdoor",
  "Friend / Referral",
  "Drove by a job site",
  "Other",
];

export function ContactForm() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setFormData(initialFormData);

      // Redirect to Calendly if URL is available
      if (data.calendlyUrl) {
        setTimeout(() => {
          window.location.href = data.calendlyUrl;
        }, 2000);
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const inputClasses =
    "w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-[#666] focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30 transition-all duration-300";

  if (status === "success") {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto text-center py-16 px-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
        >
          <CheckCircle className="w-20 h-20 text-gold mx-auto mb-6" />
        </motion.div>
        <h3 className="font-[family-name:var(--font-playfair)] text-3xl font-bold mb-4">
          Thank You!
        </h3>
        <p className="text-[#999] text-lg mb-6">
          We received your request. Our team will reach out within 24 hours to schedule your free estimate.
        </p>
        <p className="text-gold/70 text-sm">Redirecting to schedule your appointment...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm text-gold/80 mb-1.5 font-medium">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              placeholder="John"
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm text-gold/80 mb-1.5 font-medium">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              placeholder="Smith"
              className={inputClasses}
            />
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm text-gold/80 mb-1.5 font-medium">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="john@example.com"
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm text-gold/80 mb-1.5 font-medium">
              Phone *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="(813) 555-0123"
              className={inputClasses}
            />
          </div>
        </div>

        {/* Project description */}
        <div>
          <label htmlFor="description" className="block text-sm text-gold/80 mb-1.5 font-medium">
            Tell us about your project
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Guest bathroom remodel, new tile shower, steam shower..."
            className={inputClasses + " resize-none"}
          />
        </div>

        {/* Expected start & How found us */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="expectedStartDate" className="block text-sm text-gold/80 mb-1.5 font-medium">
              When do you want to start?
            </label>
            <select
              id="expectedStartDate"
              name="expectedStartDate"
              value={formData.expectedStartDate}
              onChange={handleChange}
              className={inputClasses + " appearance-none"}
            >
              <option value="">Select timing...</option>
              <option value="ASAP">ASAP</option>
              <option value="1-2 weeks">1-2 weeks</option>
              <option value="1 month">Within a month</option>
              <option value="2-3 months">2-3 months</option>
              <option value="Just exploring">Just exploring options</option>
            </select>
          </div>
          <div>
            <label htmlFor="howFoundUs" className="block text-sm text-gold/80 mb-1.5 font-medium">
              How did you find us?
            </label>
            <select
              id="howFoundUs"
              name="howFoundUs"
              value={formData.howFoundUs}
              onChange={handleChange}
              className={inputClasses + " appearance-none"}
            >
              <option value="">Select...</option>
              {howFoundUsOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error message */}
        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-red-400 bg-red-400/10 px-4 py-3 rounded-lg"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{errorMsg}</span>
          </motion.div>
        )}

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={status === "submitting"}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-[#0A0A0A] font-bold text-lg rounded-xl gold-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Get My Free Estimate
            </>
          )}
        </motion.button>

        <p className="text-center text-[#666] text-xs">
          No spam. No pressure. We&apos;ll get back to you within 24 hours.
        </p>
      </form>
    </motion.div>
  );
}
