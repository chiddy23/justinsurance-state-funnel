// Shared Spanish (es-US) translation strings for the /es/[state] hub pilot.
// Tone: Professional but warm; addressed as "tú" (US-Latino convention for
// online education brands). Currency stays in USD format ("$199" not "199 USD").
// Used by /es/florida and /es/texas — no other surfaces consume these strings yet.

export interface SpanishStateCopy {
  /** Hero eyebrow ("Florida Insurance Licensing" -> "Licencia de Seguros en Florida") */
  heroEyebrow: string;
  /** Hero H1 (state-specific override mirrors the EN H1 patterns) */
  heroTitle: string;
  /** Hero subtitle — translated from stateSpecificIntro */
  heroSubtitle: string;
  /** Five FAQ entries translated from getStateHubFAQs + the state-specific Q */
  faqs: { question: string; answer: string }[];
  /** Course (Life & Health) Spanish description for Course schema */
  courseDescription: string;
  /** Page metadata description (≤160 chars) */
  metaDescription: string;
}

// ----- Common UI strings (section headings, CTAs, labels) ---------------------
// Re-used across both ES pages. Keep these concise and brand-neutral.

export const SPANISH_UI = {
  // Section headings
  whatWeOffer: "Lo que ofrecemos",
  whyChooseUs: "Por qué elegir JustInsurance",
  requirementsHeading: "Requisitos para tu licencia",
  examInfoHeading: "Información del examen estatal",
  ceHeading: "Educación continua (CE)",
  testimonialsHeading: "Testimonios",
  faqHeading: "Preguntas frecuentes",
  prelicensingCtaHeading: "Comienza tu curso de prelicenciatura",
  finalCtaHeading: "¿Listo para obtener tu licencia de seguros?",

  // Buttons / CTAs
  startPrelicensing: "Comenzar prelicenciatura",
  renewWithCE: "Renovar con CE",
  browseCourses: "Ver cursos",
  viewRequirements: "Ver requisitos completos",
  switchToEnglish: "View in English",

  // Stat / data labels (mirror StateRequirementsBlock)
  licenseDurationLabel: "Vigencia de la licencia",
  examFeeLabel: "Costo del examen",
  totalCostLabel: "Costo total estimado",
  passingScoreLabel: "Puntaje aprobatorio",
  examProviderLabel: "Proveedor del examen",
  passRateLabel: "Tasa de aprobación de estudiantes JustInsurance",
  prelicensingHoursLabel: "Horas de prelicenciatura",
  ceHoursLabel: "Horas de CE requeridas",
  ceCycleLabel: "Ciclo de renovación",
  coursePriceLabel: "Precio del curso",

  // Misc
  lastVerifiedLabel: "Última verificación",
  providerApprovalLabel: "Número de aprobación del proveedor",
  brand: "JustInsurance",

  // Trust / value props (used in "Por qué elegir" grid)
  valueProps: [
    {
      icon: "🏛️",
      title: "Cursos aprobados por el estado",
      desc: "Cada curso de JustInsurance está aprobado oficialmente por el departamento de seguros de tu estado para cumplir con los requisitos de prelicenciatura y CE.",
    },
    {
      icon: "📱",
      title: "Estudia desde cualquier lugar",
      desc: "Accede a tu curso desde cualquier dispositivo: computadora, tableta o celular. Estudia en casa, en el descanso del trabajo o cuando quieras.",
    },
    {
      icon: "✅",
      title: "Garantía de aprobación",
      desc: "Cumple con las horas de estudio recomendadas, obtén 80% o más en el examen de práctica tres veces y presenta tu examen estatal dentro de 30 días de inscribirte. Si no apruebas, te devolvemos el costo del curso.",
    },
    {
      icon: "⚡",
      title: "Reporte de CE el mismo día",
      desc: "Reportamos tus créditos de CE al departamento de seguros el mismo día que terminas. Sin papeleo ni esperas.",
    },
    {
      icon: "🎓",
      title: "Diseñado para aprobar",
      desc: "Exámenes de práctica que reflejan el examen estatal real, tarjetas de estudio y videos impartidos por profesionales con licencia.",
    },
    {
      icon: "💬",
      title: "Soporte real",
      desc: "¿Tienes preguntas? Nuestro equipo de soporte responde dudas reales sobre el curso y el proceso de licencia.",
    },
  ],
} as const;

// ----- Florida copy ----------------------------------------------------------

export const FLORIDA_ES: SpanishStateCopy = {
  heroEyebrow: "Licencia de Seguros en Florida",
  heroTitle: "Licencia 2-15 de Florida: Cursos de Prelicenciatura y CE en Línea",
  heroSubtitle:
    "Florida es el tercer mercado más grande del país para agentes de seguros, con uno de los entornos de seguros más activos y complejos. La licencia 2-15 (Vida, Salud y Anualidades) es la designación combinada exclusiva de Florida y cubre seguros de vida, anualidades y seguros de salud bajo un solo número de licencia. Con la exposición a huracanes, una gran población de adultos mayores y el corredor tecnológico del I-4 en pleno crecimiento, Florida es un mercado privilegiado tanto para agentes de propiedad y casualidad como para los de vida y salud.",
  courseDescription:
    "Curso de prelicenciatura en línea aprobado por el estado para Florida (Vida y Salud). Prepárate para aprobar el examen estatal. 100% en línea, a tu propio ritmo, con exámenes de práctica y garantía de aprobación incluidos.",
  metaDescription:
    "Obtén tu licencia de seguros de Florida en línea — preparación para el examen de Pearson VUE, prelicenciatura aprobada por el estado, 93% de tasa de aprobación, garantía. Desde $199.",
  faqs: [
    {
      question: "¿Cómo obtengo mi licencia de seguros en Florida?",
      answer:
        "Obtener tu licencia de seguros de Florida implica cuatro pasos. Primero, completa un curso de prelicenciatura aprobado por el estado (60 horas para la línea combinada de Vida y Salud, conocida como la licencia 2-15). Segundo, aprueba el examen estatal administrado por Pearson VUE — necesitas al menos 70% para aprobar. Tercero, completa una verificación de antecedentes con huellas digitales a través de IdentoGO (código DFS-1-FL921060Z). Cuarto, presenta tu solicitud por medio del National Insurance Producer Registry (NIPR) y paga la cuota de $50 al Departamento de Servicios Financieros de Florida. La mayoría de los candidatos completan todo el proceso en 2-4 semanas. JustInsurance ofrece cursos de prelicenciatura 100% en línea, a tu propio ritmo, aprobados para Florida.",
    },
    {
      question: "¿Cuánto cuesta obtener una licencia de seguros en Florida?",
      answer:
        "El costo total para obtener tu licencia de seguros de Florida normalmente está entre $350 y $500. El desglose es así: la cuota del examen de Pearson VUE es de $44, la cuota de solicitud al Departamento de Servicios Financieros de Florida es de $50, y la verificación de antecedentes con huellas digitales agrega aproximadamente $50 adicionales. Si necesitas un curso de prelicenciatura, el paquete combinado de Vida y Salud de JustInsurance cuesta $199 — eso es $199 menos que comprar los cursos de Vida y Salud por separado. Todo lo que necesitas para obtener tu licencia, sin cargos ocultos.",
    },
    {
      question: "¿Cuánto tiempo toma obtener la licencia en Florida?",
      answer:
        "La mayoría de los candidatos enfocados completan el proceso de licencia de seguros en Florida en 2 a 4 semanas. Ese tiempo incluye terminar tu curso de prelicenciatura (tienes 30 días de acceso; la mayoría termina en 5-10 días), agendar y aprobar el examen estatal de Pearson VUE, completar la verificación de antecedentes y esperar a que el Departamento de Servicios Financieros de Florida procese tu solicitud. El examen de Pearson VUE entrega resultados rápidamente — la mayoría de los candidatos reciben su puntaje antes de salir del centro de pruebas. El formato a tu propio ritmo de JustInsurance te permite avanzar tan rápido o tan constante como tu horario lo permita.",
    },
    {
      question: "¿Cuál es la tasa de aprobación de los estudiantes de JustInsurance en el examen de Florida?",
      answer:
        "Los estudiantes de JustInsurance a nivel nacional aprueban los exámenes de licencia de seguros con una tasa aproximada del 93% en su primer intento — medido entre los estudiantes que completan el curso completo, terminan las horas de estudio recomendadas y obtienen 80% o más tres veces seguidas en el examen de práctica antes de presentar el examen real. El examen de Florida lo administra Pearson VUE y requiere un puntaje mínimo del 70% para aprobar. Si no apruebas en tu primer intento, puedes volver a presentarlo agendando la siguiente fecha disponible — no hay un período de espera obligatorio. Estás limitado a 5 intentos por tipo de examen dentro de un período de 12 meses. Consulta nuestra metodología completa de tasa de aprobación en /pass-rates.",
    },
    {
      question: "¿Cuánto ganan los agentes de seguros en Florida?",
      answer:
        "Los agentes de seguros en Florida ganan en promedio $80,300 al año según datos de la Oficina de Estadísticas Laborales (BLS). Los agentes nuevos suelen ganar alrededor de $38,420 en su primer año mientras construyen una cartera de clientes, y los productores de mejor desempeño en Florida pueden ganar $132,250 o más anualmente. La demanda de nuevos productores de seguros se mantiene estable en Florida. El ingreso depende mucho de las líneas de autoridad que tengas y de si trabajas como agente cautivo o independiente — la licencia combinada 2-15 (Vida, Salud y Anualidades) abre el rango de productos más amplio y el mayor potencial de ingresos. Las cifras de ingresos son ilustrativas, se basan en datos públicos del mercado laboral y no constituyen una garantía de ingresos; los resultados individuales varían.",
    },
    {
      question: "¿Qué es la licencia de seguros 2-15 de Florida?",
      answer:
        "La licencia 2-15 de Vida, Salud y Anualidades de Florida es la licencia combinada principal del estado para agentes que venden seguros de vida, productos de anualidades y seguros de salud. La designación '2-15' se refiere al capítulo y sección específicos de los Estatutos de Florida que rigen esta licencia. Es una de las licencias más buscadas en Florida porque permite a los agentes vender una amplia gama de productos. Florida también requiere capacitación adicional específica: 8 horas iniciales para productos de Cuidado a Largo Plazo (LTC), 4 horas para anualidades y 3 horas para cobertura de inundaciones del NFIP, además del requisito de prelicenciatura.",
    },
  ],
};

// ----- Texas copy ------------------------------------------------------------

export const TEXAS_ES: SpanishStateCopy = {
  heroEyebrow: "Licencia de Seguros en Texas",
  heroTitle: "Obtén tu Licencia de Seguros en Texas — Sin Prelicenciatura Obligatoria",
  heroSubtitle:
    "Texas es el segundo mercado más grande del país para empleo de agentes de seguros, y no requiere educación de prelicenciatura — lo que lo convierte en uno de los mercados grandes más accesibles del país. El Departamento de Seguros de Texas (TDI) supervisa uno de los entornos de licencia más activos de EE.UU., con Houston, Dallas-Fort Worth, San Antonio y Austin como mercados metropolitanos principales para profesionales de seguros. Texas no tiene impuesto estatal sobre la renta, una población enorme y una economía energética que generan una demanda excepcional en todas las líneas de cobertura.",
  courseDescription:
    "Curso de preparación en línea para el examen de seguros de Texas (Vida y Salud). Texas no requiere prelicenciatura, pero la mayoría de los candidatos exitosos usan un curso estructurado. 100% en línea, a tu propio ritmo, con exámenes de práctica y garantía de aprobación incluidos.",
  metaDescription:
    "Obtén tu licencia de seguros de Texas en línea — sin prelicenciatura obligatoria, examen de Pearson VUE, 93% de tasa de aprobación, garantía. Desde $199.",
  faqs: [
    {
      question: "¿Cómo obtengo mi licencia de seguros en Texas?",
      answer:
        "Obtener tu licencia de seguros de Texas implica cuatro pasos. Primero, prepárate para tu examen — Texas no requiere un curso formal de prelicenciatura, pero la mayoría de los candidatos exitosos toman uno. Segundo, aprueba el examen estatal administrado por Pearson VUE — necesitas al menos 70% para aprobar. Tercero, completa una verificación de antecedentes con huellas digitales a través de IdentoGO (Service Code 11G6QF). Cuarto, presenta tu solicitud por medio del National Insurance Producer Registry (NIPR) y paga la cuota de $50 al Departamento de Seguros de Texas. La mayoría de los candidatos completan todo el proceso en 2-4 semanas. JustInsurance ofrece cursos de preparación para Texas 100% en línea, a tu propio ritmo, que te llevan al día del examen con confianza.",
    },
    {
      question: "¿Cuánto cuesta obtener una licencia de seguros en Texas?",
      answer:
        "El costo total para obtener tu licencia de seguros de Texas normalmente está entre $350 y $500. El desglose es así: la cuota del examen de Pearson VUE es de $39, la cuota de solicitud al Departamento de Seguros de Texas es de $50, y la verificación de antecedentes con huellas digitales agrega aproximadamente $39.70 adicionales. Aunque Texas no requiere un curso de prelicenciatura, el paquete combinado de Vida y Salud de JustInsurance cuesta $199 — eso es $199 menos que comprar los cursos de Vida y Salud por separado. Todo lo que necesitas para prepararte y obtener tu licencia, sin cargos ocultos.",
    },
    {
      question: "¿Cuánto tiempo toma obtener la licencia en Texas?",
      answer:
        "La mayoría de los candidatos enfocados completan el proceso de licencia de seguros en Texas en 2 a 4 semanas. Ese tiempo incluye prepararte para el examen (la mayoría de los estudiantes terminan el curso de preparación de JustInsurance en 5-10 días), agendar y aprobar el examen estatal de Pearson VUE, completar la verificación de antecedentes con huellas digitales y esperar a que el Departamento de Seguros de Texas procese tu solicitud. El TDI tiene uno de los tiempos de procesamiento más rápidos del país: 1-2 días hábiles. El examen de Pearson VUE entrega resultados rápidamente — la mayoría de los candidatos reciben su puntaje antes de salir del centro de pruebas.",
    },
    {
      question: "¿Cuál es la tasa de aprobación de los estudiantes de JustInsurance en el examen de Texas?",
      answer:
        "Los estudiantes de JustInsurance a nivel nacional aprueban los exámenes de licencia de seguros con una tasa aproximada del 93% en su primer intento — medido entre los estudiantes que completan el curso completo, terminan las horas de estudio recomendadas y obtienen 80% o más tres veces seguidas en el examen de práctica antes de presentar el examen real. El examen de Texas lo administra Pearson VUE y requiere un puntaje mínimo del 70% para aprobar. Si no apruebas en tu primer intento, puedes volver a presentarlo agendando la siguiente fecha disponible — no hay un período de espera obligatorio ni un límite en el número de intentos. Consulta nuestra metodología completa de tasa de aprobación en /pass-rates.",
    },
    {
      question: "¿Cuánto ganan los agentes de seguros en Texas?",
      answer:
        "Los agentes de seguros en Texas ganan en promedio $66,490 al año según datos de la Oficina de Estadísticas Laborales (BLS). Los agentes nuevos suelen ganar alrededor de $30,140 en su primer año mientras construyen una cartera de clientes, y los productores de mejor desempeño en Texas pueden ganar $121,590 o más anualmente. La demanda de nuevos productores de seguros se mantiene fuerte en Texas gracias a su gran población y al crecimiento económico del estado. El ingreso depende mucho de las líneas de autoridad que tengas y de si trabajas como agente cautivo o independiente — la licencia combinada de Vida y Salud abre el rango de productos más amplio y el mayor potencial de ingresos. Las cifras de ingresos son ilustrativas, se basan en datos públicos del mercado laboral y no constituyen una garantía de ingresos; los resultados individuales varían.",
    },
    {
      question: "¿Texas requiere educación de prelicenciatura para una licencia de seguros?",
      answer:
        "No. Texas no requiere educación de prelicenciatura antes de presentar el examen estatal de seguros. Puedes registrarte directamente con Pearson VUE y agendar tu examen sin completar ningún curso formal. Sin embargo, el examen de seguros de Texas cubre extensa ley estatal y conocimiento de productos — la mayoría de los que toman el examen por primera vez se benefician significativamente de un curso preparatorio estructurado. Texas también requiere una capacitación de 4 horas en idoneidad de anualidades antes de vender productos de anualidades, incluso después de obtener la licencia.",
    },
  ],
};
