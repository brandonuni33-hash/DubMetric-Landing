# DubMetric-Landing

Static commercial landing page V1 for **DubMetric** — automated
synchronization QC for dubbed content.

This repository is fully independent from the DubMetric QC engine
(`brandonuni33-hash/DubMetric`). It contains **no engine code, no
backend, no audio upload, no database, and no secrets** — just a fast,
accessible static page, deployable on Vercel.

## Stack

- Plain HTML + CSS + vanilla JavaScript (no frameworks, no build step)
- System font stack only — zero mandatory network dependencies
- Static hosting target: Vercel (`dubmetric.com` DNS wiring happens
  separately after page validation)

## Structure

```
index.html      # the whole landing page (9 sections)
styles.css      # dark B2B theme, responsive, accessible focus states
script.js       # honest mailto-based pilot form handling
assets/         # favicon.svg (only asset)
README.md
.gitignore
```

## Preview locally

Any static server works, e.g.:

```bash
python -m http.server 8080
# then open http://localhost:8080
```

Or simply open `index.html` in a browser.

## Deploy on Vercel (later, after validation)

1. Push this repository to GitHub.
2. In Vercel: *Add New Project* → import `DubMetric-Landing`.
3. Framework preset: **Other** (static). Build command: none.
   Output directory: repository root.
4. Domain wiring (`dubmetric.com -> Vercel`) is intentionally NOT part
   of this mission.

## Honesty rules baked into the copy

- The example QC output is clearly labeled as an illustrative example.
- No clients, testimonials, logos, accuracy statistics or performance
  claims are invented.
- The pilot form does not fake a server submission: it opens a
  pre-filled email in the visitor's own client, and says so.
- DubMetric supports human QC review; it never claims to replace it or
  to certify deliveries.
