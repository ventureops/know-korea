export default function LegalPage() {
  return (
    <div className="px-5 md:px-8 py-12 max-w-3xl mx-auto">
      {/* Header */}
      <section className="mb-10">
        <p className="text-[10px] font-label font-bold uppercase tracking-widest text-outline mb-2">Legal</p>
        <h1 className="font-headline font-extrabold text-3xl md:text-4xl text-on-surface tracking-tight mb-3">
          Terms & Privacy
        </h1>
        <p className="text-sm font-body text-on-surface-variant leading-relaxed">
          Last updated: October 2024. These terms govern your use of Know Korea. Please read them carefully.
        </p>
      </section>

      {/* Privacy Policy */}
      <section id="privacy" className="mb-12">
        <h2 className="font-headline font-bold text-xl text-on-surface mb-4">Privacy Policy</h2>
        <div className="space-y-4 font-body text-on-surface-variant leading-relaxed text-sm">
          <p>
            Know Korea ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.
          </p>
          <h3 className="font-headline font-bold text-base text-on-surface">Information We Collect</h3>
          <p>
            We collect information you provide directly to us, such as when you create an account, post content, or contact us. This includes your name, email address, and any content you submit.
          </p>
          <p>
            We also automatically collect certain information when you use our service, including log data (IP address, browser type, pages visited) and usage data to improve the platform experience.
          </p>
          <h3 className="font-headline font-bold text-base text-on-surface">How We Use Your Information</h3>
          <ul className="list-none space-y-2">
            {[
              "To provide, maintain, and improve our services",
              "To send you technical notices and support messages",
              "To respond to your comments and questions",
              "To monitor and analyze usage patterns",
              "To comply with legal obligations",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[14px] text-primary mt-0.5 shrink-0">check</span>
                {item}
              </li>
            ))}
          </ul>
          <h3 className="font-headline font-bold text-base text-on-surface">Data Sharing</h3>
          <p>
            We do not sell, trade, or otherwise transfer your personal information to third parties. We may share aggregated, non-personally identifiable information publicly and with partners for analytical purposes.
          </p>
          <h3 className="font-headline font-bold text-base text-on-surface">Cookies</h3>
          <p>
            We use cookies to maintain your session and preferences. You can disable cookies in your browser settings, though some features may not function properly as a result.
          </p>
          <h3 className="font-headline font-bold text-base text-on-surface">Contact</h3>
          <p>
            If you have questions about this Privacy Policy, contact us at{" "}
            <a href="mailto:privacy@knowkorea.io" className="text-primary hover:text-primary-dim transition-colors font-medium">
              privacy@knowkorea.io
            </a>.
          </p>
        </div>
      </section>

      {/* Divider via surface color */}
      <div className="h-px bg-surface-container-high mb-12" />

      {/* Terms of Service */}
      <section id="terms" className="mb-12">
        <h2 className="font-headline font-bold text-xl text-on-surface mb-4">Terms of Service</h2>
        <div className="space-y-4 font-body text-on-surface-variant leading-relaxed text-sm">
          <p>
            By accessing or using Know Korea, you agree to be bound by these Terms of Service. If you do not agree, please do not use the service.
          </p>
          <h3 className="font-headline font-bold text-base text-on-surface">User Accounts</h3>
          <p>
            You must be at least 16 years old to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>
          <h3 className="font-headline font-bold text-base text-on-surface">Content & Conduct</h3>
          <p>
            You agree not to post content that is illegal, harmful, threatening, abusive, defamatory, or otherwise objectionable. Know Korea reserves the right to remove content that violates these terms.
          </p>
          <p>
            Content you post remains yours, but you grant Know Korea a non-exclusive, worldwide license to use, display, and distribute that content in connection with the service.
          </p>
          <h3 className="font-headline font-bold text-base text-on-surface">Disclaimer</h3>
          <p>
            Know Korea is provided "as is" without warranties of any kind. Information on this site is for general informational purposes only and does not constitute legal, financial, or professional advice. Always consult appropriate professionals for your specific situation.
          </p>
          <h3 className="font-headline font-bold text-base text-on-surface">Limitation of Liability</h3>
          <p>
            Know Korea shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service or reliance on its content.
          </p>
          <h3 className="font-headline font-bold text-base text-on-surface">Governing Law</h3>
          <p>
            These Terms shall be governed by the laws of the Republic of Korea, without regard to its conflict of law provisions.
          </p>
          <h3 className="font-headline font-bold text-base text-on-surface">Changes to Terms</h3>
          <p>
            We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
          </p>
        </div>
      </section>

      {/* Contact box */}
      <div className="bg-surface-container-low rounded-2xl p-6">
        <h3 className="font-headline font-bold text-base text-on-surface mb-2">Questions about our policies?</h3>
        <p className="text-sm font-body text-on-surface-variant mb-3">
          We're happy to clarify. Reach out and we'll respond within 2 business days.
        </p>
        <a
          href="mailto:legal@knowkorea.io"
          className="text-sm font-body font-bold text-primary hover:text-primary-dim transition-colors"
        >
          legal@knowkorea.io →
        </a>
      </div>
    </div>
  );
}
