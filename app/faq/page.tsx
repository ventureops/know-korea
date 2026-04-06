"use client";

import Link from "next/link";
import { useState } from "react";

const faqSections = [
  {
    id: "about",
    label: "About This Site",
    icon: "info",
    items: [
      { q: "What is Know Korea?", a: "Know Korea is a practical information and cultural guide for foreigners living in, moving to, or curious about Korea — from K-Culture to daily life. To learn more about who we are and why we built this, visit the About page." },
      { q: "Who writes the content?", a: "All guides and articles are written and reviewed by the site admin, based on real experience living and working in Korea." },
      { q: "Is this official information from the Korean government?", a: "No. We are an independent platform. While we do our best to keep information accurate and up to date, this site is not affiliated with any government body. For legal, visa, or immigration matters, always verify with official sources (e.g. HiKorea, Ministry of Justice)." },
      { q: "How often is content updated?", a: "We update guides when laws, policies, or procedures change. Each article shows the last updated date at the top." },
      { q: "How do I find what I need?", a: "Use the search bar at the top, or browse categories in the sidebar." },
    ],
  },
  {
    id: "community",
    label: "Community",
    icon: "forum",
    items: [
      { q: "What is the Community?", a: "A space for anyone interested in Korea to share experiences, ask questions, and have conversations." },
      { q: "Do I need an account?", a: "Anyone can read. To post or reply, you need to be logged in." },
      { q: "What can I post?", a: "Anything related to Korean culture, life, travel, language, or experiences. Choose a relevant category when posting." },
      { q: "What's not allowed?", a: "Off-topic, promotional, or harmful content — including hate speech, discrimination, or anything illegal — will be removed without notice." },
      { q: "Can I reply to other people's posts?", a: "Yes — any logged-in member can join the conversation." },
    ],
  },
  {
    id: "account",
    label: "Account & Profile",
    icon: "person",
    items: [
      { q: "How do I create an account?", a: "Click Login in the top navigation and sign in with your Google account. No password needed — we use your existing account securely." },
      { q: "Do you store my password?", a: "No. We never see or store your password. Login is handled entirely by Google." },
      { q: "How do I change my nickname or profile photo?", a: "Go to your Profile page (click your avatar in the top right) and edit from there." },
      { q: "Can I use a pseudonym?", a: "Yes. Your display nickname doesn't have to match your real name." },
      { q: "How do I delete my account?", a: "Go to Profile → Edit → Delete Account. Your posts will remain but be shown as \"Deleted User\" to preserve conversation context." },
    ],
  },
  {
    id: "reading",
    label: "Read Tracking",
    icon: "check_circle",
    items: [
      { q: "What is the \"Read\" button?", a: "It's a way to track which guides you've completed. Click the button on any article to mark it as read. It turns green when marked." },
      { q: "Where can I see my reading progress?", a: "In the left sidebar — when you open a category, each content card shows your read/unread status at a glance." },
      { q: "Do I need to be logged in?", a: "Yes. Read tracking is tied to your account so it syncs across devices." },
    ],
  },
  {
    id: "kofi",
    label: "Ko-fi Support",
    icon: "coffee",
    items: [
      { q: "What is the Ko-fi button?", a: "An optional way to support the site if a guide helped you. All content is free — Ko-fi is just a tip jar." },
      { q: "Is my payment secure?", a: "Transactions are handled entirely by Ko-fi's platform. We never see your payment details." },
    ],
  },
  {
    id: "privacy",
    label: "Privacy & Safety",
    icon: "shield",
    items: [
      { q: "What data do you collect?", a: "Only what's needed to run the site: your email (for login), nickname, profile photo, and activity like comments and community posts. We don't sell data. Ever. See our full Privacy Policy." },
      { q: "Is my email visible to other users?", a: "No. Only your nickname and profile photo are public." },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-4 text-left hover:text-on-surface transition-colors group"
      >
        <span className="text-sm font-body font-medium text-on-surface leading-relaxed">{q}</span>
        <span className={`material-symbols-outlined text-[18px] text-on-surface-variant shrink-0 mt-0.5 transition-transform ${open ? "rotate-180" : ""}`}>
          expand_more
        </span>
      </button>
      {open && (
        <div className="pb-4">
          <p className="text-sm font-body text-on-surface-variant leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="px-5 md:px-8 py-12 max-w-3xl mx-auto">
      {/* Header */}
      <section className="text-center mb-10">
        <h1 className="font-headline font-extrabold text-3xl md:text-4xl text-on-surface tracking-tight mb-3">
          FAQ — Frequently Asked Questions
        </h1>
        <p className="text-sm font-body text-on-surface-variant leading-relaxed max-w-lg mx-auto">
          Your questions answered. From supporting the depth of Korean culture and its practical realities. Start with the basics or jump to what matters.
        </p>
      </section>

      {/* CTA Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <Link
          href="/about"
          className="group bg-surface-container-lowest rounded-2xl p-5 shadow-sm hover:shadow-xl border border-outline-variant/15 transition-all flex flex-col items-start"
        >
          <span className="material-symbols-outlined text-[24px] text-primary mb-3">info</span>
          <h3 className="font-headline font-bold text-base text-on-surface mb-1">About Know Korea</h3>
          <p className="text-sm font-body text-on-surface-variant mb-4 leading-relaxed flex-1">
            Learn more about who we are and why we built this.
          </p>
          <span className="text-sm font-body font-bold text-primary group-hover:text-primary-dim transition-colors">
            Visit About →
          </span>
        </Link>
        <Link
          href="/contact"
          className="group bg-surface-container-lowest rounded-2xl p-5 shadow-sm hover:shadow-xl border border-outline-variant/15 transition-all flex flex-col items-start"
        >
          <span className="material-symbols-outlined text-[24px] text-primary mb-3">mail</span>
          <h3 className="font-headline font-bold text-base text-on-surface mb-1">Contact Us</h3>
          <p className="text-sm font-body text-on-surface-variant mb-4 leading-relaxed flex-1">
            Found an error or have a suggestion? We'd love to hear from you.
          </p>
          <span className="text-sm font-body font-bold text-primary group-hover:text-primary-dim transition-colors">
            Get in Touch →
          </span>
        </Link>
      </div>

      {/* FAQ Sections */}
      <div className="space-y-8">
        {faqSections.map((section) => (
          <section key={section.id} id={section.id}>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[16px] text-primary">{section.icon}</span>
              <h2 className="font-headline font-bold text-base text-on-surface">{section.label}</h2>
            </div>
            <div className="bg-surface-container-lowest rounded-2xl px-5 shadow-sm border border-outline-variant/15 divide-y divide-outline-variant/10">
              {section.items.map((item, i) => (
                <FAQItem key={i} q={item.q} a={item.a} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
