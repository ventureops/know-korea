import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface-container-low py-8 px-6 md:px-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo + tagline */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="font-headline font-extrabold text-sm tracking-widest text-brand-navy uppercase">
            Know<span className="text-tertiary">Korea</span>
          </span>
          <p className="text-xs font-body text-on-surface-variant">
            The Modern Envoy — Your Digital Curator
          </p>
          <p className="text-xs font-body text-outline mt-1">
            © 2024 The Modern Envoy, The Digital Curator
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-5 gap-y-2">
          {[
            { href: "/legal#privacy", label: "Privacy Policy" },
            { href: "/legal#terms", label: "Terms of Service" },
            { href: "/about#contact", label: "Contact Us" },
            { href: "/about#support", label: "Support" },
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
