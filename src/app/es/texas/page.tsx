import type { Metadata } from "next";
import Link from "next/link";
import { getStateBySlug } from "@/lib/states";
import {
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateOrganizationSchema,
  SchemaMarkup,
} from "@/lib/schema";
import { TEXAS_ES, SPANISH_UI } from "@/lib/spanish-copy";
import TestimonialCards from "@/components/TestimonialCards";

const BASE_URL = "https://justinsuranceco.com";
const SLUG = "texas";
// No-slash paths to match site canonical (middleware 308-redirects
// trailing slash). Fixed 2026-06-12 per Semrush hreflang audit.
const ES_PATH = `/es/${SLUG}`;
const EN_PATH = `/${SLUG}`;

export const metadata: Metadata = {
  title: { absolute: "Texas Curso de Licencia de Seguros — $199 | JustInsurance" },
  description: TEXAS_ES.metaDescription,
  robots: "index, follow",
  alternates: {
    canonical: `${BASE_URL}${ES_PATH}`,
    languages: {
      "en-US": `${BASE_URL}${EN_PATH}`,
      "es-US": `${BASE_URL}${ES_PATH}`,
      "x-default": `${BASE_URL}${EN_PATH}`,
    },
  },
  openGraph: {
    title: "Texas Curso de Licencia de Seguros — $199 | JustInsurance",
    description: TEXAS_ES.metaDescription,
    url: `${BASE_URL}${ES_PATH}`,
    siteName: "JustInsurance",
    type: "website",
    locale: "es_US",
    alternateLocale: ["en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Texas Curso de Licencia de Seguros — $199 | JustInsurance",
    description: TEXAS_ES.metaDescription,
  },
};

export default function TexasSpanishHubPage() {
  const stateData = getStateBySlug(SLUG);
  if (!stateData) {
    return null;
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Inicio", url: `${BASE_URL}/` },
    { name: "Español", url: `${BASE_URL}/es/` },
    { name: "Texas", url: `${BASE_URL}${ES_PATH}` },
  ]);

  const faqSchema = generateFAQSchema(TEXAS_ES.faqs);

  // Course schema with inLanguage: "es-US". TX prelicensing hours are stored as
  // a string ("None required (optional)") so we omit the time fields entirely.
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Texas Curso de Preparación para Examen de Seguros — Vida y Salud",
    description: TEXAS_ES.courseDescription,
    provider: {
      "@type": "Organization",
      name: "JustInsurance LLC",
      url: BASE_URL,
      logo: `${BASE_URL}/justinsurance-logo.png`,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
    },
    offers: {
      "@type": "Offer",
      price: "199",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}/${SLUG}/prelicensing`,
    },
    courseMode: "online",
    educationalCredentialAwarded: "Certificado de Preparación para Examen de Seguros de Texas",
    inLanguage: "es-US",
    url: `${BASE_URL}${ES_PATH}`,
  };

  return (
    <>
      <SchemaMarkup schema={generateOrganizationSchema()} />
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />
      <SchemaMarkup schema={courseSchema} />

      {/* Breadcrumb / language switcher */}
      <nav aria-label="breadcrumb" className="bg-gray-bg py-3 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2 text-sm">
          <ol className="flex items-center gap-2 text-gray-600">
            <li>
              <Link href="/" className="hover:text-navy">
                Inicio
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-navy font-semibold">Texas (Español)</li>
          </ol>
          <Link
            href={EN_PATH}
            hrefLang="en-US"
            className="text-navy underline text-xs hover:text-gold"
          >
            {SPANISH_UI.switchToEnglish}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-navy-dark text-white py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">
            {TEXAS_ES.heroEyebrow}
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-balance">
            {TEXAS_ES.heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-8 max-w-2xl mx-auto">
            {TEXAS_ES.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${SLUG}/prelicensing/`}
              className="inline-block bg-gold text-navy font-bold text-lg px-8 py-4 rounded-lg hover:bg-gold-dark transition-all"
            >
              {SPANISH_UI.startPrelicensing}
            </Link>
            <Link
              href={`/${SLUG}/continuing-education/`}
              className="inline-block bg-transparent border-2 border-white text-white font-bold text-lg px-8 py-4 rounded-lg hover:bg-white hover:text-navy transition-all"
            >
              {SPANISH_UI.renewWithCE}
            </Link>
          </div>
        </div>
      </section>

      {/* Provider badge / trust */}
      <section className="bg-white py-6 px-4 border-b border-gray-100">
        <div className="max-w-5xl mx-auto text-center text-sm text-gray-600">
          Proveedor aprobado por el {stateData.doiName} —{" "}
          {SPANISH_UI.providerApprovalLabel}: {stateData.providerApprovalNumber}
        </div>
      </section>

      {/* Lo que ofrecemos */}
      <section className="bg-gray-bg py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            {SPANISH_UI.whatWeOffer}
          </h2>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            Cursos de preparación para el examen y educación continua aprobados para
            Texas. Aunque el TDI no exige prelicenciatura, nuestros cursos te dan la
            estructura necesaria para aprobar en el primer intento.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-navy mb-2">
                Preparación para Examen — Vida y Salud
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Curso combinado que cubre seguros de vida, salud y todas las áreas que
                Pearson VUE evalúa en el examen estatal de Texas.
              </p>
              <p className="text-2xl font-bold text-gold-dark mb-2">$199</p>
              <Link
                href={`/${SLUG}/prelicensing/`}
                className="text-navy underline text-sm hover:text-gold"
              >
                Ver detalles del curso →
              </Link>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-navy mb-2">
                Paquete de Educación Continua (CE)
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Las 24 horas de CE que Texas requiere cada 2 años, incluyendo las 3
                horas obligatorias de ética. Reportamos al TDI el mismo día.
              </p>
              <p className="text-2xl font-bold text-gold-dark mb-2">$39</p>
              <Link
                href={`/${SLUG}/continuing-education/`}
                className="text-navy underline text-sm hover:text-gold"
              >
                Ver paquete de CE →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Requisitos */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-8">
            {SPANISH_UI.requirementsHeading}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-bg rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                {SPANISH_UI.licenseDurationLabel}
              </p>
              <p className="text-sm font-bold text-navy">2 años</p>
            </div>
            <div className="bg-gray-bg rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                {SPANISH_UI.examFeeLabel}
              </p>
              <p className="text-sm font-bold text-navy">
                ${stateData.examInfo.examFee}
              </p>
            </div>
            <div className="bg-gray-bg rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                {SPANISH_UI.totalCostLabel}
              </p>
              <p className="text-sm font-bold text-navy">$350-500</p>
            </div>
            <div className="bg-gray-bg rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                {SPANISH_UI.coursePriceLabel}
              </p>
              <p className="text-sm font-bold text-navy">$199</p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link
              href={`/${SLUG}/requirements/`}
              className="text-sm text-navy underline hover:text-gold"
            >
              {SPANISH_UI.viewRequirements} →
            </Link>
          </div>
        </div>
      </section>

      {/* Por qué elegir JustInsurance */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-3">
            {SPANISH_UI.whyChooseUs}
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
            Hemos ayudado a más de 20,000 estudiantes a obtener su licencia en todo el país.
            Estas son las razones por las que nos eligen.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SPANISH_UI.valueProps.map((item) => (
              <div key={item.title} className="bg-gray-bg rounded-xl p-5">
                <p className="text-2xl mb-3">{item.icon}</p>
                <h3 className="font-bold text-navy mb-2 text-sm">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Información del examen */}
      <section className="bg-gray-bg py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-6">
            {SPANISH_UI.examInfoHeading}
          </h2>
          <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-3 text-sm text-gray-700">
            <p>
              <strong className="text-navy">{SPANISH_UI.examProviderLabel}:</strong>{" "}
              Pearson VUE — el examen se presenta en persona en un centro de pruebas de
              Pearson VUE en Texas. Texas no requiere prelicenciatura, pero el examen
              cubre extensa ley estatal y conocimiento de productos.
            </p>
            <p>
              <strong className="text-navy">{SPANISH_UI.passingScoreLabel}:</strong>{" "}
              {stateData.examInfo.passingScore}% — la mayoría de los candidatos reciben
              su puntaje a los pocos minutos de terminar el examen.
            </p>
            <p>
              <strong className="text-navy">{SPANISH_UI.passRateLabel}:</strong> 93% en
              el primer intento (entre estudiantes que cumplieron las horas de estudio
              recomendadas y obtuvieron 80%+ tres veces seguidas en el examen de
              práctica)
            </p>
            <p>
              <strong className="text-navy">Sin límite de intentos:</strong> Texas no
              limita el número de veces que puedes presentar el examen, y no hay un
              período de espera obligatorio entre intentos.
            </p>
          </div>
        </div>
      </section>

      {/* Educación continua (CE) */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-6">
            {SPANISH_UI.ceHeading}
          </h2>
          <div className="bg-gray-bg rounded-xl p-6 space-y-2 text-sm text-gray-700">
            <p>
              <strong className="text-navy">{SPANISH_UI.ceHoursLabel}:</strong>{" "}
              {stateData.ce.totalHours} horas cada 2 años
            </p>
            <p>
              <strong className="text-navy">Horas de Ética requeridas:</strong>{" "}
              {stateData.ce.ethicsHours} horas (no es opcional)
            </p>
            <p>
              <strong className="text-navy">Reporte al TDI:</strong> JustInsurance
              reporta tus créditos al Departamento de Seguros de Texas el mismo día que
              terminas — sin papeleo manual.
            </p>
            <p>
              <strong className="text-navy">Capacitación adicional:</strong> Texas
              requiere una capacitación única de 4 horas en idoneidad de anualidades
              antes de vender productos de anualidades, incluso después de obtener la
              licencia. Esto es independiente de la prelicenciatura y la CE.
            </p>
            <p>
              <strong className="text-navy">Importante:</strong> los créditos de CE no
              se acumulan al siguiente ciclo en Texas — completa lo que necesites cada
              período de renovación.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="bg-gray-bg py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-6">
            {SPANISH_UI.testimonialsHeading}
          </h2>
          <p className="text-gray-500 text-center text-sm mb-2">
            (Testimonios verificados de nuestros estudiantes — publicados en su idioma
            original)
          </p>
        </div>
        <TestimonialCards stateName={stateData.name} seed={stateData.slug} />
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-10">
            {SPANISH_UI.faqHeading}
          </h2>
          <div className="space-y-3">
            {TEXAS_ES.faqs.map((faq, i) => (
              <details
                key={i}
                className="group border border-gray-200 rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none bg-white hover:bg-gray-bg transition-colors select-none">
                  <span className="font-semibold text-navy text-sm md:text-base leading-snug">
                    {faq.question}
                  </span>
                  <span className="text-navy group-open:rotate-180 transition-transform">
                    ▾
                  </span>
                </summary>
                <div className="p-5 pt-0 text-gray-700 text-sm leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-navy text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {SPANISH_UI.finalCtaHeading}
          </h2>
          <p className="text-blue-100 mb-8">
            Inscríbete hoy en un curso de preparación aprobado para Texas. 100% en
            línea, a tu propio ritmo, respaldado por nuestra garantía de aprobación.
          </p>
          <Link
            href={`/${SLUG}/prelicensing/`}
            className="inline-block bg-gold text-navy font-bold text-lg px-8 py-4 rounded-lg hover:bg-gold-dark transition-all"
          >
            {SPANISH_UI.browseCourses}
          </Link>
        </div>
      </section>

      {/* Last verified */}
      <section className="bg-white py-4 px-4 border-t border-gray-100">
        <div className="max-w-5xl mx-auto text-center text-xs text-gray-400">
          {SPANISH_UI.lastVerifiedLabel}: {stateData.lastVerified}
        </div>
      </section>
    </>
  );
}
