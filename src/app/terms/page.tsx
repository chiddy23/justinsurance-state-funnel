import type { Metadata } from "next";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import { SchemaMarkup, generateBreadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: { absolute: "Terms of Service | JustInsurance" },
  description:
    "JustInsurance LLC Terms of Service. Course access, payment, pass guarantee terms, CE reporting, and licensing for our online insurance education platform.",
  alternates: { canonical: "https://justinsuranceco.com/terms" },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://justinsuranceco.com/" },
  { name: "Terms of Service", url: "https://justinsuranceco.com/terms" },
]);

const LAST_UPDATED = "May 22, 2026";

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
        <div>{children}</div>
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

export default function TermsPage() {
  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />

      <BreadcrumbNav
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Terms of Service" },
        ]}
      />

      {/* Hero */}
      <section className="bg-navy text-white py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">
            Legal
          </p>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-blue-100 text-sm">
            Last updated: {LAST_UPDATED}
          </p>
          <p className="text-blue-100 text-sm leading-relaxed mt-4 max-w-2xl">
            Please read these Terms of Service carefully before using any JustInsurance LLC
            product or service. By accessing or using our website or courses, you agree to be
            bound by these terms.
          </p>
        </div>
      </section>

      {/* Quick-jump nav */}
      <div className="bg-white border-b border-gray-200 py-4 px-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto overflow-x-auto">
          <div className="flex gap-3 min-w-max text-xs font-medium text-navy">
            {[
              ["#acceptance", "Acceptance"],
              ["#account-registration", "Accounts"],
              ["#course-access", "Course Access"],
              ["#payment-refunds", "Payment & Refunds"],
              ["#ce-reporting", "CE Reporting"],
              ["#intellectual-property", "IP"],
              ["#liability", "Liability"],
              ["#governing-law", "Governing Law"],
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

      {/* 1. Acceptance of Terms */}
      <Section id="acceptance" number="1" title="Acceptance of Terms" altBg={false}>
        <P>
          These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you
          (&ldquo;User,&rdquo; &ldquo;you,&rdquo; or &ldquo;your&rdquo;) and JustInsurance LLC, a Florida limited liability
          company (&ldquo;JustInsurance,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), governing your access to and use
          of our website at justinsuranceco.com and our online learning platform at
          yourinsurancelicense.myabsorb.com (collectively, the &ldquo;Services&rdquo;).
        </P>
        <P>
          By creating an account, enrolling in a course, or otherwise using any part of the
          Services, you acknowledge that you have read, understood, and agree to be bound by
          these Terms and our{" "}
          <a href="/privacy-policy" className="text-navy underline hover:text-gold transition-colors">
            Privacy Policy
          </a>
          , which is incorporated by reference.
        </P>
        <P>
          If you do not agree to these Terms, you may not use the Services. We reserve the right
          to modify these Terms at any time. Material changes will be communicated as described
          in Section 9.
        </P>
      </Section>

      {/* 2. Account Registration */}
      <Section id="account-registration" number="2" title="Account Registration" altBg={true}>
        <P>
          To access our courses, you must create an account on our learning platform. By
          registering, you agree to:
        </P>
        <UL>
          <LI>
            Provide accurate, current, and complete information, including your legal name, valid
            email address, and — where required for CE reporting — your insurance license number
            and National Producer Number (NPN).
          </LI>
          <LI>
            Keep your account credentials confidential. You are responsible for all activity
            that occurs under your account.
          </LI>
          <LI>
            Notify us immediately at{" "}
            <a
              href="mailto:support@justinsuranceco.com"
              className="text-navy underline hover:text-gold transition-colors"
            >
              support@justinsuranceco.com
            </a>{" "}
            if you suspect unauthorized access to your account.
          </LI>
          <LI>
            Not share your account with any other person. Course access is granted to the
            registered individual only and may not be transferred.
          </LI>
        </UL>
        <P>
          You must be at least 18 years of age to create an account. JustInsurance reserves the
          right to suspend or terminate any account that violates these Terms or applicable law.
        </P>
      </Section>

      {/* 3. Course Access & Licensing */}
      <Section id="course-access" number="3" title="Course Access &amp; Licensing" altBg={false}>
        <P>
          When you purchase a JustInsurance course, you receive a limited, personal,
          non-exclusive, non-transferable license to access that course for the access period
          specified at the time of purchase. <strong>Courses are licensed, not sold.</strong>
        </P>
        <UL>
          <LI>
            <strong>Prelicensing courses</strong> provide access for 60 to 90 days from the date
            of enrollment, depending on your state&rsquo;s requirements.
          </LI>
          <LI>
            <strong>CE courses</strong> remain accessible until you have completed all required
            modules and your completion has been reported to your state.
          </LI>
          <LI>
            Access periods are per-enrollment. Purchasing the same course again creates a new
            enrollment with a new access period.
          </LI>
          <LI>
            Extension requests are handled on a case-by-case basis. Contact support before your
            access expires.
          </LI>
        </UL>
        <P>
          You agree to use the Services solely for lawful personal educational purposes. You may
          not reproduce, distribute, publicly display, reverse engineer, or create derivative works
          from any course content without our prior written consent.
        </P>
      </Section>

      {/* 4. Payment & Refunds */}
      <Section id="payment-refunds" number="4" title="Payment &amp; Refunds" altBg={true}>
        <p className="text-sm font-semibold text-navy mb-2">Payment</p>
        <P>
          All prices are listed in U.S. dollars. Payment is due in full at the time of enrollment.
          We accept major credit and debit cards processed through our PCI-compliant payment
          processor. By submitting payment, you authorize us to charge the full course price to
          your selected payment method.
        </P>

        <p className="text-sm font-semibold text-navy mb-2">Standard Refund Policy</p>
        <P>
          By enrolling in any JustInsurance course, you acknowledge that you have read and
          understood the refund policy below.
        </P>

        <div className="space-y-3 mb-4">
          <div className="bg-white border-l-4 border-gold rounded-r-lg border-t border-r border-b border-gray-200 p-4">
            <p className="text-sm font-bold text-navy mb-1">
              Within 24 hours of purchase &mdash; $5 processing fee
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              If you request a refund within 24 hours of purchase and have completed less than
              50% of the course, we refund the full purchase price minus a $5 processing fee.
            </p>
          </div>

          <div className="bg-white border-l-4 border-gold rounded-r-lg border-t border-r border-b border-gray-200 p-4">
            <p className="text-sm font-bold text-navy mb-1">
              After 24 hours, within 30 days &mdash; $24.95 processing fee
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              If you request a refund after 24 hours of purchase but within 30 days, and have
              completed less than 50% of the course, we refund the full purchase price minus a
              $24.95 processing fee.
            </p>
          </div>

          <div className="bg-gray-50 border-l-4 border-gray-400 rounded-r-lg border-t border-r border-b border-gray-200 p-4">
            <p className="text-sm font-bold text-gray-700 mb-1">
              After 30 days or 50%+ complete &mdash; no refund
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              A refund is not available if the request is submitted more than 30 days after
              purchase, or if you have completed more than 50% of the coursework &mdash;
              whichever occurs first.
            </p>
          </div>
        </div>

        <P>
          Refund requests must be submitted to{" "}
          <a
            href="mailto:support@justinsuranceco.com"
            className="text-navy underline hover:text-gold"
          >
            support@justinsuranceco.com
          </a>
          . Course progress is measured by the percentage of lessons, video minutes, and
          quizzes completed as tracked by our learning platform.
        </P>

        <p className="text-sm font-semibold text-navy mb-2">Pass Guarantee</p>
        <P>
          JustInsurance offers a Pass Guarantee on qualifying prelicensing courses. To be eligible:
        </P>
        <UL>
          <LI>
            You must complete the recommended study hours for your state — 20 hours for a single
            line of authority, or 40 hours for a dual line (Life &amp; Health) in states that do
            not require prelicensing — as tracked by our learning platform.
          </LI>
          <LI>
            You must score 80% or higher on the practice exam three times in a row before sitting
            for the state licensing exam.
          </LI>
          <LI>
            You must sit for your first state licensing exam attempt within 30 days of your first
            enrollment in the course.
          </LI>
          <LI>
            You must fail the exam on that first attempt (a passing score disqualifies the
            guarantee claim).
          </LI>
          <LI>
            You must submit your refund request with proof of your exam failure (official score
            report) within 30 days of the failed exam.
          </LI>
        </UL>
        <P>
          If all conditions are met, we will refund the original course purchase price in full.
          The Pass Guarantee applies to the prelicensing course cost only and does not cover exam
          fees, application fees, or any other third-party costs. Courses purchased at a
          promotional discount may have modified guarantee terms disclosed at the time of sale.
        </P>
      </Section>

      {/* 5. CE Reporting */}
      <Section id="ce-reporting" number="5" title="CE Reporting" altBg={false}>
        <P>
          JustInsurance is a state-approved continuing education provider in each state where we
          offer CE courses. Upon your successful completion of a CE course, we are required by law
          to report your completion to the applicable state Department of Insurance (DOI) or its
          authorized reporting agent.
        </P>
        <UL>
          <LI>
            <strong>Reporting timeline</strong> &mdash; We submit CE completions electronically,
            typically within one business day of course completion. Processing times for your
            state&rsquo;s DOI to reflect the credits on your license record vary by state and may take
            1 to 10 business days.
          </LI>
          <LI>
            <strong>Your responsibility</strong> &mdash; You are responsible for providing accurate
            license information (license number, NPN, state) in your account profile prior to
            completing CE courses. Inaccurate information may cause reporting errors or delays.
          </LI>
          <LI>
            <strong>Reporting errors</strong> &mdash; If your CE credits do not appear on your
            state record within 10 business days of completion, please contact us with your
            completion certificate and we will investigate and correct the submission at no charge.
          </LI>
          <LI>
            <strong>Licensee responsibility</strong> &mdash; It is your responsibility to verify
            that reported CE credits appear on your state license record and that you meet all
            renewal requirements before your license expiration date. JustInsurance is not
            responsible for license lapses arising from state processing delays or errors in
            licensee-provided information.
          </LI>
        </UL>
      </Section>

      {/* 6. Intellectual Property */}
      <Section id="intellectual-property" number="6" title="Intellectual Property" altBg={true}>
        <P>
          All content included in or made available through the Services &mdash; including but not
          limited to course text, videos, audio recordings, graphics, practice exam questions,
          quizzes, logos, and software &mdash; is the exclusive property of JustInsurance LLC or
          its content licensors and is protected by U.S. and international copyright, trademark,
          and other intellectual property laws.
        </P>
        <P>
          You are granted a limited license to access and use the course content for your own
          personal educational purposes only. You may not:
        </P>
        <UL>
          <LI>Copy, reproduce, or distribute any course content in any form.</LI>
          <LI>Screen-record, screenshot, or otherwise capture video or audio course content.</LI>
          <LI>
            Share your account credentials or course access links with any third party.
          </LI>
          <LI>
            Use course content to create competing educational materials or services.
          </LI>
          <LI>Remove or alter any copyright, trademark, or other proprietary notices.</LI>
        </UL>
        <P>
          Any unauthorized use of course content will result in immediate account termination
          and may result in legal action.
        </P>
      </Section>

      {/* 7. Limitation of Liability */}
      <Section id="liability" number="7" title="Limitation of Liability" altBg={false}>
        <P>
          THE SERVICES ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND,
          EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY,
          FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
        </P>
        <P>
          JUSTINSURANCE DOES NOT WARRANT THAT: (A) THE SERVICES WILL BE UNINTERRUPTED OR
          ERROR-FREE; (B) DEFECTS WILL BE CORRECTED; (C) THE SERVICES ARE FREE OF VIRUSES OR
          OTHER HARMFUL COMPONENTS; OR (D) COURSE COMPLETION WILL GUARANTEE PASSING THE STATE
          LICENSING EXAM OR SATISFYING ANY REGULATORY REQUIREMENT.
        </P>
        <P>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, JUSTINSURANCE&rsquo;S TOTAL CUMULATIVE
          LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR THE
          SERVICES SHALL NOT EXCEED THE AMOUNT YOU PAID TO JUSTINSURANCE IN THE 12 MONTHS
          PRECEDING THE CLAIM. IN NO EVENT WILL JUSTINSURANCE BE LIABLE FOR ANY INDIRECT,
          INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
        </P>
        <P>
          Some jurisdictions do not allow the exclusion of implied warranties or limitation of
          liability for incidental or consequential damages, so portions of the above may not
          apply to you.
        </P>
      </Section>

      {/* 8. Governing Law */}
      <Section id="governing-law" number="8" title="Governing Law" altBg={true}>
        <P>
          These Terms are governed by and construed in accordance with the laws of the State of
          Florida, without regard to its conflict of law principles. You agree that any dispute
          arising out of or relating to these Terms or the Services shall be subject to the
          exclusive jurisdiction of the state and federal courts located in Broward County, Florida.
        </P>
        <P>
          If any provision of these Terms is found to be unenforceable, that provision will be
          modified to the minimum extent necessary to make it enforceable, and the remainder of
          these Terms will continue in full force and effect. Our failure to enforce any right or
          provision of these Terms shall not constitute a waiver of that right or provision.
        </P>
      </Section>

      {/* 9. Changes to Terms */}
      <Section id="changes" number="9" title="Changes to These Terms" altBg={false}>
        <P>
          We reserve the right to modify these Terms at any time. When we make material changes,
          we will update the &ldquo;Last updated&rdquo; date at the top of this page and notify registered
          users by email at least 14 days before the changes take effect.
        </P>
        <P>
          Your continued use of the Services after the effective date of revised Terms constitutes
          your acceptance of those changes. If you do not agree to the revised Terms, you must
          stop using the Services before the effective date.
        </P>
      </Section>

      {/* 10. Contact */}
      <Section id="contact" number="10" title="Contact Information" altBg={true}>
        <P>
          Questions or concerns about these Terms should be directed to:
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
