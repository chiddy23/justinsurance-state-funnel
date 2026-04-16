import Link from "next/link";

interface EditorialBylineProps {
  lastVerified?: string;
}

export default function EditorialByline({ lastVerified }: EditorialBylineProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 border-l-4 border-gold bg-gray-50 px-4 py-3 rounded-r-md">
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-gold flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span>
          Reviewed by{" "}
          <Link href="/about#justin" className="font-semibold text-navy hover:text-gold underline">
            Justin vom Eigen
          </Link>
          , Licensed Insurance Educator &amp; Founder
        </span>
      </div>
      {lastVerified && (
        <span className="text-gray-500 sm:ml-auto">
          Last verified: <strong className="text-navy">{lastVerified}</strong>
        </span>
      )}
    </div>
  );
}
