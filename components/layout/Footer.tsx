import Link from "next/link";
import CookieSettingsButton from "@/components/CookieSettingsButton";

export default function Footer() {
  return (
    <footer className="bg-surface-container-low py-8">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Copyright */}
        <p className="text-xs font-body text-on-surface-variant">
          © 2026 Know Korea
        </p>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-5 gap-y-2">
          {[
            { href: "/privacy-policy", label: "Privacy Policy" },
            { href: "/terms-of-service", label: "Terms of Service" },
            { href: "/faq", label: "FAQ" },
            { href: "/contact", label: "Contact" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-body text-on-surface-variant hover:text-on-surface transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <CookieSettingsButton />
        </div>
      </div>
      </div>
    </footer>
  );
}
