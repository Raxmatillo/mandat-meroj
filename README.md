# ME’ROJ Mandat

Responsive university admissions frontend built with React, TypeScript, Vite, and Tailwind CSS. It includes 2026 pass-score lookup and score comparison, plus historical score calculation and subject-pair catalog browsing for 2023–2025.

## Run locally

```bash
npm ci
npm run dev
```

## Build and deploy

```bash
npm run build
npm run preview
```

The build is written to `dist/`. For Vercel, use the repository root as the project root, `npm run build` as the build command, and `dist` as the output directory. Add `mandat.meroj.uz` to the Vercel project and point its DNS record to the target shown by Vercel.

The language selector is available on every route. Uzbek is the default, and the chosen language is saved in browser local storage. Uzbek interface text uses the requested letters ş, ç, ğ, ö.

## Admissions data

The 2026 pages read `public/data/e8k2n91.json`. Replace that file with the complete JSON array from the admissions catalog endpoint. The app accepts either a flat array or an API response object with the array under `data`.

The 2026 dataset includes pass scores, study mode, language, branch, and base contract price. It does not include subject combinations, so the 2026 calculator compares the entered score against grant and contract thresholds, and the 2026 catalog offers search and study mode/language filters. Subject-pair calculation and browsing remain available for 2023–2025 data configured in `src/data/yearConfig.ts`.

## Security

- No `.env` file or server-side credential is required or shipped.
- `vercel.json` configures a Content Security Policy and common browser security headers.
- Public JSON data and browser requests are visible to visitors; the frontend does not rely on hiding URLs for access control.
