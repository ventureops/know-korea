import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Know Korea",
  description: "How Know Korea handles your data.",
};

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-headline font-bold text-lg text-on-surface mt-8 mb-3">{children}</h2>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-headline font-semibold text-base text-on-surface mt-5 mb-2">{children}</h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-body text-on-surface-variant leading-relaxed mb-3">{children}</p>
  );
}

function TableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto my-4 rounded-xl border border-outline-variant/15">
      <table className="w-full text-sm font-body border-collapse">{children}</table>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left px-4 py-3 font-headline font-bold text-on-surface bg-surface-container-low border-b border-outline-variant/20 whitespace-nowrap">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td className="px-4 py-3 text-on-surface-variant border-b border-outline-variant/10 align-top">
      {children}
    </td>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div className="px-5 md:px-8 py-12 max-w-3xl mr-auto">
      {/* Header */}
      <section className="mb-8">
        <p className="text-[10px] font-label font-bold uppercase tracking-widest text-outline mb-2">Legal</p>
        <h1 className="font-headline font-extrabold text-3xl md:text-4xl text-on-surface tracking-tight mb-3">
          Privacy Policy
        </h1>
        <p className="text-sm font-body text-on-surface-variant">
          <strong>Know Korea</strong> | knowkorea.com
        </p>
        <p className="text-sm font-body text-on-surface-variant">Last updated: April 2026</p>
      </section>

      {/* Section 1 */}
      <SectionHeading>1. Who We Are</SectionHeading>
      <P>
        Know Korea ("we," "us," "our") is an independent content platform providing practical information and cultural
        guides for foreigners living in, moving to, or curious about Korea. We are not affiliated with any government
        body or institution.
      </P>
      <P>
        For privacy-related questions, contact us at:{" "}
        <a href="mailto:knowkorea.official@gmail.com" className="text-primary hover:text-primary-dim transition-colors">
          knowkorea.official@gmail.com
        </a>
      </P>

      {/* Section 2 */}
      <SectionHeading>2. What Data We Collect</SectionHeading>

      <SubHeading>When you visit (no account needed)</SubHeading>
      <ul className="list-disc list-inside text-sm font-body text-on-surface-variant leading-relaxed space-y-1 mb-3 ml-2">
        <li>Anonymous usage data via Google Analytics 4: pages visited, time on page, session duration, device type, browser type, and general geographic location (country/city level)</li>
        <li>This data is anonymized and used solely to understand what content is most useful</li>
      </ul>

      <SubHeading>When you create an account</SubHeading>
      <ul className="list-disc list-inside text-sm font-body text-on-surface-variant leading-relaxed space-y-1 mb-3 ml-2">
        <li>Name and email address (via Google login — we never see your password)</li>
        <li>Profile photo (optional, provided by your Google account or uploaded by you)</li>
        <li>Nickname (set by you)</li>
      </ul>

      <SubHeading>When you use the site as a member</SubHeading>
      <ul className="list-disc list-inside text-sm font-body text-on-surface-variant leading-relaxed space-y-1 mb-3 ml-2">
        <li>Content you post: community questions, comments, replies</li>
        <li>Interactions: likes, "read" marks on articles</li>
        <li>Login timestamps and activity history (for admin review only)</li>
      </ul>

      <SubHeading>What we do NOT collect</SubHeading>
      <ul className="list-disc list-inside text-sm font-body text-on-surface-variant leading-relaxed space-y-1 mb-3 ml-2">
        <li>Passwords (handled entirely by Google)</li>
        <li>Payment information (Ko-fi is a separate, independent service)</li>
        <li>Precise location data</li>
        <li>Any data from minors — this site is intended for users 16 and older</li>
      </ul>

      {/* Section 3 */}
      <SectionHeading>3. How We Use Your Data</SectionHeading>
      <TableWrapper>
        <thead>
          <tr>
            <Th>Purpose</Th>
            <Th>Data Used</Th>
          </tr>
        </thead>
        <tbody>
          {[
            ["Provide core site features (comments, community, read tracking)", "Account info, activity data"],
            ["Improve content quality and understand usage patterns", "Anonymous analytics via GA4"],
            ["Prevent abuse and spam", "Login history, activity logs"],
            ["Respond to your questions", "Email address"],
          ].map(([purpose, data]) => (
            <tr key={purpose}>
              <Td>{purpose}</Td>
              <Td>{data}</Td>
            </tr>
          ))}
        </tbody>
      </TableWrapper>
      <P>We do not sell, rent, or share your personal data with third parties for marketing purposes. Ever.</P>

      {/* Section 4 */}
      <SectionHeading>4. Third-Party Services</SectionHeading>
      <P>This site uses the following external services. Each has its own privacy policy:</P>
      <TableWrapper>
        <thead>
          <tr>
            <Th>Service</Th>
            <Th>Purpose</Th>
            <Th>Their Privacy Policy</Th>
          </tr>
        </thead>
        <tbody>
          {[
            ["Google OAuth", "Sign-in", "policies.google.com/privacy"],
            ["Google Analytics 4", "Anonymous usage analytics", "policies.google.com/privacy"],
            ["Supabase", "Database hosting (Seoul region)", "supabase.com/privacy"],
            ["Vercel", "Web hosting (Seoul region)", "vercel.com/legal/privacy-policy"],
            ["Cloudinary", "Image hosting and optimization", "cloudinary.com/privacy"],
            ["Ko-fi", "Optional donations (Support on Ko-fi)", "more.ko-fi.com/privacy"],
          ].map(([service, purpose, policy]) => (
            <tr key={service}>
              <Td><strong>{service}</strong></Td>
              <Td>{purpose}</Td>
              <Td><span className="text-primary">{policy}</span></Td>
            </tr>
          ))}
        </tbody>
      </TableWrapper>
      <P>When you click a Ko-fi link, you leave our site. Any transaction you make is governed by Ko-fi's terms, not ours.</P>

      {/* Section 5 */}
      <SectionHeading>5. Cookies</SectionHeading>

      <SubHeading>Essential cookies</SubHeading>
      <P>
        These cookies are required for the site to function. They cannot be disabled without losing access to
        logged-in features. No consent is required for these cookies under applicable privacy laws.
      </P>
      <TableWrapper>
        <thead>
          <tr>
            <Th>Cookie</Th>
            <Th>Purpose</Th>
            <Th>Duration</Th>
          </tr>
        </thead>
        <tbody>
          {[
            ["next-auth.session-token", "Maintains your login session", "30 days"],
            ["next-auth.csrf-token", "Prevents cross-site request forgery", "Session"],
            ["next-auth.callback-url", "Manages login redirects", "Session"],
          ].map(([cookie, purpose, duration]) => (
            <tr key={cookie}>
              <Td><code className="text-xs bg-surface-container px-1 py-0.5 rounded">{cookie}</code></Td>
              <Td>{purpose}</Td>
              <Td>{duration}</Td>
            </tr>
          ))}
        </tbody>
      </TableWrapper>

      <SubHeading>Analytics cookies (Google Analytics 4)</SubHeading>
      <P>
        We use GA4 to understand how visitors use the site — which articles are popular, how people navigate between
        pages, and where our readers come from. GA4 data is anonymized and never linked to your personal account.
      </P>
      <TableWrapper>
        <thead>
          <tr>
            <Th>Cookie</Th>
            <Th>Purpose</Th>
            <Th>Duration</Th>
          </tr>
        </thead>
        <tbody>
          {[
            ["_ga", "Distinguishes unique visitors", "2 years"],
            ["_ga_[ID]", "Maintains session state", "2 years"],
          ].map(([cookie, purpose, duration]) => (
            <tr key={cookie}>
              <Td><code className="text-xs bg-surface-container px-1 py-0.5 rounded">{cookie}</code></Td>
              <Td>{purpose}</Td>
              <Td>{duration}</Td>
            </tr>
          ))}
        </tbody>
      </TableWrapper>
      <P>
        If you are located in the European Economic Area (EEA) or the United Kingdom, we will ask for your consent
        before setting analytics cookies. You may decline, and the site will function normally without analytics tracking.
      </P>

      <SubHeading>Managing cookies</SubHeading>
      <P>
        You can also control cookies through your browser settings. Most browsers allow you to block or delete cookies.
        Disabling essential cookies will prevent you from using features that require a login.
      </P>

      {/* Section 6 */}
      <SectionHeading>6. International Data Transfers</SectionHeading>
      <P>
        Know Korea is operated from South Korea. Your data may be processed in countries where our service providers
        operate, including the United States (Google, Cloudinary) and other regions (Vercel, Supabase). We select
        providers that maintain adequate data protection standards. By using the site, you acknowledge that your data
        may be transferred and processed internationally.
      </P>

      {/* Section 7 */}
      <SectionHeading>7. Data Retention</SectionHeading>
      <ul className="list-disc list-inside text-sm font-body text-on-surface-variant leading-relaxed space-y-2 mb-3 ml-2">
        <li><strong>Account data:</strong> Retained while your account is active. You may request deletion at any time.</li>
        <li><strong>Comments and community posts:</strong> Retained as part of the public record. If you delete your account, your posts will be anonymized (shown as "Deleted User") rather than removed, to preserve conversation context.</li>
        <li><strong>Activity logs:</strong> Retained for up to 12 months for security and admin purposes.</li>
        <li><strong>Analytics data:</strong> Aggregated and anonymous; retained indefinitely.</li>
      </ul>

      {/* Section 8 */}
      <SectionHeading>8. Your Rights</SectionHeading>
      <P>You have the right to:</P>
      <ul className="list-disc list-inside text-sm font-body text-on-surface-variant leading-relaxed space-y-2 mb-3 ml-2">
        <li><strong>Access</strong> the personal data we hold about you</li>
        <li><strong>Correct</strong> inaccurate data via your profile settings</li>
        <li><strong>Delete</strong> your account and associated personal data</li>
        <li><strong>Object to</strong> or restrict the processing of your data</li>
        <li><strong>Withdraw consent</strong> for analytics cookies at any time</li>
      </ul>
      <P>
        To exercise any of these rights, email us at{" "}
        <a href="mailto:knowkorea.official@gmail.com" className="text-primary hover:text-primary-dim transition-colors">
          knowkorea.official@gmail.com
        </a>. We will respond within 30 days.
      </P>
      <P>
        If you are located in the EEA, you also have the right to lodge a complaint with your local data protection authority.
      </P>

      {/* Section 9 */}
      <SectionHeading>9. Children's Privacy</SectionHeading>
      <P>
        This site is not directed at children under 16. We do not knowingly collect data from children. If you believe
        a child has created an account, please contact us immediately.
      </P>

      {/* Section 10 */}
      <SectionHeading>10. Changes to This Policy</SectionHeading>
      <P>
        We may update this policy as the site grows. When we do, we will update the "Last updated" date at the top.
        For significant changes, we will notify registered users via the site. Continued use of the site after changes
        constitutes acceptance of the updated policy.
      </P>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-outline-variant/15">
        <p className="text-xs font-body text-outline text-center">© 2026 Know Korea</p>
      </div>
    </div>
  );
}
