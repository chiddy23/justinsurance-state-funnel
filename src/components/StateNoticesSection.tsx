import Link from "next/link";

export interface StateNotice {
  /** Affects the visual treatment: "alert" = red warning, "update" = blue info, "tip" = gold info */
  kind: "alert" | "update" | "tip";
  title: string;
  body: string;
  /** Optional footer with a link */
  link?: { href: string; text: string; external?: boolean };
}

interface Props {
  stateName: string;
  notices: StateNotice[];
}

const STYLES: Record<StateNotice["kind"], { bar: string; icon: string; label: string }> = {
  alert: {
    bar: "bg-red-50 border-red-500",
    icon: "⚠️",
    label: "Important",
  },
  update: {
    bar: "bg-blue-50 border-blue-500",
    icon: "🆕",
    label: "Regulatory Update",
  },
  tip: {
    bar: "bg-amber-50 border-gold",
    icon: "📌",
    label: "Planning Note",
  },
};

export default function StateNoticesSection({ stateName, notices }: Props) {
  if (!notices || notices.length === 0) return null;

  return (
    <section className="bg-gray-bg py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-2">
          {stateName} Licensing — What You Need to Know
        </h2>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Key {stateName}-specific details many candidates miss. Verified against
          primary state sources.
        </p>
        <div className="space-y-4">
          {notices.map((n, i) => {
            const s = STYLES[n.kind];
            return (
              <article
                key={i}
                className={`${s.bar} border-l-4 rounded-r-xl p-5 shadow-sm`}
              >
                <div className="flex gap-3">
                  <span className="text-2xl flex-shrink-0" aria-hidden="true">
                    {s.icon}
                  </span>
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-wide text-navy font-bold mb-1">
                      {s.label}
                    </p>
                    <h3 className="font-bold text-navy mb-2 leading-snug">{n.title}</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">{n.body}</p>
                    {n.link && (
                      <p className="mt-3">
                        {n.link.external ? (
                          <a
                            href={n.link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gold-deep font-semibold hover:underline text-sm"
                          >
                            {n.link.text} →
                          </a>
                        ) : (
                          <Link
                            href={n.link.href}
                            className="text-gold-deep font-semibold hover:underline text-sm"
                          >
                            {n.link.text} →
                          </Link>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
