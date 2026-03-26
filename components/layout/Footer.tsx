import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface-container-low py-8 px-6 md:px-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Copyright */}
        <p className="text-xs font-body text-on-surface-variant">
          © 2026 The Modern Envoy — Your Digital Curator
        </p>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-5 gap-y-2">
          {[
            { href: "/legal#privacy", label: "Privacy Policy" },
            { href: "/legal#terms", label: "Terms of Service" },
            { href: "mailto:poisian@gmail.com", label: "Contact Us" },
            { href: "/faq", label: "FAQ" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-body text-on-surface-variant hover:text-on-surface transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
