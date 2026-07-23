import type { Metadata } from "next";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import { STATES } from "@/lib/states";
import {
  PASS_GUARANTEE_EXCLUDED_STATES,
  PASS_GUARANTEE_PENDING_APPROVAL_STATES,
} from "@/lib/pass-guarantee";
import { SchemaMarkup, generateBreadcrumbSchema } from "@/lib/schema";

// ---------------------------------------------------------------------------
// CE provider approval is NOT universal. states.ts carries
// providerApprovalNumber === "PENDING" for New York and Washington, yet CE is
// actively sold for both. The old flat §5 claim ("approved provider in each
// state where we offer CE courses") was therefore false in the site's own
// controlling contract. Derived from states.ts so this self-corrects the moment
// an approval issues — same pattern as /continuing-education and
// /license-renewal-guide.
// ---------------------------------------------------------------------------
const CE_APPROVAL_PENDING_STATES = Object.values(STATES).filter(
  (s) => s.providerApprovalNumber === "PENDING"
);

/** "A", "A and B", "A, B, and C" — for naming pending states in prose. */
const formatStateNames = (states: { name: string }[]): string => {
  const names = states.map((s) => s.name);
  if (names.length <= 1) return names.join("");
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
};

// ---------------------------------------------------------------------------
// Pass Guarantee availability.
//
// @/lib/pass-guarantee is the single gate every page consults before it may
// advertise the guarantee (hasPassGuarantee), and it withholds the guarantee
// for TWO reasons: a regulatory/elective exclusion
// (PASS_GUARANTEE_EXCLUDED_STATES) and a pending provider approval
// (PASS_GUARANTEE_PENDING_APPROVAL_STATES). Section 4 previously hard-coded
// only the first group — Ohio, West Virginia and Illinois — so this contract
// promised a Pass Guarantee in the approval-pending states while the site
// itself never offered one there. Deriving the list from the same two sets the
// gate uses means the contract and the product can no longer disagree, and the
// text self-corrects the moment a slug is added to or removed from either set.
// ---------------------------------------------------------------------------
type GuaranteeState = { slug: string; name: string };

/** Resolve gate slugs to display names. A slug with no states.ts record falls
 *  back to the slug itself rather than being dropped — a state must never fall
 *  silently out of a legal exclusion list. */
const guaranteeStates = (slugs: ReadonlySet<string>): GuaranteeState[] =>
  Array.from(slugs)
    .map((slug) => ({
      slug,
      name: Object.values(STATES).find((s) => s.slug === slug)?.name ?? slug,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

const GUARANTEE_EXCLUDED_STATES = guaranteeStates(PASS_GUARANTEE_EXCLUDED_STATES);
const GUARANTEE_PENDING_STATES = guaranteeStates(PASS_GUARANTEE_PENDING_APPROVAL_STATES);
const GUARANTEE_UNAVAILABLE_STATES = [
  ...GUARANTEE_EXCLUDED_STATES,
  ...GUARANTEE_PENDING_STATES,
].sort((a, b) => a.name.localeCompare(b.name));

/** Why the guarantee is withheld, per state. Ohio and West Virginia are
 *  regulatory; anything else is an elective business decision and is described
 *  as such rather than being attributed to a rule that does not exist. */
const GUARANTEE_EXCLUSION_REASON: Record<string, React.ReactNode> = {
  ohio: (
    <>
      Ohio Admin. Code 3901-5-07(H)(16) prohibits an insurance education provider from
      offering any guarantee to a student that completing its program of insurance
      education will result in passing the state insurance license examination.
    </>
  ),
  "west-virginia": (
    <>
      The West Virginia Offices of the Insurance Commissioner Pre-Licensing Provider
      Information Packet (item 9) directs that advertising for an approved course carry no
      guarantee that the student will pass a required exam.
    </>
  ),
};

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
              ["#acceptable-use", "Acceptable Use"],
              ["#liability", "Liability"],
              ["#governing-law", "Governing Law"],
              ["#disclaimer", "Disclaimer"],
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
          in Section 10.
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
        <P>
          By providing a phone number, you consent to receive calls and text messages
          (including via automated technology) from JustInsurance at that number, as described in
          our{" "}
          <a href="/privacy-policy#sms-calls" className="text-navy underline hover:text-gold transition-colors">
            Privacy Policy
          </a>
          ; such consent is not required to purchase any course.
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
            <strong>Prelicensing courses</strong> provide access for 30 days from the date of
            enrollment, or the access period stated on the course page at the time of
            purchase if different.
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
          <LI>
            <strong>Other products.</strong> Standalone practice exams provide access for the
            period stated on the product page. The Pass Guarantee applies only to qualifying
            prelicensing courses in eligible states, as described in Section 4. Agency, bulk, and subscription
            arrangements are governed by a separate written agreement between JustInsurance and
            the partner organization.
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
          processor, and may accept other payment methods presented at checkout or by invoice. By submitting payment, you authorize us to charge the full course price to
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
          JustInsurance offers a Pass Guarantee on qualifying prelicensing courses in eligible
          states. The Pass Guarantee is not offered in every state &mdash; see &ldquo;States where the
          Pass Guarantee is not offered&rdquo; below. Where the guarantee is offered, you must meet all
          of the following conditions to be eligible:
        </P>
        <UL>
          <LI>
            You must complete the recommended study hours for your state — in states that require
            prelicensing education, the recommended hours equal your state&apos;s required course
            hours; in states that do not, 20 hours for a single line of authority or 40 hours
            for a dual line (Life &amp; Health) — as tracked by our learning platform.
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

        {GUARANTEE_UNAVAILABLE_STATES.length > 0 && (
          <>
            <p className="text-sm font-semibold text-navy mb-2">
              States where the Pass Guarantee is not offered
            </p>
            <P>
              The Pass Guarantee is not available on prelicensing courses purchased for{" "}
              {formatStateNames(GUARANTEE_UNAVAILABLE_STATES)}. In{" "}
              {GUARANTEE_UNAVAILABLE_STATES.length === 1 ? "that state" : "those states"} the
              guarantee is not part of the course, is not included in any purchase, and is not
              advertised on the corresponding course pages. The reasons are:
            </P>
            <UL>
              {GUARANTEE_EXCLUDED_STATES.map((s) => (
                <LI key={s.slug}>
                  <strong>{s.name}</strong> &mdash;{" "}
                  {GUARANTEE_EXCLUSION_REASON[s.slug] ?? (
                    <>
                      We have elected not to offer an outcome guarantee on {s.name} prelicensing
                      courses.
                    </>
                  )}
                </LI>
              ))}
              {GUARANTEE_PENDING_STATES.length > 0 && (
                <LI>
                  <strong>{formatStateNames(GUARANTEE_PENDING_STATES)}</strong> &mdash; our
                  provider approval{" "}
                  {GUARANTEE_PENDING_STATES.length === 1
                    ? "in this state is"
                    : "in these states is"}{" "}
                  still pending, and we do not offer an outcome guarantee on a course whose state
                  approval has not yet issued.
                </LI>
              )}
            </UL>
            <P>
              Whether the Pass Guarantee applies to a given course is stated on that state&apos;s
              course pages at the time of purchase. If you are unsure whether your purchase
              includes the Pass Guarantee, contact{" "}
              <a
                href="mailto:support@justinsuranceco.com"
                className="text-navy underline hover:text-gold"
              >
                support@justinsuranceco.com
              </a>{" "}
              before enrolling.
            </P>
          </>
        )}
      </Section>

      {/* 5. CE Reporting */}
      <Section id="ce-reporting" number="5" title="CE Reporting" altBg={false}>
        <P>
          JustInsurance is a state-approved continuing education provider in each state where our
          CE courses are offered as state-credited CE.
          {CE_APPROVAL_PENDING_STATES.length > 0 && (
            <>
              {" "}
              Our CE provider approval is still pending in{" "}
              {formatStateNames(CE_APPROVAL_PENDING_STATES)}; until that approval issues, CE
              purchased for{" "}
              {CE_APPROVAL_PENDING_STATES.length === 1 ? "that state" : "those states"} is not yet
              creditable toward your state CE requirement and will not be reported to the state
              &mdash; you receive a certificate of completion for your own records instead.
            </>
          )}{" "}
          Upon your successful completion of a CE course in a state where our provider approval is
          active, we are required by law to report your completion to the applicable state
          Department of Insurance (DOI) or its authorized reporting agent.
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

      {/* 7. Acceptable Use & Automated Access */}
      <Section id="acceptable-use" number="7" title="Acceptable Use &amp; Automated Access" altBg={false}>
        <P>
          The Services &mdash; including all pages of justinsuranceco.com, our blog, our state and
          prelicensing content, and our account-based learning platform at
          yourinsurancelicense.myabsorb.com &mdash; are provided for your lawful, personal use only.
          This Section applies to every visitor and user of the Services, whether or not you create
          an account, and whether access is carried out by a human or by any automated agent, bot,
          or process acting on your behalf. By accessing the Services by any means, you and any
          automated agent you use or direct agree to this Section.
        </P>
        <P>
          You agree that you will not, and will not authorize, enable, direct, or assist any other
          person or automated agent to, engage in any of the following:
        </P>
        <UL>
          <LI>
            Access, or attempt to access, any part of the Services by any automated means &mdash;
            including any bot, spider, crawler, scraper, headless browser, script, or other software
            or process &mdash; except that a general-purpose Internet search engine may crawl
            publicly available pages solely to the extent expressly permitted by our robots.txt file
            and solely to create a publicly available searchable index. All other automated access is
            prohibited.
          </LI>
          <LI>
            Scrape, harvest, extract, data-mine, index, cache (other than ordinary temporary browser
            caching), or systematically download, copy, collect, aggregate, or store any content,
            text, images, video, course materials, practice questions, pricing, or other data from
            the Services.
          </LI>
          <LI>
            Circumvent, disable, bypass, probe, or defeat &mdash; or attempt to do so &mdash; any
            rate limit, IP-address block, access restriction, CAPTCHA, authentication requirement,
            login gate, robots.txt directive, or any other technological or security measure that we
            use to control, protect, or limit access to the Services or to the copyrighted works
            available through them. These measures are technological measures that effectively
            control access to our copyrighted content, and circumventing them is prohibited.
          </LI>
          <LI>
            Use rotating, proxy, anonymizing, datacenter, or other IP addresses, or multiple
            accounts, or any other method, in order to evade, disguise, or defeat any block, rate
            limit, suspension, or other restriction we have applied.
          </LI>
          <LI>
            Use any content, text, or data obtained from the Services to build, train, or improve any
            dataset, database, machine-learning or artificial-intelligence model, large language
            model, or any competing or derivative product, service, or educational offering.
          </LI>
          <LI>
            Frame, mirror, republish, redistribute, sell, or make available to any third party any
            content obtained from the Services.
          </LI>
          <LI>
            Access the Services in a manner that imposes, or may impose, an unreasonable or
            disproportionately large load on our infrastructure, or that interferes with, degrades,
            or disrupts the operation, integrity, availability, or performance of the Services or the
            servers or networks that host them.
          </LI>
        </UL>
        <P>
          <strong>Accessibility exception.</strong> Nothing in this Section is intended to restrict
          the use of assistive technologies &mdash; such as screen readers, refreshable braille
          displays, or other tools used by individuals with disabilities to access and read the
          Services for their own personal, non-automated use. Legitimate, individual accessibility
          use of the Services is welcome and permitted.
        </P>
        <P>
          <strong>Grant and revocation of authorization.</strong> Your permission to access the
          Services is a limited, revocable license, not a right. We may revoke, suspend, condition,
          or limit your authorization to access all or any part of the Services at any time, for any
          reason, with or without notice, including by written notice to you or to your Internet or
          cloud-service provider, and by technical means such as blocking your account, IP addresses,
          IP ranges, or hosting provider (ASN). Any access to the Services after your authorization
          has been revoked, or that evades or circumvents any block or restriction we have applied,
          is access without authorization and is expressly prohibited.
        </P>
        <P>
          <strong>Ownership and copyright.</strong> The original course text, blog articles, practice
          questions, and other original expression made available through the Services are works of
          authorship owned by JustInsurance LLC and protected by U.S. copyright law. Unauthorized
          reproduction, distribution, or creation of derivative works from that original expression,
          and the removal or alteration of any copyright, authorship, or terms-of-use notice
          associated with it, is prohibited and may constitute copyright infringement and a violation
          of 17 U.S.C. &sect; 1201.
        </P>
        <P>
          <strong>Monitoring and evidence.</strong> We may monitor, log, and record access to the
          Services &mdash; including IP addresses, request timestamps, request volume, and user-agent
          and account information &mdash; to detect, investigate, prevent, and document violations of
          this Section, and we may preserve and use those records in connection with enforcement.
        </P>
        <P>
          <strong>Reservation of remedies.</strong> Violation of this Section is a material breach of
          these Terms. In addition to terminating your account and access, we reserve the right to
          pursue any and all remedies available at law or in equity, which may include injunctive and
          other equitable relief, breach-of-contract damages, and claims under applicable federal and
          state law, including the U.S. Copyright Act, the Digital Millennium Copyright Act (including
          17 U.S.C. &sect; 1201), the Computer Fraud and Abuse Act, and the Florida Computer Abuse and
          Data Recovery Act (Fla. Stat. &sect;&sect; 668.801&ndash;668.805), to the extent each
          applies to the conduct at issue. Where permitted by the applicable statute or agreement, we
          will seek recovery of our costs and reasonable attorneys&rsquo; fees. Nothing in this
          Section guarantees any particular claim, outcome, or remedy; the availability of any
          specific claim depends on the facts and governing law. This Section is in addition to, and
          does not limit, the intellectual-property and other protections stated elsewhere in these
          Terms, and is governed by the Florida choice-of-law and Broward County venue provisions
          below.
        </P>
      </Section>

      {/* 8. Limitation of Liability */}
      <Section id="liability" number="8" title="Limitation of Liability" altBg={true}>
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

      {/* 9. Governing Law */}
      <Section id="governing-law" number="9" title="Governing Law" altBg={false}>
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

      {/* 10. Changes to Terms */}
      <Section id="changes" number="10" title="Changes to These Terms" altBg={true}>
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

      {/* 11. Disclaimer — Educational Content */}
      <Section id="disclaimer" number="11" title="Disclaimer &mdash; Educational Content" altBg={false}>
        <P>
          JustInsurance provides state-approved insurance education. Our courses, blog posts, and
          guides are for general educational and informational purposes only and are not legal,
          tax, financial, or regulatory advice. Licensing and continuing education requirements
          change frequently and vary by state. You should always verify current rules with your
          state Department of Insurance and consult a qualified professional (such as an attorney,
          accountant, or licensed insurance professional) before acting or relying on any
          information provided through the Services.
        </P>
        <P>
          Completion of a JustInsurance course does not guarantee that you will pass any state
          licensing exam, obtain or maintain a license, or satisfy any particular regulatory
          requirement. It is your responsibility to confirm that a course satisfies your state&rsquo;s
          specific requirements before enrolling.
        </P>
      </Section>

      {/* 12. Contact */}
      <Section id="contact" number="12" title="Contact Information" altBg={true}>
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
