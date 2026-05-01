interface LastUpdatedProps {
  date: string; // "March 2026" or "2026-03-15" — rendered as-is
  className?: string;
}

/**
 * Visible "Last updated" stamp for the bottom of an article body.
 * Renders muted gray italic text — pairs with schema-level dateModified
 * (handled separately in src/lib/schema.ts).
 */
export default function LastUpdated({ date, className = "" }: LastUpdatedProps) {
  if (!date) return null;
  return (
    <p
      className={`text-sm text-gray-500 italic ${className}`.trim()}
      data-component="last-updated"
    >
      Last updated: {date}
    </p>
  );
}
