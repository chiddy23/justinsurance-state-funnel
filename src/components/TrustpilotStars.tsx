import React from "react";

// Trustpilot-style star: white star on Trustpilot green (#00B67A).
function TpStar({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect width="24" height="24" rx="2" fill="#00B67A" />
      <path
        d="M12 4l2.06 5.06 5.44.4-4.16 3.52 1.31 5.3L12 15.9 7.35 18.28l1.31-5.3L4.5 9.46l5.44-.4L12 4z"
        fill="#fff"
      />
    </svg>
  );
}

// Row of Trustpilot green stars. `count` controls how many (4 or 5 per review).
export default function TrustpilotStars({
  size = "w-5 h-5",
  count = 5,
  className = "",
}: {
  size?: string;
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={`flex gap-0.5 ${className}`}
      role="img"
      aria-label={`${count} out of 5 on Trustpilot`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <TpStar key={i} className={size} />
      ))}
    </div>
  );
}
