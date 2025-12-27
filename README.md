# Elind Timeline

Personal timeline site (1995–2025) scaffolded with Vite + React + TypeScript + Tailwind.

Features
- Timeline view showing events per year
- Admin backoffice panel: add/edit/delete events, import/export JSON, attach images (stored as DataURL in localStorage)

Setup (macOS / Linux / Windows)

```bash
npm install
npm run dev
```

Notes
- The admin panel stores edits in `localStorage`. Use Export to download JSON and later Import to restore.
- To persist permanently in the repository, export the JSON and copy its content into `data/events.json` (manual step).

Commands
- `npm run dev` - start dev server
- `npm run build` - build production bundle
- `npm run preview` - preview production build

Next steps
- Add server-side persistence (simple API) if you want saving directly into project files
- Replace placeholder images in `public/` with real photos

Deployment & custom domain (quick)

Recommended: Vercel (fast, automatic for Vite apps)

1. Push this repo to GitHub.
2. Create a Vercel account and import the GitHub repo.
3. Set Build Command: `npm run build`, Output Directory: `dist`.
4. (Optional) Add Environment Variable `VITE_ADMIN_PASS` in Vercel settings to set admin password.
5. In Vercel dashboard -> Domains, add your custom domain `3LE.time` (you must own it) and follow DNS instructions (add A/ALIAS/CNAME as Vercel shows).

Alternative hosting: GitHub Pages (requires extra config for SPA routing).
