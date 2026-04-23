# JustInsurance State Funnel Website

## Project Overview
SEO funnel website for JustInsurance LLC — **904 static pages** covering insurance licensing courses across 50 states, plus a 280-article blog across 29 topic clusters. Built with Next.js 14 App Router, TypeScript, and Tailwind CSS. Deployed on Vercel at justinsuranceco.com.

## Latest Sprint State (as of 2026-04-24)

**Latest commit:** `923ed93` — Texas parity (Best TX Prelicensing pillar + Deep Dive card)

**Recent significant work:**
- Texas hub now has full Florida parity (specialNotices + Deep Dive card + comparison blog post)
- 12/50 states have specialNotices regulatory callouts populated (FL, CA, TX, NY, PA, OH, IL, GA, NC, MI, NJ, VA)
- 30 states have ≥1 state-matched YouTube testimonial (138 testimonials total)
- ~380 redirect rules across 5 rounds (legacy WP, www→apex, trailing slash, Kaplan URL mirrors, 404 cleanup)
- Comparative-content SOP + `npm run verify-comparative-claims` script (Lanham Act §43(a) compliance)
- Quarterly audit triggers scheduled for 2026-07-01 (Gmail attachment blocked at platform level — workaround needed)

**Sitewide standards (do not violate):**
- Pass rate: **93%** (NOT 93.2 — render uses `Math.round(stateData.realPassRate)`)
- All-inclusive price: **$199 prelicensing / $39 CE**
- Live sessions: **5×/week**, included in base $199
- Pass guarantee: complete recommended hours + score 80%+ on practice 3× in a row + sit for state exam within 30 days of first enrollment
- AggregateRating schema is **STRIPPED** — re-enable only when Google reviews ≥25
- Florida provider approval **#129317** (consolidated; old #373671 was wrong)
- Georgia prelicensing: **8/16 hours** (changed from 20/40 effective June 24, 2025)
- California AB 943: only **12-hour Code & Ethics** prelicensing required (effective Jan 1, 2026)
- Michigan: licenses are **perpetual with biennial CE** (NOT 3-year cycle)

**Memory notes** (most recent first):
- `~/.claude/projects/c--Users-Chidd-Downloads/memory/project_state_funnel_2026-04-24.md`
- `project_state_funnel_2026-04-20.md`
- `project_state_funnel_2026-04-15.md`

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom brand colors (navy #1B3A6B, gold #F5A623, gray-bg #F5F7FA)
- **Deployment:** Vercel (force deploy with `vercel --prod --force` to bust CDN cache)
- **Font:** Inter
- **Markdown:** gray-matter + remark + remark-html for blog posts
- **Typography:** @tailwindcss/typography for blog article rendering

## Key Commands
```bash
npm run dev                          # Start local dev server (http://localhost:3000)
npm run build                        # Production build (generates 904 static pages)
npm run lint                         # ESLint check
npm run verify-comparative-claims    # Quarterly Lanham-Act compliance check (zero exit = clean)
npx vercel deploy --prod --yes       # Deploy to production
```

## Project Structure
```
src/
  app/
    [state]/                    # Dynamic state routes (50 states, NY filtered from grid)
      page.tsx                  # State hub
      requirements/page.tsx     # Legal citations & requirements
      prelicensing/page.tsx     # Prelicensing hub
      prelicensing/[loa]/page.tsx       # Course detail (life, health, life-and-health)
      continuing-education/page.tsx     # CE hub
      continuing-education/[loa]/page.tsx  # CE course detail
    blog/
      page.tsx                  # Blog index (279 posts, 29 clusters)
      [cluster]/page.tsx        # Cluster landing page (topic silo)
      [cluster]/[slug]/page.tsx # Individual blog post
    about/page.tsx              # About page (E-E-A-T, founder bio, press)
    contact/page.tsx            # Contact page (phone, email, address)
    partners/page.tsx           # Agency partnership form (submits to Google Apps Script)
    press/page.tsx              # Press & media mentions
    pass-rates/page.tsx         # 93% pass rate showcase
    faq/page.tsx                # 20 Q&As in 4 categories
    study-guide/page.tsx        # Evidence-based study guide
    insurance-exam-guide/page.tsx    # Exam day guide
    license-renewal-guide/page.tsx   # CE renewal by state
    prelicensing/page.tsx       # Category hub
    continuing-education/page.tsx    # Category hub
    life-insurance-license/page.tsx  # LOA hub
    health-insurance-license/page.tsx # LOA hub
    life-and-health-insurance-license/page.tsx # LOA hub
    privacy-policy/page.tsx     # Privacy policy
    terms/page.tsx              # Terms of service
    video-sitemap.xml/route.ts  # Video sitemap (10 YouTube embeds)
    sitemap.ts                  # Main sitemap route
    layout.tsx                  # Root layout
    not-found.tsx               # 404 page
  components/
    Navbar.tsx          # Nav with Browse States + Resources dropdowns (SSR-visible)
    Footer.tsx          # 7-column footer (Brand, Courses, Resources, States x2, Blog, Legal)
    YouTubeEmbed.tsx    # Lazy-load facade (thumbnail → iframe on click)
    TestimonialCards.tsx # 14-person pool with seed-based per-state selection
    CourseFeatures.tsx  # variant="prelicensing" | "ce"
    BlogCard.tsx, BlogPostLayout.tsx, AuthorBio.tsx, RelatedPosts.tsx
    BlogClusterGrid.tsx, BlogPagination.tsx
    CTABanner.tsx, BreadcrumbNav.tsx, StateHero.tsx, TrustBar.tsx
    CourseOverviewBox.tsx, FAQAccordion.tsx, PassGuarantee.tsx
    LOASelector.tsx, TwoPathSelector.tsx, StickyMobileCTA.tsx
  content/blog/           # 279 markdown blog posts organized in 29 cluster folders
    _index.json           # Post metadata index
    [cluster-slug]/       # 29 cluster directories
      [post-slug].md      # Frontmatter + markdown body
  lib/
    states.ts             # All 50 states data (hours, DOI, citations, testimonials, training)
    loa.ts                # Lines of Authority definitions
    blog.ts               # Blog helper (read .md, parse frontmatter, render markdown)
    catalog-links.json    # Absorb LMS URLs per state
    metadata.ts           # SEO metadata generator (keyword-optimized titles/descriptions)
    schema.tsx            # JSON-LD (Organization, Course, FAQPage, BreadcrumbList, Article, VideoObject, etc.)
    faq-data.ts           # FAQ content generators with aOrAn() helper
    sitemap-data.ts       # Sitemap URL list (814+ URLs including blog)
    youtube-videos.json   # Video embed mapping (10 pages)
    seo-data.json         # Raw CSV data (113 columns, 50 states)
public/
  justinsurance-logo.png  # Self-hosted transparent logo
  favicon.ico             # 48x48 shield favicon for Google
  favicon-48x48.png       # Same as above
  robots.txt              # Allow all, both sitemaps referenced
  blog/images/            # 279 unique Pexels stock images (1 per post)
vercel.json               # 301 redirects for legacy WP URLs, security headers
```

## Important Rules
- **New York:** State data exists but filtered from homepage grid and sitemap. Blog cluster for NY exists but no enrollment CTAs.
- **Title tags:** 45-60 characters. Use `{ absolute: title }` to bypass layout template suffix. Keywords: "prelicensing", "state-approved", "same-day reporting" for CE.
- **Meta descriptions:** 120-155 characters. Must include 2+ conversion signals: 93% pass rate, $199, pass guarantee, state-approved, same-day reporting.
- **Brand:** "JustInsurance LLC" everywhere. Footer copyright has no dual brand. Email on site: `support@justinsuranceco.com`. Actual support inbox: `support@yourinsurancelicense.com` (migration pending).
- **Brand colors only:** navy (#1B3A6B), gold (#F5A623), gray-bg (#F5F7FA)
- **vercel --prod --force** required for deploys to bust CDN cache
- **Static generation:** All state + blog pages use `generateStaticParams()`. Changes require rebuild.
- **Blog posts:** Markdown in `src/content/blog/[cluster]/[slug].md` with frontmatter. Each has unique keyword, unique Pexels image, internal links to state money pages.
- **Testimonials:** 14-person rotation pool seeded by state slug. CE variant exists for renewal pages.
- **CE vs Prelicensing:** CourseFeatures and TestimonialCards both have variant props. CE pages show "Everything You Need to Renew" not "Pass".
- **Application-before-exam states:** AR, NC, KY, KS — requirements page reorders steps automatically via `applicationBeforeExam` flag.
- **California AB 943 (Jan 2026):** Only 12-hour Code & Ethics course required. Line-specific product hours eliminated.
- **YouTube embeds:** Lazy-load facade pattern. 10 pages have embeds. Video sitemap at `/video-sitemap.xml`.
- **Partner form:** `/partners` page form submits to Google Apps Script webhook → emails support + justin.
- **Schema on every page type:** Organization, FAQPage, BreadcrumbList, Course, Article, VideoObject, CollectionPage, Person, ContactPoint, NewsArticle

## Git Info
- **Repo:** https://github.com/chiddy23/justinsurance-state-funnel.git
- **Branch:** master
- **Live URL:** https://justinsuranceco.com
- **GSC:** Verified via DNS. Sitemap submitted. Video sitemap submitted.

## Data Sources
- `src/lib/states.ts` — source of truth for all state data (hours, fees, citations, etc.)
- `C:\Users\Chidd\Downloads\combined placeholders.xlsx` — verified Excel source for exam fees, background costs, provider numbers
- `C:\Users\Chidd\Downloads\blog_post_schedule_v2.xlsx` — blog schedule (29 clusters, titles, keywords, article types)
- `C:\Users\Chidd\Downloads\blog links.xlsx` — Google Docs links for all 314 original blog articles
