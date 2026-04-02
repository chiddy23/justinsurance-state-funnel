# JustInsurance State Funnel Website

## Project Overview
SEO funnel website for JustInsurance LLC — 456+ static pages covering insurance licensing courses across 49 states (New York excluded). Built with Next.js 14 App Router, TypeScript, and Tailwind CSS. Deployed on Vercel.

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom brand colors (navy #1B3A6B, gold #F5A623, gray-bg #F5F7FA)
- **Deployment:** Vercel (force deploy with `vercel --prod --force` to bust CDN cache)
- **Font:** Inter

## Key Commands
```bash
npm run dev      # Start local dev server (http://localhost:3000)
npm run build    # Production build (generates all 456+ static pages)
npm run lint     # ESLint check
vercel --prod --force  # Deploy to production (use --force to clear cache)
```

## Project Structure
```
src/
  app/              # Next.js App Router pages
    [state]/        # Dynamic state routes (49 states)
      page.tsx                          # State hub
      requirements/page.tsx             # Legal citations & requirements
      prelicensing/page.tsx             # Prelicensing hub
      prelicensing/[loa]/page.tsx       # Course detail page
      continuing-education/page.tsx     # CE hub
      continuing-education/[loa]/page.tsx  # CE course detail
    press/page.tsx
    pass-rates/page.tsx
    faq/page.tsx
    study-guide/page.tsx
    insurance-exam-guide/page.tsx
    license-renewal-guide/page.tsx
    prelicensing/page.tsx               # Category hub
    continuing-education/page.tsx       # Category hub
    life-insurance-license/page.tsx     # LOA hub
    health-insurance-license/page.tsx   # LOA hub
    life-and-health-insurance-license/page.tsx  # LOA hub
    sitemap.ts
    layout.tsx
    not-found.tsx
  components/       # Reusable React components (Navbar, Footer, CTABanner, etc.)
  lib/              # Data & utilities
    states.ts       # All 50 states data (hours, DOI, citations, testimonials)
    loa.ts          # Lines of Authority definitions
    catalog-links.json  # Absorb LMS URLs per state
    metadata.ts     # SEO metadata generator
    schema.tsx      # JSON-LD structured data
    faq-data.ts     # FAQ content generators
    sitemap-data.ts # Sitemap URL list
    seo-data.json   # Raw CSV data (113 columns, 50 states)
public/
  robots.txt        # Disallows /new-york, points to sitemap
vercel.json         # WP redirects (301), security headers
```

## Important Rules
- **New York is excluded** — filtered from homepage grid, sitemap, robots.txt
- **Title tags must be 45-61 characters** — use `{ absolute: title }` in metadata to bypass layout template suffix
- **Layout template** adds " | JustInsurance" — page metadata must use `absolute` to avoid double suffix
- **Brand colors only:** navy (#1B3A6B), gold (#F5A623), gray-bg (#F5F7FA)
- **No background sync schedulers** — caused infinite load on login in prior project, avoid
- **vercel --prod --force** is required for deploys to bust CDN cache
- **Static generation:** All state pages use `generateStaticParams()` — changes to state data require a rebuild

## Git Info
- **Repo:** https://github.com/chiddy23/justinsurance-state-funnel.git
- **Branch:** master
- **Deploy URL:** https://justinsurance-state-funnel.vercel.app
