import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using Know Korea.",
};

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-headline font-bold text-lg text-on-surface mt-8 mb-3">{children}</h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-body text-on-surface-variant leading-relaxed mb-3">{children}</p>
  );
}

export default function TermsOfServicePage() {
  return (
    <div className="px-5 md:px-8 py-12 max-w-3xl mr-auto">
      {/* Header */}
      <section className="mb-8">
        <p className="text-[10px] font-label font-bold uppercase tracking-widest text-outline mb-2">Legal</p>
        <h1 className="font-headline font-extrabold text-3xl md:text-4xl text-on-surface tracking-tight mb-3">
          Terms of Service
        </h1>
        <p className="text-sm font-body text-on-surface-variant">
          <strong>Know Korea</strong> | knowkorea.com
        </p>
        <p className="text-sm font-body text-on-surface-variant">Last updated: April 2026</p>
      </section>

      {/* Section 1 */}
      <SectionHeading>1. Acceptance of Terms</SectionHeading>
      <P>
        By accessing or using Know Korea, you agree to these Terms. If you do not agree, please do not use the site.
        These Terms apply to all visitors, registered members, and contributors.
      </P>
      <P>
        You must be at least 16 years old to create an account or use interactive features on this site.
      </P>

      {/* Section 2 */}
      <SectionHeading>2. What This Site Is</SectionHeading>
      <P>
        Know Korea is an informational and cultural content platform. Content on this site is provided for general
        informational purposes only. It is <strong>not legal, financial, medical, or immigration advice</strong>.
        Always consult qualified professionals for decisions that affect your legal status, finances, or health.
      </P>
      <P>
        Information about Korean laws, visa rules, and regulations changes frequently. We make every effort to keep
        content accurate, but we cannot guarantee it reflects the latest changes. Always verify with official sources
        before acting on any information found here.
      </P>

      {/* Section 3 */}
      <SectionHeading>3. Your Account</SectionHeading>
      <P>You are responsible for:</P>
      <ul className="list-disc list-inside text-sm font-body text-on-surface-variant leading-relaxed space-y-1 mb-3 ml-2">
        <li>Providing accurate information when registering</li>
        <li>Keeping your login secure (we never ask for your password)</li>
        <li>All activity that occurs under your account</li>
      </ul>
      <P>
        You may not create an account on behalf of someone else without their permission. You may not create multiple
        accounts for the same person.
      </P>

      {/* Section 4 */}
      <SectionHeading>4. Acceptable Use</SectionHeading>
      <p className="text-sm font-body text-on-surface font-medium mb-2">You agree NOT to:</p>
      <ul className="list-disc list-inside text-sm font-body text-on-surface-variant leading-relaxed space-y-1 mb-4 ml-2">
        <li>Post content that is illegal, defamatory, harassing, or hateful</li>
        <li>Impersonate any person or entity</li>
        <li>Spam, advertise, or solicit in comments or community posts</li>
        <li>Scrape, crawl, or automatically extract content without written permission</li>
        <li>Attempt to gain unauthorized access to any part of the site</li>
        <li>Post personally identifiable information about others without their consent</li>
        <li>Use automated tools, bots, or scripts to interact with the site</li>
      </ul>
      <p className="text-sm font-body text-on-surface font-medium mb-2">You agree TO:</p>
      <ul className="list-disc list-inside text-sm font-body text-on-surface-variant leading-relaxed space-y-1 mb-3 ml-2">
        <li>Be respectful to other community members</li>
        <li>Post only content you have the right to share</li>
      </ul>

      {/* Section 5 */}
      <SectionHeading>5. Content You Post</SectionHeading>
      <P>When you post comments, community questions, or any other content on Know Korea:</P>
      <ul className="list-disc list-inside text-sm font-body text-on-surface-variant leading-relaxed space-y-1 mb-3 ml-2">
        <li>You retain ownership of your content</li>
        <li>You grant us a non-exclusive, worldwide, royalty-free license to display, distribute, and archive your content as part of the site</li>
        <li>You confirm the content does not infringe any third-party rights</li>
        <li>You understand that if you delete your account, your posts will be anonymized (shown as "Deleted User") rather than removed, to preserve conversation context</li>
      </ul>
      <P>We reserve the right to remove content that violates these Terms, without prior notice.</P>

      {/* Section 6 */}
      <SectionHeading>6. Our Content</SectionHeading>
      <P>
        All editorial content — including articles, guides, and structured information — created by Know Korea is
        owned by us and protected by copyright. You may:
      </P>
      <ul className="list-disc list-inside text-sm font-body text-on-surface-variant leading-relaxed space-y-1 mb-3 ml-2">
        <li>Share links to our content freely</li>
        <li>Quote brief excerpts with proper attribution and a link back to the original</li>
      </ul>
      <P>
        You may not reproduce full articles or substantial portions of our content without written permission.
        Unauthorized reproduction, scraping, or redistribution of our content is prohibited.
      </P>

      {/* Section 7 */}
      <SectionHeading>7. Third-Party Links and Services</SectionHeading>
      <P>
        Know Korea contains links to third-party websites and services, including Ko-fi for optional donations.
        When you follow these links, you leave our site. We are not responsible for the content, privacy practices,
        or terms of any third-party site.
      </P>

      {/* Section 8 */}
      <SectionHeading>8. Account Suspension and Termination</SectionHeading>
      <P>
        We reserve the right to suspend or permanently ban accounts that violate these Terms, at our sole discretion.
        Actions that may result in suspension or ban include repeated violations of community guidelines, harassment
        of other users, or posting prohibited content.
      </P>
      <P>You may delete your account at any time from your profile settings.</P>

      {/* Section 9 */}
      <SectionHeading>9. Disclaimer of Warranties</SectionHeading>
      <P>
        Know Korea is provided "as is" and "as available" without warranties of any kind, express or implied. We do
        not guarantee the accuracy, completeness, reliability, or timeliness of any content on this site.
      </P>

      {/* Section 10 */}
      <SectionHeading>10. Limitation of Liability</SectionHeading>
      <P>
        To the maximum extent permitted by applicable law, Know Korea and its operator are not liable for any direct,
        indirect, incidental, or consequential damages arising from your use of the site or reliance on its content.
        This includes, but is not limited to, decisions made based on information found on this site.
      </P>

      {/* Section 11 */}
      <SectionHeading>11. Governing Law</SectionHeading>
      <P>
        These Terms are governed by the laws of the Republic of Korea. Any disputes arising from these Terms or your
        use of the site shall be subject to the exclusive jurisdiction of the courts of Seoul, Republic of Korea,
        unless otherwise required by your local law.
      </P>
      <P>
        If you are located in the European Economic Area, nothing in these Terms affects your rights under mandatory
        consumer protection laws in your country of residence.
      </P>

      {/* Section 12 */}
      <SectionHeading>12. Changes to These Terms</SectionHeading>
      <P>
        We may update these Terms from time to time. When we make significant changes, we will update the "Last
        updated" date at the top and, where appropriate, notify registered users via the site. Continued use of the
        site following any changes constitutes acceptance of the revised Terms.
      </P>

      {/* Section 13 */}
      <SectionHeading>13. Contact</SectionHeading>
      <P>Questions about these Terms or our Privacy Policy?</P>
      <P>
        <strong>Email:</strong>{" "}
        <a href="mailto:knowkorea.official@gmail.com" className="text-primary hover:text-primary-dim transition-colors">
          knowkorea.official@gmail.com
        </a>
      </P>
      <P>
        Or visit the{" "}
        <Link href="/about" className="text-primary hover:text-primary-dim transition-colors">
          About
        </Link>{" "}
        page on our site.
      </P>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-outline-variant/15">
        <p className="text-xs font-body text-outline text-center">© 2026 Know Korea</p>
      </div>
    </div>
  );
}
