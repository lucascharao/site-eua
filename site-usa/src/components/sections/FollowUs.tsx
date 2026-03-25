"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { Send, CheckCircle, Loader2 } from "lucide-react";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  description: string;
  expectedStartDate: string;
  howFoundUs: string;
}

const initialForm: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  description: "",
  expectedStartDate: "",
  howFoundUs: "",
};

const howFoundOptions = [
  "",
  "Google Search",
  "Instagram",
  "Facebook",
  "Referral from a Friend",
  "Nextdoor",
  "Yelp",
  "Home Advisor / Angi",
  "Drive-by / Yard Sign",
  "Other",
];

const inputClass =
  "w-full bg-[#111] border border-border-subtle rounded-xl px-4 py-3 text-white placeholder:text-[#555] focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30 transition-all text-sm";
const labelClass = "block text-[#999] text-xs font-semibold uppercase tracking-wider mb-1.5";

export function FollowUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [form, setForm] = useState<FormData>(initialForm);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send");
      }

      setSent(true);
      setForm(initialForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" ref={ref} className="relative py-24 md:py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#060606] to-[#0A0A0A]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gold/3 rounded-full blur-[200px]" />

      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 60, rotateX: 25 }}
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-10"
        >
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl font-bold mb-4">
            Ready to Love Your <span className="gold-gradient-text">Bathroom Again?</span>
          </h2>
          <TextShimmer
            as="p"
            className="text-lg font-[family-name:var(--font-cormorant)]"
            duration={4}
          >
            Fill this out in 60 seconds. The owner calls you personally within 24 hours with an honest quote. No gatekeepers.
          </TextShimmer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-10 rounded-2xl bg-surface border border-gold/30 text-center"
            >
              <CheckCircle className="w-16 h-16 text-gold mx-auto mb-4" />
              <h3 className="text-white text-2xl font-semibold mb-2">You&apos;re In!</h3>
              <p className="text-[#888]">The owner will personally call you within 24 hours. Not an assistant. Not a call center. The person who will tile your bathroom.</p>
              <button
                onClick={() => setSent(false)}
                className="mt-6 text-gold text-sm font-semibold hover:underline"
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="p-8 rounded-2xl bg-surface border border-border-subtle space-y-5"
            >
              {/* Name row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    First Name <span className="text-gold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(e) => update("firstName", e.target.value)}
                    placeholder="John"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Last Name <span className="text-gold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.lastName}
                    onChange={(e) => update("lastName", e.target.value)}
                    placeholder="Doe"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    Email <span className="text-gold">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="john@example.com"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Phone <span className="text-gold">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="(813) 555-0123"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Cracked tiles, mold, outdated look, want a full remodel..."
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Date & How found */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Expected Start Date</label>
                  <input
                    type="date"
                    value={form.expectedStartDate}
                    onChange={(e) => update("expectedStartDate", e.target.value)}
                    className={`${inputClass} [color-scheme:dark]`}
                  />
                </div>
                <div>
                  <label className={labelClass}>How did you find us?</label>
                  <select
                    value={form.howFoundUs}
                    onChange={(e) => update("howFoundUs", e.target.value)}
                    className={`${inputClass} appearance-none`}
                  >
                    {howFoundOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt || "Select an option"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={sending}
                whileHover={{ scale: sending ? 1 : 1.02 }}
                whileTap={{ scale: sending ? 1 : 0.98 }}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-[#0A0A0A] font-bold rounded-xl gold-glow transition-all disabled:opacity-60"
              >
                {sending ? (
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
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
