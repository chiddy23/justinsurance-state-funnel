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

const LAST_UPDATED = "July 7, 2026";

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
              ["#data-retention", "Retention"],
              ["#cookies", "Cookies"],
              ["#sms-calls", "SMS & Calls"],
              ["#your-rights", "Your Rights"],
              ["#california-privacy", "CA Privacy"],
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
            <strong>Social Security Number (certificate requests only)</strong> &mdash; if you
            request a course-completion certificate, we collect your Social Security Number
            because most state Departments of Insurance require it to match and report your
            continuing education or prelicensing course completion. We use your SSN solely for
            this state CE/prelicensing reporting purpose &mdash; never for marketing &mdash; and
            transmit it securely (see Section 4, Data Security). California residents have the
            right to limit the use of this sensitive personal information; see Section 9 below.
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
            <strong>Device &amp; usage data</strong> &mdash; IP address, approximate geolocation
            derived from IP (city, region, ZIP/postal code, country), browser/user-agent,
            referring URL, pages and query strings visited, marketing click identifiers (e.g.,
            Google gclid, Meta fbclid, UTM parameters), and a first-party visitor ID.
          </LI>
          <LI>
            <strong>Cookies &amp; similar technologies</strong> &mdash; see Section 6 for details.
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
            <strong>Marketing attribution &amp; measurement</strong> &mdash; we record each page
            request (IP address, timestamp, page, referrer, and campaign/click identifiers) and
            match it against our purchase records to determine which marketing sources and site
            visits led to an enrollment. This may link your individual browsing activity to your
            purchase.
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
            processors (such as Authorize.net) to handle billing. These processors receive only
            the information necessary to complete your transaction.
          </LI>
          <LI>
            <strong>Learning management platform</strong> &mdash; Your course enrollment and
            progress data are stored on our LMS provider (Absorb LMS) under a data processing
            agreement that restricts their use of your data.
          </LI>
          <LI>
            <strong>Cloud infrastructure (Google)</strong> &mdash; visit and attribution logs are
            processed and stored in Google BigQuery; completion-certificate documents (which can
            include the Social Security number required for state filing) are stored in Google
            Drive; and partnership-application form submissions are processed through Google
            Workspace (Sheets/Apps Script) &mdash; all under Google&rsquo;s data-processing terms.
          </LI>
          <LI>
            <strong>CRM &amp; communications platform</strong> &mdash; contact details and
            enrollment status may be processed in our customer-relationship and messaging
            platform to deliver the communications described in Section 7, under terms that
            restrict use to our behalf.
          </LI>
          <LI>
            <strong>Sponsoring agencies and partners</strong> &mdash; if you were enrolled by, or
            affiliated with, a partner agency, we share your enrollment status, course progress,
            and completion data with that agency so it can support you through licensing.
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
          <LI>Student-account passwords are managed by our learning-platform provider, which represents that passwords are stored using strong one-way hashing.</LI>
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

      {/* 5. Data Retention */}
      <Section id="data-retention" number="5" title="Data Retention" altBg={false}>
        <P>
          Website request and attribution logs &mdash; including IP address, approximate
          location, and page-visit data &mdash; are stored in Google BigQuery (Google Cloud
          Platform) and automatically deleted after 90 days. Account, transaction, and
          CE-completion records are retained longer as required by law and for our legitimate
          business needs; completion certificates are retained for 7 years (or longer where a
          state requires it).
        </P>
      </Section>

      {/* 6. Cookies */}
      <Section id="cookies" number="6" title="Cookies" altBg={true}>
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
            website (e.g., Google Analytics). Some analytics and attribution data is tied to your
            individual IP address and visit history rather than fully anonymized &mdash; see
            &ldquo;Marketing attribution &amp; measurement&rdquo; in Section 2 and Section 5 above.
          </LI>
          <LI>
            <strong>Marketing cookies</strong> &mdash; used to deliver relevant advertisements
            and measure ad effectiveness on platforms such as Google Ads and Meta.
          </LI>
        </UL>
        <P>
          You can control non-essential cookies through your browser settings. Our first-party
          visit and attribution logging described in Section 2 is performed server-side and is
          not controlled by browser cookie settings &mdash; it is controlled by the Global
          Privacy Control signal (which we honor; see Section 9) or by the opt-out process in
          Section 9. Disabling analytics or marketing cookies will not prevent you from
          accessing your courses. Most embedded videos load only a preview image from
          YouTube&rsquo;s servers until you click play, at which point the player loads from the
          privacy-enhanced youtube-nocookie.com domain; some pages embed the standard YouTube
          player directly, which may set YouTube cookies when the page loads.
        </P>
      </Section>

      {/* 7. Text Messages (SMS) & Phone Calls */}
      <Section id="sms-calls" number="7" title="Text Messages (SMS) &amp; Phone Calls" altBg={false}>
        <P>
          If you provide us with a phone number, you agree that JustInsurance and its service
          providers may contact you at that number by phone call or text message (SMS),
          including through the use of automated telephone dialing technology, to service your
          account and send enrollment and course-related notices. We send marketing calls or
          texts only where you have separately given express written consent at the point where
          your number was collected. Consent to receive such calls or texts is not a condition
          of purchasing any course or service. Message and data rates may apply, and message
          frequency may vary. You may opt out of text messages at any time by replying
          &ldquo;STOP,&rdquo; or reply &ldquo;HELP&rdquo; for help. You may also opt out by
          contacting us at{" "}
          <a
            href="mailto:support@justinsuranceco.com"
            className="text-navy underline hover:text-gold transition-colors"
          >
            support@justinsuranceco.com
          </a>
          .
        </P>
      </Section>

      {/* 8. Your Rights */}
      <Section id="your-rights" number="8" title="Your Rights" altBg={true}>
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

      {/* 9. Your California Privacy Rights (CCPA/CPRA) */}
      <Section
        id="california-privacy"
        number="9"
        title="Your California Privacy Rights (CCPA/CPRA)"
        altBg={false}
      >
        <P>
          If you are a California resident, the California Consumer Privacy Act, as amended by
          the California Privacy Rights Act (CCPA/CPRA), gives you additional rights with respect
          to your personal information. These include the right to:
        </P>
        <UL>
          <LI>
            <strong>Know &amp; access</strong> &mdash; request that we disclose the categories
            and specific pieces of personal information we have collected about you and the
            purposes for which it is used.
          </LI>
          <LI>
            <strong>Delete</strong> &mdash; request deletion of personal information we have
            collected from you, subject to certain exceptions (e.g., records we must retain for
            CE reporting or other legal obligations).
          </LI>
          <LI>
            <strong>Correct</strong> &mdash; request that we correct inaccurate personal
            information we maintain about you.
          </LI>
          <LI>
            <strong>Opt out of &ldquo;sale&rdquo; or &ldquo;sharing&rdquo;</strong> &mdash;
            request that we stop &ldquo;selling&rdquo; or &ldquo;sharing&rdquo; your personal
            information, including for cross-context behavioral advertising.
          </LI>
          <LI>
            <strong>Limit the use of sensitive personal information</strong> &mdash; your Social
            Security Number, collected only when you request a course-completion certificate, is
            &ldquo;sensitive personal information&rdquo; under the CPRA. You have the right to
            direct us to limit its use to what is reasonably necessary to report your course
            completion to your state Department of Insurance. We do not use or disclose your SSN
            for any other purpose, including marketing.
          </LI>
        </UL>
        <P>
          JustInsurance honors <strong>Global Privacy Control (GPC)</strong> browser signals as a
          valid request to opt out of the &ldquo;sharing&rdquo; of your personal information for
          cross-context behavioral advertising. If your browser sends a GPC signal, we will treat
          it as an opt-out request for that browser/device.
        </P>

        <p id="do-not-sell" className="text-sm font-semibold text-navy mb-2 mt-4 scroll-mt-24">
          Do Not Sell or Share My Personal Information
        </p>
        <P>
          Because our website matches IP address and visit data against purchase records for
          marketing attribution (see Sections 1&ndash;2 above), that activity may be considered
          &ldquo;sharing&rdquo; of personal information under the CCPA/CPRA. California residents
          may opt out of this sharing, and of any sale of personal information, by emailing{" "}
          <a
            href="mailto:support@justinsuranceco.com?subject=Do%20Not%20Sell%20or%20Share"
            className="text-navy underline hover:text-gold transition-colors"
          >
            support@justinsuranceco.com
          </a>{" "}
          with &ldquo;Do Not Sell or Share&rdquo; in the subject line. We will not discriminate
          against you &mdash; including by denying goods or services, charging different prices,
          or providing a different level of quality &mdash; for exercising any of these rights.
        </P>
        <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">
          This is a general summary, not legal advice; consult the full policy or an attorney for
          specifics regarding your rights under California law.
        </p>
        <P>
          <strong>Children.</strong> Our services are professional licensing education intended
          for adults and are offered only to users 18 years of age or older. We do not knowingly
          collect personal information from children under 16, and we do not knowingly
          &ldquo;share&rdquo; the personal information of consumers under 16 for cross-context
          behavioral advertising. If you believe a child has provided us personal information,
          contact{" "}
          <a
            href="mailto:support@justinsuranceco.com"
            className="text-navy underline hover:text-gold transition-colors"
          >
            support@justinsuranceco.com
          </a>{" "}
          and we will delete it.
        </P>
      </Section>

      {/* 10. Changes to This Policy */}
      <Section id="policy-changes" number="10" title="Changes to This Policy" altBg={true}>
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

      {/* 11. Contact */}
      <Section id="contact" number="11" title="Contact Information" altBg={false}>
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
