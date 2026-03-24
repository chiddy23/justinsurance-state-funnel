import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] bg-navy-dark flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-gold font-bold text-6xl md:text-8xl mb-4">404</p>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-blue-100 text-lg mb-8 max-w-md mx-auto">
          Sorry, we couldn&apos;t find the page you were looking for. It may have moved or the URL might be incorrect.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-block bg-gold hover:bg-gold-dark text-gray-dark font-bold px-8 py-3 rounded-lg transition-colors"
          >
            Browse All States
          </Link>
          <a
            href="tel:7542239744"
            className="inline-block bg-transparent border-2 border-white text-white font-bold px-8 py-3 rounded-lg hover:bg-white hover:text-navy transition-colors"
          >
            Call 754-223-9744
          </a>
        </div>
      </div>
    </div>
  );
}
