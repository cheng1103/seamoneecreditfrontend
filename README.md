### SeaMoneeCredit Frontend

Next.js 14 application powering the multilingual marketing site for SeaMoneeCredit. It consumes the backend API for products, testimonials, blogs, applications, etc., and renders localized pages for `/en` and `/ms`.

---

### Requirements

- Node.js 18.18+ (recommend 20 LTS)
- npm 9+ (or pnpm/yarn if you update the scripts)

---

### Environment variables

Create a `.env.local` in `frontend/` with:

```
NEXT_PUBLIC_BASE_URL=https://www.example.com   # used for metadata/open graph
NEXT_PUBLIC_API_URL=http://localhost:5000/api # backend REST API
```

Additional keys (analytics, map embeds, etc.) should be prefixed with `NEXT_PUBLIC_` if used client-side.

---

### Install dependencies

```bash
cd frontend
npm install
```

---

### Development

```bash
npm run dev
```

- Runs the Next.js dev server on `http://localhost:3000`
- Root `/` automatically redirects to `/en`
- Uses next-intl for locale routing (`/en/...`, `/ms/...`)

---

### Production build

```bash
npm run build    # compile for production
npm run start    # serve .next output (uses PORT env)
```

Make sure `NEXT_PUBLIC_*` values point to production services when building.

---

### Linting

```bash
npm run lint
```

Runs Next.js + ESLint rules (TypeScript, accessibility, etc.).

---

### Translation sync check

```bash
npm run check:i18n
```

Ensures `src/i18n/messages/en.json` and `ms.json` have matching keys (arrays included). CI can run this to prevent untranslated strings from slipping in.

---

### Analytics

The localized layout automatically includes [Vercel Web Analytics](https://vercel.com/analytics). No extra config is necessary beyond enabling Analytics in the Vercel project dashboard; the snippet loads only in production builds. If you prefer a different analytics provider, replace the `<Analytics />` component in `src/app/[locale]/layout.tsx`.

---

### Project structure highlights

- `src/app/[locale]/**` – localized routes (home, products, blog, testimonials, calculator, payment table, etc.)
- `src/components/home/**` – hero/features/calculator/cta sections
- `src/lib/api.ts` – lightweight fetch wrappers talking to backend API
- `src/lib/analytics.ts` + `components/analytics/AnalyticsTracker.tsx` – page view tracking
- `src/i18n/messages/{en,ms}.json` – translations mirrored between languages
- `src/hooks/useSiteSettings.ts` – fetch site-wide branding/contact data

---

### Static assets

- `public/brand/**` – logos & favicons
- `src/app/page.tsx` – redirects to the default locale, no Next.js boilerplate

---

### Deployment notes

- Frontend expects the backend to be reachable via `NEXT_PUBLIC_API_URL`
- Configure rewrites or proxy rules if serving both via the same domain
- For Vercel: add the `NEXT_PUBLIC_*` env vars in the project settings and `npm run build` as the build command
