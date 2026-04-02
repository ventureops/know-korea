"use client";

import Link from "next/link";
import { useState } from "react";

const faqSections = [
  {
    id: "about",
    label: "About This Site",
    icon: "info",
    items: [
      { q: "What is Know Korea?", a: "Know Korea is an editorial platform providing practical guides, resources, and community Q&A for foreigners living, working, or traveling in Korea." },
      { q: "Who writes the content?", a: "Content is written and curated by long-term Korea residents, legal professionals, and subject-matter experts — all with direct experience navigating the topics covered." },
      { q: "Is any of this official government information?", a: "No. Know Korea is an independent resource. For official immigration and legal matters, always consult the Korean Immigration Service or a licensed professional." },
      { q: "How often is content updated?", a: "We review and update guides regularly, especially when laws or government procedures change. Each guide shows its last-updated date." },
    ],
  },
  {
    id: "finding",
    label: "Finding Information",
    icon: "search",
    items: [
      { q: "How do I find what I'm looking for?", a: "Use the search bar in the top navigation, browse by category in the sidebar, or explore the homepage for featured and recent guides." },
      { q: "I couldn't find an answer. What now?", a: "Post your question in our Q&A section. The community typically responds within 24–48 hours." },
    ],
  },
  {
    id: "qa",
    label: "Q&A",
    icon: "forum",
    items: [
      { q: "What's the difference between Comments and Q&A?", a: "Comments are tied to specific articles and allow discussion about that content. Q&A is a standalone section where you can ask any Korea-related question." },
      { q: "How do I create a post?", a: "You need a free account to post questions or comments. Sign up with Google or Apple — it takes under a minute." },
    ],
  },
  {
    id: "account",
    label: "Account & Profile",
    icon: "person",
    items: [
      { q: "How do I sign up?", a: "Click the profile icon in the top navigation and select 'Sign up'. We support Google and Apple sign-in for a fast, secure experience." },
      { q: "Can I delete my account?", a: "Yes. Go to your profile settings and select 'Delete Account'. This action is permanent and cannot be undone." },
    ],
  },
  {
    id: "reading",
    label: "Read Tracking",
    icon: "check_circle",
    items: [
      { q: "What does 'Mark as Read' do?", a: "Marking an article as read tracks your progress across Know Korea and helps you keep a record of what you've covered. It's visible only to you." },
    ],
  },
  {
    id: "bmc",
    label: "Buy Me a Coffee",
    icon: "coffee",
    items: [
      { q: "What does support go toward?", a: "Contributions help cover hosting, research time, translation costs, and keep the platform free and ad-free for everyone." },
    ],
  },
  {
    id: "privacy",
    label: "Privacy & Safety",
    icon: "shield",
    items: [
      { q: "What data do you collect?", a: "We collect only what's necessary for your account: your email address (or OAuth token), display name, and usage data for improving the site. We never sell data." },
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
    <div className="px-5 md:px-8 py-12 max-w-3xl mr-auto">
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
          href="/community"
          className="group bg-surface-container-lowest rounded-2xl p-5 shadow-sm hover:shadow-xl border border-outline-variant/15 transition-all flex flex-col items-start"
        >
          <span className="material-symbols-outlined text-[24px] text-primary mb-3">forum</span>
          <h3 className="font-headline font-bold text-base text-on-surface mb-1">Community</h3>
          <p className="text-sm font-body text-on-surface-variant mb-4 leading-relaxed flex-1">
            Can't find your answer here? Ask the Know Korea community.
          </p>
          <span className="text-sm font-body font-bold text-primary group-hover:text-primary-dim transition-colors">
            Visit Community →
          </span>
        </Link>
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/15 flex flex-col items-start">
          <span className="material-symbols-outlined text-[24px] text-primary mb-3">mail</span>
          <h3 className="font-headline font-bold text-base text-on-surface mb-1">Contact Us</h3>
          <p className="text-sm font-body text-on-surface-variant mb-4 leading-relaxed flex-1">
            Need to reach us directly? We're here to help.
          </p>
          <a
            href="mailto:hello@knowkorea.io"
            className="text-sm font-body font-bold text-primary hover:text-primary-dim transition-colors"
          >
            Send Support →
          </a>
        </div>
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
