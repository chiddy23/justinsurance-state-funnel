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
  whatWeOffer: "Lo que incluirá el curso en español",
  whyChooseUs: "Por qué elegir JustInsurance",
  requirementsHeading: "Requisitos para tu licencia",
  examInfoHeading: "Información del examen estatal",
  ceHeading: "Educación continua (CE)",
  testimonialsHeading: "Testimonios",
  faqHeading: "Preguntas frecuentes",
  prelicensingCtaHeading: "Comienza tu curso de prelicenciatura",
  finalCtaHeading: "El curso en español llegará muy pronto",

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
      desc: "Los cursos de JustInsurance cuentan con aprobación estatal donde el estado la otorga: educación continua (CE) y prelicenciatura en los estados que la exigen. Donde el estado no exige prelicenciatura, nuestro curso es preparación para el examen.",
    },
    {
      icon: "📱",
      title: "Estudia desde cualquier lugar",
      desc: "Accede a tu curso desde cualquier dispositivo: computadora, tableta o celular. Estudia en casa, en el descanso del trabajo o cuando quieras.",
    },
    {
      icon: "🗣️",
      title: "Muy pronto en español",
      desc: "Estamos preparando la versión completa del curso en español. Por ahora está disponible en inglés; regresa pronto para estudiar en tu idioma.",
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
  heroTitle: "Curso de Licencia de Seguros de Florida (2-15) — Próximamente en Español",
  heroSubtitle:
    "Florida es el tercer mercado más grande del país para agentes de seguros, con uno de los entornos de seguros más activos y complejos. La licencia 2-15 (Vida, Salud y Anualidades) es la designación combinada exclusiva de Florida y cubre seguros de vida, anualidades y seguros de salud bajo un solo número de licencia. Con la exposición a huracanes, una gran población de adultos mayores y el corredor tecnológico del I-4 en pleno crecimiento, Florida es un mercado privilegiado tanto para agentes de propiedad y casualidad como para los de vida y salud.",
  courseDescription:
    "Curso de prelicenciatura en línea para Florida (Vida y Salud), próximamente disponible en español. 100% en línea y a tu propio ritmo, con exámenes de práctica. El curso ya está disponible en inglés.",
  metaDescription:
    "Curso de licencia de seguros de Florida (2-15), próximamente en español. Prepárate para el examen de Pearson VUE con prelicenciatura aprobada por el estado. Disponible ahora en inglés.",
  faqs: [
    {
      question: "¿Cómo obtengo mi licencia de seguros en Florida?",
      answer:
        "Obtener tu licencia de seguros de Florida implica cuatro pasos. Primero, completa un curso de prelicenciatura aprobado por el estado (60 horas para la línea combinada de Vida y Salud, conocida como la licencia 2-15). Segundo, aprueba el examen estatal administrado por Pearson VUE — necesitas al menos 70% para aprobar. Tercero, completa una verificación de antecedentes con huellas digitales a través de IdentoGO (código DFS-1-FL921060Z). Cuarto, presenta tu solicitud por medio del National Insurance Producer Registry (NIPR) y paga la cuota de $50 al Departamento de Servicios Financieros de Florida. La mayoría de los candidatos completan todo el proceso en 2-4 semanas. El curso de prelicenciatura de JustInsurance para Florida está disponible en inglés y muy pronto en español.",
    },
    {
      question: "¿Cuánto cuesta obtener una licencia de seguros en Florida?",
      answer:
        "El costo total para obtener tu licencia de seguros de Florida, incluyendo el curso de prelicenciatura, ronda los $343. El desglose de las cuotas estatales es así: la cuota del examen de Pearson VUE es de $44, la cuota de solicitud al Departamento de Servicios Financieros de Florida es de $50, y la verificación de antecedentes con huellas digitales agrega aproximadamente $50 adicionales. El resto corresponde al curso de prelicenciatura combinado de 60 horas de Vida y Salud, disponible en inglés y muy pronto en español.",
    },
    {
      question: "¿Cuánto tiempo toma obtener la licencia en Florida?",
      answer:
        "La mayoría de los candidatos enfocados completan el proceso de licencia de seguros en Florida en 2 a 4 semanas. Ese tiempo incluye terminar tu curso de prelicenciatura (tienes 30 días de acceso; la mayoría termina en 5-10 días), agendar y aprobar el examen estatal de Pearson VUE, completar la verificación de antecedentes y esperar a que el Departamento de Servicios Financieros de Florida procese tu solicitud. El examen de Pearson VUE entrega resultados rápidamente — la mayoría de los candidatos reciben su puntaje antes de salir del centro de pruebas. El formato a tu propio ritmo de JustInsurance te permite avanzar tan rápido o tan constante como tu horario lo permita.",
    },
    {
      question: "¿Cuándo estará disponible el curso en español?",
      answer:
        "Estamos finalizando la versión en español de nuestro curso de prelicenciatura para Florida. Por ahora, el curso completo está disponible en inglés y puedes comenzar cuando quieras; regresa pronto para estudiar en español. El examen estatal de Florida lo administra Pearson VUE y requiere un puntaje mínimo del 70% para aprobar; estás limitado a 5 intentos por tipo de examen dentro de un período de 12 meses.",
    },
    {
      question: "¿Cuánto ganan los agentes de seguros en Florida?",
      answer:
        "Los agentes de seguros en Florida ganan en promedio $80,300 al año según datos de la Oficina de Estadísticas Laborales (BLS). Los agentes nuevos suelen ganar alrededor de $38,420 en su primer año mientras construyen una cartera de clientes, y los productores de mejor desempeño en Florida pueden ganar $132,640 o más anualmente. La demanda de nuevos productores de seguros se mantiene estable en Florida. El ingreso depende mucho de las líneas de autoridad que tengas y de si trabajas como agente cautivo o independiente — la licencia combinada 2-15 (Vida, Salud y Anualidades) abre el rango de productos más amplio y el mayor potencial de ingresos. Las cifras de ingresos son ilustrativas, se basan en datos públicos del mercado laboral y no constituyen una garantía de ingresos; los resultados individuales varían.",
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
  heroTitle: "Curso de Licencia de Seguros de Texas — Próximamente en Español",
  heroSubtitle:
    "Texas es el segundo mercado más grande del país para empleo de agentes de seguros, y no requiere educación de prelicenciatura — lo que lo convierte en uno de los mercados grandes más accesibles del país. El Departamento de Seguros de Texas (TDI) supervisa uno de los entornos de licencia más activos de EE.UU., con Houston, Dallas-Fort Worth, San Antonio y Austin como mercados metropolitanos principales para profesionales de seguros. Texas no tiene impuesto estatal sobre la renta, una población enorme y una economía energética que generan una demanda excepcional en todas las líneas de cobertura.",
  courseDescription:
    "Curso de preparación en línea para el examen de seguros de Texas (Vida y Salud), próximamente disponible en español. Texas no requiere prelicenciatura, pero la mayoría de los candidatos exitosos usan un curso estructurado. 100% en línea y a tu propio ritmo, con exámenes de práctica. El curso ya está disponible en inglés.",
  metaDescription:
    "Curso de preparación para el examen de seguros de Texas, próximamente en español. Sin prelicenciatura obligatoria; examen de Pearson VUE. Disponible ahora en inglés.",
  faqs: [
    {
      question: "¿Cómo obtengo mi licencia de seguros en Texas?",
      answer:
        "Obtener tu licencia de seguros de Texas implica cuatro pasos. Primero, prepárate para tu examen — Texas no requiere un curso formal de prelicenciatura, pero la mayoría de los candidatos exitosos toman uno. Segundo, aprueba el examen estatal administrado por Pearson VUE — necesitas un puntaje escalado de al menos 70 para aprobar (es un puntaje escalado, no un porcentaje de respuestas correctas). Tercero, completa una verificación de antecedentes con huellas digitales a través de IdentoGO (Código de servicio 11G6QF). Cuarto, presenta tu solicitud por medio del National Insurance Producer Registry (NIPR) y paga la cuota de $50 al Departamento de Seguros de Texas. La mayoría de los candidatos completan todo el proceso en 2-4 semanas. El curso de preparación de JustInsurance para Texas está disponible en inglés y muy pronto en español.",
    },
    {
      question: "¿Cuánto cuesta obtener una licencia de seguros en Texas?",
      answer:
        "El costo total para obtener tu licencia de seguros de Texas normalmente está entre $350 y $500, incluyendo un curso de preparación. El desglose de las cuotas estatales es así: la cuota del examen de Pearson VUE es de $39, la cuota de solicitud al Departamento de Seguros de Texas es de $50, y la verificación de antecedentes con huellas digitales agrega aproximadamente $39.70 adicionales. Aunque Texas no requiere un curso de prelicenciatura, la mayoría de los candidatos exitosos usan uno; nuestro curso de preparación está disponible en inglés y muy pronto en español.",
    },
    {
      question: "¿Cuánto tiempo toma obtener la licencia en Texas?",
      answer:
        "La mayoría de los candidatos enfocados completan el proceso de licencia de seguros en Texas en 2 a 4 semanas. Ese tiempo incluye prepararte para el examen (la mayoría de los estudiantes terminan el curso de preparación de JustInsurance en 5-10 días), agendar y aprobar el examen estatal de Pearson VUE, completar la verificación de antecedentes con huellas digitales y esperar a que el Departamento de Seguros de Texas procese tu solicitud. El TDI tiene uno de los tiempos de procesamiento más rápidos del país: 1-2 días hábiles. El examen de Pearson VUE entrega resultados rápidamente — la mayoría de los candidatos reciben su puntaje antes de salir del centro de pruebas.",
    },
    {
      question: "¿Cuándo estará disponible el curso en español?",
      answer:
        "Estamos finalizando la versión en español de nuestro curso de preparación para el examen de Texas. Por ahora, el curso completo está disponible en inglés y puedes comenzar cuando quieras; regresa pronto para estudiar en español. El examen de Texas lo administra Pearson VUE y requiere un puntaje escalado de al menos 70 para aprobar, sin límite en el número de intentos.",
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
