# AC Fault DB Wave 5 Smart

Professional HVAC fault-code project for **GitHub + Vercel**, upgraded with **symptom search**, **smart suggestions**, and **illustrated diagnosis categories**.

## What is inside
- `docs/faults-wave5-smart.json` — full smart dataset
- `docs/symptom-scenarios.json` — symptom presets used by the app
- `docs/sources-wave5.json` — source registry
- `data/faults-wave5.ts` — typed app dataset
- `public/illustrations/` — SVG illustrations by diagnostic category
- `app/` — Next.js user interface

## Smart features
- Search by **brand / unit type / technology / code**
- Search by **symptom**
- **AI-style ranking** of likely categories and matching codes
- Record detail view with:
  - official code meaning
  - likely causes
  - check steps
  - suspected parts
  - source link
- Arabic + English UI

## Run locally
```bash
npm install
npm run dev
```

## Deploy to Vercel
1. Push this folder to GitHub.
2. Import the repository into Vercel.
3. Framework: **Next.js**
4. Build command: default
5. Output: default
6. No environment variables are required.

## Technical honesty
This project is designed to be **usable in the field**.  
However, the OEM ecosystem is uneven:
- the **code meanings** come from linked public manuals / support pages
- the **smart causes / steps / parts** are technician guidance inferred from those meanings and normal HVAC diagnostic practice
- always confirm the exact model family before replacing expensive parts
