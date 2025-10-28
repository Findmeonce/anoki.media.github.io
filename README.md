# anoki.media — Minimalist Editor Portfolio

This is a small, minimalist static website for an editor's portfolio (white-dominant, black text).

Files:

- `index.html` — Main site (hero, selected work, about, contact).
- `css/styles.css` — Styles (uses TikTok Sans Bold for titles via Google Fonts).
- `CNAME` — Contains the domain `anoki.media` for simple GitHub Pages deployment.

Partials and loader

- Sections are now split into `partials/` and loaded client-side by `index.html` (no server-side templating required). The partials are:
	- `partials/header.html`
	- `partials/hero.html`
	- `partials/work.html`
	- `partials/about.html`
	- `partials/contact.html`
	- `partials/footer.html`
	This approach keeps the site static and easy to edit; if you prefer server-side includes (Jekyll, Eleventy, etc.) I can convert them.

Notes and assumptions
- You requested "TikTok Sans Bold from googlefonts" for titles. The site links to Google Fonts with `family=TikTok+Sans:wght@700`. If that font is not available from Google at hosting time, the browser will fall back to system sans-serif.

Preview locally

Run a simple static server (Python 3):

```bash
cd /Users/findmeonce/Documents/siteweb_media
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

Deployment
- For GitHub Pages: push this folder to a repository and add `anoki.media` to the repository's Custom domain field (the `CNAME` file is included).

Serving partials

The client-side loader fetches `./partials/*.html` so ensure the `partials/` folder is included when you deploy. GitHub Pages and other static hosts will serve these files fine.

Contact
- Email used in the template: contact@anoki.media
