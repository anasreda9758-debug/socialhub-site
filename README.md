# SocialHub Desktop — website

Static marketing site and privacy policy for **SocialHub Desktop**, served with GitHub Pages at:

- https://socialhub.vylo.win/
- https://socialhub.vylo.win/privacy/

No build step, no framework, no external fonts, CDNs, analytics, or third-party scripts. Everything is plain HTML, CSS, and a small amount of JavaScript.

## Structure

```
index.html            Bilingual home page (Arabic default, English via the switcher or ?lang=en)
privacy/index.html    Privacy policy (English first, full Arabic version below)
assets/styles.css     Shared styles
assets/site.js        Language switch, mobile navigation, header state, footer year
favicon.svg           Site icon
robots.txt            Crawler rules
sitemap.xml           Sitemap with hreflang alternates
404.html              GitHub Pages not-found page
CNAME                 Custom domain — do not edit (DNS/OAuth redirects depend on it)
.nojekyll             Serve files as-is, without Jekyll processing
```

## Local preview

From the repository root:

```powershell
python -m http.server 8080
```

Then open http://localhost:8080/ and http://localhost:8080/privacy/. A local HTTP server is preferable to opening the files directly because the privacy link uses a directory path.

## Editing content

- Arabic is the default language. Each translatable element on the home page contains a `.lang-ar` and a `.lang-en` span; `html[data-lang]` controls which one is visible.
- The language choice is stored in `localStorage` under `socialhub.lang`; `?lang=en` or `?lang=ar` overrides it.
- The privacy page is intentionally **not** language-switched: English is shown first for Google API reviewers, and the full Arabic translation follows at `#arabic`.
- Keep every factual claim about data handling aligned with the app's actual behavior. The current policy documents local SQLite storage, AES-256-GCM token encryption with a Windows Credential Manager key, the four YouTube scopes, disconnect/deletion behavior, and the fact that the database is not fully encrypted and the PIN is only a UI lock.

## Privacy constraints for future edits

- Do not add analytics, tracking pixels, cookies, remote fonts, or third-party scripts.
- Do not publish credentials, OAuth client secrets, tokens, personal email addresses, or user data.
- Do not claim official endorsement by Google, YouTube, Meta, Instagram, Threads, LinkedIn, TikTok, or X.
- Do not add a download link unless a public, installable release actually exists.
- Keep the site independent of the Vylo platform: no Vylo branding, links, or assets. The custom domain is retained only because it is already configured with DNS and the Google OAuth redirect setup.

## Deployment

GitHub Pages is configured for this repository with **legacy** builds from `main` at `/`, custom domain `socialhub.vylo.win`, and HTTPS enforced. Pushing to `main` publishes the site. Do not change the domain, DNS records, or Google OAuth settings as part of a content update.

After pushing, verify:

```powershell
curl.exe -I https://socialhub.vylo.win/
curl.exe -I https://socialhub.vylo.win/privacy/
```

Both should return `HTTP/1.1 200` (or `HTTP/2 200`) with a valid certificate.

## Contact

Use the public issue tracker: https://github.com/anasreda9758-debug/socialhub-site/issues
