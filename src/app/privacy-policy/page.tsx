import type { Metadata } from "next";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import { SchemaMarkup, generateBreadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: { absolute: "Privacy Policy | JustInsurance" },
  description:
    "Learn how JustInsurance LLC collects, uses, and protects your personal information. We take your privacy seriously and never sell your data to third parties.",
  alternates: { canonical: "https://justinsuranceco.com/privacy-policy" },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://justinsuranceco.com/" },
  { name: "Privacy Policy", url: "https://justinsuranceco.com/privacy-policy" },
]);

const LAST_UPDATED = "April 1, 2025";

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function Section({
  id,
  number,
  title,
  children,
  altBg = false,
}: {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
  altBg?: boolean;
}) {
  return (
    <section
      id={id}
      className="py-12 px-4"
      style={altBg ? { backgroundColor: "#F5F7FA" } : { backgroundColor: "#ffffff" }}
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-navy mb-6 flex items-baseline gap-3">
          <span className="text-gold font-bold text-lg">{number}.</span>
          {title}
        </h2>
        <div className="prose-policy">{children}</div>
      </div>
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-gray-600 text-sm leading-relaxed mb-4">{children}</p>;
}

function UL({ children }: { children: React.ReactNode }) {
  return (
    <ul className="list-disc list-outside pl-5 space-y-2 text-gray-600 text-sm leading-relaxed mb-4">
      {children}
    </ul>
  );
}

function LI({ children }: { children: React.ReactNode }) {
  return <li>{children}</li>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function PrivacyPolicyPage() {
  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />

      <BreadcrumbNav
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Privacy Policy" },
        ]}
      />

      {/* Hero */}
      <section className="bg-navy text-white py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">
            Legal
          </p>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-blue-100 text-sm">
            Last updated: {LAST_UPDATED}
          </p>
          <p className="text-blue-100 text-sm leading-relaxed mt-4 max-w-2xl">
            JustInsurance LLC (&ldquo;JustInsurance,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is committed to
            protecting your privacy. This Privacy Policy explains what information we collect, how
            we use it, and your rights regarding your personal data.
          </p>
        </div>
      </section>

      {/* Quick-jump nav */}
      <div className="bg-white border-b border-gray-200 py-4 px-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto overflow-x-auto">
          <div className="flex gap-3 min-w-max text-xs font-medium text-navy">
            {[
              ["#information-we-collect", "Information We Collect"],
              ["#how-we-use", "How We Use It"],
              ["#information-sharing", "Sharing"],
              ["#data-security", "Security"],
              ["#cookies", "Cookies"],
              ["#your-rights", "Your Rights"],
              ["#contact", "Contact"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="whitespace-nowrap hover:text-gold transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* 1. Information We Collect */}
      <Section id="information-we-collect" number="1" title="Information We Collect" altBg={false}>
        <P>
          We collect information you provide directly to us as well as information generated
          automatically when you use our services.
        </P>
        <p className="text-sm font-semibold text-navy mb-2">Information you provide:</p>
        <UL>
          <LI>
            <strong>Identity &amp; contact information</strong> &mdash; your full name, email
            address, phone number, and mailing address when you create an account or contact us.
          </LI>
          <LI>
            <strong>Payment information</strong> &mdash; credit or debit card details and billing
            address processed through our payment processor. We do not store full card numbers on
            our servers.
          </LI>
          <LI>
            <strong>Insurance license information</strong> &mdash; your state, line of authority,
            license number, and National Producer Number (NPN) where required for CE reporting.
          </LI>
          <LI>
            <strong>Account credentials</strong> &mdash; username and encrypted password for your
            JustInsurance account on our learning platform (yourinsurancelicense.myabsorb.com).
          </LI>
        </UL>
        <p className="text-sm font-semibold text-navy mb-2 mt-4">Information collected automatically:</p>
        <UL>
          <LI>
            <strong>Course progress &amp; activity</strong> &mdash; lessons completed, quiz scores,
            time spent in course, and exam results.
          </LI>
          <LI>
            <strong>Device &amp; usage data</strong> &mdash; IP address, browser type, operating
            system, referring URL, and pages visited on justinsuranceco.com.
          </LI>
          <LI>
            <strong>Cookies &amp; similar technologies</strong> &mdash; see Section 5 for details.
          </LI>
        </UL>
      </Section>

      {/* 2. How We Use Your Information */}
      <Section id="how-we-use" number="2" title="How We Use Your Information" altBg={true}>
        <P>We use the information we collect for the following purposes:</P>
        <UL>
          <LI>
            <strong>Account management</strong> &mdash; to create and maintain your student account,
            authenticate your identity, and provide customer support.
          </LI>
          <LI>
            <strong>Course delivery</strong> &mdash; to grant access to purchased courses, track
            your progress, issue completion certificates, and record passing scores.
          </LI>
          <LI>
            <strong>CE reporting to state Departments of Insurance (DOIs)</strong> &mdash; to
            electronically report your continuing education completions to your state&rsquo;s DOI or
            its approved reporting vendor (e.g., Sircon, NIPR) as required by state law.
          </LI>
          <LI>
            <strong>Payment processing</strong> &mdash; to complete transactions and, where
            applicable, process refunds.
          </LI>
          <LI>
            <strong>Communication</strong> &mdash; to send enrollment confirmations, course
            completion notices, CE reporting confirmations, renewal reminders, and responses to
            support inquiries.
          </LI>
          <LI>
            <strong>Marketing</strong> &mdash; to send promotional offers or course
            recommendations. You may opt out at any time by clicking &ldquo;Unsubscribe&rdquo; in
            any marketing email or by contacting us.
          </LI>
          <LI>
            <strong>Legal compliance &amp; fraud prevention</strong> &mdash; to comply with
            applicable laws, respond to legal process, and protect the rights and safety of
            JustInsurance and its users.
          </LI>
          <LI>
            <strong>Service improvement</strong> &mdash; to analyze aggregate usage patterns and
            improve our courses, website, and support experience.
          </LI>
        </UL>
      </Section>

      {/* 3. Information Sharing */}
      <Section id="information-sharing" number="3" title="Information Sharing" altBg={false}>
        <P>
          <strong>We do not sell your personal information to third parties.</strong> We share your
          information only in the circumstances described below.
        </P>
        <UL>
          <LI>
            <strong>State Departments of Insurance</strong> &mdash; When you complete a
            continuing education course, we are legally required to report your completion (name,
            NPN, license number, course title, credit hours, and completion date) to your state&rsquo;s
            DOI or an authorized reporting agent.
          </LI>
          <LI>
            <strong>Payment processors</strong> &mdash; We use PCI-compliant third-party payment
            processors (such as Stripe) to handle billing. These processors receive only the
            information necessary to complete your transaction.
          </LI>
          <LI>
            <strong>Learning management platform</strong> &mdash; Your course enrollment and
            progress data are stored on our LMS provider (Absorb LMS) under a data processing
            agreement that restricts their use of your data.
          </LI>
          <LI>
            <strong>Service providers</strong> &mdash; We may share data with trusted vendors who
            assist us in operating our website and business (e.g., email delivery, analytics),
            all of whom are contractually bound to keep your information confidential and use it
            only on our behalf.
          </LI>
          <LI>
            <strong>Legal requirements</strong> &mdash; We may disclose information if required by
            law, court order, or government regulation, or to protect the rights, property, or
            safety of JustInsurance, our users, or others.
          </LI>
          <LI>
            <strong>Business transfers</strong> &mdash; In the event of a merger, acquisition, or
            sale of all or substantially all of our assets, your information may be transferred as
            part of that transaction. We will notify you via email or a prominent notice on our
            website prior to your information being transferred and becoming subject to a different
            privacy policy.
          </LI>
        </UL>
      </Section>

      {/* 4. Data Security */}
      <Section id="data-security" number="4" title="Data Security" altBg={true}>
        <P>
          We implement industry-standard technical and organizational measures to protect your
          personal information against unauthorized access, loss, or alteration. These measures
          include:
        </P>
        <UL>
          <LI>HTTPS/TLS encryption for all data transmitted between your browser and our servers.</LI>
          <LI>Encrypted storage of passwords using bcrypt or equivalent strong hashing.</LI>
          <LI>PCI-compliant payment handling — full card numbers are never stored on our systems.</LI>
          <LI>Access controls that limit employee access to personal data on a need-to-know basis.</LI>
          <LI>Regular security reviews of our systems and third-party service providers.</LI>
        </UL>
        <P>
          No method of transmission over the Internet or electronic storage is 100% secure. While
          we strive to use commercially acceptable means to protect your personal information, we
          cannot guarantee absolute security. If you believe your account has been compromised,
          please contact us immediately at{" "}
          <a
            href="mailto:support@justinsuranceco.com"
            className="text-navy underline hover:text-gold transition-colors"
          >
            support@justinsuranceco.com
          </a>
          .
        </P>
      </Section>

      {/* 5. Cookies */}
      <Section id="cookies" number="5" title="Cookies" altBg={false}>
        <P>
          Our website and learning platform use cookies and similar tracking technologies to
          enhance your experience and gather usage analytics.
        </P>
        <UL>
          <LI>
            <strong>Essential cookies</strong> &mdash; required for core functionality such as
            maintaining your login session and saving your course progress. These cannot be
            disabled without breaking the service.
          </LI>
          <LI>
            <strong>Analytics cookies</strong> &mdash; help us understand how visitors use our
            website (e.g., Google Analytics). Data is aggregated and anonymized where possible.
          </LI>
          <LI>
            <strong>Marketing cookies</strong> &mdash; used to deliver relevant advertisements
            and measure ad effectiveness on platforms such as Google Ads and Meta.
          </LI>
        </UL>
        <P>
          You can control non-essential cookies through your browser settings or by using a
          consent management tool if one is presented to you. Disabling analytics or marketing
          cookies will not prevent you from accessing your courses.
        </P>
      </Section>

      {/* 6. Your Rights */}
      <Section id="your-rights" number="6" title="Your Rights" altBg={true}>
        <P>
          Depending on your state of residence, you may have the following rights with respect to
          your personal information:
        </P>
        <UL>
          <LI>
            <strong>Access</strong> &mdash; request a copy of the personal information we hold
            about you.
          </LI>
          <LI>
            <strong>Correction</strong> &mdash; request that we correct inaccurate or incomplete
            information.
          </LI>
          <LI>
            <strong>Deletion</strong> &mdash; request deletion of your personal information,
            subject to our legal obligations (e.g., we are required to retain CE completion
            records for the period prescribed by state law).
          </LI>
          <LI>
            <strong>Opt-out of marketing</strong> &mdash; unsubscribe from promotional emails at
            any time using the link in any email or by contacting us.
          </LI>
          <LI>
            <strong>Data portability</strong> &mdash; request a machine-readable copy of the data
            you have provided to us.
          </LI>
        </UL>
        <P>
          To exercise any of these rights, contact us at{" "}
          <a
            href="mailto:support@justinsuranceco.com"
            className="text-navy underline hover:text-gold transition-colors"
          >
            support@justinsuranceco.com
          </a>
          . We will respond within 30 days. We may need to verify your identity before processing
          your request.
        </P>
      </Section>

      {/* 7. Changes to This Policy */}
      <Section id="policy-changes" number="7" title="Changes to This Policy" altBg={false}>
        <P>
          We may update this Privacy Policy from time to time to reflect changes in our practices,
          technology, legal requirements, or other factors. When we make material changes, we will
          update the &ldquo;Last updated&rdquo; date at the top of this page and, where appropriate, notify
          you by email or via a notice on our website.
        </P>
        <P>
          Your continued use of JustInsurance services after the effective date of any changes
          constitutes your acceptance of the revised Privacy Policy. We encourage you to review
          this page periodically.
        </P>
      </Section>

      {/* 8. Contact */}
      <Section id="contact" number="8" title="Contact Information" altBg={true}>
        <P>
          If you have questions, concerns, or requests related to this Privacy Policy or your
          personal data, please contact us:
        </P>
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-sm text-gray-700 space-y-2">
          <p className="font-bold text-navy">JustInsurance LLC</p>
          <p>PO BOX 1025<br />Rincon, PR 00677</p>
          <p>
            Email:{" "}
            <a
              href="mailto:support@justinsuranceco.com"
              className="text-navy underline hover:text-gold transition-colors"
            >
              support@justinsuranceco.com
            </a>
          </p>
          <p>
            Phone:{" "}
            <a href="tel:7542239744" className="text-navy underline hover:text-gold transition-colors">
              754-223-9744
            </a>
          </p>
        </div>
      </Section>
    </>
  );
}
