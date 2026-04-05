"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const CATEGORIES = [
  "Bug Report / Site Error",
  "Topic Suggestion",
  "Business / Partnership",
  "Other",
];

export default function ContactPage() {
  const { data: session } = useSession();
  const [form, setForm] = useState({ name: "", email: "", category: "", message: "" });

  useEffect(() => {
    if (session?.user) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || session.user.name || "",
        email: prev.email || session.user.email || "",
      }));
    }
  }, [session]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-sm font-body text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all";

  if (success) {
    return (
      <div className="px-5 md:px-8 py-12 max-w-xl mr-auto">
        <div className="bg-success/10 border border-success/20 rounded-2xl p-8 text-center">
          <span className="material-symbols-outlined text-[48px] text-success mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
          <h2 className="font-headline font-bold text-xl text-on-surface mb-2">Message Sent!</h2>
          <p className="text-sm font-body text-on-surface-variant">
            Thank you! We'll get back to you soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 md:px-8 py-12 max-w-xl mr-auto">
      {/* Header */}
      <section className="mb-8">
        <p className="text-[10px] font-label font-bold uppercase tracking-widest text-outline mb-2">Get in Touch</p>
        <h1 className="font-headline font-extrabold text-3xl text-on-surface tracking-tight mb-3">
          Contact Us
        </h1>
        <p className="text-sm font-body text-on-surface-variant leading-relaxed">
          Found an error? Have a topic suggestion? Interested in a partnership? Let us know.
        </p>
      </section>

      {/* Login nudge */}
      {!session && (
        <div className="flex items-center gap-2 p-4 bg-blue-50 text-blue-700 rounded-lg text-sm mb-6">
          <span className="material-symbols-outlined text-lg">info</span>
          <p>
            <Link href="/login" className="font-bold underline">Sign in</Link> for a faster response — we can reach you through your account.
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-body font-medium text-on-surface mb-1.5">
            Name <span className="text-error">*</span>
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your name"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-body font-medium text-on-surface mb-1.5">
            Email <span className="text-error">*</span>
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="your@email.com"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-body font-medium text-on-surface mb-1.5">
            Category <span className="text-error">*</span>
          </label>
          <select
            required
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className={inputClass}
          >
            <option value="" disabled>Select a category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-body font-medium text-on-surface mb-1.5">
            Message <span className="text-error">*</span>
          </label>
          <textarea
            required
            rows={6}
            maxLength={2000}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Tell us what's on your mind..."
            className={`${inputClass} resize-none`}
          />
          <p className="text-xs font-body text-outline mt-1 text-right">
            {form.message.length} / 2000
          </p>
        </div>

        {error && (
          <div className="bg-error/10 border border-error/20 rounded-xl px-4 py-3">
            <p className="text-sm font-body text-error">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary font-body font-bold text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
          ) : (
            <span className="material-symbols-outlined text-[18px]">send</span>
          )}
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
