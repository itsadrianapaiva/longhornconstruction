# CÉU Construction — Website

Clean, credible, one-page website that tells CÉU’s story with speed, accessibility, and trust.

## Branch Strategy
- **main**: protected, production-ready.
- **staging**: integration branch for features. Deploys to staging.
- **feature/***: short-lived branches merged via PR into `staging`, then into `main`.

## Project Goals
- One-page site with anchored sections.
- Strong media (project photos, time-lapse).
- Sismo method explained simply.
- High performance, accessibility, SEO.

## Tech (planned)
Next.js (App Router), TailwindCSS, shadcn/ui, Option A i18n with JSON dictionaries, Resend for email, Netlify hosting.

## SDLC Notes
- 3-step plans before coding.
- Small functions, low complexity, low duplication.
- One file at a time, with line-by-line explanations in PRs.

## Getting Started
Codespaces with Node 20. Package manager TBD (pnpm/npm/yarn).
