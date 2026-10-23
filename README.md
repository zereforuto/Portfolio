# Jayzer Relator — Developer Portfolio

Personal developer portfolio for **Jayzer Relator** (`zereforuto`), built as a static site deployable directly via GitHub Pages.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Markup | Plain HTML5 (semantic) |
| Styling | Vanilla CSS (no frameworks) |
| Logic | Vanilla JavaScript (ES2020+, no build step) |
| Data | GitHub REST API v3 (live repo fetch) |
| Font | [Archivo](https://fonts.google.com/specimen/Archivo) via Google Fonts |

No `npm install`, no bundler, no dependencies. Push files → site is live.

---

## Deploying to GitHub Pages

### 1 — Create (or use) your repository
Your repo must be named **`zereforuto.github.io`** for the root URL to work.

```
https://github.com/zereforuto/zereforuto.github.io
```

### 2 — Push the files
```bash
git init
git add index.html styles.css script.js README.md
git commit -m "Initial portfolio deploy"
git branch -M main
git remote add origin https://github.com/zereforuto/zereforuto.github.io.git
git push -u origin main
```

### 3 — Enable GitHub Pages
1. Go to **Settings** → **Pages** (left sidebar).
2. Under **Source**, select **Deploy from a branch**.
3. Branch: `main` · Folder: `/ (root)`.
4. Click **Save**.
5. Wait ~60 seconds. Your site will be live at:

```
https://zereforuto.github.io/
```

### 4 — (Optional) Custom domain
Add a `CNAME` file to the repo root containing your domain, then configure DNS.

---

## File Structure

```
zereforuto.github.io/
├── index.html      ← All markup (6 sections)
├── styles.css      ← Ferrari Design System tokens + layout + components
├── script.js       ← Nav toggle, scroll reveal, GitHub API fetch
└── README.md       ← This file
```

---

## Features

| Feature | Implementation |
|---------|---------------|
| Chiaroscuro layout | Hard black/white section alternation, no gradients between sections |
| Ferrari Red CTA | One red button per screen (`#DA291C`), teal hover (`#1EAEDB`) |
| Racing Yellow accent | Used exclusively in the "Next Laps" roadmap section |
| Live GitHub repos | Fetched from `api.github.com/users/zereforuto/repos`, forks excluded, sorted by `pushed_at` |
| Scroll animations | `IntersectionObserver` fade+slide reveals, stagger delays, respects `prefers-reduced-motion` |
| Mobile nav | Hamburger with ARIA `aria-expanded`, closes on outside click / link tap |
| Accessibility | Semantic HTML5, visible `:focus-visible` ring, `alt` text, ARIA labels, `aria-live` on project grid |
| SEO | `<title>`, `<meta description>`, Open Graph tags, canonical URL, `<h1>` per page |
| No dependencies | Zero npm packages, zero CDN scripts (fonts via Google Fonts CSS only) |

---

## Assumptions Made

1. **No contact form backend** — The contact section links only to GitHub, as specified. No email is collected.
2. **OG image** — Referenced as `og-cover.png` at the repo root; not included. Add a 1200×630px image and name it `og-cover.png` for social previews to work.
3. **Favicon** — Uses an inline SVG data-URI favicon (black background, red "J"). Replace with a proper `.ico` or `.png` if desired.
4. **Font fallback** — `Archivo` (Google Fonts) is the closest free substitute for Ferrari's proprietary FerrariSans. Fallback chain: `Archivo → Arial → Helvetica → sans-serif`.
5. **GitHub API rate limit** — Unauthenticated requests are limited to 60/hour per IP. For a personal portfolio this is fine; if you hit limits, the error state is shown gracefully.
6. **Projects shown** — Up to 9 most-recently-pushed public non-fork repos. Adjust the `.slice(0, 9)` in `script.js` to show more or fewer.
7. **No Ferrari trademarks** — The "JR" monogram is used instead of the Prancing Horse or any Ferrari-branded assets, per the brief.

---

## Local Development

Because the site uses `fetch()` to call the GitHub API, open it via a local server (not `file://`):

```bash
# Python 3
python -m http.server 8080

# Node (npx)
npx -y serve .
```

Then visit `http://localhost:8080`.

---

*Built with the Ferrari Design System visual language — chiaroscuro, editorial, precise.*
