# Eduvia marketing website

Production site for **Eduvia** (school management platform by [Abler](https://abler.dev)), built with Astro and deployed on Vercel.

## Commands

```bash
npm install
npm run dev          # http://localhost:3000
npm run check        # astro check
npm run build        # check + build (static pages + serverless contact API)
npm run preview
```

## Environment

Copy `.env.example` to `.env` for local contact delivery:

- `RESEND_API_KEY` — same provider as [abler.dev](https://abler.dev/contact/)
- `CONTACT_TO` / `CONTACT_FROM` — defaults to `hello@abler.dev` and `Eduvia Website <website@abler.dev>`
- `SITE_URL` — canonical URL for SEO and CORS on `/api/contact`

Without `RESEND_API_KEY`, the contact form shows a clear local error; email/phone fallbacks use **hello@abler.dev** and **+92 342 9144154**.

## Contact API

`POST /api/contact` accepts JSON (see `src/lib/contact.ts`). Includes rate limiting, honeypot field, and minimum fill time (spam protection aligned with the Abler site).
