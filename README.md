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

Alternative hosting: Netlify (similar flow) or GitHub Pages (requires extra config for SPA routing).

Files
Netlify Identity (recommended for simple serverless auth)

1. Deploy the site to Netlify.
2. In Netlify dashboard, open the site -> "Identity" -> "Enable Identity".
3. Under "Services" enable Git Gateway (optional) or invite users via the Identity UI.
4. Invite yourself (email) from the Identity panel and accept the invite — then use "Login with Netlify Identity" on `/admin` to sign in.
5. You can also set `VITE_ADMIN_PASS` in Netlify Environment Variables for a fallback local password.

Notes
- Netlify Identity is client-side authentication managed by Netlify. It provides secure auth without building your own backend.
- If you prefer Vercel, consider Auth0, Clerk, or next-auth (requires serverless functions).

